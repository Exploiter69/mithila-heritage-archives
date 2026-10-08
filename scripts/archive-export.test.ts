import { getPublicArchiveCsv, getPublicArchiveEnvelope } from "../src/data/archive-export";
import { getResearchDataset } from "../src/data/research-infrastructure";

const envelope = getPublicArchiveEnvelope();
const csv = getPublicArchiveCsv();
const research = getResearchDataset({ limit: 1000 });

if (envelope.apiVersion !== "1.0") throw new Error("Unexpected public API version");
if (envelope.archiveRelease !== "2026.10.0") throw new Error("Unexpected archive release");
if (envelope.recordCount <= 0) throw new Error("Public export contains no records");
if (!csv.startsWith("id,type,slug,url,contentStatus,verificationStatus,sourceIds,mediaIds,relationIds,content\n")) {
  throw new Error("CSV header contract changed unexpectedly");
}
if (research.length === 0) throw new Error("Research export contains no records");
for (const record of envelope.records) {
  if (!record.id || !record.slug || !record.url) throw new Error("Public record is missing stable identity fields");
  if (record.contentStatus !== "published") throw new Error("Unpublished record leaked into public export");
}
console.log("EXPORT_CONTRACT_OK");
