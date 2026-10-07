import assert from "node:assert/strict";
import { CULTURAL_ATLAS_POINTS, EXPLORE_JOURNEYS, MITHILA_TIMELINE, archiveEvidenceStats, journeyRecords } from "../src/data/archive-experience";

assert.ok(EXPLORE_JOURNEYS.length >= 6);
for (const journey of EXPLORE_JOURNEYS) {
  assert.ok(journeyRecords(journey).length > 0, "journey must resolve at least one canonical record: " + journey.slug);
}
assert.ok(CULTURAL_ATLAS_POINTS.length >= 4);
for (const point of CULTURAL_ATLAS_POINTS) {
  assert.match(point.sourceUrl, /^https:\/\//);
  assert.ok(point.lat >= -90 && point.lat <= 90);
  assert.ok(point.lon >= -180 && point.lon <= 180);
}
assert.ok(MITHILA_TIMELINE.length >= 8);
const stats = archiveEvidenceStats();
assert.equal(stats.records, 693);
assert.ok(stats.literature > 0 && stats.language > 0 && stats.music > 0 && stats.art > 0 && stats.heritage > 0);
console.log("Archive experience tests passed.");
