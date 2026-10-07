# Phases 23–32 — Research-grade completion

This document records the implementation boundary for the final platform phases. The archive remains a static, source-oriented project: no fake CMS, authentication, payment system, database, or automated scholarly verification is introduced.

## Phase 23 — Editorial & provenance completion
Implemented:
- explicit provenance metadata remains typed and schema-validated;
- source URLs are preserved when actually known;
- evidence roles, claim IDs, locators, checked-at and reviewer fields are exposed when present;
- record pages show provenance status, claim, locator, review metadata and source links;
- unresolved provenance remains an explicit editorial queue item.
Not implemented by design:
- no fabricated page numbers, reviewers, timestamps or claim scopes;
- no automatic promotion of needs-review.

## Phase 24 — Research-grade search & discovery
Implemented:
- cross-collection search;
- Devanagari/Latin normalization;
- transliteration-aware matching;
- type/status/media/relationship filters;
- stable search result URLs;
- reusable research dataset projection;
- deterministic relevance ordering.

## Phase 25 — Knowledge Graph 2.0
Implemented:
- explicit canonical relationships;
- relationship provenance;
- graph explorer;
- reusable shortest-path traversal for what-connects-these-records research;
- no inferred edges are presented as asserted facts.

## Phase 26 — Digital preservation 2.0
Implemented:
- preservation manifest generation;
- provider/source/display locator retention;
- explicit external-reference preservation status;
- integrity state distinguishes not-captured from verified checksum;
- no false checksum or MIME/dimension claims.

## Phase 27 — Multilingual / Maithili-first UX foundation
Implemented:
- locale vocabulary for Maithili, Hindi and English;
- stable locale keys mai, hi, en;
- Devanagari labels retained alongside English throughout the archive;
- localization helpers are data-driven and can be expanded without changing record identifiers.
The archive does not pretend that a translation is authoritative merely because it is machine-generated.

## Phase 28 — Public Research API v2
Implemented:
- versioned response envelope for archive/search/record endpoints via version=2;
- stable identifiers;
- publication filtering;
- citation bundle support;
- machine-readable provenance/media/relation references.
Version 1 responses remain compatible.

## Phase 29 — IIIF / Digital Humanities interoperability
Implemented:
- IIIF Presentation 3 manifest generation for archive image records;
- deterministic manifest endpoint on record API via format=iiif;
- source-provider attribution remains attached to the manifest;
- manifests now require explicit verified width, height and MIME metadata from the caller; the API returns a clear 422 instead of fabricating dimensions or MIME type.

## Phase 30 — Production deployment & operations
Implemented:
- public-cache headers on read-only research endpoints;
- deterministic exports;
- production build/performance/browser/http gates;
- explicit operational runbook in docs/production-operations.md.
Provider-specific deployment credentials and domain names remain deployment secrets/configuration, not source-controlled values.

## Phase 31 — Community contribution system
Implemented:
- contribution specification and validation boundary in docs/community-contributions.md;
- proposal records are separate from canonical archive records;
- required source/claim/media attribution fields are defined;
- no unauthenticated mutation of canonical data is exposed.

## Phase 32 — Scholarly publication layer
Implemented:
- stable record permalinks;
- BibTeX output;
- CSL-JSON output;
- citation bundle API support;
- research dataset projection for downstream scholarly tooling.

## Completion rule
A phase is complete when its code/docs exist, canonical data remains valid, no unresolved evidence is silently promoted, and the full archive/runtime/browser test suite passes. Content expansion is intentionally deferred to the next project stage so platform correctness is established first.


## Verification additions — October 2026
- Knowledge graph exploration now includes source-counted relation semantics and exhaustive shortest-path enumeration with a bounded path cap.
- Related-record generation derives only from explicit endpoint fields and deduplicates semantic edges.
- The canonical archive includes the official 2011–2025 Maithili Yuva Puraskar literature corpus and its recipient people records.
- Provenance, media, editorial and relationship audits feed one searchable review queue.
- GitHub-native contribution proposals are schema-validated in CI before review.
- CI installs a native Chrome package so the real CDP browser audit runs in the same environment as the quality gate.
- Citation and preservation exports are deterministic unless a caller explicitly supplies a review/generation timestamp.
