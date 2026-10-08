import { canonicalArchive } from "./archive-foundation";
import { auditArchiveMedia } from "./archive-media";
import { auditArchiveQuality } from "./archive-quality";
import { getProvenanceAuditReport } from "./provenance-report";
import type { ArchiveRecord, ArchiveRecordType } from "./types";

export type ScholarlyAuditKind =
  | "identity"
  | "provenance"
  | "content"
  | "media"
  | "relationship";

export type ScholarlyAuditPriority = "high" | "normal";

export interface ScholarlyAuditFinding {
  kind: ScholarlyAuditKind;
  priority: ScholarlyAuditPriority;
  code: string;
  recordId: string;
  recordType: ArchiveRecordType;
  slug: string;
  message: string;
}

export interface ScholarlyAuditReport {
  records: number;
  publishedRecords: number;
  findings: ScholarlyAuditFinding[];
  countsByKind: Record<ScholarlyAuditKind, number>;
  countsByCode: Record<string, number>;
  highPriority: number;
  reviewReady: number;
}

/**
 * Deterministic editorial matrix for scholarly follow-up.
 *
 * This is deliberately a review queue, not a truth oracle. It checks whether
 * the archive contains the evidence/metadata needed for a human review pass;
 * it never promotes verification status and never contacts external sources.
 */
const IDENTITY_FIELDS: Record<ArchiveRecordType, string[]> = {
  "literature-work": ["title", "titleDeva"],
  author: ["name", "nameDeva"],
  "dictionary-entry": ["headword"],
  proverb: ["text"],
  "art-entry": ["title", "titleDeva"],
  "art-style": ["name", "nameDeva"],
  "music-entry": ["title", "titleDeva"],
  song: ["title", "titleDeva"],
  "heritage-entry": ["name", "nameDeva"],
};

const TRANSLITERATION_TYPES = new Set<ArchiveRecordType>([
  "literature-work",
  "author",
  "dictionary-entry",
  "proverb",
  "art-style",
  "music-entry",
  "song",
  "heritage-entry",
]);

function objectContent(record: ArchiveRecord): Record<string, unknown> | null {
  return typeof record.content === "object" &&
    record.content !== null &&
    !Array.isArray(record.content)
    ? (record.content as Record<string, unknown>)
    : null;
}

function hasText(content: Record<string, unknown>, fields: string[]): boolean {
  return fields.some(
    (field) => typeof content[field] === "string" && content[field].trim().length > 0,
  );
}

function add(
  findings: ScholarlyAuditFinding[],
  record: ArchiveRecord,
  kind: ScholarlyAuditKind,
  priority: ScholarlyAuditPriority,
  code: string,
  message: string,
) {
  findings.push({
    kind,
    priority,
    code,
    recordId: record.id,
    recordType: record.type,
    slug: record.slug,
    message,
  });
}

function auditRecord(record: ArchiveRecord, findings: ScholarlyAuditFinding[]) {
  const content = objectContent(record);
  if (!content) {
    add(findings, record, "content", "high", "content-not-object", "Canonical content is not a structured object.");
    return;
  }

  if (!hasText(content, IDENTITY_FIELDS[record.type])) {
    add(
      findings,
      record,
      "identity",
      "high",
      "missing-identity",
      `No populated display identity field is available (${IDENTITY_FIELDS[record.type].join(", ")}).`,
    );
  }

  if (TRANSLITERATION_TYPES.has(record.type) && !hasText(content, ["transliteration"])) {
    add(
      findings,
      record,
      "identity",
      "normal",
      "missing-transliteration",
      "Transliteration is absent; review whether a scholarly transliteration should be recorded.",
    );
  }

  if (record.sourceIds.length === 0 || record.provenanceIds.length === 0) {
    add(
      findings,
      record,
      "provenance",
      "high",
      "missing-evidence-chain",
      "Published record does not have a complete source/provenance ownership chain.",
    );
  }

  if (record.verificationStatus === "needs-review" || record.verificationStatus === "disputed") {
    add(
      findings,
      record,
      "content",
      "high",
      `status-${record.verificationStatus}`,
      `Record is explicitly marked ${record.verificationStatus}; no automatic promotion is permitted.`,
    );
  }

  if (record.type === "author" && !hasText(content, ["bio"])) {
    add(
      findings,
      record,
      "content",
      "normal",
      "missing-biography",
      "Author has no biography text; review whether an authoritative biographical source can support one.",
    );
  }

  if (record.type === "dictionary-entry") {
    if (!Array.isArray(content["examples"]) || content["examples"].length === 0) {
      add(
        findings,
        record,
        "content",
        "normal",
        "missing-attested-example",
        "Dictionary entry has no attested example array; review whether usage evidence is available.",
      );
    }
  }

  if (record.type === "song" && (!Array.isArray(content["lyrics"]) || content["lyrics"].length === 0)) {
    add(
      findings,
      record,
      "content",
      "normal",
      "missing-lyrics-or-attestation",
      "Song has no lyric/attestation array; review whether a source-supported text or recording note is appropriate.",
    );
  }

  if (
    (record.type === "art-entry" || record.type === "art-style" || record.type === "heritage-entry") &&
    record.mediaIds.length === 0
  ) {
    add(
      findings,
      record,
      "media",
      "normal",
      "missing-media",
      "Visual/heritage record has no canonical media item; review whether an appropriately licensed source image exists.",
    );
  }
}

export function auditScholarlyReadiness(): ScholarlyAuditReport {
  const published = canonicalArchive.records.filter(
    (record) => record.contentStatus === "published",
  );
  const findings: ScholarlyAuditFinding[] = [];

  for (const record of published) auditRecord(record, findings);

  const provenance = getProvenanceAuditReport();
  for (const finding of provenance.findings) {
    add(
      findings,
      canonicalArchive.records.find((record) => record.id === finding.recordId)!,
      "provenance",
      finding.codes.includes("missing-claim-scope") || finding.codes.includes("missing-url")
        ? "high"
        : "normal",
      `provenance-${finding.codes.join("+")}`,
      `Evidence metadata requires review: ${finding.codes.join(", ")}.`,
    );
  }

  for (const finding of auditArchiveMedia().findings) {
    const record = canonicalArchive.records.find((item) => item.id === finding.recordId);
    if (!record) continue;
    add(
      findings,
      record,
      "media",
      finding.severity === "error" ? "high" : "normal",
      finding.code,
      finding.message,
    );
  }

  const quality = auditArchiveQuality();
  for (const finding of quality.findings.filter((item) => item.severity === "warning" && item.recordId)) {
    const record = canonicalArchive.records.find((item) => item.id === finding.recordId);
    if (!record) continue;
    add(findings, record, "content", "normal", finding.code, finding.message);
  }

  const countsByKind: Record<ScholarlyAuditKind, number> = {
    identity: 0,
    provenance: 0,
    content: 0,
    media: 0,
    relationship: 0,
  };
  const countsByCode: Record<string, number> = {};
  for (const finding of findings) {
    countsByKind[finding.kind] += 1;
    countsByCode[finding.code] = (countsByCode[finding.code] ?? 0) + 1;
  }

  const recordsWithHighPriority = new Set(
    findings.filter((finding) => finding.priority === "high").map((finding) => finding.recordId),
  );

  return {
    records: canonicalArchive.records.length,
    publishedRecords: published.length,
    findings,
    countsByKind,
    countsByCode,
    highPriority: findings.filter((finding) => finding.priority === "high").length,
    reviewReady: published.length - recordsWithHighPriority.size,
  };
}

export function formatScholarlyAuditReport(
  report = auditScholarlyReadiness(),
): string {
  const lines = [
    "# Scholarly verification readiness report",
    "",
    "Deterministic local audit only. This report identifies evidence and metadata that need human/source review; it does not verify facts or contact external sources.",
    "",
    `- Records: ${report.records}`,
    `- Published records: ${report.publishedRecords}`,
    `- High-priority findings: ${report.highPriority}`,
    `- Records without high-priority findings: ${report.reviewReady}`,
    "",
    "## Findings by kind",
    ...Object.entries(report.countsByKind).map(([kind, count]) => `- ${kind}: ${count}`),
    "",
    "## Findings by code",
    ...Object.entries(report.countsByCode)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([code, count]) => `- ${code}: ${count}`),
    "",
    "## Record-level queue",
    ...report.findings
      .slice(0, 250)
      .map(
        (finding) =>
          `- [${finding.priority.toUpperCase()}] ${finding.recordType}:${finding.slug} — ${finding.kind}/${finding.code}: ${finding.message}`,
      ),
    ...(report.findings.length > 250
      ? [`- ... ${report.findings.length - 250} additional findings omitted`]
      : []),
  ];
  return lines.join("\n");
}
