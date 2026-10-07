#!/usr/bin/env bun

import { readdir } from "node:fs/promises";
import { join } from "node:path";

const dir = ".output/public/assets";
const maxClientJsBytes = 512 * 1024;
const maxClientCssBytes = 120 * 1024;

const files = await readdir(dir);
const js = [];
const css = [];

for (const file of files) {
  const path = join(dir, file);
  const stat = await Bun.file(path).stat();
  if (file.endsWith(".js")) js.push({ file, bytes: stat.size });
  if (file.endsWith(".css")) css.push({ file, bytes: stat.size });
}

const largestJs = [...js].sort((a, b) => b.bytes - a.bytes)[0];
const largestCss = [...css].sort((a, b) => b.bytes - a.bytes)[0];

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  largestClientJs: largestJs,
  largestClientCss: largestCss,
  totalClientJsBytes: js.reduce((sum, item) => sum + item.bytes, 0),
  totalClientCssBytes: css.reduce((sum, item) => sum + item.bytes, 0),
  budgets: { maxClientJsBytes, maxClientCssBytes },
}, null, 2));

if (largestJs && largestJs.bytes > maxClientJsBytes) {
  throw new Error(`Largest client JS chunk exceeds budget: ${largestJs.file} (${largestJs.bytes} bytes).`);
}
if (largestCss && largestCss.bytes > maxClientCssBytes) {
  throw new Error(`Largest client CSS chunk exceeds budget: ${largestCss.file} (${largestCss.bytes} bytes).`);
}
