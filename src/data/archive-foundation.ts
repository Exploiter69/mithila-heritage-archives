/**
 * Canonical, read-only Archive Foundation v1 data layer.
 * Existing collection payloads are retained verbatim as migration
 * representations. This module does not alter collection modules or UI.
 */
import {
  art as legacyArt,
  authors,
  dictionary as legacyDictionary,
  literature as legacyLiterature,
  music as legacyMusic,
  proverbs,
  sources as legacyBibliography,
} from "./archive";
import { artStyles } from "./art";
import { dictionaryEntries } from "./dictionary";
import { heritage } from "./heritage";
import { literaryWorks } from "./literature";
import { songs, type Stream } from "./music";
import type {
  ArchiveRecord,
  ArchiveRecordType,
  CanonicalArchiveData,
  CommonsImage,
  MediaRecord,
  MigrationRepresentation,
  BibliographicSource,
  ProvenanceAssertion,
  ProvenanceAssertionV2,
  Source,
  SourceRecord,
  SourceStatus,
  VerificationStatus,
} from "./types";

type LegacySourced = { source: Source };
type Origin = MigrationRepresentation["origin"];
type Identity = { id: string; slug: string };

/** Explicit migration identities: never regenerate these from source order. */
const IDENTITIES: Record<string, Identity> = {
  "legacy-literature-vidyapati-padavali": { id: "rec-4b91a1", slug: "vidyapati-padavali" },
  "legacy-literature-kirtilata": { id: "rec-4b91a2", slug: "kirtilata" },
  "legacy-literature-gorakh-vijay": { id: "rec-4b91a3", slug: "gorakh-vijay" },
  "legacy-literature-chanda-jhas-ramayana": { id: "rec-4b91a4", slug: "chanda-jhas-ramayana" },
  "legacy-literature-nagphans": { id: "rec-4b91a5", slug: "nagphans" },
  "legacy-author-vidyapati": { id: "rec-5c20b1", slug: "vidyapati" },
  "legacy-author-jyotirishvara": { id: "rec-5c20b2", slug: "jyotirishvara" },
  "legacy-author-chanda-jha": { id: "rec-5c20b3", slug: "chanda-jha" },
  "legacy-author-yatri-nagarjun": { id: "rec-5c20b4", slug: "yatri-nagarjun" },
  "legacy-author-lili-ray": { id: "rec-5c20b5", slug: "lili-ray" },
  "legacy-dictionary-गाम": { id: "rec-6d31c1", slug: "legacy-dictionary-a1" },
  "legacy-dictionary-अरिपन": { id: "rec-6d31c2", slug: "legacy-dictionary-a2" },
  "legacy-dictionary-पाहुन": { id: "rec-6d31c3", slug: "legacy-dictionary-a3" },
  "legacy-dictionary-कोसी": { id: "rec-6d31c4", slug: "legacy-dictionary-a4" },
  "legacy-dictionary-बिहान": { id: "rec-6d31c5", slug: "legacy-dictionary-a5" },
  "legacy-dictionary-नैहर": { id: "rec-6d31c6", slug: "legacy-dictionary-a6" },
  "legacy-dictionary-सोहर": { id: "rec-6d31c7", slug: "legacy-dictionary-a7" },
  "legacy-dictionary-खेत": { id: "rec-6d31c8", slug: "legacy-dictionary-a8" },
  "legacy-dictionary-मधुर": { id: "rec-6d31c9", slug: "legacy-dictionary-a9" },
  "legacy-dictionary-जाइत": { id: "rec-6d31ca", slug: "legacy-dictionary-a10" },
  "legacy-dictionary-पोखरि": { id: "rec-6d31cb", slug: "legacy-dictionary-a11" },
  "legacy-dictionary-कनैत": { id: "rec-6d31cc", slug: "legacy-dictionary-a12" },
  "legacy-proverb-आमक गाछ आमे फड़त": { id: "rec-7e42d1", slug: "legacy-proverb-b1" },
  "legacy-proverb-जकर लाठी तकर भैंस": { id: "rec-7e42d2", slug: "legacy-proverb-b2" },
  "legacy-proverb-बिनु बरखा खेत सुन": { id: "rec-7e42d3", slug: "legacy-proverb-b3" },
  "legacy-proverb-बेसी बाजनिहार कम करैत अछि": { id: "rec-7e42d4", slug: "legacy-proverb-b4" },
  "legacy-proverb-नैहरक मीठ, ससुरारिक तीत": { id: "rec-7e42d5", slug: "legacy-proverb-b5" },
  "legacy-proverb-कोसी के भरोस घर नहि बनाउ": { id: "rec-7e42d6", slug: "legacy-proverb-b6" },
  "legacy-art-mithila-painting": { id: "rec-8f53e1", slug: "mithila-painting" },
  "legacy-art-aripan": { id: "rec-8f53e2", slug: "aripan" },
  "legacy-art-sikki-grass": { id: "rec-8f53e3", slug: "sikki-grass" },
  "legacy-art-kohbar-ghar": { id: "rec-8f53e4", slug: "kohbar-ghar" },
  "legacy-music-sohar": { id: "rec-9a64f1", slug: "sohar" },
  "legacy-music-samdaun": { id: "rec-9a64f2", slug: "samdaun" },
  "legacy-music-nachari-mahesvani": { id: "rec-9a64f3", slug: "nachari-mahesvani" },
  "legacy-music-jhijhiya": { id: "rec-9a64f4", slug: "jhijhiya" },
  "legacy-music-batgamani": { id: "rec-9a64f5", slug: "batgamani" },
  "collection-literature-bada-sukh-sar": { id: "rec-a17501", slug: "bada-sukh-sar" },
  "collection-literature-varna-ratnakara": { id: "rec-a17502", slug: "varna-ratnakara" },
  "collection-literature-gadya-kusumanjali": { id: "rec-a17503", slug: "gadya-kusumanjali" },
  "collection-literature-nachari-umapati": { id: "rec-a17504", slug: "nachari-umapati" },
  "collection-literature-lalit-katha": { id: "rec-a17505", slug: "lalit-katha" },
  "collection-song-bad-sukh-saar": { id: "rec-b28601", slug: "bad-sukh-saar" },
  "collection-song-kaanch-hi-baans-ke-bahangiya": { id: "rec-b28602", slug: "kaanch-hi-baans-ke-bahangiya" },
  "collection-song-sama-chakeva-lokgeet": { id: "rec-b28603", slug: "sama-chakeva-lokgeet" },
  "collection-song-sohar-lalna-re": { id: "rec-b28604", slug: "sohar-lalna-re" },
  "collection-song-batgamani-vidai": { id: "rec-b28605", slug: "batgamani-vidai" },
  "collection-art-bharni": { id: "rec-c39701", slug: "bharni" },
  "collection-art-kachni": { id: "rec-c39702", slug: "kachni" },
  "collection-art-tantrik": { id: "rec-c39703", slug: "tantrik" },
  "collection-art-godna": { id: "rec-c39704", slug: "godna" },
  "collection-art-kohbar": { id: "rec-c39705", slug: "kohbar" },
  "collection-heritage-rajnagar-palace": { id: "rec-d4a801", slug: "rajnagar-palace" },
  "collection-heritage-simraungadh": { id: "rec-d4a802", slug: "simraungadh" },
  "collection-heritage-kapileshwar-nath": { id: "rec-d4a803", slug: "kapileshwar-nath" },
  "collection-heritage-chhath": { id: "rec-d4a804", slug: "chhath" },
  "collection-heritage-sama-chakeva": { id: "rec-d4a805", slug: "sama-chakeva" },
  "collection-heritage-vivah-panchami": { id: "rec-d4a806", slug: "vivah-panchami" },
  "collection-dictionary-osaar": { id: "rec-e5b901", slug: "osaar" },
  "collection-dictionary-gaam": { id: "rec-e5b902", slug: "gaam" },
  "collection-dictionary-sunar": { id: "rec-e5b903", slug: "sunar" },
  "collection-dictionary-khaenai": { id: "rec-e5b904", slug: "khaenai" },
  "collection-dictionary-dubhaar": { id: "rec-e5b905", slug: "dubhaar" },
  "collection-dictionary-aankh-ke-dekhal": { id: "rec-e5b906", slug: "aankh-ke-dekhal" },
  "collection-dictionary-jekra-nahi-aabai": { id: "rec-e5b907", slug: "jekra-nahi-aabai" },
};

function identityFor(key: string) {
  const identity = IDENTITIES[key];
  if (!identity) throw new Error(`Missing explicit archive identity for ${key}`);
  return identity;
}

function verificationStatus(status: SourceStatus): VerificationStatus {
  if (status === "community") return "community-attested";
  return status;
}

function representation<T>(id: string, origin: Origin, payload: T): MigrationRepresentation<T> {
  return { id, origin, payload };
}

function sourceFor(
  record: ArchiveRecord,
  migratedRepresentation: MigrationRepresentation,
  source: Source,
): SourceRecord {
  return {
    id: `source:${record.id}:${migratedRepresentation.id}`,
    citation: source.citation,
    ...(source.detail ? { detail: source.detail } : {}),
    captureKind: "record-citation",
    representationId: migratedRepresentation.id,
    legacyStatus: source.status,
  };
}

function provenanceFor(
  record: ArchiveRecord,
  migratedRepresentation: MigrationRepresentation,
  sourceId: string,
  source: Source,
): ProvenanceAssertion {
  return {
    id: `provenance:${record.id}:${migratedRepresentation.id}`,
    recordId: record.id,
    sourceId,
    verificationStatus: verificationStatus(source.status),
    evidenceRole: "record-level",
  };
}

function adaptRecord<T extends LegacySourced>(
  type: ArchiveRecordType,
  identity: Identity,
  representationId: string,
  origin: Origin,
  entry: T,
) {
  const migratedRepresentation = representation(representationId, origin, entry);
  const record: ArchiveRecord<T> = {
    id: identity.id,
    type,
    slug: identity.slug,
    contentStatus: "published",
    verificationStatus: verificationStatus(entry.source.status),
    sourceIds: [],
    provenanceIds: [],
    mediaIds: [],
    relationIds: [],
    representations: [migratedRepresentation],
    content: entry,
  };
  const source = sourceFor(record, migratedRepresentation, entry.source);
  const provenance = provenanceFor(record, migratedRepresentation, source.id, entry.source);
  record.sourceIds.push(source.id);
  record.provenanceIds.push(provenance.id);
  return { record, sources: [source], provenance: [provenance] };
}

function addRepresentation<T extends LegacySourced>(
  target: ReturnType<typeof adaptRecord>,
  representationId: string,
  origin: Origin,
  entry: T,
) {
  const migratedRepresentation = representation(representationId, origin, entry);
  target.record.representations.push(migratedRepresentation);
  const source = sourceFor(target.record, migratedRepresentation, entry.source);
  const assertion = provenanceFor(target.record, migratedRepresentation, source.id, entry.source);
  target.record.sourceIds.push(source.id);
  target.record.provenanceIds.push(assertion.id);
  target.sources.push(source);
  target.provenance.push(assertion);
}

function addMedia(record: ArchiveRecord, media: MediaRecord) {
  record.mediaIds.push(media.id);
  return media;
}

function commonsMedia(record: ArchiveRecord, image: CommonsImage): MediaRecord {
  return { id: `media:${record.id}:image`, kind: "image", recordId: record.id, displayUrl: image.url, sourceUrl: image.filePage, licenseUrl: image.licenseUrl, provider: "wikimedia-commons", payload: image };
}

function streamMedia(record: ArchiveRecord, stream: Stream): MediaRecord {
  return { id: `media:${record.id}:audio-stream`, kind: "audio-stream", recordId: record.id, provider: "youtube", externalId: stream.youtubeId, locator: { kind: "deterministic-playback", url: `https://www.youtube.com/watch?v=${stream.youtubeId}`, derivedFrom: "youtubeId" }, payload: stream };
}

const legacyVarna = legacyLiterature.find((entry) => entry.slug === "varna-ratnakara");
const currentVarna = literaryWorks.find((entry) => entry.slug === "varna-ratnakara");
if (!legacyVarna || !currentVarna) throw new Error("Expected both Varṇa Ratnākara representations");

const adapted = [
  ...legacyLiterature.filter((entry) => entry.slug !== "varna-ratnakara").map((entry) => adaptRecord("literature-work", identityFor(`legacy-literature-${entry.slug}`), `representation:legacy-literature:${entry.slug}`, { module: "archive.ts", exportName: "literature" }, entry)),
  ...authors.map((entry) => adaptRecord("author", identityFor(`legacy-author-${entry.slug}`), `representation:legacy-author:${entry.slug}`, { module: "archive.ts", exportName: "authors" }, entry)),
  ...legacyDictionary.map((entry) => adaptRecord("dictionary-entry", identityFor(`legacy-dictionary-${entry.headword}`), `representation:legacy-dictionary:${entry.headword}`, { module: "archive.ts", exportName: "dictionary" }, entry)),
  ...proverbs.map((entry, index) => {
    const identityKeys = [
      'legacy-proverb-आमक गाछ आमे फड़त',
      'legacy-proverb-जकर लाठी तकर भैंस',
      'legacy-proverb-बिनु बरखा खेत सुन',
      'legacy-proverb-बेसी बाजनिहार कम करैत अछि',
      'legacy-proverb-नैहरक मीठ, ससुरारिक तीत',
      'legacy-proverb-कोसी के भरोस घर नहि बनाउ',
    ] as const;
    const migrationKey = `legacy-proverb-b${index + 1}`;
    return adaptRecord(
      "proverb",
      identityFor(identityKeys[index]!),
      `representation:${migrationKey}`,
      { module: "archive.ts", exportName: "proverbs" },
      entry,
    );
  }),
  ...legacyArt.map((entry) => adaptRecord("art-entry", identityFor(`legacy-art-${entry.slug}`), `representation:legacy-art:${entry.slug}`, { module: "archive.ts", exportName: "art" }, entry)),
  ...legacyMusic.map((entry) => adaptRecord("music-entry", identityFor(`legacy-music-${entry.slug}`), `representation:legacy-music:${entry.slug}`, { module: "archive.ts", exportName: "music" }, entry)),
  ...literaryWorks.filter((entry) => entry.slug !== "varna-ratnakara").map((entry) => adaptRecord("literature-work", identityFor(`collection-literature-${entry.slug}`), `representation:collection-literature:${entry.slug}`, { module: "literature.ts", exportName: "literaryWorks" }, entry)),
  ...songs.map((entry) => adaptRecord("song", identityFor(`collection-song-${entry.slug}`), `representation:collection-song:${entry.slug}`, { module: "music.ts", exportName: "songs" }, entry)),
  ...artStyles.map((entry) => adaptRecord("art-style", identityFor(`collection-art-${entry.slug}`), `representation:collection-art:${entry.slug}`, { module: "art.ts", exportName: "artStyles" }, entry)),
  ...heritage.map((entry) => adaptRecord("heritage-entry", identityFor(`collection-heritage-${entry.slug}`), `representation:collection-heritage:${entry.slug}`, { module: "heritage.ts", exportName: "heritage" }, entry)),
  ...dictionaryEntries.map((entry) => adaptRecord("dictionary-entry", identityFor(`collection-dictionary-${entry.slug}`), `representation:collection-dictionary:${entry.slug}`, { module: "dictionary.ts", exportName: "dictionaryEntries" }, entry)),
];

const canonicalVarna = adaptRecord("literature-work", identityFor("collection-literature-varna-ratnakara"), "representation:collection-literature:varna-ratnakara", { module: "literature.ts", exportName: "literaryWorks" }, currentVarna);
addRepresentation(canonicalVarna, "representation:legacy-literature:varna-ratnakara", { module: "archive.ts", exportName: "literature" }, legacyVarna);
adapted.push(canonicalVarna);

const records = adapted.map(({ record }) => record);
const sources: SourceRecord[] = [
  ...adapted.flatMap((entry) => entry.sources),
  ...legacyBibliography.map((entry, index) => ({ id: `source:bibliography:${index + 1}`, citation: entry.name, detail: entry.note, captureKind: "bibliography-entry" as const, legacyKind: entry.kind })),
];

const sourceReferenceUrls: Array<[string, string]> = [
  ["G. A. Grierson, An Introduction to the Maithili Language", "https://archive.org/details/introductiontoma00grierich"],
  ["Grierson, Maithili Chrestomathy", "https://archive.org/details/introductiontoma00grierich"],
  ["Sahitya Akademi author record", "https://www.sahitya-akademi.gov.in/awards/akademi%20samman_suchi.jsp?JG4TxjCSLF=adUIQ"],
  ["Sahitya Akademi Maithili bibliography", "https://www.sahitya-akademi.gov.in/publications/maithili-catalogue_h.jsp"],
  ["Mithila Painting", "https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Mithila_painting/MithilaPaintingWebPage.html"],
  ["Madhubani Paintings", "https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["Ganga Devi: Tradition and Expression in Mithila Painting", "https://books.google.com/books/about/Ganga_Devi.html?id=nfTVAAAAMAAJ"],
  ["Varṇa Ratnākara", "https://search.worldcat.org/title/Varna-ratnakara-%28Vararatnakara%29-of-Jyotirisvara-Kavisekharacarya/oclc/166063766"],
  ["Maithil Painting", "https://smarthistory.org/painting-mithila-introduction/"],
  ["Mithila Painting: The Evolution of an Art Form", "https://chazen.wisc.edu/exhibitions/mithila-painting-the-evolution-of-an-art-form/"],
  ["Janakpur", "https://janakpurmun.gov.np/sites/janakpurmun.gov.np/files/%E0%A4%9C%E0%A4%A8%E0%A4%95%E0%A4%AA%E0%A5%81%E0%A4%B0%20%E0%A4%B8%E0%A4%AE%E0%A5%8D%E0%A4%AA%E0%A4%A6%E0%A4%BE%20%E0%A4%B8%E0%A5%82%E0%A4%9A%E0%A5%80%20%E0%A4%A1%E0%A4%BF%E0%A4%9C%E0%A4%BE%E0%A4%87%E0%A4%A8.pdf"],
  ["Chandā Jhā, Mithilā-bhāṣā Rāmāyaṇa", "https://tufs.repo.nii.ac.jp/records/26913"],
  ["Maithili grammar notes, Yadav (1996)", "https://books.google.com/books/about/A_Reference_Grammar_of_Maithili.html?id=G6k03mvHoBwC"],
  ["A Reference Grammar of Maithili", "https://books.google.com/books/about/A_Reference_Grammar_of_Maithili.html?id=G6k03mvHoBwC"],
  ["Maithili Lokgeet", "https://sahitya-akademi.gov.in/publications/maithili.pdf"],
  ["Sahitya Akademi Maithili bibliography", "https://sahitya-akademi.gov.in/publications/maithili.pdf"],
  ["Sharda Sinha", "https://www.saregama.com/artist/sharda-sinha_7621/songs"],
];

function sourceUrlFor(source: SourceRecord): string | undefined {
  const citation = source.citation.toLocaleLowerCase();
  for (const [needle, url] of sourceReferenceUrls) {
    if (citation.includes(needle.toLocaleLowerCase())) return url;
  }
  if (citation.includes("all india handicrafts board") || citation.includes("mithila painting") || citation.includes("madhubani painting")) {
    return citation.includes("madhubani painting")
      ? "https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"
      : "https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Mithila_painting/MithilaPaintingWebPage.html";
  }
  if (citation.includes("ignca")) return "https://ignca.gov.in/PDF_data/Mithila_Paintings.pdf";
  if (citation.includes("saregama")) return "https://www.saregama.com/artist/sharda-sinha_7621/songs";
  return undefined;
}

const enrichedSources = sources.map((source) => {
  const url = source.url ?? sourceUrlFor(source);
  return url ? { ...source, url } : source;
});
const provenance = adapted.flatMap((entry) => entry.provenance);

function stableSourceHash(value: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first ^= code;
    first = Math.imul(first, 0x01000193);
    second ^= code + index;
    second = Math.imul(second, 0x85ebca6b);
  }
  return `${(first >>> 0).toString(16).padStart(8, "0")}${(second >>> 0).toString(16).padStart(8, "0")}`;
}

function sourceTypeFor(source: SourceRecord): BibliographicSource["sourceType"] {
  const kind = source.legacyKind?.toLocaleLowerCase() ?? "";
  if (kind.includes("book")) return "book";
  if (kind.includes("article") || kind.includes("journal")) return "article";
  if (kind.includes("website") || kind.includes("web")) return "website";
  if (kind.includes("archive") || kind.includes("museum")) return "archive";
  if (source.legacyStatus === "community") return "community";
  return "unclassified";
}

/**
 * Normalize exact source captures without merging merely similar citations.
 * Identity is based on the full migrated bibliographic payload, so this step
 * never claims that two merely related sources are the same source.
 */
function normalizeBibliographicSources(sourceRecords: SourceRecord[]): BibliographicSource[] {
  const groups = new Map<string, BibliographicSource>();

  for (const source of sourceRecords) {
    const identityKey = JSON.stringify([
      source.citation,
      source.detail ?? "",
      source.url ?? "",
      source.legacyKind ?? "",
    ]);
    const id = `bibliography:${stableSourceHash(identityKey)}`;
    const existing = groups.get(id);
    if (existing) {
      existing.captureIds.push(source.id);
      continue;
    }

    groups.set(id, {
      id,
      citation: source.citation,
      ...(source.detail ? { detail: source.detail } : {}),
      ...(source.url ? { url: source.url } : {}),
      sourceType: sourceTypeFor(source),
      captureIds: [source.id],
    });
  }

  return Array.from(groups.values());
}

const bibliographicSources = normalizeBibliographicSources(enrichedSources);
const sourceToBibliographicId = new Map<string, string>();
for (const source of bibliographicSources) {
  for (const captureId of source.captureIds) {
    sourceToBibliographicId.set(captureId, source.id);
  }
}

const provenanceV2: ProvenanceAssertionV2[] = provenance.map((assertion) => {
  const bibliographicSourceId = sourceToBibliographicId.get(assertion.sourceId);
  if (!bibliographicSourceId) {
    throw new Error(`Missing normalized source for provenance ${assertion.id}`);
  }

  return {
    id: `provenance-v2:${assertion.id}`,
    recordId: assertion.recordId,
    bibliographicSourceId,
    verificationStatus: assertion.verificationStatus,
    evidenceRole: assertion.evidenceRole,
    ...(assertion.locator ? { locator: assertion.locator } : {}),
    ...(assertion.editorialNote ? { editorialNote: assertion.editorialNote } : {}),
    sourceCaptureIds: [assertion.sourceId],
  };
});

const media: MediaRecord[] = [];
for (const record of records) {
  const content = record.content as Record<string, unknown>;
  const image = content["image"];
  if (image && typeof image === "object" && "url" in image) media.push(addMedia(record, commonsMedia(record, image as CommonsImage)));
  const stream = content["stream"];
  if (stream && typeof stream === "object" && "youtubeId" in stream) media.push(addMedia(record, streamMedia(record, stream as Stream)));
}

/** No record relation is inferred without explicit support in existing data. */
export const canonicalArchive: CanonicalArchiveData = {
  records,
  sources: enrichedSources,
  media,
  provenance,
  bibliographicSources,
  provenanceV2,
  relations: [],
};
export const archiveRecords = canonicalArchive.records;
export const sourceRecords = canonicalArchive.sources;
export const mediaRecords = canonicalArchive.media;
export const provenanceAssertions = canonicalArchive.provenance;
export const normalizedBibliographicSources = canonicalArchive.bibliographicSources;
export const provenanceAssertionsV2 = canonicalArchive.provenanceV2;
export const recordRelations = canonicalArchive.relations;
