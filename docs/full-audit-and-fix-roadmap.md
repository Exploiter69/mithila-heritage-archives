# Mithila Heritage Archives — Full Codebase Audit & Fix Roadmap

Audit date: 2026-10-06
Branch audited: `main`
Head audited: `a0341782f96de9256b0507d0f68cf46262c293c1`

## Executive verdict

The repository is structurally healthy and the Archive Foundation v1 migration is a good direction. The main problem is not that the project is badly coded; it is that the current architecture **claims more archival capability than the public application actually exposes**.

The most important gap is the boundary between the canonical archive graph and the UI:

- canonical IDs/slugs exist, but public records are still rendered as collection pages with hash anchors;
- search is called global/archive search but indexes only five content types and omits authors and proverbs;
- record-level source/provenance objects exist, but the UI still consumes the legacy `Source` shape;
- the foundation keeps both legacy and current collections, which is safe for migration but creates a large duplicate-content surface that is not yet protected by parity tests;
- validation is strong on graph integrity but weak on **editorial/data quality** and external-source freshness;
- there is no evident automated test/CI gate protecting the migration.

This means the next phase should **not** be a visual rewrite. It should finish the data architecture, make records first-class public resources, strengthen validation/tests, and only then expand content.

## Severity model

- **P0 — Critical:** correctness/security/data-integrity failure; fix before substantial feature expansion.
- **P1 — High:** architectural or UX defect that undermines the archive's core purpose.
- **P2 — Medium:** important quality, maintainability, accessibility, or discoverability improvement.
- **P3 — Low:** polish or future enhancement.

---

# 1. Architecture audit

## P1 — Canonical archive layer is only partially authoritative

### Evidence

`src/data/archive-foundation.ts` creates the canonical graph, while `src/data/archive-read.ts` provides compatibility reads. Most public routes now call `getArchiveContent()`, which is good.

However, routes still import legacy collection modules for filters/constants:

- `literature.tsx` imports `literatureFilters` from `src/data/literature.ts`
- `art.tsx` imports `motifs`
- `heritage.tsx` owns route-local filters
- `music.tsx` imports `musicFilters` and attribution text from `src/data/music.ts`
- `language.tsx` imports `wordClasses` from `src/data/dictionary.ts`

This is not inherently wrong, but it means the canonical layer is not yet the sole application data contract.

### Risk

Future edits can update a collection module without updating the canonical model's derived assumptions. The archive can then pass graph validation while the UI and canonical layer disagree.

### Fix

Create canonical helpers for:

- available filters/facets;
- record display metadata;
- record lookup;
- related records;
- source/provenance display;
- media display.

Then remove application-level reads from legacy modules one collection at a time.

---

## P1 — Legacy and collection representations are duplicated by design, but parity is not tested

`archive-foundation.ts` intentionally preserves:

- legacy aggregate data from `archive.ts`;
- newer collection modules;
- duplicate representations such as Varṇa Ratnākara.

This is a sensible migration strategy.

The missing piece is an automated **migration parity contract**.

### Fix

Add tests/validation that assert:

1. every intended legacy record has exactly one canonical identity;
2. every intended collection record has exactly one canonical identity;
3. intentional merges are explicitly listed;
4. unintentional duplicate `(type, slug)` values fail;
5. canonical content equals its designated primary representation;
6. representation counts match the documented migration inventory.

Do not delete `archive.ts` until this passes.

---

# 2. Public URL / record model audit

## P1 — Records are not first-class indexable pages

The canonical model has both:

- stable opaque `id`;
- stable URL-facing `slug`.

But the application does not currently expose record routes such as:

- `/literature/vidyapati-padavali`
- `/authors/vidyapati`
- `/dictionary/osaar`
- `/heritage/simraungadh`

Instead, collection pages use HTML IDs and hash navigation, for example:

`/literature#varna-ratnakara`

and literature content is opened inside a client-side dialog.

### Why this matters

A cultural archive should make each item independently:

- linkable;
- bookmarkable;
- crawlable;
- shareable;
- metadata-bearing;
- addressable without depending on client-side state.

Hash fragments are not an adequate substitute for record URLs.

### Fix

Introduce dynamic record routes:

`src/routes/literature/$slug.tsx`
`src/routes/authors/$slug.tsx`
`src/routes/language/$slug.tsx`
`src/routes/proverbs/$slug.tsx`
`src/routes/art/$slug.tsx`
`src/routes/heritage/$slug.tsx`
`src/routes/music/$slug.tsx`

Use canonical lookup helpers rather than collection-specific arrays.

Keep collection pages as discovery/index pages.

The existing hash links can remain temporarily and then become redirects or simple links to the canonical record URL.

---

# 3. Search audit

## P1 — "Global Search" is not actually archive-wide

`src/components/global-search.tsx` indexes:

- literature
- music
- art
- heritage
- dictionary

It does **not** index:

- authors
- proverbs

It also searches only selected presentation fields rather than the canonical record envelope.

### Consequence

A user searching the archive for an author's name or proverb can receive no result even though the archive contains that record.

### Fix

Build the index from canonical records, with a typed search projection.

Minimum searchable fields:

- canonical type;
- canonical slug;
- Devanagari title/name/headword;
- transliteration;
- aliases;
- authors/performers;
- place;
- period;
- category/theme/form;
- summary/description;
- source citation;
- relevant keywords.

Every hit should navigate to a canonical record URL, not a collection hash.

---

## P2 — Search has no result count, type filtering, or keyboard-oriented result semantics

The command UI is functional, but archive search should become a real discovery interface.

Future improvements:

- type badges;
- result counts;
- recent searches;
- search highlighting;
- explicit no-result state;
- normalized Devanagari/Latin matching;
- optional transliteration normalization;
- URL query state for shareable searches.

Do this after P1 record URLs.

---

# 4. Data/provenance audit

## P1 — Schema integrity is stronger than editorial evidence integrity

`src/data/archive-schema.ts` validates object shape and URLs.

`src/data/validate-archive.ts` validates graph ownership and references.

That is good infrastructure.

But validation currently cannot tell whether:

- a citation actually supports the claim;
- a cited institution/source exists;
- a URL still works;
- a Wikimedia file still has the stated licence;
- a YouTube ID still resolves;
- a historical date is accurate;
- a transliteration is linguistically sound;
- an excerpt is correctly attributed;
- a "verified" source label is justified.

This is explicitly acknowledged by the foundation documentation.

### Fix

Keep local validation deterministic, but add a separate optional **source audit tool**.

Do not make builds depend on live websites.

Add checks such as:

- URL reachability report;
- redirect detection;
- Wikimedia file-page availability;
- YouTube availability;
- license URL availability;
- stale-source report.

Store audit output as a report, not as a hidden automatic verification claim.

---

## P1 — "verified" is semantically overloaded

The current status model maps legacy `verified` directly to canonical `verified`.

But there is no machine-checkable distinction between:

- bibliographic source exists;
- source directly supports this specific claim;
- editorial reviewer checked the claim;
- external source was live at audit time.

### Fix

Preserve current statuses for compatibility, but introduce a clearer editorial evidence model in a later schema version:

- evidence status;
- source type;
- checked date;
- checked by/reviewer;
- locator/page/section;
- claim scope.

Do not silently downgrade or upgrade existing records during migration.

---

## P2 — Source normalization is incomplete

`SourceRecord` is intentionally a migrated capture, not a normalized bibliography entity.

That is correct for v1, but it means repeated citations are duplicated.

### Fix

In the next data phase introduce normalized `BibliographicSource` records and let many provenance assertions reference one source identity.

Keep migrated source captures until parity is established.

---

# 5. Data-quality risks found during code inspection

## P1 — The repository contains seeded factual content that needs a dedicated editorial verification pass

The data modules contain many precise historical, linguistic, institutional, and cultural claims.

Examples include:

- dates/lifespans;
- historical descriptions;
- institutional attributions;
- dictionary etymology/usage statements;
- festival descriptions;
- art-school classifications;
- source names and citations.

The code structure can validate these strings but cannot establish their truth.

### Fix

Create an editorial audit matrix rather than attempting to "fix" facts blindly.

For every record capture:

| Field | Required review |
| --- | --- |
| title/name | identity check |
| Devanagari | spelling/script check |
| transliteration | linguistic check |
| dates | historical source |
| description | claim-level source |
| excerpt/lyrics | edition/recording |
| source citation | bibliographic verification |
| status | evidence review |
| image | Commons file/licence review |
| external media | URL/channel review |

The archive should prefer "needs-review" over confident unsupported claims.

---

# 6. Media audit

## P2 — Media model is good, but display and source semantics should be separated more explicitly

The foundation correctly distinguishes:

- Wikimedia display/source page;
- deterministic YouTube playback locator.

That is a strong design choice.

However, the public UI still constructs the YouTube URL directly in `music.tsx`.

### Fix

Move media navigation/playback URL creation into the canonical media helper.

The UI should consume:

`getArchiveMedia(record)`

rather than knowing how a YouTube locator is constructed.

---

## P2 — Image attribution should be rendered from canonical media

`CommonsImageFigure` currently receives the legacy `CommonsImage` shape.

Once canonical media reads are complete, the UI should consume `MediaRecord` and derive attribution from it.

This reduces the chance that the displayed image and canonical attribution drift apart.

---

# 7. SEO audit

## P1 — Collection-level metadata exists; record-level SEO does not

Every major route has title/description/Open Graph metadata, which is good.

But there are no individual record pages with unique metadata.

### Fix

Dynamic record routes should generate:

- title;
- description;
- canonical URL;
- Open Graph title/description/image;
- Twitter card;
- appropriate robots metadata.

For media-bearing records, use their canonical display image where licensing permits.

---

## P2 — Structured data is absent

Future record pages can expose schema.org metadata where appropriate:

- CreativeWork;
- Book;
- Person;
- MusicRecording;
- VisualArtwork;
- Place;
- Event;
- DefinedTerm.

Use only fields supported by archive evidence.

Do not generate structured data that makes unsupported factual claims.

---

# 8. Accessibility audit

## P2 — Basic semantic structure is good, but record UX needs a11y hardening

Positive findings:

- semantic `article`, `nav`, `header`, `main`, `footer`;
- labels for search fields;
- `aria-pressed` filters;
- `aria-expanded` lyrics control;
- accessible search trigger;
- dialog title.

Issues to address:

- hash/scroll navigation is less robust than normal links;
- dialog-based literature reading is less accessible/shareable than a page;
- image/media components should be audited for alternative text;
- interactive controls should have consistent focus-visible treatment;
- mobile navigation should be keyboard/focus tested.

---

# 9. TypeScript / lint / build audit

## P2 — Strict TypeScript configuration is a strength

The repository enables:

- `strict`;
- `noImplicitReturns`;
- `noFallthroughCasesInSwitch`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- `noUncheckedSideEffectImports`.

This is appropriate for an archive.

## P1 — Automated regression tests are missing from the visible project contract

`package.json` exposes:

- dev;
- build;
- build:dev;
- preview;
- lint;
- typecheck;
- archive:validate;
- format.

There is no test script or visible unit/integration test contract in the inspected repository.

### Fix

Add a lightweight test layer for the data foundation first.

Minimum tests:

1. canonical archive validates;
2. expected inventory counts;
3. all canonical slugs are unique per type;
4. all published records have provenance;
5. all record references resolve;
6. all search records have canonical destinations;
7. legacy migration parity;
8. representative record lookup cases;
9. word-of-the-day determinism.

Then add route smoke tests later.

---

# 10. CI/CD audit

## P1 — Build correctness is not visibly enforced as a repository gate

The project has local scripts but no visible evidence in the inspected tree of a comprehensive GitHub Actions quality gate.

### Fix

Add CI that runs on pull requests and pushes:

`npm ci`
`npm run typecheck`
`npm run lint`
`npm run archive:validate`
`npm run build`

Later add the test command.

Because the repository is connected to Lovable, avoid force pushes, rebases, amended published commits, or history rewriting.

---

# 11. Maintainability findings

## P2 — Data types are split between compatibility and canonical modules

There are two conceptual layers:

- legacy `Source`/collection interfaces;
- canonical archive interfaces.

This is correct during migration but increases cognitive load.

### Fix

Document the boundary explicitly and gradually make canonical types the application-facing types.

Legacy modules should become migration inputs, not application dependencies.

---

## P2 — Route files contain too much presentation-specific archive logic

Several routes know about:

- data filters;
- media URLs;
- source presentation;
- content transformations.

Move reusable behavior into:

- archive selectors;
- record views;
- media helpers;
- source/provenance components.

This will make the eventual record pages much easier to implement.

---

# 12. Product/content audit

## P1 — The archive is currently a polished seed, not yet a substantial cultural archive

The current coverage is intentionally small.

The site itself describes the collections as early/expanding. This is honest and should remain so.

Do **not** solve this by bulk-generating hundreds of entries.

### Correct expansion strategy

Expand in evidence-backed batches:

1. improve existing records;
2. verify sources;
3. add claim-level provenance;
4. add stable record pages;
5. add curated relationships;
6. then add new records.

Quality and traceability are more important than raw record count.

---

# 13. Recommended target architecture

## Phase A — Canonical core

Legacy collections:
`archive.ts`, `literature.ts`, `music.ts`, `art.ts`, `heritage.ts`, `dictionary.ts`

↓

Migration layer:
`archive-foundation.ts`

↓

Canonical graph:
`ArchiveRecord`
`SourceRecord`
`ProvenanceAssertion`
`MediaRecord`
`RecordRelation`

↓

Application selectors:
`archive-read.ts` + new canonical helper modules

↓

Public UI:
collection indexes + individual record routes

↓

Search:
canonical search projection

This is the direction the repository is already moving toward.

---

# 14. Fix roadmap

## Phase 0 — Guardrails

**Goal:** stop regressions before changing architecture.

Tasks:

- add archive foundation tests;
- add expected inventory/parity checks;
- add CI;
- document migration invariants;
- make `archive:validate` part of CI.

Files:

- `package.json`
- `src/data/validate-archive.ts`
- new `src/data/__tests__/`
- `.github/workflows/ci.yml`

Priority: **P0/P1**

---

## Phase 1 — Canonical selectors

**Status: complete (2026-10-06)**

**Goal:** make canonical archive data the only application-facing data source.

Tasks:

- expand `archive-read.ts`;
- add selectors for filters/facets;
- add canonical media helpers;
- add canonical source/provenance view models;
- migrate remaining route imports away from collection data modules.



Completed implementation:

- archive-read.ts owns collection facet selectors for literature forms, music categories, dictionary word classes, and heritage kinds;
- canonical evidence views join SourceRecord and ProvenanceAssertion for UI consumption;
- canonical image/audio media helpers expose display and playback metadata without route-level URL construction;
- curated art motif metadata and stream attribution copy are exposed through the archive read layer;
- all collection routes no longer import runtime data/constants from literature.ts, music.ts, art.ts, or dictionary.ts;
- archive-ui.tsx consumes the shared Source compatibility type from types.ts rather than importing the legacy aggregate module;
- regression tests cover selector ordering, evidence ownership, and canonical media helpers.
Priority: **P1**

---

## Phase 2 — First-class record URLs

**Goal:** turn every archive item into an addressable resource.

Tasks:

- dynamic routes for all record types;
- canonical slug lookup;
- not-found handling;
- record metadata;
- canonical links;
- breadcrumbs/back-to-collection;
- related-source display;
- media display.

Priority: **P1**

---

## Phase 3 — Real archive search

**Goal:** make global search genuinely global.

Tasks:

- canonical search projection;
- authors + proverbs;
- all public record types;
- normalized Devanagari/Latin matching;
- type labels;
- canonical result destinations;
- optional URL query state.

Priority: **P1**

---

## Phase 4 — Provenance v2

**Goal:** move from "citation attached to record" toward evidence-aware archival records.

Tasks:

- normalized sources;
- claim-level provenance;
- locators/page/section;
- checked dates;
- editorial notes;
- evidence roles;
- source audit reporting.

Priority: **P1/P2**

---

## Phase 5 — Media hardening

**Goal:** canonicalize media behavior.

Tasks:

- media selectors;
- attribution from canonical records;
- external media health report;
- image alt/caption audit;
- YouTube locator handling;
- license metadata checks.

Priority: **P2**

---

## Phase 6 — Editorial quality system

**Goal:** make content growth safe.

Tasks:

- editorial status dashboard/report;
- needs-review inventory;
- source completeness report;
- duplicate/near-duplicate report;
- missing transliteration report;
- missing attribution report;
- record review checklist.

Priority: **P1/P2**

---

## Phase 7 — Relationships

**Goal:** turn the graph into a useful cultural knowledge network.

Only add evidence-supported relationships.

Examples:

- author → work;
- work → tradition;
- festival → music;
- place → festival;
- artwork → motif;
- work → source.

Every relationship must retain source support.

Priority: **P2**

---

## Phase 8 — Content expansion

Only after the previous phases are stable.

Prioritize:

1. Maithili literature;
2. authors;
3. lexicon;
4. folk song;
5. art traditions;
6. heritage places;
7. festivals;
8. oral-history/attestation records.

Every new record must pass validation and the editorial evidence checklist.

Priority: **P2**

---

# 15. Things we should NOT do

1. Do not rewrite the UI from scratch.
2. Do not remove `archive.ts` immediately.
3. Do not replace the static graph with a database just for scale.
4. Do not auto-infer cultural relationships.
5. Do not bulk-generate unsourced historical content.
6. Do not convert `needs-review` into `verified` merely because a source exists.
7. Do not make live external URL checks mandatory for local builds.
8. Do not treat YouTube playback URLs as provenance.
9. Do not use hash fragments as the final record URL architecture.
10. Do not rewrite published Git history because the repository is connected to Lovable.

---

# 16. First implementation batch

The safest first batch is:

### Batch 1
- tests + CI;
- canonical selector completion;
- migration parity checks.

### Batch 2
- individual record routes;
- canonical record metadata;
- collection → record links.

### Batch 3
- rebuild global search on canonical records;
- add authors/proverbs;
- search → record URLs.

### Batch 4
- provenance/source improvements;
- media canonicalization;
- editorial audit tooling.

### Batch 5
- evidence-backed content expansion and relationships.

---

# Final assessment

**Architecture:** 8/10  
Good foundation, but migration is incomplete.

**Data integrity:** 7/10  
Strong structural validation; editorial evidence needs a separate system.

**UX:** 7/10  
Calm and coherent, but record discovery is still collection-page oriented.

**Search:** 5/10  
Useful but not actually global.

**SEO/discoverability:** 5/10  
Good collection metadata; missing first-class record URLs.

**Testing/regression protection:** 3/10  
The canonical validator is good, but the project needs automated regression tests and CI.

**Archive maturity:** 5/10  
Promising foundation and careful methodology, but currently a small curated seed rather than a mature archive.

## Bottom line

The previous Archive Foundation work was **not a mistake**. It solved the right underlying problem: stable identities, provenance separation, media typing, and migration preservation.

The mistake would be to stop there and start adding lots of content.

The correct next move is to **finish the canonical architecture and expose it through first-class record URLs and real archive-wide search, while adding automated migration/data-quality protection**. After that, content expansion becomes substantially safer and more valuable.
