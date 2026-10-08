# Architecture

Mithila Heritage Archives is intentionally a version-controlled static archive rather than a mutable CMS.

## Layers

1. **Canonical data** — archive records, source captures, normalized bibliographic sources, provenance assertions, media and explicit relations.
2. **Read layer** — typed helpers that expose published records to the application.
3. **Research layer** — search, facets, graph traversal, exports and evidence reporting.
4. **Presentation layer** — public collection pages, record pages, atlas, timeline, language and research surfaces.
5. **Validation layer** — deterministic schema, identity, provenance, quality, media, editorial, scholarly-readiness, browser and performance audits.

## Editorial state

Content publication and factual verification are separate dimensions.

- contentStatus controls whether a record is public.
- verificationStatus describes the current evidence state.

This allows a published record to be explicitly marked needs-review or disputed without hiding the fact that it exists.

## Provenance

Source captures are preserved separately from normalized bibliographic identities. Provenance assertions connect sources to records and can optionally identify a specific claim, locator, reviewer and checked-at timestamp.

## Media

Media is a separate graph from cultural claims. External assets retain their provider and rights metadata.

## Relationships

Record-to-record relations are explicit and carry source IDs. The graph therefore represents documented relationships rather than semantic guesses.

## Why static data?

At the current scale, Git provides:

- reviewable history
- reproducible builds
- deterministic validation
- transparent changes
- easy archival snapshots

A database or CMS can be considered later if the editorial workflow genuinely requires it.
