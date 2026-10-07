# Phase 4 — Archive Data Quality & Scholarly Integrity

**Status: engineering implementation complete; editorial source verification remains human-reviewed**

Phase 4 hardens the canonical archive against structural data regressions without pretending that code can prove historical, linguistic, or cultural claims.

## Implemented

- deterministic canonical content-shape audit in `src/data/archive-quality.ts`;
- CLI entry point: `bun run archive:quality`;
- CI enforcement: quality errors fail the build;
- published-record checks for:
  - non-object canonical content;
  - missing display identity;
  - missing migration representation;
  - missing source capture;
  - missing provenance;
  - malformed current dictionary `examples` payloads;
  - malformed current song `lyrics` payloads;
- canonical media consistency checks for:
  - Commons display URL;
  - Commons file-page URL;
  - licence URL;
  - YouTube playback locator / external ID;
- normalized provenance ownership checks:
  - every source capture belongs to exactly one normalized bibliographic source;
  - every provenance-v2 source capture belongs to its referenced normalized source;
- regression tests for the new quality and provenance invariants;
- removed an unreachable duplicate return from the provenance URL resolver.

## Editorial boundary

The automated audit deliberately does **not** decide whether a historical statement is true.

It does not automatically:

- promote `needs-review` to `verified`;
- invent page numbers or locators;
- infer claim-level evidence;
- declare a citation authoritative merely because it has a URL;
- validate that a translation or transliteration is linguistically correct;
- treat a live external URL as proof that its content supports a claim.

Those require explicit editorial/source review and are tracked by the existing provenance-v2 report.

## Why the content-shape audit matters

The canonical migration layer intentionally retains legacy representations. That is useful for traceability, but a generic TypeScript cast can otherwise make incompatible payloads look identical to callers.

Phase 4 therefore validates the runtime invariants that the application actually depends on. This catches the class of failure that caused the recent homepage word-of-the-day crash before it reaches the UI.

## Phase 4 acceptance criteria

- [x] Canonical archive validates structurally.
- [x] Canonical record IDs and type/slug identities are unique.
- [x] Source, provenance, media, relation, and representation ownership is bidirectional.
- [x] Provenance-v1/v2 parity is enforced.
- [x] Normalized bibliographic source capture ownership is enforced.
- [x] Runtime content-shape invariants have a deterministic audit.
- [x] Media metadata cannot silently drift from its payload.
- [x] Quality audit is a CI gate.
- [x] Regression tests cover malformed canonical content and provenance ownership.
- [ ] Editorial claim-by-claim verification of every seeded fact.

The final unchecked item is intentionally human work. It must not be fabricated or replaced with an automated confidence label.
