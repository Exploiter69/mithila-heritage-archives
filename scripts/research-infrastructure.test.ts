import assert from "node:assert/strict";
import { canonicalArchive } from "../src/data/archive-foundation";
import { getArchiveRecordById } from "../src/data/archive-read";
import {
  ARCHIVE_LOCALES,
  buildIiifManifest,
  buildPreservationManifest,
  findShortestRecordPath,
  getCitationBundle,
  getResearchDataset,
} from "../src/data/research-infrastructure";
import { validateContributionProposal } from "../src/data/contribution-schema";

const published = canonicalArchive.records.filter((record) => record.contentStatus === "published");
const dataset = getResearchDataset({ limit: 1000 });
assert.equal(dataset.length, published.length);
assert.equal(new Set(dataset.map((item) => item.id)).size, dataset.length);

const record = canonicalArchive.records[0]!;
const bundle = getCitationBundle(record, "https://example.org");
assert(bundle.permalink.includes("/archive/"));
assert(bundle.bibtex.includes("@misc{"));
assert.equal(bundle.cslJson.publisher, "Mithila Digital Archive");

const image = canonicalArchive.media.find((item) => item.kind === "image");
assert(image);
if (image && image.kind === "image") {
  const imageRecord = getArchiveRecordById(image.recordId);
  assert(imageRecord);
  if (imageRecord) {
    const manifest = buildIiifManifest(
      imageRecord,
      { ...image, payload: { caption: image.payload.caption } },
      "https://example.org",
    );
    assert.equal(manifest.type, "Manifest");
    assert.equal(manifest.items[0]!.items[0]!.items[0]!.body.id, image.displayUrl);
  }
}

const media = canonicalArchive.media[0]!;
const mediaRecord = getArchiveRecordById(media.recordId);
assert(mediaRecord);
if (mediaRecord) {
  const preservation = buildPreservationManifest(mediaRecord, media);
  assert.equal(preservation.integrity.checksum, null);
  assert.equal(preservation.integrity.status, "not-captured");
}

const relation = canonicalArchive.relations[0]!;
const paths = findShortestRecordPath(relation.fromRecordId, relation.toRecordId);
assert(paths.length > 0);
assert.equal(paths[0]![0]!.id, relation.fromRecordId);
assert.equal(paths[0]!.at(-1)!.id, relation.toRecordId);

assert.deepEqual(ARCHIVE_LOCALES, ["mai", "hi", "en"]);

const proposal = validateContributionProposal({
  id: "proposal:test",
  targetRecordId: "rec-test",
  targetType: "literature-work",
  field: "summary",
  proposedValue: "A proposed correction",
  reason: "Corrects a bibliographic statement.",
  sourceCitation: "Test source, 2026.",
  contributor: "Research contributor",
  requestedStatus: "needs-review",
  submittedAt: "2026-10-07T00:00:00Z",
});
assert.equal(proposal.success, true);

console.log("Research infrastructure tests passed.");
