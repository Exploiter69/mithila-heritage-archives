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
