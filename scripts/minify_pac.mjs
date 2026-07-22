#!/usr/bin/env node
/** Create valid, minified PAC aliases without relying on a remote compiler. */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { minify } from "terser";

const PAC_GLOBALS = [
  "PROXY",
  "DEFAULT",
  "cnIpAddressCidrList",
  "FindProxyForURL",
  "dnsResolve",
];

const MINIFY_OPTIONS = {
  ecma: 5,
  compress: {
    ecma: 5,
    passes: 2,
    unsafe: false,
  },
  mangle: {
    reserved: PAC_GLOBALS,
    toplevel: false,
  },
  format: {
    ascii_only: true,
    comments: false,
    ecma: 5,
  },
};

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function assertPacSurface(source, label) {
  for (const symbol of PAC_GLOBALS.slice(0, 4)) {
    if (!source.includes(symbol)) {
      throw new Error(`${label} is missing PAC global ${symbol}`);
    }
  }
}

export async function minifyPac(source, label) {
  assertPacSurface(source, label);
  const result = await minify(source, MINIFY_OPTIONS);
  if (!result.code) {
    throw new Error(`${label} did not produce minified JavaScript`);
  }

  const code = `${result.code}\n`;
  assertPacSurface(code, label);
  if (code.length >= source.length) {
    throw new Error(`${label} was not smaller after minification`);
  }
  return code;
}

export async function writeCompressedAliases(outputDir) {
  const aliases = [
    ["ip/8989.pac", "ip/m.8989.pac"],
    ["ip/7070.pac", "ip/m.7070.pac"],
  ];
  const minified = [];

  for (const [sourceName, outputName] of aliases) {
    const sourcePath = path.join(outputDir, sourceName);
    const source = fs.readFileSync(sourcePath, "utf8");
    minified.push({
      outputName,
      sourceBytes: Buffer.byteLength(source),
      code: await minifyPac(source, sourceName),
    });
  }

  const manifestPath = path.join(outputDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.compression = {
    aliases: minified.map(({ outputName }) => outputName),
    tool: "terser",
  };

  for (const { outputName, code } of minified) {
    const outputPath = path.join(outputDir, outputName);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, code, "utf8");
    manifest.sha256[outputName] = sha256(code);
  }
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return minified.map(({ outputName, sourceBytes, code }) => ({
    outputName,
    sourceBytes,
    outputBytes: Buffer.byteLength(code),
  }));
}

function parseArgs(argv) {
  if (argv.length !== 2 || argv[0] !== "--out-dir") {
    throw new Error("usage: minify_pac.mjs --out-dir <generated-directory>");
  }
  return argv[1];
}

async function main() {
  const outputDir = parseArgs(process.argv.slice(2));
  const results = await writeCompressedAliases(outputDir);
  for (const { outputName, sourceBytes, outputBytes } of results) {
    console.log(`minified ${outputName}: ${sourceBytes} -> ${outputBytes} bytes`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
