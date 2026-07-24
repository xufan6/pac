import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(testDirectory, "..", "templates", "white.pac");
const source = fs.readFileSync(templatePath, "utf8");
const proxy = "SOCKS5 127.0.0.1:8989; SOCKS 127.0.0.1:8989";

const domainListMatch = source.match(/var safeDomainNames = \[([\s\S]*?)\n\];/);
if (!domainListMatch) {
  throw new Error("white PAC is missing safeDomainNames");
}
const configuredDomains = [
  ...domainListMatch[1].matchAll(/"([^"]+)"/g),
].map((match) => match[1]);

function ipv4Number(value) {
  const octets = value.split(".");
  if (octets.length !== 4) return null;

  let number = 0;
  for (const octet of octets) {
    if (!/^\d+$/.test(octet) || Number(octet) > 255) return null;
    number = (number * 256) + Number(octet);
  }
  return number >>> 0;
}

function isInNet(ipAddress, network, mask) {
  const ip = ipv4Number(ipAddress);
  const networkValue = ipv4Number(network);
  const maskValue = ipv4Number(mask);
  if (ip === null || networkValue === null || maskValue === null) {
    throw new Error(`isInNet must receive an IPv4 literal, got ${ipAddress}`);
  }
  return ((ip & maskValue) >>> 0) === ((networkValue & maskValue) >>> 0);
}

function loadPac(dnsRecords = {}) {
  const dnsCalls = [];
  const context = {
    dnsResolve(host) {
      dnsCalls.push(host);
      return Object.prototype.hasOwnProperty.call(dnsRecords, host)
        ? dnsRecords[host]
        : null;
    },
    isInNet,
    isPlainHostName(host) {
      return !host.includes(".");
    },
  };
  vm.runInNewContext(source, context, { filename: templatePath });

  return {
    context,
    dnsCalls,
    route(host) {
      return context.FindProxyForURL(`https://${host}/`, host);
    },
  };
}

test("configured domains preserve exact and subdomain DIRECT routing without DNS", () => {
  const pac = loadPac();
  assert.equal(new Set(configuredDomains).size, configuredDomains.length);

  for (const domain of configuredDomains) {
    assert.equal(pac.route(domain), "DIRECT", domain);
    assert.equal(pac.route(`www.${domain}`), "DIRECT", `www.${domain}`);
  }

  assert.deepEqual(pac.dnsCalls, []);
});

test("domain matching is case-insensitive and keeps label boundaries", () => {
  const pac = loadPac({
    "evilzhihu.com": "203.0.113.1",
    "zhihu.com.example": "203.0.113.1",
  });

  assert.equal(pac.route("WWW.ZHIHU.COM"), "DIRECT");
  assert.equal(pac.route("foo.example.cn"), "DIRECT");
  assert.equal(pac.route("evilzhihu.com"), proxy);
  assert.equal(pac.route("zhihu.com.example"), proxy);
  assert.deepEqual(pac.dnsCalls, ["evilzhihu.com", "zhihu.com.example"]);
});

test("configured IPv4 ranges stay DIRECT without resolving an IP literal", () => {
  const pac = loadPac();

  assert.equal(pac.context.directIpNetworks.length, 41);
  for (const [network] of pac.context.directIpNetworks) {
    assert.equal(pac.route(network), "DIRECT", network);
  }
  assert.equal(pac.route("127.0.0.1"), "DIRECT");
  assert.equal(pac.route("printer"), "DIRECT");
  assert.deepEqual(pac.dnsCalls, []);
});

test("unlisted hosts resolve once before IP-range matching", () => {
  const pac = loadPac({
    "mapped-direct.example": "42.120.0.1",
    "mapped-proxy.example": "203.0.113.1",
  });

  assert.equal(pac.route("mapped-direct.example"), "DIRECT");
  assert.deepEqual(pac.dnsCalls, ["mapped-direct.example"]);

  pac.dnsCalls.length = 0;
  assert.equal(pac.route("mapped-proxy.example"), proxy);
  assert.deepEqual(pac.dnsCalls, ["mapped-proxy.example"]);
});
