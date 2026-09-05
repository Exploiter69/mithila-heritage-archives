/** Shared types for the archive's typed content modules. */

export type SourceStatus = "verified" | "community" | "needs-review";

export interface Source {
  citation: string;
  status: SourceStatus;
  detail?: string;
}

/**
 * A verified Wikimedia Commons image. Every field is taken from the file page
 * itself — credits and licences are never inferred or invented.
 */
export interface CommonsImage {
  /** Direct upload.wikimedia.org URL used for display. */
  url: string;
  /** Commons file page, where licence and contributor can be checked. */
  filePage: string;
  /** File title as it appears on Commons. */
  fileTitle: string;
  /** Photographer / contributor exactly as credited on the file page. */
  credit: string;
  /** Licence label, e.g. "CC BY-SA 4.0". */
  license: string;
  /** Canonical licence deed URL. */
  licenseUrl: string;
  /** Plain description of what the image shows. */
  caption: string;
  /** Motif / symbolism breakdown shown with the image. */
  motifs?: { name: string; meaning: string }[];
  /** Any caveat about how the image is being used here. */
  note?: string;
}

/**
 * Archive Foundation v1
 *
 * These are intentionally separate from the small `Source` interface above.
 * `Source` remains the compatibility shape used by the existing collection
 * modules while their records are migrated into the canonical layer.
 */
export const archiveRecordTypes = [
  "literature-work",
  "author",
  "dictionary-entry",
  "proverb",
  "art-entry",
  "art-style",
  "music-entry",
  "song",
  "heritage-entry",
] as const;

export type ArchiveRecordType = (typeof archiveRecordTypes)[number];

export const verificationStatuses = [
  "verified",
  "community-attested",
  "needs-review",
  "disputed",
] as const;

/** Editorial confidence; distinct from whether a record is published. */
export type VerificationStatus = (typeof verificationStatuses)[number];

export const contentStatuses = ["published", "draft", "withdrawn"] as const;

/** Editorial lifecycle; only published records may appear in public indexes. */
export type ContentStatus = (typeof contentStatuses)[number];

export const mediaKinds = ["image", "audio-stream"] as const;
export type MediaKind = (typeof mediaKinds)[number];

export const relationPredicates = [
  "created-by",
  "has-work",
  "performed-at",
  "depicts",
  "about",
  "related-to",
  "part-of",
] as const;
export type RelationPredicate = (typeof relationPredicates)[number];

export interface MigrationRepresentation<TPayload = unknown> {
  /** Stable migration identifier, not a cultural identifier. */
  id: string;
  origin: {
    module:
      | "archive.ts"
      | "literature.ts"
      | "music.ts"
      | "art.ts"
      | "heritage.ts"
      | "dictionary.ts";
    exportName: string;
  };
  /** Original payload retained without editorial rewriting. */
  payload: TPayload;
}

/**
 * A migrated citation/source capture, not yet a normalized bibliographic
 * identity. Repeated citations are therefore expected in Foundation v1.
 */
export interface SourceRecord {
  id: string;
  citation: string;
  detail?: string;
  captureKind: "record-citation" | "bibliography-entry";
  representationId?: string;
  /** Preserved from the legacy bibliography index when available. */
  legacyKind?: string;
  /** The legacy status is retained verbatim; it is not a new verification claim. */
  legacyStatus?: SourceStatus;
  url?: string;
}

/** Evidence connecting one source to a record (or, later, a specific claim). */
export interface ProvenanceAssertion {
  id: string;
  recordId: string;
  sourceId: string;
  verificationStatus: VerificationStatus;
  evidenceRole: "record-level" | "claim-level";
  locator?: string;
  editorialNote?: string;
}

export interface DeterministicMediaLocator {
  kind: "deterministic-playback";
  /** Computed from an existing external identifier; not source-provided provenance. */
  url: string;
  derivedFrom: "youtubeId";
}

export interface YoutubeStreamPayload {
  youtubeId: string;
  channel: string;
  channelKind: "Official artist channel" | "Label channel" | "Regional music channel";
  note: string;
}

/** Commons attribution copied from the existing image record. */
export interface CommonsImageMediaRecord {
  id: string;
  kind: "image";
  recordId: string;
  displayUrl: string;
  sourceUrl: string;
  licenseUrl: string;
  provider: "wikimedia-commons";
  payload: CommonsImage;
}

/** Existing YouTube stream metadata; its locator is explicitly derived. */
export interface YoutubeAudioStreamMediaRecord {
  id: string;
  kind: "audio-stream";
  recordId: string;
  provider: "youtube";
  externalId: string;
  locator: DeterministicMediaLocator;
  payload: YoutubeStreamPayload;
}

export type MediaRecord = CommonsImageMediaRecord | YoutubeAudioStreamMediaRecord;

/** An explicitly asserted record-to-record relationship. */
export interface RecordRelation {
  id: string;
  fromRecordId: string;
  toRecordId: string;
  predicate: RelationPredicate;
  sourceIds: string[];
  note?: string;
}

/**
 * Canonical archive envelope. `content` is the unaltered collection payload
 * during Foundation v1; later phases can introduce record-type-specific views.
 */
export interface ArchiveRecord<TContent = unknown> {
  /** Explicit immutable migration ID; never derived from type, slug, or order. */
  id: string;
  type: ArchiveRecordType;
  slug: string;
  contentStatus: ContentStatus;
  verificationStatus: VerificationStatus;
  sourceIds: string[];
  provenanceIds: string[];
  mediaIds: string[];
  relationIds: string[];
  /** Every original input representation retained during Foundation v1. */
  representations: MigrationRepresentation[];
  /** Primary representation payload retained for incremental compatibility. */
  content: TContent;
}

export interface CanonicalArchiveData {
  records: ArchiveRecord[];
  sources: SourceRecord[];
  media: MediaRecord[];
  provenance: ProvenanceAssertion[];
  relations: RecordRelation[];
}
