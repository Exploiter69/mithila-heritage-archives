import { canonicalArchive } from "./archive-foundation";
import type { ArchiveRecord, ArchiveRecordType, Source } from "./types";
import type { Author, Proverb } from "./archive";
import type { ArtStyle, Motif } from "./art";
import type { DictionaryEntry } from "./dictionary";
import type { HeritageEntry } from "./heritage";
import type { LiteraryWork } from "./literature";
import type { Song } from "./music";

const publishedRecords = canonicalArchive.records.filter(
  (record) => record.contentStatus === "published",
);

export interface ArchiveEvidenceView {
  source: ReturnType<typeof getArchiveSources>[number];
  provenance: ReturnType<typeof getArchiveProvenance>[number] | undefined;
}

export interface ArchiveImageMediaView {
  id: string;
  kind: "image";
  recordId: string;
  displayUrl: string;
  sourceUrl: string;
  licenseUrl: string;
  provider: "wikimedia-commons";
  payload: NonNullable<ReturnType<typeof getArchiveMedia>[number]>["payload"];
}

export interface ArchiveAudioMediaView {
  id: string;
  kind: "audio-stream";
  recordId: string;
  provider: "youtube";
  externalId: string;
  playbackUrl: string;
  payload: NonNullable<ReturnType<typeof getArchiveMedia>[number]>["payload"];
}

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

export function getArchiveEvidence(record: ArchiveRecord): ArchiveEvidenceView[] {
  const sources = getArchiveSources(record);
  const provenance = getArchiveProvenance(record);
  return sources.map((source) => ({
    source,
    provenance: provenance.find((assertion) => assertion.sourceId === source.id),
  }));
}

export function getArchiveImageMedia(record: ArchiveRecord): ArchiveImageMediaView[] {
  return getArchiveMedia(record)
    .filter((media) => media.kind === "image")
    .map((media) => ({
      ...media,
      kind: "image" as const,
    }));
}

export function getArchiveAudioMedia(record: ArchiveRecord): ArchiveAudioMediaView[] {
  return getArchiveMedia(record)
    .filter((media) => media.kind === "audio-stream")
    .map((media) => ({
      ...media,
      kind: "audio-stream" as const,
      playbackUrl: media.locator.url,
    }));
}

export function getArchiveBibliography() {
  return canonicalArchive.sources
    .filter((source) => source.captureKind === "bibliography-entry")
    .map((source) => ({
      name: source.citation,
      kind: source.legacyKind ?? "Reference",
      note: source.detail ?? "",
    }));
}

export function getArchiveContent<T>(type: ArchiveRecordType): T[] {
  return getArchiveRecords(type).map((record) => record.content as T);
}

function getArchiveFacetValues<T>(
  type: ArchiveRecordType,
  selector: (content: T) => string,
  allLabel = "All",
): string[] {
  const values = getArchiveContent<T>(type).map(selector);
  return [allLabel, ...Array.from(new Set(values))];
}

export function getArchiveLiteratureForms(): string[] {
  return getArchiveFacetValues<LiteraryWork>(
    "literature-work",
    (work) => work.form,
  );
}

export function getArchiveMusicCategories(): string[] {
  return getArchiveFacetValues<Song>("song", (song) => song.category);
}

export function getArchiveDictionaryWordClasses(): string[] {
  return getArchiveFacetValues<DictionaryEntry>(
    "dictionary-entry",
    (entry) => entry.wordClass,
  );
}

export function getArchiveHeritageKinds(): string[] {
  return getArchiveFacetValues<HeritageEntry>("heritage-entry", (entry) => entry.kind);
}

/**
 * These are the archive's four curated iconographic facets. They are
 * presentation metadata, not inferred record-to-record relationships.
 */
const ARCHIVE_ART_MOTIFS: Motif[] = [
  {
    name: "Lotus",
    nameDeva: "कमल",
    meaning:
      "The female principle and fertility; in the kohbar the ringed lotus with its stalk is the central image of the marriage chamber.",
  },
  {
    name: "Fish",
    nameDeva: "मछली",
    meaning:
      "Fecundity, abundance and good fortune — and the emblem of Mithila's rivers. A pair of fish is the standard auspicious sign at a wedding.",
  },
  {
    name: "Bamboo",
    nameDeva: "बाँस",
    meaning:
      "The male principle and the continuity of the family line; bamboo grows in unbroken succession, so it stands for descendants.",
  },
  {
    name: "Sun",
    nameDeva: "सूर्य",
    meaning:
      "The witness. The sun and moon painted at the top of a kohbar attest the marriage, as the sun attests the offerings at Chhath.",
  },
];

export function getArchiveArtMotifs(): Motif[] {
  return ARCHIVE_ART_MOTIFS;
}

export const ARCHIVE_STREAM_ATTRIBUTION_TEXT =
  "All audio streams via official artist/label channels on YouTube. Rights remain with the original creators.";

export function getArchiveWordOfTheDay(date = new Date()): DictionaryEntry {
  const dictionaryEntries = getArchiveContent<DictionaryEntry>("dictionary-entry");
  const day = Math.floor(date.getTime() / 86_400_000);
  const nouns = dictionaryEntries.filter(
    (entry) => entry.wordClass !== "Idiom / Proverb",
  );
  return nouns[day % nouns.length] ?? dictionaryEntries[0]!;
}

export type {
  ArtStyle,
  Author,
  DictionaryEntry,
  HeritageEntry,
  LiteraryWork,
  Proverb,
  Song,
  Source,
};
