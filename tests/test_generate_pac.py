from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from scripts.generate_pac import generate, parse_china_ipv4


def delegated_fixture() -> str:
    records = ["2|apnic|20260723|00000000|00000|00000000|+0000"]
    for index in range(1_001):
        second = index // 256
        third = index % 256
        records.append(f"apnic|CN|ipv4|1.{second}.{third}.0|256|20260723|allocated")
    records.append("apnic|JP|ipv4|203.0.113.0|256|20260723|allocated")
    return "\n".join(records) + "\n"


TEMPLATE = """function FindProxyForURL(url, host) {
  var PROXY = \"SOCKS5 127.0.0.1:8989\";
  return PROXY;
}
"""


class GeneratePacTests(unittest.TestCase):
    def test_parse_normalizes_china_records(self) -> None:
        cidrs = parse_china_ipv4(delegated_fixture())
        self.assertEqual(len(cidrs), 1_001)
        self.assertEqual(cidrs[0], "1.0.0.0/24")
        self.assertEqual(cidrs[-1], "1.3.232.0/24")

    def test_generate_preserves_legacy_aliases_as_valid_pac(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            output_dir = Path(temporary_directory)
            generate(
                delegated_fixture(),
                TEMPLATE,
                output_dir,
                "https://example.invalid/delegated-apnic-latest",
            )

            generic_7070 = (output_dir / "generic/7070.pac").read_text()
            ip_8989 = (output_dir / "ip/8989.pac").read_text()
            ip_7070 = (output_dir / "ip/7070.pac").read_text()

            self.assertIn("127.0.0.1:7070", generic_7070)
            self.assertIn("FindProxyForURL", ip_8989)
            self.assertIn('"1.0.0.0/24"', ip_8989)
            self.assertIn("127.0.0.1:7070", ip_7070)
            self.assertEqual(
                ip_8989,
                (output_dir / "ip/m.8989.pac").read_text(),
            )
            self.assertEqual(
                ip_7070,
                (output_dir / "ip/m.7070.pac").read_text(),
            )


if __name__ == "__main__":
    unittest.main()
