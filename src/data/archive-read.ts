import { canonicalArchive } from "./archive-foundation";
import type {
  ArchiveRecord,
  ArchiveRecordType,
  BibliographicSource,
  ProvenanceAssertionV2,
  Source,
} from "./types";
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
  normalizedSource: BibliographicSource | undefined;
  provenanceV2: ProvenanceAssertionV2 | undefined;
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

export function getArchiveRecordByTypeAndSlug(
  type: ArchiveRecordType,
  slug: string,
): ArchiveRecord | undefined {
  return getArchiveRecordBySlug(type, slug);
}

export function getArchiveRecordPath(record: Pick<ArchiveRecord, "type" | "slug">): string {
  return `/archive/${record.type}/${record.slug}`;
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

export function getArchiveBibliographicSources(): BibliographicSource[] {
  return canonicalArchive.bibliographicSources;
}

export function getArchiveProvenanceV2(record: ArchiveRecord): ProvenanceAssertionV2[] {
  return canonicalArchive.provenanceV2.filter(
    (assertion) => assertion.recordId === record.id,
  );
}

export function getArchiveEvidence(record: ArchiveRecord): ArchiveEvidenceView[] {
  const sources = getArchiveSources(record);
  const provenance = getArchiveProvenance(record);
  const provenanceV2 = getArchiveProvenanceV2(record);

  return sources.map((source) => {
    const assertion = provenance.find((item) => item.sourceId === source.id);
    const normalizedSource = canonicalArchive.bibliographicSources.find((item) =>
      item.captureIds.includes(source.id),
    );
    const v2Assertion = provenanceV2.find((item) =>
      item.sourceCaptureIds.includes(source.id),
    );

    return {
      source,
      provenance: assertion,
      normalizedSource,
      provenanceV2: v2Assertion,
    };
  });
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

function hasStringFields(content: unknown, fields: string[]): content is Record<string, unknown> {
  if (!content || typeof content !== "object" || Array.isArray(content)) return false;
  const value = content as Record<string, unknown>;
  return fields.every((field) => typeof value[field] === "string" && value[field].trim().length > 0);
}

export function getArchiveAuthors(): Author[] {
  return getArchiveRecords("author")
    .map((record) => record.content as Partial<Author>)
    .filter((content): content is Author =>
      hasStringFields(content, ["slug", "name", "nameMai", "lifespan", "place", "role", "bio"]) &&
      Array.isArray(content.works) && content.works.every((work) => typeof work === "string"),
    );
}

export function getArchiveProverbs(): Proverb[] {
  return getArchiveRecords("proverb")
    .map((record) => record.content as Partial<Proverb>)
    .filter((content): content is Proverb =>
      hasStringFields(content, ["text", "transliteration", "literal", "meaning", "theme"]),
    );
}

function isCommonsImage(value: unknown): value is ArtStyle["image"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const image = value as Record<string, unknown>;
  return hasStringFields(image, ["url", "filePage", "fileTitle", "credit", "license", "licenseUrl", "caption"]);
}

function isSongStream(value: unknown): value is Song["stream"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const stream = value as Record<string, unknown>;
  return hasStringFields(stream, ["youtubeId", "channel", "channelKind", "note"]);
}

function isLiteraryBody(value: unknown): value is LiteraryWork["body"] {
  return Array.isArray(value) && value.every((line) => {
    if (!line || typeof line !== "object" || Array.isArray(line)) return false;
    const item = line as Record<string, unknown>;
    return hasStringFields(item, ["deva", "translation"]) &&
      (item.translit === undefined || typeof item.translit === "string");
  });
}

function isDictionaryExamples(value: unknown): value is DictionaryEntry["examples"] {
  return Array.isArray(value) && value.every((example) => {
    if (!example || typeof example !== "object" || Array.isArray(example)) return false;
    return hasStringFields(example, ["deva", "translit", "english"]);
  });
}

function isSongLyrics(value: unknown): value is Song["lyrics"] {
  return Array.isArray(value) && value.every((line) => {
    if (!line || typeof line !== "object" || Array.isArray(line)) return false;
    return hasStringFields(line, ["deva", "translation"]);
  });
}

export function getArchiveArtStyles(): ArtStyle[] {
  return getArchiveRecords("art-style")
    .map((record) => record.content as Partial<ArtStyle>)
    .filter((content): content is ArtStyle =>
      hasStringFields(content, ["slug", "name", "nameDeva", "origin", "technique", "description"]) &&
      Array.isArray(content.dyes) && content.dyes.every((item) => typeof item === "string") &&
      Array.isArray(content.motifs) && content.motifs.every((item) => typeof item === "string") &&
      isCommonsImage(content.image),
    );
}

export function getArchiveSongs(): Song[] {
  return getArchiveRecords("song")
    .map((record) => record.content as Partial<Song>)
    .filter((content): content is Song =>
      hasStringFields(content, ["slug", "title", "titleDeva", "transliteration", "performer", "occasion", "category", "about"]) &&
      isSongStream(content.stream) &&
      isSongLyrics(content.lyrics),
    );
}

export function getArchiveHeritageEntries(): HeritageEntry[] {
  return getArchiveRecords("heritage-entry")
    .map((record) => record.content as Partial<HeritageEntry>)
    .filter((content): content is HeritageEntry =>
      hasStringFields(content, ["slug", "name", "nameDeva", "kind", "place", "period", "summary"]) &&
      Array.isArray(content.context) && content.context.every((item) => typeof item === "string"),
    );
}

/**
 * Collection-facing typed reads intentionally select the current collection
 * payloads. The canonical graph also retains legacy payloads as published
 * migration records, but those payloads do not implement the newer collection
 * interfaces (for example, legacy dictionary entries have no examples[]).
 */
export function getArchiveLiteraryWorks(): LiteraryWork[] {
  return getArchiveRecords("literature-work")
    .map((record) => record.content as Partial<LiteraryWork>)
    .filter(
      (content): content is LiteraryWork =>
        typeof content.slug === "string" &&
        typeof content.titleDeva === "string" &&
        isLiteraryBody(content.body),
    );
}

export function getArchiveDictionaryEntries(): DictionaryEntry[] {
  return getArchiveRecords("dictionary-entry")
    .map((record) => record.content as Partial<DictionaryEntry>)
    .filter(
      (content): content is DictionaryEntry =>
        typeof content.slug === "string" &&
        typeof content.headword === "string" &&
        isDictionaryExamples(content.examples),
    );
}

export interface ArchiveSearchHit {
  record: ArchiveRecord;
  title: string;
  secondary: string;
  typeLabel: string;
  url: string;
}

export interface ArchiveSearchOptions {
  limit?: number;
}

const SEARCH_TYPE_LABELS: Record<ArchiveRecordType, string> = {
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

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\u200B-\u200D\u2060]/g, "")
    .replace(/\uFEFF/g, "")
    .replace(/\uFE0E/g, "")
    .replace(/\uFE0F/g, "")
    .replace(/(?:‐|‒|–|—|―)/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLatinSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function addSearchField(values: string[], value: unknown): void {
  if (typeof value === "string" && value.trim()) values.push(value);
}

function addSearchFields(values: string[], ...fields: unknown[]): void {
  for (const field of fields) addSearchField(values, field);
}

function addStringArray(values: string[], value: unknown): void {
  if (!Array.isArray(value)) return;
  for (const item of value) addSearchField(values, item);
}

function getRecordSearchProjection(record: ArchiveRecord): {
  title: string;
  secondary: string;
  searchText: string;
} {
  const content = record.content as Record<string, unknown>;
  const values: string[] = [];
  const secondaryValues: string[] = [];

  switch (record.type) {
    case "literature-work":
      addSearchFields(
        values,
        content["title"],
        content["titleDeva"],
        content["titleMai"],
        content["transliteration"],
        content["author"],
        content["authorDeva"],
        content["period"],
        content["form"],
        content["language"],
        content["summary"],
      );
      addSearchFields(
        secondaryValues,
        content["transliteration"],
        content["author"],
        content["period"],
        content["form"],
      );
      break;

    case "author":
      addSearchFields(
        values,
        content["name"],
        content["nameDeva"],
        content["nameMai"],
        content["transliteration"],
        content["lifespan"],
        content["place"],
        content["role"],
        content["bio"],
      );
      addStringArray(values, content["works"]);
      addSearchFields(
        secondaryValues,
        content["name"],
        content["lifespan"],
        content["place"],
        content["role"],
      );
      break;

    case "dictionary-entry":
      addSearchFields(
        values,
        content["headword"],
        content["transliteration"],
        content["pos"],
        content["gloss"],
        content["usage"],
        content["usageGloss"],
        content["register"],
        content["english"],
        content["hindi"],
        content["wordClass"],
      );
      addSearchFields(
        secondaryValues,
        content["transliteration"],
        content["gloss"],
        content["pos"],
        content["register"],
      );
      break;

    case "proverb":
      addSearchFields(
        values,
        content["text"],
        content["transliteration"],
        content["literal"],
        content["meaning"],
        content["theme"],
      );
      addSearchFields(
        secondaryValues,
        content["transliteration"],
        content["meaning"],
        content["theme"],
      );
      break;

    case "art-entry":
      addSearchFields(
        values,
        content["title"],
        content["titleDeva"],
        content["tradition"],
        content["region"],
        content["materials"],
        content["description"],
      );
      addSearchFields(
        secondaryValues,
        content["tradition"],
        content["region"],
        content["materials"],
      );
      break;

    case "art-style":
      addSearchFields(
        values,
        content["name"],
        content["nameDeva"],
        content["transliteration"],
        content["origin"],
      );
      addStringArray(values, content["motifs"]);
      addSearchFields(
        secondaryValues,
        content["origin"],
        content["transliteration"],
      );
      break;

    case "music-entry":
      addSearchFields(
        values,
        content["title"],
        content["titleDeva"],
        content["titleMai"],
        content["transliteration"],
        content["genre"],
        content["occasion"],
        content["description"],
      );
      addSearchFields(
        secondaryValues,
        content["genre"],
        content["occasion"],
      );
      break;

    case "song": {
      addSearchFields(
        values,
        content["title"],
        content["titleDeva"],
        content["transliteration"],
        content["performer"],
        content["occasion"],
        content["category"],
        content["about"],
      );
      const lyrics = content["lyrics"];
      if (Array.isArray(lyrics)) {
        for (const lyric of lyrics) {
          if (lyric && typeof lyric === "object") {
            addSearchFields(
              values,
              (lyric as Record<string, unknown>)["deva"],
              (lyric as Record<string, unknown>)["translation"],
            );
          }
        }
      }
      addSearchFields(
        secondaryValues,
        content["transliteration"],
        content["performer"],
        content["category"],
        content["occasion"],
      );
      break;
    }

    case "heritage-entry":
      addSearchFields(
        values,
        content["name"],
        content["nameDeva"],
        content["transliteration"],
        content["kind"],
        content["place"],
        content["period"],
        content["summary"],
      );
      addStringArray(values, content["context"]);
      addSearchFields(
        secondaryValues,
        content["kind"],
        content["place"],
        content["period"],
      );
      break;
  }

  const sources = getArchiveSources(record);
  for (const source of sources) {
    addSearchField(values, source.citation);
    addSearchField(values, source.detail);
  }

  const title =
    (typeof content["titleDeva"] === "string" && content["titleDeva"]) ||
    (typeof content["nameDeva"] === "string" && content["nameDeva"]) ||
    (typeof content["headword"] === "string" && content["headword"]) ||
    (typeof content["text"] === "string" && content["text"]) ||
    (typeof content["title"] === "string" && content["title"]) ||
    (typeof content["name"] === "string" && content["name"]) ||
    (typeof content["transliteration"] === "string" &&
      content["transliteration"]) ||
    record.slug;

  const searchText = normalizeSearchText(
    [
      record.slug,
      SEARCH_TYPE_LABELS[record.type],
      ...values,
    ].join(" "),
  );

  return {
    title,
    secondary: Array.from(new Set(secondaryValues)).join(" — "),
    searchText,
  };
}

function searchFieldMatch(searchText: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return false;

  const normalizedSearch = normalizeSearchText(searchText);
  if (normalizedSearch.includes(normalizedQuery)) return true;

  return normalizeLatinSearchText(searchText).includes(
    normalizeLatinSearchText(query),
  );
}

export function searchArchive(
  query: string,
  options: ArchiveSearchOptions = {},
): ArchiveSearchHit[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(" ").filter(Boolean);
  const limit = Math.max(1, options.limit ?? 20);

  return getArchiveRecords()
    .map((record) => {
      const projection = getRecordSearchProjection(record);
      const normalizedTitle = normalizeSearchText(projection.title);
      const normalizedSlug = normalizeSearchText(record.slug);
      const normalizedLatinTitle = normalizeLatinSearchText(projection.title);
      const normalizedLatinSlug = normalizeLatinSearchText(record.slug);
      const latinQuery = normalizeLatinSearchText(query);

      const exactTitle =
        normalizedTitle === normalizedQuery ||
        normalizedLatinTitle === latinQuery;
      const titleMatch =
        normalizedTitle.includes(normalizedQuery) ||
        normalizedLatinTitle.includes(latinQuery);
      const slugMatch =
        normalizedSlug.includes(normalizedQuery) ||
        normalizedLatinSlug.includes(latinQuery);
      const allTermsMatch = terms.every((term) =>
        searchFieldMatch(projection.searchText, term),
      );

      if (!allTermsMatch) return null;

      let score = 1;
      if (exactTitle) score += 100;
      else if (titleMatch) score += 60;
      if (slugMatch) score += 30;
      for (const term of terms) {
        if (
          normalizedTitle.includes(term) ||
          normalizedLatinTitle.includes(normalizeLatinSearchText(term))
        ) {
          score += 10;
        }
      }

      return {
        record,
        title: projection.title,
        secondary: projection.secondary,
        typeLabel: SEARCH_TYPE_LABELS[record.type],
        url: `/archive/${record.type}/${record.slug}`,
        score,
      };
    })
    .filter(
      (
        hit,
      ): hit is ArchiveSearchHit & { score: number } => hit !== null,
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.typeLabel.localeCompare(b.typeLabel) ||
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
    )
    .slice(0, limit)
    .map(({ score: _score, ...hit }) => hit);
}


function getArchiveFacetValues<T>(
  type: ArchiveRecordType,
  selector: (content: T) => string | undefined,
  allLabel = "All",
): string[] {
  const values = getArchiveContent<T>(type)
    .map(selector)
    .filter((value): value is string => Boolean(value?.trim()));
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
    (entry) =>
      entry.wordClass !== "Idiom / Proverb" &&
      Array.isArray(entry.examples) &&
      entry.examples.length > 0,
  );
  return nouns[day % nouns.length] ?? dictionaryEntries[0]!;
}

export type {
  ArtStyle,
  Author,
  BibliographicSource,
  DictionaryEntry,
  HeritageEntry,
  LiteraryWork,
  ProvenanceAssertionV2,
  Proverb,
  Song,
  Source,
};
