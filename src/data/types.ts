/** Shared types for the archive's typed content modules. */

export type SourceStatus = "verified" | "community" | "needs-review";

export interface Source {
  citation: string;
  status: SourceStatus;
  detail?: string;
}
