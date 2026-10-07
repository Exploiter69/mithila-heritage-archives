import { canonicalArchive } from "./archive-foundation";
import { auditArchiveMedia } from "./archive-media";
import { auditArchiveQuality } from "./archive-quality";
import { getProvenanceAuditReport } from "./provenance-report";

export type EditorialQueueKind =
  | "provenance-review"
  | "media-review"
  | "source-needed"
  | "content-review"
  | "relationship-review"
  | "biography-review";

export interface EditorialQueueItem {
  kind: EditorialQueueKind;
  recordId: string;
  slug: string;
  priority: "high" | "normal";
  reason: string;
  codes?: string[];
}

export function getEditorialQueue(): EditorialQueueItem[] {
  const queue: EditorialQueueItem[] = [];
  const published = canonicalArchive.records.filter((record) => record.contentStatus === "published");
  const provenance = getProvenanceAuditReport();

  for (const finding of provenance.findings) {
    const record = canonicalArchive.records.find((item) => item.id === finding.recordId);
    if (!record) continue;
    const high = finding.codes.includes("missing-claim-scope") || finding.codes.includes("missing-url");
    queue.push({
      kind: "provenance-review",
      recordId: record.id,
      slug: record.slug,
      priority: high ? "high" : "normal",
      reason: "Provenance evidence has editorial gaps: " + finding.codes.join(", ") + ".",
      codes: finding.codes,
    });
  }

  for (const record of published) {
    if (record.sourceIds.length === 0 || record.provenanceIds.length === 0) {
      queue.push({
        kind: "source-needed",
        recordId: record.id,
        slug: record.slug,
        priority: "high",
        reason: "Published record has no complete source/provenance ownership chain.",
      });
    }
    if (record.verificationStatus === "needs-review" || record.verificationStatus === "disputed") {
      queue.push({
        kind: "content-review",
        recordId: record.id,
        slug: record.slug,
        priority: "high",
        reason: "Published record is explicitly marked " + record.verificationStatus + ".",
      });
    }
    if (record.type === "author") {
      const content = record.content as Record<string, unknown>;
      if (typeof content.bio !== "string" || !content.bio.trim()) {
        queue.push({
          kind: "biography-review",
          recordId: record.id,
          slug: record.slug,
          priority: "high",
          reason: "Author record has no biography text.",
        });
      }
    }
  }

  for (const finding of auditArchiveMedia().findings) {
    const record = canonicalArchive.records.find((item) => item.id === finding.recordId);
    queue.push({
      kind: "media-review",
      recordId: finding.recordId,
      slug: record?.slug ?? finding.recordId,
      priority: finding.severity === "error" ? "high" : "normal",
      reason: finding.message,
      codes: [finding.code],
    });
  }

  const quality = auditArchiveQuality();
  for (const finding of quality.findings.filter((item) => item.severity === "warning" && item.recordId)) {
    const record = canonicalArchive.records.find((item) => item.id === finding.recordId);
    if (!record) continue;
    if (finding.code === "missing-image-media") {
      queue.push({
        kind: "media-review",
        recordId: record.id,
        slug: record.slug,
        priority: "normal",
        reason: finding.message,
        codes: [finding.code],
      });
    }
  }

  const relatedRecordIds = new Set(canonicalArchive.relations.flatMap((relation) => [relation.fromRecordId, relation.toRecordId]));
  for (const record of published) {
    if (!relatedRecordIds.has(record.id) && ["author", "literature-work", "heritage-entry", "art-entry", "art-style", "music-entry", "song"].includes(record.type)) {
      queue.push({
        kind: "relationship-review",
        recordId: record.id,
        slug: record.slug,
        priority: "normal",
        reason: "Record has no explicit relationship; review whether a sourced relationship should be asserted or whether isolation is intentional.",
      });
    }
  }

  const seen = new Set<string>();
  return queue.filter((item) => {
    const key = item.kind + ":" + item.recordId + ":" + (item.codes?.join(",") ?? "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
