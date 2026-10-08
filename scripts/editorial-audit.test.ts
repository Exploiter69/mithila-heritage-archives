import assert from "node:assert/strict";
import { canonicalArchive } from "../src/data/archive-foundation";
import { auditScholarlyReadiness } from "../src/data/editorial-audit";

const report = auditScholarlyReadiness();

assert.equal(report.records, canonicalArchive.records.length);
assert.equal(report.publishedRecords, canonicalArchive.records.filter((r) => r.contentStatus === "published").length);
assert.ok(report.findings.length >= report.highPriority);
assert.ok(report.highPriority >= 0);
assert.ok(report.reviewReady >= 0 && report.reviewReady <= report.publishedRecords);
assert.equal(
  report.findings.length,
  Object.values(report.countsByCode).reduce((total, count) => total + count, 0),
);
for (const finding of report.findings) {
  assert.ok(canonicalArchive.records.some((record) => record.id === finding.recordId));
  assert.ok(finding.slug.length > 0);
}
console.log(
  `Scholarly readiness audit passed: ${report.records} records, ${report.findings.length} findings, ${report.highPriority} high-priority.`,
);
