import assert from "node:assert/strict";

import { canonicalArchive } from "../src/data/archive-foundation";
import {
  getArchiveBibliography,
  getArchiveContent,
  getArchiveMedia,
  getArchiveProvenance,
  getArchiveRecordById,
  getArchiveRecordBySlug,
  getArchiveRecords,
  getArchiveSources,
  getArchiveWordOfTheDay,
} from "../src/data/archive-read";
import { validateArchive } from "../src/data/validate-archive";
import type { CanonicalArchiveData } from "../src/data/types";

const EXPECTED = {
  records: 65,
  representations: 66,
  sources: 71,
  provenance: 66,
  media: 15,
  relations: 0,
} as const;

function cloneArchive(): CanonicalArchiveData {
  return JSON.parse(JSON.stringify(canonicalArchive)) as CanonicalArchiveData;
}

function representationCount(data: CanonicalArchiveData): number {
  return data.records.reduce(
    (total, record) => total + record.representations.length,
    0,
  );
}

function expectInvalid(
  mutate: (data: CanonicalArchiveData) => void,
  expectedMessage: string,
) {
  const data = cloneArchive();
  mutate(data);
  const result = validateArchive(data);
  assert.equal(result.valid, false, "mutated archive should be invalid");
  assert.ok(
    result.errors.some((error) => error.includes(expectedMessage)),
    `expected an error containing: ${expectedMessage}\nActual errors:\n${result.errors.join("\n")}`,
  );
}

assert.deepEqual(
  {
    records: canonicalArchive.records.length,
    representations: representationCount(canonicalArchive),
    sources: canonicalArchive.sources.length,
    provenance: canonicalArchive.provenance.length,
    media: canonicalArchive.media.length,
    relations: canonicalArchive.relations.length,
  },
  EXPECTED,
  "canonical archive inventory changed; update the migration deliberately",
);

const valid = validateArchive(canonicalArchive);
assert.equal(valid.valid, true, valid.errors.join("\n"));

const recordIds = canonicalArchive.records.map((record) => record.id);
assert.equal(new Set(recordIds).size, recordIds.length);

const recordKeys = canonicalArchive.records.map(
  (record) => `${record.type}:${record.slug}`,
);
assert.equal(new Set(recordKeys).size, recordKeys.length);

const representationIds = canonicalArchive.records.flatMap((record) =>
  record.representations.map((representation) => representation.id),
);
assert.equal(new Set(representationIds).size, representationIds.length);

for (const record of canonicalArchive.records) {
  assert.ok(record.provenanceIds.length > 0, `published record lacks provenance: ${record.id}`);
  for (const sourceId of record.sourceIds) {
    assert.ok(
      canonicalArchive.sources.some((source) => source.id === sourceId),
      `record source does not resolve: ${record.id} -> ${sourceId}`,
    );
  }
  for (const provenanceId of record.provenanceIds) {
    assert.ok(
      canonicalArchive.provenance.some((assertion) => assertion.id === provenanceId),
      `record provenance does not resolve: ${record.id} -> ${provenanceId}`,
    );
  }
}

const varna = getArchiveRecordBySlug("literature-work", "varna-ratnakara");
assert.ok(varna);
assert.equal(varna.representations.length, 2);
assert.equal(getArchiveRecordById(varna.id)?.slug, "varna-ratnakara");

assert.equal(getArchiveRecords("author").length, 5);
assert.equal(getArchiveContent("proverb").length, 6);
assert.equal(getArchiveBibliography().length, 5);

const firstRecord = getArchiveRecords()[0];
assert.ok(firstRecord);
assert.equal(getArchiveRecordById(firstRecord.id), firstRecord);
assert.deepEqual(getArchiveSources(firstRecord).map((source) => source.id), firstRecord.sourceIds);
assert.deepEqual(
  getArchiveProvenance(firstRecord).map((assertion) => assertion.id),
  firstRecord.provenanceIds,
);
assert.deepEqual(
  getArchiveMedia(firstRecord).map((media) => media.id),
  firstRecord.mediaIds,
);

const stableDate = new Date("2026-01-01T00:00:00.000Z");
assert.equal(
  getArchiveWordOfTheDay(stableDate).slug,
  getArchiveWordOfTheDay(stableDate).slug,
  "word of the day must be deterministic for a fixed date",
);

expectInvalid((data) => {
  data.records.push({ ...data.records[0]! });
}, "Duplicate record ID");

expectInvalid((data) => {
  data.records[1]!.slug = data.records[0]!.slug;
  data.records[1]!.type = data.records[0]!.type;
}, "Duplicate (type, slug)");

expectInvalid((data) => {
  data.records[0]!.sourceIds = ["source:missing"];
}, "references missing source");

expectInvalid((data) => {
  data.records[0]!.provenanceIds = [];
}, "has no required provenance");

expectInvalid((data) => {
  const source = data.sources.find((item) => item.id === data.records[0]!.sourceIds[0]);
  assert.ok(source?.representationId);
  source.representationId = "representation:missing";
}, "references missing representation");

expectInvalid((data) => {
  data.records[0]!.mediaIds = ["media:missing"];
}, "references missing media");

expectInvalid((data) => {
  data.records[0]!.relationIds = ["relation:missing"];
}, "references missing relation");

expectInvalid((data) => {
  const representation = data.records[0]!.representations[0]!;
  const source = data.sources.find(
    (item) => item.representationId === representation.id,
  );
  assert.ok(source);
  source.representationId = representation.id;
  source.legacyStatus = undefined;
  // The source remains valid, but ownership is intentionally broken below.
  data.records[0]!.sourceIds = data.records[0]!.sourceIds.filter(
    (id) => id !== source.id,
  );
}, "is not listed by owning record");

console.log(
  `Archive foundation tests passed: ${EXPECTED.records} records, ${EXPECTED.representations} representations, ${EXPECTED.sources} sources, ${EXPECTED.provenance} provenance assertions, ${EXPECTED.media} media records, ${EXPECTED.relations} relations.`,
);
