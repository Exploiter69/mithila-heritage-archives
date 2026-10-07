import assert from "node:assert/strict";
import { getArchiveIdentityAudit } from "../src/data/archive-foundation";

const audit = getArchiveIdentityAudit();
assert.equal(audit.missing.length, 0, "every legacy/collection identity key must be explicitly registered");
assert.equal(audit.duplicateIds.length, 0, "identity IDs must be unique");
assert.equal(audit.duplicateSlugs.length, 0, "identity slugs must be unique");
assert.ok(audit.registeredCount >= audit.expectedCount, "identity registry should cover every audited collection entry");
console.log("Archive identity audit passed:", JSON.stringify(audit));
