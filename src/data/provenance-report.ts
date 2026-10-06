import { canonicalArchive } from "./archive-foundation";
import type { VerificationStatus } from "./types";

export type ProvenanceGapCode =
  | "missing-url"
  | "missing-locator"
  | "missing-review"
  | "missing-claim-scope"
  | "vague-citation";

export interface ProvenanceAuditFinding {
  recordId: string;
  recordSlug: string;
  sourceId: string;
  citation: string;
  codes: ProvenanceGapCode[];
}

export interface ProvenanceAuditReport {
  records: number;
  sourceCaptures: number;
  normalizedSources: number;
  provenanceV1: number;
  provenanceV2: number;
  normalizedCaptureCoverage: number;
  recordsWithVerifiedEvidence: number;
  recordsWithCommunityEvidence: number;
  recordsNeedingReview: number;
  recordsWithDisputedEvidence: number;
  assertionsWithLocator: number;
  assertionsWithClaimId: number;
  assertionsWithCheckedAt: number;
  assertionsWithReviewer: number;
  sourceCapturesWithUrl: number;
  findings: ProvenanceAuditFinding[];
}

function countRecordsByStatus(status: VerificationStatus): number {
  return canonicalArchive.records.filter(
    (record) => record.verificationStatus === status,
  ).length;
}

/**
 * Produce a deterministic editorial-audit snapshot.
 *
 * This report intentionally does not contact external websites and never
 * upgrades an evidence status. Missing review metadata is reported as a gap,
 * not treated as proof that a claim is false.
 */
function citationIsSpecific(citation: string): boolean {
  const value = citation.toLocaleLowerCase();
  return (
    /\\b(ed\\.|edited|edition|edn\\.|vol\\.|volume|press|publisher|academy|akademi|university|journal|dictionary|kosh|chrestomathy|bibliography|records?|manuals?|collection|survey|institute|institute)\\b/.test(value) ||
    /\\b\\d{4}\\b/.test(value)
  );
}

function buildFindings(): ProvenanceAuditFinding[] {
  const findings: ProvenanceAuditFinding[] = [];

  for (const record of canonicalArchive.records) {
    const evidence = canonicalArchive.provenanceV2.filter(
      (assertion) => assertion.recordId === record.id,
    );

    for (const assertion of evidence) {
      const source = canonicalArchive.sources.find((item) =>
        assertion.sourceCaptureIds.includes(item.id),
      );
      if (!source) continue;

      const codes: ProvenanceGapCode[] = [];
      if (!source.url) codes.push("missing-url");
      if (!assertion.locator) codes.push("missing-locator");
      if (!assertion.checkedAt || !assertion.checkedBy) codes.push("missing-review");
      if (assertion.evidenceRole === "record-level" && !assertion.claimId) {
        codes.push("missing-claim-scope");
      }
      if (!citationIsSpecific(source.citation)) codes.push("vague-citation");

      if (codes.length > 0) {
        findings.push({
          recordId: record.id,
          recordSlug: record.slug,
          sourceId: source.id,
          citation: source.citation,
          codes,
        });
      }
    }
  }

  return findings;
}

export function getProvenanceAuditReport(): ProvenanceAuditReport {
  const assertions = canonicalArchive.provenanceV2;

  return {
    records: canonicalArchive.records.length,
    sourceCaptures: canonicalArchive.sources.length,
    normalizedSources: canonicalArchive.bibliographicSources.length,
    provenanceV1: canonicalArchive.provenance.length,
    provenanceV2: assertions.length,
    normalizedCaptureCoverage: new Set(
      canonicalArchive.bibliographicSources.flatMap(
        (source) => source.captureIds,
      ),
    ).size,
    recordsWithVerifiedEvidence: countRecordsByStatus("verified"),
    recordsWithCommunityEvidence: countRecordsByStatus("community-attested"),
    recordsNeedingReview: countRecordsByStatus("needs-review"),
    recordsWithDisputedEvidence: countRecordsByStatus("disputed"),
    assertionsWithLocator: assertions.filter((item) => item.locator).length,
    assertionsWithClaimId: assertions.filter((item) => item.claimId).length,
    assertionsWithCheckedAt: assertions.filter((item) => item.checkedAt).length,
    assertionsWithReviewer: assertions.filter((item) => item.checkedBy).length,
    sourceCapturesWithUrl: canonicalArchive.sources.filter(
      (source) => source.url,
    ).length,
    findings: buildFindings(),
  };
}

export function formatProvenanceAuditReport(
  report = getProvenanceAuditReport(),
): string {
  const lines = [
    "# Provenance v2 audit report",
    "",
    "This is a deterministic local report. It does not perform live URL checks.",
    "",
    "## Coverage",
    `- Records: ${report.records}`,
    `- Source captures: ${report.sourceCaptures}`,
    `- Normalized bibliographic sources: ${report.normalizedSources}`,
    `- Provenance assertions (v1): ${report.provenanceV1}`,
    `- Provenance assertions (v2): ${report.provenanceV2}`,
    `- Source captures represented by normalized sources: ${report.normalizedCaptureCoverage}`,
    "",
    "## Evidence status",
    `- Verified: ${report.recordsWithVerifiedEvidence}`,
    `- Community-attested: ${report.recordsWithCommunityEvidence}`,
    `- Needs review: ${report.recordsNeedingReview}`,
    `- Disputed: ${report.recordsWithDisputedEvidence}`,
    "",
    "## Editorial metadata gaps",
    `- Assertions with locator/page/section: ${report.assertionsWithLocator}`,
    `- Assertions scoped to a claim: ${report.assertionsWithClaimId}`,
    `- Assertions with checked-at timestamp: ${report.assertionsWithCheckedAt}`,
    `- Assertions with named reviewer: ${report.assertionsWithReviewer}`,
    `- Source captures with URL: ${report.sourceCapturesWithUrl}`,
    `- Sources with any editorial gap: ${new Set(report.findings.map((item) => item.sourceId)).size}`,
    `- Total editorial gap findings: ${report.findings.length}`,
    "",
    "## Findings",
    ...report.findings.slice(0, 100).map(
      (finding) =>
        `- ${finding.recordSlug} / ${finding.sourceId}: [${finding.codes.join(", ")}] ${finding.citation}`,
    ),
    ...(report.findings.length > 100
      ? [`- ... ${report.findings.length - 100} additional findings omitted from this report`]
      : []),
    "",
    "Missing metadata is not converted into a negative verification result.",
  ];

  return lines.join("\n");
}
