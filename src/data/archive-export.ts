import { canonicalArchive } from "./archive-foundation";
import { getArchiveRecordPath } from "./archive-read";
import type { ArchiveRecord, RecordRelation } from "./types";

export const ARCHIVE_API_VERSION = "1.0";

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
