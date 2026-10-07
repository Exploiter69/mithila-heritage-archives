import { describe, expect, test } from "bun:test";
import { canonicalArchive } from "@/data/archive-foundation";
import { getArchiveRecordById } from "@/data/archive-read";
import {
  ARCHIVE_LOCALES,
  buildIiifManifest,
  buildPreservationManifest,
  findShortestRecordPath,
  getCitationBundle,
  getResearchDataset,
} from "@/data/research-infrastructure";
import { validateContributionProposal } from "@/data/contribution-schema";

describe("research-grade infrastructure", () => {
  test("covers all published records in the dataset projection", () => {
    const dataset = getResearchDataset({ limit: 1000 });
    expect(dataset.length).toBe(canonicalArchive.records.filter((record) => record.contentStatus === "published").length);
    expect(new Set(dataset.map((item) => item.id)).size).toBe(dataset.length);
  });

  test("generates stable scholarly citation formats", () => {
    const record = canonicalArchive.records[0]!;
    const bundle = getCitationBundle(record, "https://example.org");
    expect(bundle.permalink).toContain("/archive/");
    expect(bundle.bibtex).toContain("@misc{");
    expect(bundle.cslJson.publisher).toBe("Mithila Digital Archive");
  });

  test("keeps IIIF external image identity intact", () => {
    const media = canonicalArchive.media.find((item) => item.kind === "image");
    expect(media).toBeDefined();
    const record = media ? getArchiveRecordById(media.recordId) : undefined;
    expect(record).toBeDefined();
    if (media?.kind === "image" && record) {
      const manifest = buildIiifManifest(record, media, "https://example.org");
      expect(manifest.type).toBe("Manifest");
      expect(manifest.items[0]?.items[0]?.items[0]?.body.id).toBe(media.displayUrl);
    }
  });

  test("preservation manifests do not invent integrity metadata", () => {
    const media = canonicalArchive.media[0]!;
    const record = getArchiveRecordById(media.recordId)!;
    const manifest = buildPreservationManifest(record, media);
    expect(manifest.integrity.checksum).toBeNull();
    expect(manifest.integrity.status).toBe("not-captured");
  });

  test("graph traversal returns only asserted endpoints", () => {
    const relation = canonicalArchive.relations[0]!;
    const paths = findShortestRecordPath(relation.fromRecordId, relation.toRecordId);
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0]?.[0]?.id).toBe(relation.fromRecordId);
    expect(paths[0]?.at(-1)?.id).toBe(relation.toRecordId);
  });

  test("locale keys are stable", () => {
    expect(ARCHIVE_LOCALES).toEqual(["mai", "hi", "en"]);
  });

  test("contribution validation requires evidence and attribution", () => {
    const result = validateContributionProposal({
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
    expect(result.success).toBe(true);
  });
});
