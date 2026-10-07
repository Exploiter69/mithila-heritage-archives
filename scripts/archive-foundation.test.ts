import assert from "node:assert/strict";

import { canonicalArchive } from "../src/data/archive-foundation";
import { dictionaryEntries } from "../src/data/dictionary";
import { awardRecipientAuthors, catalogueLiterature, folkCultureExpansion, artExpansion, musicExpansion, heritageExpansion } from "../src/data/content-expansion-deep";
import { auditArchiveQuality } from "../src/data/archive-quality";
import {
  ARCHIVE_STREAM_ATTRIBUTION_TEXT,
  getArchiveArtMotifs,
  getArchiveBibliography,
  getArchiveContent,
  getArchiveDictionaryEntries,
  getArchiveDictionaryWordClasses,
  getArchiveEvidence,
  getArchiveImageMedia,
  getArchiveAudioMedia,
  getArchiveMedia,
  getArchiveLiteratureForms,
  getArchiveLiteraryWorks,
  getArchiveMusicCategories,
  getArchiveProvenance,
  getArchiveRecordById,
  getArchiveRecordBySlug,
  getArchiveRecords,
  getArchiveSources,
  getArchiveWordOfTheDay,
} from "../src/data/archive-read";
import { validateArchive } from "../src/data/validate-archive";
import type { CanonicalArchiveData } from "../src/data/types";

const EXPANDED_RECORDS =
  127 +
  awardRecipientAuthors.length +
  catalogueLiterature.length +
  folkCultureExpansion.length +
  artExpansion.length +
  musicExpansion.length +
  heritageExpansion.length +
  (new Set(dictionaryEntries.map((entry) => entry.slug)).size - 27);

const EXPECTED = {
  records: EXPANDED_RECORDS,
  representations: EXPANDED_RECORDS + 1,
  sources: 133 + (EXPANDED_RECORDS - 127),
  provenance: 128 + (EXPANDED_RECORDS - 127),
  media: 19,
  relations: 12,
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
const quality = auditArchiveQuality(canonicalArchive);
assert.equal(quality.errors.length, 0, quality.errors.map((item) => `${item.code}: ${item.message}`).join("\n"));

const invalidQualityArchive = cloneArchive();
invalidQualityArchive.records[0]!.content = null;
const invalidQuality = auditArchiveQuality(invalidQualityArchive);
assert.ok(
  invalidQuality.errors.some((item) => item.code === "content-not-object"),
  "quality audit must catch malformed canonical content",
);

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

assert.ok(
  canonicalArchive.bibliographicSources.length > 0,
  "provenance v2 must expose normalized bibliographic sources",
);
assert.ok(
  canonicalArchive.bibliographicSources.length <= canonicalArchive.sources.length,
  "normalization cannot create more bibliographic sources than source captures",
);
assert.equal(
  canonicalArchive.provenanceV2.length,
  canonicalArchive.provenance.length,
  "every migrated provenance assertion must have a provenance v2 counterpart",
);
const normalizedCaptureIds = canonicalArchive.bibliographicSources.flatMap(
  (source) => source.captureIds,
);
assert.deepEqual(
  new Set(normalizedCaptureIds),
  new Set(canonicalArchive.sources.map((source) => source.id)),
  "normalized bibliographic sources must retain every source capture exactly once",
);
for (const assertion of canonicalArchive.provenance) {
  const v2 = canonicalArchive.provenanceV2.find(
    (item) => item.id === `provenance-v2:${assertion.id}`,
  );
  assert.ok(v2, `missing provenance v2 counterpart: ${assertion.id}`);
  assert.equal(v2?.recordId, assertion.recordId);
  assert.equal(v2?.verificationStatus, assertion.verificationStatus);
  assert.equal(v2?.evidenceRole, assertion.evidenceRole);
  assert.deepEqual(v2?.sourceCaptureIds, [assertion.sourceId]);
}

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

const featuredLiterature = getArchiveRecordBySlug("literature-work", "bada-sukh-sar");
assert.ok(featuredLiterature);
assert.ok(Array.isArray((featuredLiterature?.content as { body?: unknown }).body));

assert.equal(getArchiveRecords("author").length, 5 + awardRecipientAuthors.length);
assert.equal(getArchiveContent("proverb").length, 6);
assert.equal(getArchiveBibliography().length, 5);
assert.equal(getArchiveLiteraryWorks().length, 62 + catalogueLiterature.length);\nassert.ok(catalogueLiterature.length >= 15);
assert.equal(getArchiveDictionaryEntries().length, new Set(dictionaryEntries.map((entry) => entry.slug)).size);\nassert.ok(getArchiveDictionaryEntries().length >= 100);
assert.deepEqual(getArchiveLiteratureForms(), [
  "All",
  "Padāvalī",
  "Narrative verse",
  "Drama",
  "Prose",
  "कविता",
  "कथा",
  "शास्त्रीय",
]);
assert.deepEqual(getArchiveMusicCategories(), ["All", "लोकगीत", "छठी मईया", "सोहर", "बटगमनी"]);
assert.deepEqual(getArchiveDictionaryWordClasses(), [
  "All",
  "Noun",
  "Adjective",
  "Verb",
  "Idiom / Proverb",
]);
assert.deepEqual(getArchiveArtMotifs().map((motif) => motif.name), [
  "Lotus",
  "Fish",
  "Bamboo",
  "Sun",
]);
assert.ok(
  ARCHIVE_STREAM_ATTRIBUTION_TEXT.includes("YouTube"),
  "stream attribution copy should remain available from the canonical read layer",
);

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
assert.equal(getArchiveEvidence(firstRecord).length, firstRecord.sourceIds.length);
assert.deepEqual(
  getArchiveEvidence(firstRecord).map((evidence) => evidence.source.id),
  firstRecord.sourceIds,
);
for (const evidence of getArchiveEvidence(firstRecord)) {
  assert.ok(evidence.provenance);
  assert.equal(evidence.provenance?.sourceId, evidence.source.id);
}

const imageRecord = getArchiveRecords("art-entry")[0] ?? getArchiveRecords("art-style")[0];
assert.ok(imageRecord);
assert.equal(
  getArchiveImageMedia(imageRecord).length,
  getArchiveMedia(imageRecord).filter((media) => media.kind === "image").length,
);

const audioRecord = getArchiveRecords("song")[0];
assert.ok(audioRecord);
const audioMedia = getArchiveAudioMedia(audioRecord);
assert.equal(
  audioMedia.length,
  getArchiveMedia(audioRecord).filter((media) => media.kind === "audio-stream").length,
);
if (audioMedia[0]) {
  assert.match(audioMedia[0].playbackUrl, /^https:\/\/www\.youtube\.com\/watch\?v=/);
}

const stableDate = new Date("2026-01-01T00:00:00.000Z");
const wordOfDay = getArchiveWordOfTheDay(stableDate);
assert.equal(
  wordOfDay.slug,
  getArchiveWordOfTheDay(stableDate).slug,
  "word of the day must be deterministic for a fixed date",
);
assert.ok(Array.isArray(wordOfDay.examples));
assert.ok(wordOfDay.examples.length > 0);

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

expectInvalid((data) => {
  const source = data.sources[0]!;
  data.bibliographicSources[0]!.captureIds.push(source.id);
}, "belongs to multiple bibliographic sources");

expectInvalid((data) => {
  const assertion = data.provenanceV2[0]!;
  const other = data.bibliographicSources.find(
    (source) => source.id !== assertion.bibliographicSourceId,
  );
  assert.ok(other);
  other!.captureIds.push(assertion.sourceCaptureIds[0]!);
}, "belongs to multiple bibliographic sources");

console.log(
  `Archive foundation tests passed: ${EXPECTED.records} records, ${EXPECTED.representations} representations, ${EXPECTED.sources} sources, ${EXPECTED.provenance} provenance assertions, ${EXPECTED.media} media records, ${EXPECTED.relations} relations.`,
);
