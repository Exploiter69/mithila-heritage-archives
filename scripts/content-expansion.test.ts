import assert from "node:assert/strict";

import { sahityaAkademiMaithiliAwards, yuvaPuraskarMaithiliAwards } from "../src/data/content-expansion-literature";
import { canonicalArchive } from "../src/data/archive-foundation";

assert.equal(sahityaAkademiMaithiliAwards.length, 57);
assert.deepEqual(
  sahityaAkademiMaithiliAwards.map((entry) => entry.awardYear),
  [1966, 1968, 1969, 1970, 1971, 1973, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, ...Array.from({ length: 37 }, (_, index) => 1989 + index)],
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
console.log("Content expansion literature tests passed: Sahitya Akademi Maithili and Yuva Puraskar award records.");

assert.equal(yuvaPuraskarMaithiliAwards.length, 15);
assert.deepEqual(yuvaPuraskarMaithiliAwards.map((entry) => entry.awardYear), Array.from({ length: 15 }, (_, index) => 2011 + index));
for (const entry of yuvaPuraskarMaithiliAwards) {
  assert.equal(entry.source.status, "verified");
  assert.equal(entry.source.url, "https://sahitya-akademi.gov.in/awards/yuva_samman_suchi.jsp");
  assert.ok(entry.note.includes("Bibliographic recognition record only"));
  assert.ok(canonicalArchive.records.some((item) => item.type === "literature-work" && item.slug === entry.slug));
}
