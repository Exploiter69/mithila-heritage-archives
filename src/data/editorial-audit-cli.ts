import { auditScholarlyReadiness, formatScholarlyAuditReport } from "./editorial-audit";

const report = auditScholarlyReadiness();
console.log(formatScholarlyAuditReport(report));
