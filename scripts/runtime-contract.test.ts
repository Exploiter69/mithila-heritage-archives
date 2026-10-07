import { strict as assert } from "node:assert";

import {
  getArchiveArtStyles,
  getArchiveAuthors,
  getArchiveDictionaryEntries,
  getArchiveHeritageEntries,
  getArchiveLiteraryWorks,
  getArchiveProverbs,
  getArchiveRecords,
  getArchiveSongs,
} from "../src/data/archive-read";
import { archiveRecordTypes } from "../src/data/types";
import { getPublicArchiveEnvelope, getPublicRecord } from "../src/data/archive-export";

const collections = [
  ["literature-work", getArchiveLiteraryWorks()],
  ["author", getArchiveAuthors()],
  ["dictionary-entry", getArchiveDictionaryEntries()],
  ["proverb", getArchiveProverbs()],
  ["art-style", getArchiveArtStyles()],
  ["song", getArchiveSongs()],
  ["heritage-entry", getArchiveHeritageEntries()],
] as const;

for (const [type, records] of collections) {
  assert.ok(records.length > 0, type + " must have renderable current records");
  for (const record of records) assert.ok(record);
}

const published = getArchiveRecords();
assert.equal(published.length, 723);
assert.deepEqual(new Set(published.map((record) => record.type)), new Set(archiveRecordTypes));

const envelope = getPublicArchiveEnvelope();
assert.equal(envelope.recordCount, published.length);
for (const record of published) {
  const publicRecord = getPublicRecord(record.type, record.slug);
  assert.ok(publicRecord);
  assert.equal(publicRecord.url, "/archive/" + record.type + "/" + record.slug);
}

console.log("Runtime contract tests passed:", published.length, "published records");
