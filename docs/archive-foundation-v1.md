# Archive Foundation v1

Phase 1 establishes a canonical, static archive graph without changing public
routes, collection-page UX, search, or SEO. The application remains a TanStack
Start application with TypeScript data files; it does not introduce a
database.

## Purpose

The Archive Foundation provides one canonical identity layer over the existing
archive data.

It is intentionally additive: the existing collection modules remain intact
during Phase 1, while `src/data/archive-foundation.ts` exposes their content as
canonical archive records.

The foundation is designed so later phases can move application reads from
collection-specific modules to the canonical layer without first redesigning
the public site.

## Canonical data graph

The graph is:

`SourceRecord ──< ProvenanceAssertion >── ArchiveRecord ──< RecordRelation >── ArchiveRecord`

and:

`ArchiveRecord ──< MediaRecord`

### ArchiveRecord

`ArchiveRecord` is the canonical record envelope.

Each record has:

- a stable canonical `id`
- a stable URL-facing `slug`
- an explicit archive `type`
- an independent `contentStatus`
- an independent `verificationStatus`
- source, provenance, media, and relation references
- one or more `representations`
- canonical `content`

The canonical record identity is defined explicitly in the `IDENTITIES` mapping
inside `src/data/archive-foundation.ts`. Identity is therefore not derived
implicitly from display text, array position, or a generated slug.

### SourceRecord

`SourceRecord` preserves source information already present in the migrated
data.

A migrated source may retain:

- citation
- optional detail
- legacy source status
- legacy source kind
- the migrated representation it came from

Phase 1 does not invent missing URLs, dates, locators, licenses, or citations.

Bibliography entries from the existing archive are also retained as source
records where applicable.

### ProvenanceAssertion

`ProvenanceAssertion` explicitly connects a canonical record to a source.

Each migrated record currently receives record-level provenance derived from
its existing source citation. The assertion carries the canonical
verification status corresponding to that source status.

Provenance is separate from the record itself so later phases can support
multiple sources, claim-level evidence, and richer editorial review without
changing the record identity model.

### MediaRecord

`MediaRecord` provides a typed media layer for media already present in the
source collections.

Phase 1 supports:

- Wikimedia Commons image records
- YouTube audio-stream records

Existing attribution objects are retained in the media payload.

YouTube playback URLs are derived deterministically from existing YouTube IDs.
They are media locators, not newly asserted provenance sources.

### RecordRelation

`RecordRelation` provides the explicit relationship layer between canonical
records.

Phase 1 contains **zero relations**.

No relationship is inferred from matching names, shared text, collection
membership, editorial judgment, or other indirect signals. Relationships may
be added only when supported by explicit evidence.

## Stable identity

Canonical record identity is authoritative in the explicit `IDENTITIES`
mapping in `src/data/archive-foundation.ts`.

Each identity contains:

```ts
{
  id: string;
  slug: string;
}
```

The IDs are stable opaque canonical identifiers such as `rec-4b91a1`,
`rec-a17502`, and `rec-7e42d1`.

The slug is the stable URL-facing identifier for the record.

Migration representation IDs are separate from canonical record IDs. They
identify the origin of a migrated payload, for example:

`representation:legacy-proverb:b1`

This distinction is intentional:

- canonical record ID = identity of the archive record
- slug = stable public-facing identifier
- representation ID = identity of one migrated source representation

Array position, display text, or a generated identifier must not become the
canonical identity of a record.

## Migration representations

Existing collection payloads are preserved as `MigrationRepresentation`
objects.

A representation records:

- its migration ID
- the originating module
- the originating export
- the original payload

Current source modules represented by the foundation include:

- `archive.ts`
- `literature.ts`
- `music.ts`
- `art.ts`
- `heritage.ts`
- `dictionary.ts`

The legacy aggregate data is therefore retained during the migration rather
than silently rewritten or discarded.

### Duplicate and overlapping content

Migration representations do not automatically become separate canonical
records.

Where the same logical archive item exists in both legacy and current
collections, the foundation may explicitly map both representations to one
canonical identity.

`Varṇa Ratnakara` is the Phase 1 example:

- the current `literature.ts` representation
- the legacy `archive.ts` representation

both belong to the same canonical record:

`rec-a17502` / `varna-ratnakara`

No duplicate canonical record is created merely because two source modules
contain representations of the same work.

## Status model

Verification and publication are intentionally independent.

### Verification status

The canonical verification statuses are:

| Status | Meaning |
| --- | --- |
| `verified` | Existing source data identifies the record as verified. |
| `community-attested` | Existing source data identifies the record as community-attested. |
| `needs-review` | Existing source data indicates that review is still needed. |
| `disputed` | The canonical model supports an explicitly disputed record. |

Legacy `community` status is mapped to `community-attested`.

Other existing statuses are preserved conservatively. Migration does not
upgrade a record’s evidentiary status.

### Content status

The canonical content statuses are:

| Status | Meaning |
| --- | --- |
| `published` | Content is currently published by the application. |
| `draft` | Content is not yet published. |
| `withdrawn` | Content has been withdrawn. |

Phase 1 marks currently rendered migrated records as `published`.

This does **not** mean that a published record is verified. Publication and
verification remain separate concerns.

The original legacy status is also retained on migrated source records as
`legacyStatus` where available.

## Current Phase 1 inventory

The current canonical foundation validates to:

- **65 canonical records**
- **66 migration representations**
- **71 source records**
- **66 provenance assertions**
- **15 media records**
- **0 record relations**

The counts are validation-time facts for the current Phase 1 dataset and may
change as later archive content is migrated.

## Validation

Schemas live in:

`src/data/archive-schema.ts`

Graph-level validation lives in:

`src/data/validate-archive.ts`

The executable validation entry point is:

`src/data/validate-archive-cli.ts`

Run:

```sh
bun run archive:validate
```

Validation currently checks:

- canonical object shape
- valid record types and statuses
- valid IDs
- duplicate record IDs
- duplicate `(type, slug)` pairs
- source references
- provenance references
- media references
- relation references
- required provenance for published records
- source ownership and representation references
- provenance ownership
- media ownership
- relation ownership
- relation source support
- URL shape where a URL field exists
- prevention of self-relations

Validation is deterministic and local.

It does not perform live web verification of citations, Wikimedia Commons
pages, YouTube URLs, or other external resources.

## Phase 1 architectural boundaries

Phase 1 intentionally does **not**:

- replace existing collection-module reads throughout the application
- change public routes
- redesign collection pages
- redesign search
- add a database
- add a CMS
- infer archive relationships
- perform live source verification
- rewrite historical content
- invent missing provenance
- remove `archive.ts`

The canonical layer is currently a read-only foundation.

Later phases can build canonical archive helpers and migrate application reads
onto this foundation incrementally.

## Migration rules

1. Preserve existing text, excerpts, citations, attribution, statuses, media,
   and slugs unless a later explicit migration decision says otherwise.
2. Do not invent sources, URLs, dates, locators, licenses, relationships, or
   historical assertions.
3. Preserve uncertainty exactly; migration must not silently strengthen a
   claim.
4. Keep canonical identity explicit and stable.
5. Keep source provenance separate from publication status.
6. Keep migration representations available until parity has been demonstrated.
7. Do not remove legacy collection data merely because a canonical
   representation exists.
8. Do not infer relationships without explicit supporting evidence.
9. Treat the canonical foundation as the authority for identity while Phase 1
   compatibility reads remain in place.
10. Any future content migration must pass the archive validator before being
    considered part of the canonical dataset.

## Phase 1 completion criterion

Archive Foundation v1 is complete when:

- all intended existing records have canonical identities
- migrated representations preserve their source payloads
- source and provenance references validate
- media references validate
- no unsupported relations are inferred
- the canonical dataset passes the validator
- the application build remains clean
- this document accurately describes the implementation

The next phase may then begin migrating application reads from the legacy
collection modules toward the canonical archive layer.
