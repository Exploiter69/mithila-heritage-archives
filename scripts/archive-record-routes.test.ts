import assert from "node:assert/strict";

import { canonicalArchive } from "../src/data/archive-foundation";
import { getArchiveRecordBySlug, getArchiveRecords } from "../src/data/archive-read";
import type { ArchiveRecordType } from "../src/data/types";

const CANONICAL_ROUTE_PREFIX = "/archive";

const EXPECTED_RECORD_TYPES: ArchiveRecordType[] = [
  "literature-work",
  "author",
  "dictionary-entry",
  "proverb",
  "art-entry",
  "art-style",
  "music-entry",
  "song",
  "heritage-entry",
];

function canonicalPath(type: ArchiveRecordType, slug: string): string {
  return `${CANONICAL_ROUTE_PREFIX}/${type}/${slug}`;
}

assert.equal(canonicalArchive.records.length, 65);

const paths = new Set<string>();
const ids = new Set<string>();

for (const record of canonicalArchive.records) {
  assert.equal(record.contentStatus, "published");
  assert.ok(
    EXPECTED_RECORD_TYPES.includes(record.type),
    `record type is not covered by the canonical route: ${record.type}`,
  );
  assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);

  const path = canonicalPath(record.type, record.slug);
  assert.ok(!paths.has(path), `duplicate canonical record path: ${path}`);
  paths.add(path);

  assert.ok(!ids.has(record.id), `duplicate canonical record id: ${record.id}`);
  ids.add(record.id);

  const resolved = getArchiveRecordBySlug(record.type, record.slug);
  assert.ok(resolved, `record lookup failed: ${record.type}/${record.slug}`);
  assert.equal(resolved?.id, record.id);
  assert.equal(canonicalPath(resolved!.type, resolved!.slug), path);
}

for (const type of EXPECTED_RECORD_TYPES) {
  const records = getArchiveRecords(type);
  assert.ok(records.length > 0, `canonical route type has no records: ${type}`);
  for (const record of records) {
    assert.ok(
      paths.has(canonicalPath(type, record.slug)),
      `record missing from canonical path inventory: ${type}/${record.slug}`,
    );
  }
}

assert.equal(paths.size, canonicalArchive.records.length);
assert.ok(paths.has("/archive/literature-work/varna-ratnakara"));
assert.ok(paths.has("/archive/author/vidyapati"));
assert.ok(paths.has("/archive/dictionary-entry/osaar"));
assert.ok(
  [...paths].some((path) => path.startsWith("/archive/proverb/")),
);

console.log(
  `Archive record route checks passed: ${paths.size} unique canonical paths across ${EXPECTED_RECORD_TYPES.length} record types.`,
);
