import assert from "node:assert/strict";
import { canonicalArchive } from "../src/data/archive-foundation";
import { getEditorialQueue } from "../src/data/editorial-workflow";
import { atlasPointRecords, EXPLORE_JOURNEYS, getCorpusTimelineEvents, journeyRecords } from "../src/data/archive-experience";
import { auditArchiveMedia } from "../src/data/archive-media";
import { getProvenanceAuditReport } from "../src/data/provenance-report";
import { getArchiveEvidence, getArchiveRecordById } from "../src/data/archive-read";
import { getRecordPermalink, getCitationBundle, buildPreservationManifest, findShortestRecordPath } from "../src/data/research-infrastructure";
import { validateArchive } from "../src/data/validate-archive";

const validation = validateArchive(canonicalArchive);
assert.equal(validation.valid, true, validation.errors.join("\n"));

for (const record of canonicalArchive.records.filter((item) => item.contentStatus === "published")) {
  assert.ok(record.sourceIds.length > 0, "published record must have a source: " + record.id);
  assert.ok(record.provenanceIds.length > 0, "published record must have provenance: " + record.id);
  for (const relationId of record.relationIds) {
    const relation = canonicalArchive.relations.find((item) => item.id === relationId);
    assert.ok(relation, "relation must resolve: " + relationId);
    assert.ok(relation!.fromRecordId === record.id || relation!.toRecordId === record.id);
  }
  for (const evidence of getArchiveEvidence(record)) {
    assert.ok(evidence.provenance, "source capture must resolve to provenance: " + record.id);
    assert.ok(evidence.normalizedSource, "source capture must normalize: " + record.id);
  }
}

for (const relation of canonicalArchive.relations) {
  const from = getArchiveRecordById(relation.fromRecordId);
  const to = getArchiveRecordById(relation.toRecordId);
  assert.ok(from && to);
  assert.ok(relation.sourceIds.some((sourceId) => from!.sourceIds.includes(sourceId) || to!.sourceIds.includes(sourceId)));
}

for (const item of atlasPointRecords()) {
  assert.ok(item.record, "atlas point must resolve to a canonical record: " + item.point.slug);
  assert.equal(item.record?.type, "heritage-entry");
}

for (const journey of EXPLORE_JOURNEYS) {
  assert.equal(journeyRecords(journey).length, journey.slugs.length, "explore journey contains an unresolved canonical slug: " + journey.slug);
}

for (const event of getCorpusTimelineEvents()) {
  assert.ok(event.sourceRecordId);
  assert.ok(event.slug);
  assert.ok(Number.isInteger(event.year));
}

for (const media of canonicalArchive.media) {
  const owner = getArchiveRecordById(media.recordId);
  assert.ok(owner, "media owner must resolve: " + media.id);
  assert.ok(owner!.mediaIds.includes(media.id), "media owner must list media: " + media.id);
}

for (const assertion of canonicalArchive.provenanceV2) {
  assert.equal(Boolean(assertion.checkedAt), Boolean(assertion.checkedBy), "review metadata must be paired: " + assertion.id);
  if (assertion.evidenceRole === "claim-level") assert.ok(assertion.claimId);
}

const mediaReport = auditArchiveMedia();
assert.equal(mediaReport.findings.filter((item) => item.severity === "error").length, 0, "media audit has errors");

const provenance = getProvenanceAuditReport();
assert.ok(provenance.findings.length >= 0);
const editorial = getEditorialQueue();
assert.ok(editorial.every((item) => item.recordId && item.slug && item.reason));

const first = canonicalArchive.records[0]!;
assert.equal(getRecordPermalink(first), "/archive/" + first.type + "/" + first.slug);
assert.deepEqual(getCitationBundle(first, "https://example.org").cslJson, getCitationBundle(first, "https://example.org").cslJson);
const preserved = buildPreservationManifest(first, canonicalArchive.media.find((item) => item.recordId === first.id) ?? canonicalArchive.media[0]!);
assert.equal(preserved.generatedAt, undefined);

for (const relation of canonicalArchive.relations.slice(0, 25)) {
  const paths = findShortestRecordPath(relation.fromRecordId, relation.toRecordId);
  assert.ok(paths.length > 0);
  const length = paths[0]!.length;
  assert.ok(paths.every((path) => path.length === length), "all returned paths must have equal shortest length");
}

console.log("Archive deep audit passed:", JSON.stringify({
  records: canonicalArchive.records.length,
  relations: canonicalArchive.relations.length,
  media: canonicalArchive.media.length,
  provenanceGaps: provenance.findings.length,
  editorialItems: editorial.length,
}));
