import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateContributionProposal } from "../src/data/contribution-schema";
import { canonicalArchive } from "../src/data/archive-foundation";

const root = join(process.cwd(), "contributions");
const files = (() => {
  try { return readdirSync(root).filter((file) => file.endsWith(".json")).sort(); }
  catch { return []; }
})();

const errors: string[] = [];
const recordIds = new Set(canonicalArchive.records.map((record) => record.id));

for (const file of files) {
  let input: unknown;
  try {
    input = JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    errors.push(file + ": invalid JSON (" + String(error) + ")");
    continue;
  }
  const result = validateContributionProposal(input);
  if (!result.success) {
    errors.push(file + ": schema validation failed: " + result.error.issues.map((issue) => issue.path.join(".") + " " + issue.message).join("; "));
    continue;
  }
  if (result.data.targetType !== "new-record" && !recordIds.has(result.data.targetRecordId)) {
    errors.push(file + ": targetRecordId does not resolve to a canonical record");
  }
  if (result.data.mediaLicense && !result.data.mediaAttribution) {
    errors.push(file + ": mediaLicense requires mediaAttribution");
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Contribution audit passed:", files.length, "proposal files.");
