import { canonicalArchive } from "./archive-foundation";
import type { VerificationStatus } from "./types";

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
    "",
    "Missing metadata is not converted into a negative verification result.",
  ];

  return lines.join("\n");
}
