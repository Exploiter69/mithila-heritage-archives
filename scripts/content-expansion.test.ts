import assert from "node:assert/strict";

import { sahityaAkademiMaithiliAwards } from "../src/data/content-expansion-literature";
import { canonicalArchive } from "../src/data/archive-foundation";

assert.equal(sahityaAkademiMaithiliAwards.length, 37);
assert.deepEqual(
  sahityaAkademiMaithiliAwards.map((entry) => entry.awardYear),
  Array.from({ length: 37 }, (_, index) => 1989 + index),
);
assert.equal(
  new Set(sahityaAkademiMaithiliAwards.map((entry) => entry.slug)).size,
  sahityaAkademiMaithiliAwards.length,
);
for (const entry of sahityaAkademiMaithiliAwards) {
  assert.equal(entry.source.status, "verified");
  assert.equal(
    entry.source.url,
    "https://www.sahitya-akademi.gov.in/awards/akademi%20samman_suchi.jsp",
  );
  assert.ok(entry.note.includes("Bibliographic recognition record only"));
  const record = canonicalArchive.records.find(
    (item) => item.type === "literature-work" && item.slug === entry.slug,
  );
  assert.ok(record, `expanded award record missing from canonical archive: ${entry.slug}`);
  assert.equal(record?.contentStatus, "published");
}
console.log("Content expansion literature tests passed: 37 Sahitya Akademi Maithili award records.");
