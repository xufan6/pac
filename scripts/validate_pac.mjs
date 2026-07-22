#!/usr/bin/env node
/** Validate the generated PAC syntax and a few deterministic routing cases. */

import fs from "node:fs";
import vm from "node:vm";

const ipPacPaths = process.argv.slice(2);
if (ipPacPaths.length === 0) {
  throw new Error("usage: validate_pac.mjs <ip-pac> [...]");
}

for (const pacPath of ipPacPaths) {
  const source = fs.readFileSync(pacPath, "utf8");
  const context = {
    dnsResolve: (host) => host,
  };
  vm.runInNewContext(source, context, { filename: pacPath });

  if (typeof context.FindProxyForURL !== "function") {
    throw new Error(`${pacPath}: FindProxyForURL is missing`);
  }
  if (typeof context.PROXY !== "string" || typeof context.DEFAULT !== "string") {
    throw new Error(`${pacPath}: PAC constants are missing`);
  }

  const route = (ip) =>
    context.FindProxyForURL("https://example.invalid/", ip);

  if (route("10.1.2.3") !== context.DEFAULT) {
    throw new Error(`${pacPath}: private IPv4 address is not DIRECT`);
  }
  if (route("203.0.113.1") !== context.PROXY) {
    throw new Error(`${pacPath}: documentation-range IPv4 address is not proxied`);
  }

  const chinaCidr = context.cnIpAddressCidrList.find(
    (cidr) => ![
      "127.0.0.0/8",
      "10.0.0.0/8",
      "11.0.0.0/8",
      "30.0.0.0/8",
      "172.16.0.0/12",
      "192.168.0.0/16",
      "100.64.0.0/10",
    ].includes(cidr),
  );
  if (!chinaCidr || route(chinaCidr.split("/")[0]) !== context.DEFAULT) {
    throw new Error(`${pacPath}: generated China IPv4 list is not routed DIRECT`);
  }
}

console.log(`validated ${ipPacPaths.length} IP PAC file(s)`);
