import assert from "node:assert/strict";

import { expandedHeritage } from "../src/data/content-expansion-heritage";
import { canonicalArchive } from "../src/data/archive-foundation";

assert.equal(expandedHeritage.length, 5);
assert.equal(new Set(expandedHeritage.map((entry) => entry.slug)).size, 5);
for (const entry of expandedHeritage) {
  assert.ok(entry.source.url);
  const record = canonicalArchive.records.find(
    (item) => item.type === "heritage-entry" && item.slug === entry.slug,
  );
  assert.ok(record, `expanded heritage record missing: ${entry.slug}`);
}
console.log("Content expansion heritage tests passed: 5 documented heritage records.");
