import { auditArchiveQuality } from "./archive-quality";

const report = auditArchiveQuality();

console.log(`Archive quality audit: ${report.records} records, ${report.publishedRecords} published`);
console.log(`Errors: ${report.errors.length}`);
console.log(`Warnings: ${report.warnings.length}`);

for (const [code, count] of Object.entries(report.countsByCode).sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  console.log(`- ${code}: ${count}`);
}

for (const item of report.findings) {
  const key = item.recordKey ?? item.recordId ?? "archive";
  console.log(`[${item.severity.toUpperCase()}] ${item.code} ${key}: ${item.message}`);
}

if (report.errors.length > 0) process.exit(1);
