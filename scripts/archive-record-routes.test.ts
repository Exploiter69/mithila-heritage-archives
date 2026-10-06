import assert from "node:assert/strict";

import { canonicalArchive } from "../src/data/archive-foundation";
import { getArchiveRecordBySlug, getArchiveRecords } from "../src/data/archive-read";
import type { ArchiveRecord, ArchiveRecordType } from "../src/data/types";

const COLLECTION_PATHS: Record<ArchiveRecordType, string> = {
  "literature-work": "/literature",
  author: "/authors",
  "dictionary-entry": "/language",
  proverb: "/proverbs",
  "art-entry": "/art",
  "art-style": "/art",
  "music-entry": "/music",
  song: "/music",
  "heritage-entry": "/heritage",
};

function recordPath(record: ArchiveRecord): string {
  return `${COLLECTION_PATHS[record.type]}/${record.slug}`;
}

assert.equal(canonicalArchive.records.length, 65);

const paths = new Set<string>();
for (const record of canonicalArchive.records) {
  assert.equal(record.contentStatus, "published");
  assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const path = recordPath(record);
  assert.ok(!paths.has(path), `duplicate canonical record path: ${path}`);
  paths.add(path);

  const resolved = getArchiveRecordBySlug(record.type, record.slug);
  assert.ok(resolved, `record lookup failed: ${record.type}/${record.slug}`);
  assert.equal(resolved?.id, record.id);
}

for (const [type, path] of Object.entries(COLLECTION_PATHS) as [ArchiveRecordType, string][]) {
  const records = getArchiveRecords(type);
  for (const record of records) {
    assert.ok(recordPath(record).startsWith(path + "/"));
  }
}

assert.ok(paths.has("/literature/varna-ratnakara"));
assert.ok(paths.has("/authors/vidyapati"));
assert.ok(paths.has("/language/osaar"));
assert.ok([...paths].some((path) => path.startsWith("/proverbs/legacy-proverb-")));

console.log(`Archive record route checks passed: ${paths.size} unique canonical paths.`);
