import { canonicalArchive } from "./archive-foundation";
import { auditArchiveMedia } from "./archive-media";
import { getPublicArchiveEnvelope } from "./archive-export";
import { auditArchiveQuality } from "./archive-quality";
import { getProvenanceAuditReport } from "./provenance-report";
import { getEditorialQueue } from "./editorial-workflow";
import { validateArchive } from "./validate-archive";

export interface ArchiveQaReport {
  records: number;
  sources: number;
  relations: number;
  media: number;
  errors: number;
  warnings: number;
  provenanceGaps: number;
  editorialHighPriority: number;
  checks: string[];
}

export function runArchiveQa(): ArchiveQaReport {
  const validation = validateArchive(canonicalArchive);
  const quality = auditArchiveQuality(canonicalArchive);
  const media = auditArchiveMedia();
  const exported = getPublicArchiveEnvelope();
  const provenance = getProvenanceAuditReport();
  const editorial = getEditorialQueue();
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
    provenanceGaps: provenance.findings.length,
    editorialHighPriority: editorial.filter((item) => item.priority === "high").length,
    checks: [
      "canonical schema validation",
      "content-shape quality audit",
      "media preservation audit",
      "relationship endpoint audit",
      "public-record export contract",
      "provenance gap inventory",
      "editorial priority queue",
    `export contains ${exported.recordCount} published records`,
    `provenance gap findings: ${provenance.findings.length}`,
    `high-priority editorial items: ${editorial.filter((item) => item.priority === "high").length}`,
    ],
  };
}
