# Phases 5–14 platform completion

This document records the engineering scope completed after Archive Foundation v2.

## Phase 5 — Relationships / knowledge graph

The canonical graph now contains a controlled relationship vocabulary and a conservative relationship builder. Relationships are created only where existing archive records explicitly support the endpoint and meaning. Each relation keeps source IDs from the endpoint records and is attached to both endpoint records for validation.

The graph explorer is available at /graph.

Absence of a relation is not treated as evidence of absence. No influence, chronology, authorship, or causation is inferred merely from similarity.

## Phase 6 — Search & discovery 2.0

The public /search route adds cross-collection filtering by record type and evidence status. The existing Devanagari/Latin normalization remains the search foundation, while the platform helper exposes facets and larger result sets.

The public /api/search?q=... endpoint exposes the same canonical search surface to research tools.

## Phase 7 — Record-page architecture

The canonical record route remains the single source of truth for records. Record pages continue to expose structured content, provenance, media and canonical URLs. Relationship navigation is exposed through the public graph explorer while the record component remains deliberately source-oriented.

## Phase 8 — Media & digital preservation

Media is kept separate from record content. The media audit checks ownership, accessible captions, license metadata, deterministic YouTube locators and identifier/locator consistency. The audit never downloads or claims ownership of external files.

## Phase 9 — Bibliography / source explorer

/sources provides normalized bibliographic identities with capture counts, source type, optional authoritative URL and stable identity. Missing URLs and editorial metadata remain visible gaps.

## Phase 10 — Data / export / API

Public JSON endpoints are available under /api/archive, /api/archive/:type, /api/records/:type/:slug, and /api/search. bun run archive:export emits a stable public archive envelope without migration representations.

## Phase 11 — SEO, accessibility & performance

The application has canonical record URLs, route-level metadata, a dynamic /sitemap.xml endpoint, reduced-motion handling, semantic headings and source links. The existing Vite production build remains the performance gate.

## Phase 12 — Editorial/admin workflow

Because the project intentionally has no authentication or database, the editorial workflow is implemented as a deterministic review queue rather than a pretend secure admin panel. bun run archive:editorial reports published records with explicit needs-review provenance and media QA issues. Future authenticated editorial tooling can consume the same queue.

## Phase 13 — Automated archive QA

CI now runs archive validation, provenance reporting, content-shape quality, media preservation, consolidated QA, editorial queue reporting, public export generation, regression tests, typecheck, build and lint.

## Phase 14 — Public research experience

/research is the public research entry point. It exposes archive coverage and directs researchers to search, bibliography, graph, API and methods surfaces without requiring an account.

## Editorial boundary

Engineering checks do not replace scholarship. No reviewer names, page locators, URLs, source identities, image attributions, relationship claims or verification statuses are fabricated to make an audit green.
