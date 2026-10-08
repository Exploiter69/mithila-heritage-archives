# Phase 33 — Scholarly verification readiness & evidence-backed expansion

Status: **engineering complete; scholarly review remains intentionally human-led**

Phase 33 is the transition from platform completion to evidence-led archive growth. The repository must never manufacture verification simply to make an audit green.

## 33.1 Scholarly readiness matrix

Implemented in `src/data/editorial-audit.ts`.

The deterministic audit combines:

- canonical identity completeness;
- transliteration availability where the record model supports it;
- source/provenance ownership;
- explicit `needs-review` / `disputed` status;
- author biography coverage;
- dictionary attestation/example coverage;
- song lyric/attestation coverage;
- visual/heritage media coverage;
- provenance metadata gaps;
- media integrity findings;
- existing archive-quality warnings.

It produces a record-level queue with priority, category, stable record ID, slug and reason.

The audit is intentionally non-authoritative: it identifies work that requires a human/editorial decision; it does not establish historical, linguistic or cultural truth.

## 33.2 Automated contract

The following commands are now part of the repository contract:

- `bun run archive:scholarly` — deterministic readiness report;
- `bun run test:scholarly` — regression contract;
- CI executes the readiness report and the regression test.

The report is informational rather than a failing factual-verification gate. Structural failures remain covered by the existing archive, quality, media, provenance, contribution and runtime gates.

## 33.3 Source-health boundary

Live URL/source checks remain deliberately outside deterministic builds. A future optional source-health job may check availability, redirects and provider metadata, but a reachable URL must never automatically become evidence that a claim is true.

## 33.4 Human verification workflow

For each high-priority record:

1. identify the authoritative or strongest available source;
2. verify identity/spelling;
3. verify dates or other factual claims;
4. record the precise page/section/edition locator where available;
5. record claim scope;
6. record reviewer and checked-at metadata;
7. retain uncertainty or dispute when evidence conflicts;
8. only then consider changing the verification status.

No page number, reviewer, timestamp, quotation, URL or attribution should be invented.

## 33.5 Evidence-backed expansion

New content should follow this order:

1. deepen existing high-value records;
2. complete claim-level provenance;
3. verify media attribution/licensing;
4. add sourced relationships;
5. add new literature, language, folk-culture, art, music and heritage records in controlled batches;
6. rerun the complete deterministic QA suite.

Raw record count is not a completion metric.

## Completion rule

Phase 33 engineering is complete when the scholarly readiness matrix is deterministic, covered by regression tests, included in CI, and documented. Scholarly verification itself remains an explicit research activity and must not be falsely marked complete by software.
