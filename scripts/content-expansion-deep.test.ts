import assert from "node:assert/strict";

import { canonicalArchive } from "../src/data/archive-foundation";
import { dictionaryEntries } from "../src/data/dictionary";
import {
  awardRecipientAuthors,
  catalogueLiterature,
  folkCultureExpansion,
  artExpansion,
  musicExpansion,
  heritageExpansion,
} from "../src/data/content-expansion-deep";
import { sahityaAkademiMaithiliAwards } from "../src/data/content-expansion-literature";

assert.equal(sahityaAkademiMaithiliAwards.length, 57);
assert.equal(
  new Set(sahityaAkademiMaithiliAwards.map((entry) => entry.author)).size,
  awardRecipientAuthors.length,
  "author expansion should deduplicate repeat award recipients",
);
assert.ok(awardRecipientAuthors.length >= 50);
assert.ok(catalogueLiterature.length >= 15);
assert.ok(folkCultureExpansion.length >= 10);
assert.ok(artExpansion.length >= 10);
assert.ok(musicExpansion.length >= 10);
assert.ok(heritageExpansion.length >= 8);

const canonicalKeys = canonicalArchive.records.map((record) => `${record.type}:${record.slug}`);
assert.equal(new Set(canonicalKeys).size, canonicalKeys.length);

assert.ok(
  new Set(dictionaryEntries.map((entry) => entry.slug)).size >= 100,
  "language expansion must provide at least 100 unique lexical records",
);

for (const record of [
  ...awardRecipientAuthors.map((entry) => ["author", entry.slug] as const),
  ...catalogueLiterature.map((entry) => ["literature-work", entry.slug] as const),
  ...folkCultureExpansion.map((entry) => ["heritage-entry", entry.slug] as const),
  ...artExpansion.map((entry) => ["art-entry", entry.slug] as const),
  ...musicExpansion.map((entry) => ["music-entry", entry.slug] as const),
  ...heritageExpansion.map((entry) => ["heritage-entry", entry.slug] as const),
]) {
  const canonical = canonicalArchive.records.find(
    (item) => item.type === record[0] && item.slug === record[1],
  );
  assert.ok(canonical, `deep expansion missing from canonical archive: ${record[0]}:${record[1]}`);
  assert.equal(canonical?.contentStatus, "published");
  assert.ok(canonical?.sourceIds.length);
  assert.ok(canonical?.provenanceIds.length);
}

for (const entry of [...catalogueLiterature, ...folkCultureExpansion, ...artExpansion, ...musicExpansion, ...heritageExpansion]) {
  assert.equal(entry.source.status, "verified");
  assert.ok(entry.source.url);
}

for (const entry of awardRecipientAuthors) {
  assert.equal(entry.source.status, "verified");
  assert.equal(
    entry.source.url,
    "https://www.sahitya-akademi.gov.in/awards/akademi%20samman_suchi.jsp",
  );
}

console.log(
  `Deep content expansion tests passed: ${awardRecipientAuthors.length} unique award recipients, ${catalogueLiterature.length} catalogue works, ${folkCultureExpansion.length} folk-culture records, ${artExpansion.length} art records, ${musicExpansion.length} music records, ${heritageExpansion.length} heritage records, and ${new Set(dictionaryEntries.map((entry) => entry.slug)).size} unique dictionary entries.`,
);
