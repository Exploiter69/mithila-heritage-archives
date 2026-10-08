# Mithila Heritage Archives — Current Roadmap

**Authoritative status:** October 2026  
**Current branch:** `main`

## Executive status

The repository has completed its platform-hardening roadmap through Phases 23–32. The archive now has:

- canonical records and explicit migration identities;
- first-class canonical record URLs;
- archive-wide canonical search;
- normalized provenance v2;
- media/preservation audits;
- explicit relationships and knowledge-graph traversal;
- multilingual UX foundations;
- public research API and scholarly citation exports;
- IIIF preservation manifests with explicit verified image metadata;
- deployment/operations hardening;
- contribution proposal validation;
- deterministic editorial/provenance queues;
- full TypeScript, lint, build, archive, runtime and browser CI gates.

The remaining work is **scholarly rather than architectural**: source-by-source verification, claim-level locators, editorial review, media/source-health review, and evidence-backed content expansion.

## Completed phases

### Phases 0–14 — Foundation and public research platform
**Complete.**

### Phases 15–22 — Runtime, data and integration hardening
**Complete.**

### Phases 23–32 — Research-grade platform completion
**Complete.**

See [docs/phases-23-32-implementation.md](phases-23-32-implementation.md).

## Phase 33 — Scholarly verification readiness & evidence-backed expansion

**Engineering status: complete.**

See [docs/phase-33-scholarly-verification.md](phase-33-scholarly-verification.md).

Implemented:

- deterministic scholarly readiness matrix;
- record-level editorial findings;
- priority classification;
- content/provenance/media integration;
- regression test;
- CI reporting;
- explicit non-fabrication boundary.

Remaining human research:

- verify claims against primary/authoritative sources;
- add precise page/section/edition locators;
- add claim IDs where appropriate;
- record reviewer and checked-at metadata;
- resolve disputed claims;
- verify external media and licences;
- deepen thin records;
- add new evidence-backed records and relationships.

## Phase 34 — Optional source-health operations

**Not required for archive correctness.**

Potential future engineering:

- non-blocking URL reachability;
- redirect reports;
- Wikimedia file availability;
- YouTube availability;
- licence-page health;
- stale-source reporting.

Live source health must remain separate from deterministic archive validation and must never promote verification automatically.

## Research priority order

1. high-priority provenance gaps;
2. records marked `needs-review` or `disputed`;
3. authors and major literary works;
4. dictionary attestation/examples;
5. heritage and art source/media verification;
6. music/folk-song attestation and media verification;
7. sourced relationship enrichment;
8. controlled new-record expansion.

## Non-goals

Do not:

- fabricate evidence to clear queues;
- bulk-generate unsourced cultural facts;
- automatically promote verification;
- replace the static archive with a database solely for scale;
- add authentication/CMS merely to simulate editorial tooling;
- treat URL reachability as claim verification;
- treat generated playback URLs as provenance;
- rewrite published Git history.

## Verification contract

Every engineering change must preserve:

- canonical identity uniqueness;
- source/provenance ownership;
- explicit uncertainty;
- deterministic exports;
- media attribution;
- relationship provenance;
- generated route-tree integrity;
- typecheck, lint, regression, build and browser audit gates.
