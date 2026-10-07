import { canonicalArchive } from "./archive-foundation";
import { searchArchive, getArchiveRecordById, getArchiveRecords } from "./archive-read";
import type { ArchiveRecord, ArchiveRecordType, VerificationStatus } from "./types";

export const TYPE_LABELS: Record<ArchiveRecordType, string> = {
  "literature-work": "Literature",
  author: "Author",
  "dictionary-entry": "Dictionary",
  proverb: "Proverb",
  "art-entry": "Art",
  "art-style": "Art style",
  "music-entry": "Music",
  song: "Song",
  "heritage-entry": "Heritage",
};

export function getRelatedRecords(record: ArchiveRecord) {
  return canonicalArchive.relations
    .filter((relation) => relation.fromRecordId === record.id || relation.toRecordId === record.id)
    .flatMap((relation) => {
      const from = getArchiveRecordById(relation.fromRecordId);
      const to = getArchiveRecordById(relation.toRecordId);
      if (!from || !to) return [];
      return [{
        relation,
        target: from.id === record.id ? to : from,
      }];
    });
}

export function searchArchiveAdvanced(
  query: string,
  options: {
    types?: ArchiveRecordType[];
    statuses?: VerificationStatus[];
    limit?: number;
    hasMedia?: boolean;
    hasRelations?: boolean;
  } = {},
) {
  const hits = searchArchive(query, { limit: 100 });
  return hits
    .filter((hit) => !options.types?.length || options.types.includes(hit.record.type))
    .filter((hit) => !options.statuses?.length || options.statuses.includes(hit.record.verificationStatus))
    .filter((hit) => options.hasMedia === undefined || (hit.record.mediaIds.length > 0) === options.hasMedia)
    .filter((hit) => options.hasRelations === undefined || (hit.record.relationIds.length > 0) === options.hasRelations)
    .slice(0, Math.max(1, options.limit ?? 50));
}

export function getResearchFacets() {
  const records = getArchiveRecords();
  return {
    types: (Object.keys(TYPE_LABELS) as ArchiveRecordType[]).map((value) => ({
      value,
      label: TYPE_LABELS[value],
      count: records.filter((record) => record.type === value).length,
    })),
    statuses: (["verified", "community-attested", "needs-review", "disputed"] as const).map((value) => ({
      value,
      label: value.replaceAll("-", " "),
      count: records.filter((record) => record.verificationStatus === value).length,
    })),
  };
}

export function getArchiveStats() {
  const records = getArchiveRecords();
  return {
    records: records.length,
    sources: canonicalArchive.sources.length,
    bibliographicSources: canonicalArchive.bibliographicSources.length,
    media: canonicalArchive.media.length,
    relations: canonicalArchive.relations.length,
    recordsWithMedia: records.filter((record) => record.mediaIds.length > 0).length,
    recordsWithRelations: records.filter((record) => record.relationIds.length > 0).length,
    recordTypes: new Set(records.map((record) => record.type)).size,
  };
}
