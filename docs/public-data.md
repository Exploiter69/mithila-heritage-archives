# Public data and API

The archive exposes a read-only HTTP interface over the canonical static dataset.

## Endpoints

### GET /api/archive

Returns the published archive envelope.

### GET /api/archive?version=2

Returns the research-oriented dataset envelope with the current API version marker.

### GET /api/archive/:type

Returns published records for a single canonical record type.

Supported types:

- literature-work
- author
- dictionary-entry
- proverb
- art-entry
- art-style
- music-entry
- song
- heritage-entry

### GET /api/search?q=QUERY

Searches the published corpus.

Optional parameters include limit, type and status. Version 2 exposes the research-oriented response shape.

## Stability

Every canonical record has an immutable archive ID and a stable type/slug URL. API versions are explicit so future schema changes can be introduced without silently changing the meaning of an existing contract.

## Source of truth

The Git repository's canonical archive remains the editorial source of truth. The public API is a read-only projection of published records.

## Downloads

Release snapshots should be generated from the same canonical data used by the API. Do not hand-maintain a second copy of archive data for downloads.

## Research caution

API availability does not mean that every claim is independently verified. Consumers should inspect verificationStatus and the associated provenance before treating a record as evidence.
