import { auditArchiveMedia } from "./archive-media";

const report = auditArchiveMedia();
console.log(\`Media preservation audit: \${report.media} media records (\${report.images} images, \${report.audioStreams} audio streams)\`);
console.log(\`Errors: \${report.findings.filter((item) => item.severity === "error").length}\`);
for (const finding of report.findings) console.log(\`[\${finding.severity.toUpperCase()}] \${finding.mediaId}: \${finding.message}\`);
if (report.findings.some((item) => item.severity === "error")) process.exit(1);
