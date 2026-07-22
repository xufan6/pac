import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

import { minifyPac, writeCompressedAliases } from "../scripts/minify_pac.mjs";

const PAC_SOURCE = `var PROXY = "SOCKS5 127.0.0.1:8989";
var DEFAULT = "DIRECT";
var cnIpAddressCidrList = ["10.0.0.0/8"];
function rangeLoopTest(ip) {
  return ip === "10.0.0.1";
}
function FindProxyForURL(url, host) {
  if (rangeLoopTest(dnsResolve(host))) {
    return DEFAULT;
  }
  return PROXY;
}
`;

function evaluatePac(source) {
  const context = { dnsResolve: (host) => host };
  vm.runInNewContext(source, context);
  return context;
}

test("minifyPac preserves the PAC interface and routing", async () => {
  const minified = await minifyPac(PAC_SOURCE, "fixture");
  const context = evaluatePac(minified);

  assert.ok(minified.length < PAC_SOURCE.length);
  assert.equal(context.FindProxyForURL("https://example.invalid", "10.0.0.1"), "DIRECT");
  assert.equal(context.FindProxyForURL("https://example.invalid", "203.0.113.1"), "SOCKS5 127.0.0.1:8989");
});

test("writeCompressedAliases updates both aliases and the manifest", async (t) => {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "pac-minify-test-"));
  t.after(() => fs.rmSync(outputDir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(outputDir, "ip"));
  fs.writeFileSync(path.join(outputDir, "ip", "8989.pac"), PAC_SOURCE);
  fs.writeFileSync(
    path.join(outputDir, "ip", "7070.pac"),
    PAC_SOURCE.replaceAll("8989", "7070"),
  );
  fs.writeFileSync(path.join(outputDir, "manifest.json"), '{"sha256":{}}\n');

  const results = await writeCompressedAliases(outputDir);
  const manifest = JSON.parse(fs.readFileSync(path.join(outputDir, "manifest.json"), "utf8"));

  assert.equal(results.length, 2);
  assert.deepEqual(manifest.compression.aliases, ["ip/m.8989.pac", "ip/m.7070.pac"]);
  assert.ok(manifest.sha256["ip/m.8989.pac"]);
  assert.equal(
    evaluatePac(fs.readFileSync(path.join(outputDir, "ip", "m.8989.pac"), "utf8"))
      .FindProxyForURL("https://example.invalid", "10.0.0.1"),
    "DIRECT",
  );
});
