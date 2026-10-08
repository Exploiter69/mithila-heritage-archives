import { canonicalArchive } from "./archive-foundation";
import { searchArchive, getArchiveRecordById, getArchiveRecords } from "./archive-read";
import type { ArchiveRecord, ArchiveRecordType, VerificationStatus } from "./types";

export const RELATION_PREDICATE_LABELS: Record<import("./types").RelationPredicate, string> = {
  "created-by": "created by", "has-work": "has work", "performed-at": "performed at", "depicts": "depicts", "about": "about", "related-to": "related to", "part-of": "part of", "example-of": "example of", "associated-with": "associated with",
};

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
    provenanceAssertions: canonicalArchive.provenance.length + canonicalArchive.provenanceV2.length,
    media: canonicalArchive.media.length,
    relations: canonicalArchive.relations.length,
    recordsWithMedia: records.filter((record) => record.mediaIds.length > 0).length,
    recordsWithRelations: records.filter((record) => record.relationIds.length > 0).length,
    recordTypes: new Set(records.map((record) => record.type)).size,
  };
}

export function interpretResearchQuery(query: string) {
  const q = query.toLocaleLowerCase();
  const result: { relatedSlug?: string; textHint?: string; requireSources?: boolean; types?: ArchiveRecordType[] } = {};
  if (q.includes("associated with vidyapati") || q.includes("associated with vidyāpati") || q.includes("by vidyapati")) result.relatedSlug = "vidyapati";
  if (q.includes("folk traditions from janakpur") || q.includes("from janakpur")) result.textHint = "janakpur";
  if (q.includes("with sources") || q.includes("with source")) result.requireSources = true;
  if (q.includes("literary works") || q.includes("literature")) result.types = ["literature-work"];
  if (q.includes("marriage songs") || q.includes("wedding songs")) result.types = ["song","music-entry"];
  return result;
}

export function applyResearchIntent(hits: ReturnType<typeof searchArchiveAdvanced>, query: string) {
  const intent = interpretResearchQuery(query);
  let filtered = hits;
  if (intent.types?.length) filtered = filtered.filter(hit => intent.types!.includes(hit.record.type));
  if (intent.requireSources) filtered = filtered.filter(hit => hit.record.sourceIds.length > 0);
  if (intent.textHint) filtered = filtered.filter(hit => JSON.stringify(hit.record.content).toLocaleLowerCase().includes(intent.textHint!));
  if (intent.relatedSlug) {
    const anchor = getArchiveRecords().find(record => record.slug === intent.relatedSlug);
    if (anchor) {
      const relatedIds = new Set(getRelatedRecords(anchor).map(item => item.target.id));
      filtered = filtered.filter(hit => hit.record.id === anchor.id || relatedIds.has(hit.record.id));
    }
  }
  return filtered;
}
