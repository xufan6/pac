#!/usr/bin/env python3
"""Generate public PAC artifacts from APNIC's delegated IPv4 data.

This script intentionally has no credential, subscription, or proxy-node input.
It emits only public PAC files used by the `dev` and `devip` release branches.
"""

from __future__ import annotations

import argparse
import hashlib
import ipaddress
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Iterable


APNIC_DELEGATED_URL = (
    "https://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest"
)
MIN_EXPECTED_CIDRS = 1_000
BASE_DIRECT_CIDRS = (
    "127.0.0.0/8",
    "10.0.0.0/8",
    "11.0.0.0/8",
    "30.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    "100.64.0.0/10",
)
SENSITIVE_MARKERS = (
    "ss://",
    "vmess://",
    "trojan://",
    "password",
    "passwd",
    "api_key",
    "api-key",
    "access_token",
)


class GenerationError(RuntimeError):
    """Raised when public source data or generated output is invalid."""


def fetch_text(url: str) -> str:
    """Fetch a public text resource with an explicit timeout and user agent."""
    if not url.startswith("https://"):
        raise GenerationError("only HTTPS source URLs are allowed")

    request = urllib.request.Request(
        url,
        headers={"User-Agent": "pac-public-generator/1.0 (+github-actions)"},
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            status = getattr(response, "status", 200)
            if status != 200:
                raise GenerationError(f"APNIC returned HTTP {status}")
            payload = response.read()
    except urllib.error.URLError as exc:
        raise GenerationError(f"failed to fetch APNIC data: {exc.reason}") from exc

    if len(payload) < 100_000:
        raise GenerationError("APNIC response is unexpectedly small")
    try:
        return payload.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise GenerationError("APNIC response is not UTF-8 text") from exc


def parse_china_ipv4(delegated_text: str) -> list[str]:
    """Return normalized CIDRs for APNIC records allocated to China.

    `summarize_address_range` deliberately handles a future non-power-of-two
    allocation correctly instead of relying on floating-point log arithmetic.
    """
    networks: set[ipaddress.IPv4Network] = set()

    for line in delegated_text.splitlines():
        fields = line.split("|")
        if len(fields) < 5 or fields[1:3] != ["CN", "ipv4"]:
            continue

        address_text, count_text = fields[3], fields[4]
        if address_text == "*" or count_text == "*":
            continue

        try:
            start = ipaddress.IPv4Address(address_text)
            count = int(count_text)
        except ValueError as exc:
            raise GenerationError(f"invalid APNIC IPv4 record: {line!r}") from exc

        if count <= 0:
            raise GenerationError(f"invalid APNIC allocation size: {line!r}")

        end_value = int(start) + count - 1
        if end_value > (2**32 - 1):
            raise GenerationError(f"APNIC allocation exceeds IPv4 range: {line!r}")

        end = ipaddress.IPv4Address(end_value)
        networks.update(ipaddress.summarize_address_range(start, end))

    ordered = sorted(networks, key=lambda item: (int(item.network_address), item.prefixlen))
    cidrs = [str(network) for network in ordered]
    if len(cidrs) < MIN_EXPECTED_CIDRS:
        raise GenerationError(
            f"only found {len(cidrs)} China IPv4 CIDRs; source is likely incomplete"
        )
    return cidrs


def build_ip_pac(cidrs: Iterable[str]) -> str:
    """Build a self-contained, standards-compatible PAC file."""
    entries = list(BASE_DIRECT_CIDRS) + list(cidrs)
    cidr_lines = ",\n".join(f"  {json.dumps(cidr)}" for cidr in entries)
    return f"""// Generated from APNIC delegated data. Do not edit by hand.
var PROXY = \"SOCKS5 127.0.0.1:8989; SOCKS 127.0.0.1:8989\";
var DEFAULT = \"DIRECT\";
var cnIpAddressCidrList = [
{cidr_lines}
];

var blocksByPrefix = {{}};
var prefixes = [];
for (var i = 0, n = cnIpAddressCidrList.length; i < n; i++) {{
  var cidr = cnIpAddressCidrList[i];
  var last = cidr.split('/');
  var prefix = Number(last[1]);
  var sections = last[0].split('.');
  var block = (((Number(sections[0]) << 24) |
                (Number(sections[1]) << 16) |
                (Number(sections[2]) << 8) |
                Number(sections[3])) >>> 0);
  if (!blocksByPrefix[prefix]) {{
    blocksByPrefix[prefix] = [];
    prefixes.push(prefix);
  }}
  blocksByPrefix[prefix].push(block);
}}
prefixes.sort(function(a, b) {{ return a - b; }});
for (var j = 0; j < prefixes.length; j++) {{
  blocksByPrefix[prefixes[j]].sort(function(a, b) {{ return a - b; }});
}}

function binarySearch(array, value) {{
  var high = array.length - 1;
  var low = 0;
  while (low <= high) {{
    var mid = (high + low) >> 1;
    var midValue = array[mid];
    if (midValue < value) low = mid + 1;
    else if (midValue > value) high = mid - 1;
    else return mid;
  }}
  return -1;
}}

function rangeLoopTest(ipAddress) {{
  if (!ipAddress) return false;
  var sections = ipAddress.split('.');
  if (sections.length !== 4) return false;
  var octets = [];
  for (var i = 0; i < 4; i++) {{
    var value = Number(sections[i]);
    if (!isFinite(value) || value < 0 || value > 255 || Math.floor(value) !== value) {{
      return false;
    }}
    octets.push(value);
  }}
  var ip32 = (((octets[0] << 24) |
               (octets[1] << 16) |
               (octets[2] << 8) |
               octets[3]) >>> 0);
  for (var j = 0; j < prefixes.length; j++) {{
    var prefix = prefixes[j];
    var mask = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
    var prefixValue = (ip32 & mask) >>> 0;
    if (binarySearch(blocksByPrefix[prefix], prefixValue) > -1) return true;
  }}
  return false;
}}

function FindProxyForURL(url, host) {{
  return rangeLoopTest(dnsResolve(host)) ? DEFAULT : PROXY;
}}
"""


def replace_proxy_port(pac_text: str, port: int) -> str:
    replacement = f"127.0.0.1:{port}"
    if "127.0.0.1:8989" not in pac_text:
        raise GenerationError("PAC template does not contain the 8989 proxy endpoint")
    return pac_text.replace("127.0.0.1:8989", replacement)


def validate_pac(text: str, label: str) -> None:
    if "FindProxyForURL" not in text:
        raise GenerationError(f"{label} is missing FindProxyForURL")
    lower_text = text.lower()
    markers = [marker for marker in SENSITIVE_MARKERS if marker in lower_text]
    if markers:
        raise GenerationError(f"{label} contains forbidden sensitive marker(s): {markers}")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def generate(
    delegated_text: str,
    template_text: str,
    output_dir: Path,
    source_url: str,
) -> dict[str, str]:
    cidrs = parse_china_ipv4(delegated_text)
    ip_pac = build_ip_pac(cidrs)
    generic_8989 = template_text
    generic_7070 = replace_proxy_port(template_text, 7070)
    ip_7070 = replace_proxy_port(ip_pac, 7070)

    outputs = {
        "cn.lst": "\n".join(cidrs) + "\n",
        "generic/8989.pac": generic_8989,
        "generic/7070.pac": generic_7070,
        "ip/8989.pac": ip_pac,
        "ip/7070.pac": ip_7070,
    }
    for label, text in outputs.items():
        if label.endswith(".pac"):
            validate_pac(text, label)
        write_text(output_dir / label, text)

    manifest = {
        "source_url": source_url,
        "china_ipv4_cidr_count": len(cidrs),
        "sha256": {label: sha256_text(text) for label, text in sorted(outputs.items())},
    }
    write_text(
        output_dir / "manifest.json",
        json.dumps(manifest, indent=2, sort_keys=True) + "\n",
    )
    return {label: sha256_text(text) for label, text in outputs.items()}


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--template",
        type=Path,
        default=Path("templates/white.pac"),
        help="public 8989 PAC template (default: %(default)s)",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path("generated"),
        help="directory for generated artifacts (default: %(default)s)",
    )
    parser.add_argument(
        "--source-url",
        default=APNIC_DELEGATED_URL,
        help="HTTPS URL for APNIC delegated data",
    )
    parser.add_argument(
        "--input-file",
        type=Path,
        help="use a local delegated-data fixture instead of fetching --source-url",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    try:
        template_text = args.template.read_text(encoding="utf-8")
        validate_pac(template_text, str(args.template))
        if args.input_file:
            delegated_text = args.input_file.read_text(encoding="utf-8")
        else:
            delegated_text = fetch_text(args.source_url)
        checksums = generate(
            delegated_text,
            template_text,
            args.out_dir,
            args.source_url,
        )
    except (GenerationError, OSError) as exc:
        print(f"generation failed: {exc}", file=sys.stderr)
        return 1

    print(f"generated {len(checksums)} public artifacts in {args.out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
