import assert from "node:assert/strict";

import { songs } from "../src/data/music";
import { canonicalArchive } from "../src/data/archive-foundation";

assert.ok(songs.length >= 40, "music corpus should contain at least 40 catalogue records");
assert.equal(new Set(songs.map((song) => song.slug)).size, songs.length, "music slugs must be unique");

const categories = new Set(songs.map((song) => song.category));
for (const category of ["संस्कार गीत", "पर्व गीत", "देवगीत", "ऋतु गीत", "लोकगाथा", "प्रेमगीत"]) {
  assert.ok(categories.has(category), "music category missing: " + category);
}

const recordingStatuses = new Set(
  songs.map((song) => song.recordingStatus ?? (song.stream ? "needs-recheck" : "no-recording-located")),
);
assert.ok(recordingStatuses.has("needs-recheck"), "music corpus should retain re-checkable recording leads");
assert.ok(recordingStatuses.has("no-recording-located"), "music corpus should retain records without recordings");

for (const song of songs) {
  const record = canonicalArchive.records.find((item) => item.type === "song" && item.slug === song.slug);
  assert.ok(record, "song missing from canonical archive: " + song.slug);
  assert.equal(record?.contentStatus, "published");
  if (song.stream) {
    assert.match(song.stream.youtubeId, /^[A-Za-z0-9_-]{11}$/);
  }
}

console.log("Music corpus tests passed: " + songs.length + " song records across " + categories.size + " categories.");
