import { canonicalArchive } from "./archive-foundation";
import { getArchiveRecordPath } from "./archive-read";
import type { ArchiveRecord, RecordRelation } from "./types";

export const ARCHIVE_API_VERSION = "1.0";
export const ARCHIVE_RELEASE = "2026.10.0";
export const ARCHIVE_RELEASE_DATE = "2026-10-08";

export interface PublicArchiveRecord {
  id: string;
  type: ArchiveRecord["type"];
  slug: string;
  url: string;
  contentStatus: ArchiveRecord["contentStatus"];
  verificationStatus: ArchiveRecord["verificationStatus"];
  content: unknown;
  sourceIds: string[];
  mediaIds: string[];
  relationIds: string[];
}

export interface PublicArchiveEnvelope {
  apiVersion: string;
  archiveRelease: string;
  releaseDate: string;
  generatedFrom: "canonical-static-archive";
  recordCount: number;
  sourceCount: number;
  mediaCount: number;
  relationCount: number;
  records: PublicArchiveRecord[];
  relations: RecordRelation[];
}

export function toPublicRecord(record: ArchiveRecord): PublicArchiveRecord {
  return {
    id: record.id,
    type: record.type,
    slug: record.slug,
    url: getArchiveRecordPath(record),
    contentStatus: record.contentStatus,
    verificationStatus: record.verificationStatus,
    content: record.content,
    sourceIds: [...record.sourceIds],
    mediaIds: [...record.mediaIds],
    relationIds: [...record.relationIds],
  };
}

export function getPublicArchiveEnvelope(): PublicArchiveEnvelope {
  const records = canonicalArchive.records.filter((record) => record.contentStatus === "published").map(toPublicRecord);
  return {
    apiVersion: ARCHIVE_API_VERSION,
    archiveRelease: ARCHIVE_RELEASE,
    releaseDate: ARCHIVE_RELEASE_DATE,
    generatedFrom: "canonical-static-archive",
    recordCount: records.length,
    sourceCount: canonicalArchive.sources.length,
    mediaCount: canonicalArchive.media.length,
    relationCount: canonicalArchive.relations.length,
    records,
    relations: canonicalArchive.relations,
  };
}

export function getPublicRecord(type: ArchiveRecord["type"], slug: string) {
  const record = canonicalArchive.records.find((item) => item.contentStatus === "published" && item.type === type && item.slug === slug);
  return record ? toPublicRecord(record) : undefined;
}

function csvEscape(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value) ?? "";
  return `"${text.replaceAll('"', '""')}"`;
}

export function getPublicArchiveCsv(): string {
  const records = canonicalArchive.records.filter((record) => record.contentStatus === "published").map(toPublicRecord);
  const header = ["id", "type", "slug", "url", "contentStatus", "verificationStatus", "sourceIds", "mediaIds", "relationIds", "content"];
  const rows = records.map((record) => [
    record.id,
    record.type,
    record.slug,
    record.url,
    record.contentStatus,
    record.verificationStatus,
    record.sourceIds.join(";"),
    record.mediaIds.join(";"),
    record.relationIds.join(";"),
    record.content,
  ].map(csvEscape).join(","));
  return [header.join(","), ...rows].join("\n") + "\n";
}
