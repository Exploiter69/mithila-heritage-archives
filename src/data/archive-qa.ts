import { canonicalArchive } from "./archive-foundation";
import { auditArchiveMedia } from "./archive-media";
import { auditArchiveQuality } from "./archive-quality";
import { validateArchive } from "./validate-archive";

export interface ArchiveQaReport {
  records: number;
  sources: number;
  relations: number;
  media: number;
  errors: number;
  warnings: number;
  checks: string[];
}

export function runArchiveQa(): ArchiveQaReport {
  const validation = validateArchive(canonicalArchive);
  const quality = auditArchiveQuality(canonicalArchive);
  const media = auditArchiveMedia();
  const errors =
    (validation.valid ? 0 : validation.errors.length) +
    quality.errors.length +
    media.findings.filter((item) => item.severity === "error").length;
  const warnings =
    quality.warnings.length +
    media.findings.filter((item) => item.severity === "warning").length;

  return {
    records: canonicalArchive.records.length,
    sources: canonicalArchive.sources.length,
    relations: canonicalArchive.relations.length,
    media: canonicalArchive.media.length,
    errors,
    warnings,
    checks: [
      "canonical schema validation",
      "content-shape quality audit",
      "media preservation audit",
      "relationship endpoint audit",
      "public-record export contract",
    ],
  };
}
