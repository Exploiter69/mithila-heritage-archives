import { canonicalArchive } from "./archive-foundation";
import type { ArchiveRecord, CanonicalArchiveData } from "./types";

export type ArchiveQualitySeverity = "error" | "warning";

export interface ArchiveQualityFinding {
  code: string;
  severity: ArchiveQualitySeverity;
  recordId?: string;
  recordKey?: string;
  message: string;
}

export interface ArchiveQualityReport {
  records: number;
  publishedRecords: number;
  findings: ArchiveQualityFinding[];
  errors: ArchiveQualityFinding[];
  warnings: ArchiveQualityFinding[];
  countsByCode: Record<string, number>;
}

type ContentObject = Record<string, unknown>;

const IDENTITY_FIELDS: Record<ArchiveRecord["type"], string[]> = {
  "literature-work": ["title", "titleDeva", "titleMai"],
  author: ["name", "nameDeva"],
  "dictionary-entry": ["headword"],
  proverb: ["text"],
  "art-entry": ["title", "titleDeva"],
  "art-style": ["name", "nameDeva"],
  "music-entry": ["title", "titleDeva", "titleMai"],
  song: ["title", "titleDeva"],
  "heritage-entry": ["name", "nameDeva"],
};

function isObject(value: unknown): value is ContentObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(content: ContentObject, fields: string[]): boolean {
  return fields.some(
    (field) => typeof content[field] === "string" && content[field].trim().length > 0,
  );
}

function finding(
  severity: ArchiveQualitySeverity,
  code: string,
  record: ArchiveRecord | undefined,
  message: string,
): ArchiveQualityFinding {
  return {
    code,
    severity,
    ...(record ? { recordId: record.id, recordKey: `${record.type}:${record.slug}` } : {}),
    message,
  };
}

function auditRecord(record: ArchiveRecord): ArchiveQualityFinding[] {
  const findings: ArchiveQualityFinding[] = [];
  const content = record.content;

  if (!isObject(content)) {
    findings.push(
      finding("error", "content-not-object", record, "canonical content must be a non-null object"),
    );
    return findings;
  }

  if (!hasText(content, IDENTITY_FIELDS[record.type])) {
    findings.push(
      finding(
        "error",
        "missing-display-identity",
        record,
        `record has no populated display identity field (${IDENTITY_FIELDS[record.type].join(", ")})`,
      ),
    );
  }

  if (record.representations.length === 0) {
    findings.push(
      finding("error", "missing-representation", record, "published record has no migration representation"),
    );
  }

  if (record.sourceIds.length === 0) {
    findings.push(
      finding("error", "missing-source", record, "published record has no source capture"),
    );
  }

  if (record.provenanceIds.length === 0) {
    findings.push(
      finding("error", "missing-provenance", record, "published record has no provenance assertion"),
    );
  }

  if (
    record.type === "dictionary-entry" &&
    record.representations.some((representation) => representation.origin.module === "dictionary.ts") &&
    !Array.isArray(content.examples)
  ) {
    findings.push(
      finding(
        "error",
        "dictionary-examples-shape",
        record,
        "dictionary.ts representations must expose an examples array",
      ),
    );
  }

  if (
    record.type === "song" &&
    record.representations.some((representation) => representation.origin.module === "music.ts") &&
    !Array.isArray(content.lyrics)
  ) {
    findings.push(
      finding(
        "error",
        "song-lyrics-shape",
        record,
        "music.ts song representations must expose a lyrics array",
      ),
    );
  }

  if (
    (record.type === "art-entry" || record.type === "heritage-entry") &&
    record.mediaIds.length === 0
  ) {
    findings.push(
      finding(
        "warning",
        "missing-image-media",
        record,
        "published visual/cultural record has no canonical media item",
      ),
    );
  }

  return findings;
}

function auditMedia(data: CanonicalArchiveData): ArchiveQualityFinding[] {
  const findings: ArchiveQualityFinding[] = [];

  for (const media of data.media) {
    if (media.kind === "image") {
      if (media.displayUrl !== media.payload.url) {
        findings.push({
          code: "image-display-url-drift",
          severity: "error",
          recordId: media.recordId,
          message: `media ${media.id} displayUrl differs from its canonical payload URL`,
        });
      }
      if (media.sourceUrl !== media.payload.filePage) {
        findings.push({
          code: "image-source-url-drift",
          severity: "error",
          recordId: media.recordId,
          message: `media ${media.id} sourceUrl differs from its Commons file page`,
        });
      }
      if (media.licenseUrl !== media.payload.licenseUrl) {
        findings.push({
          code: "image-license-url-drift",
          severity: "error",
          recordId: media.recordId,
          message: `media ${media.id} licenseUrl differs from its canonical payload`,
        });
      }
    } else if (!media.locator.url.includes(media.externalId)) {
      findings.push({
        code: "audio-locator-drift",
        severity: "error",
        recordId: media.recordId,
        message: `media ${media.id} playback locator does not contain its external YouTube ID`,
      });
    }
  }

  return findings;
}

/**
 * Deterministic Phase 4 audit. This intentionally does not contact external
 * sources and never changes editorial verification status.
 */
export function auditArchiveQuality(data: CanonicalArchiveData = canonicalArchive): ArchiveQualityReport {
  const findings = data.records.flatMap((record) => auditRecord(record));
  findings.push(...auditMedia(data));

  const errors = findings.filter((item) => item.severity === "error");
  const warnings = findings.filter((item) => item.severity === "warning");
  const countsByCode: Record<string, number> = {};

  for (const item of findings) {
    countsByCode[item.code] = (countsByCode[item.code] ?? 0) + 1;
  }

  return {
    records: data.records.length,
    publishedRecords: data.records.filter((record) => record.contentStatus === "published").length,
    findings,
    errors,
    warnings,
    countsByCode,
  };
}

export function assertArchiveQuality(data: CanonicalArchiveData = canonicalArchive): ArchiveQualityReport {
  const report = auditArchiveQuality(data);
  if (report.errors.length > 0) {
    throw new Error(
      `Archive quality audit failed:\n${report.errors
        .map((item) => `[${item.code}] ${item.recordKey ?? item.recordId ?? "archive"}: ${item.message}`)
        .join("\n")}`,
    );
  }
  return report;
}
