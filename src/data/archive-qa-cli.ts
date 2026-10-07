import { runArchiveQa } from "./archive-qa";

const report = runArchiveQa();
console.log(`Archive QA: ${report.records} records, ${report.sources} sources, ${report.relations} relations, ${report.media} media`);
console.log(`Errors: ${report.errors}`);
console.log(`Warnings: ${report.warnings}`);
for (const check of report.checks) console.log(`- ${check}`);
if (report.errors > 0) process.exit(1);
