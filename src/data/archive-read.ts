import { canonicalArchive } from "./archive-foundation";
import type { ArchiveRecord, ArchiveRecordType } from "./types";
import type { Proverb } from "./archive";
import type { ArtStyle } from "./art";
import type { DictionaryEntry } from "./dictionary";
import type { HeritageEntry } from "./heritage";
import type { LiteraryWork } from "./literature";
import type { Song } from "./music";

const publishedRecords = canonicalArchive.records.filter(
  (record) => record.contentStatus === "published",
);

export function getArchiveRecords(type?: ArchiveRecordType): ArchiveRecord[] {
  if (!type) return publishedRecords;
  return publishedRecords.filter((record) => record.type === type);
}

export function getArchiveRecordBySlug(
  type: ArchiveRecordType,
  slug: string,
): ArchiveRecord | undefined {
  return publishedRecords.find(
    (record) => record.type === type && record.slug === slug,
  );
}

export function getArchiveRecordById(id: string): ArchiveRecord | undefined {
  return publishedRecords.find((record) => record.id === id);
}

export function getArchiveSources(record: ArchiveRecord) {
  return canonicalArchive.sources.filter((source) =>
    record.sourceIds.includes(source.id),
  );
}

export function getArchiveMedia(record: ArchiveRecord) {
  return canonicalArchive.media.filter((media) =>
    record.mediaIds.includes(media.id),
  );
}

export function getArchiveProvenance(record: ArchiveRecord) {
  return canonicalArchive.provenance.filter((assertion) =>
    record.provenanceIds.includes(assertion.id),
  );
}

export function getArchiveContent<T>(type: ArchiveRecordType): T[] {
  return getArchiveRecords(type).map((record) => record.content as T);
}

export type {
  ArtStyle,
  DictionaryEntry,
  HeritageEntry,
  LiteraryWork,
  Proverb,
  Song,
};
