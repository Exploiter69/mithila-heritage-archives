import { canonicalArchive } from "./archive-foundation";
import { auditArchiveMedia } from "./archive-media";
import { getArchiveProvenanceV2 } from "./archive-read";

export type EditorialQueueKind = "provenance-review" | "media-review";

export interface EditorialQueueItem {
  kind: EditorialQueueKind;
  recordId: string;
  slug: string;
  priority: "high" | "normal";
  reason: string;
}

export function getEditorialQueue(): EditorialQueueItem[] {
  const queue: EditorialQueueItem[] = [];

  for (const record of canonicalArchive.records.filter((item) => item.contentStatus === "published")) {
    for (const assertion of getArchiveProvenanceV2(record)) {
      if (assertion.verificationStatus === "needs-review") {
        queue.push({
          kind: "provenance-review",
          recordId: record.id,
          slug: record.slug,
          priority: "high",
          reason: "Published record has a provenance assertion explicitly marked needs-review.",
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
    });
  }

  return queue;
}
