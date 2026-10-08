# Mithila Heritage Archives

**An open, evidence-oriented digital archive of Mithila and the Maithili language.**

Mithila Heritage Archives brings literature, language, art, music, heritage, people, places, sources, media and documented relationships into one research-oriented public archive.

**[Explore the archive]((production deployment pending))** · **[Research portal]((production deployment pending)research)** · **[API]((production deployment pending)api/archive)**

> **Research note:** The archive's software and editorial infrastructure are built for scholarly use, but the collection itself remains actively researched and expanded. Catalogue counts describe what is currently published; they do not claim completeness of Mithila's cultural heritage. Uncertainty is preserved rather than silently converted into fact.

## Why this exists

Mithila's cultural record is distributed across books, archives, recordings, community knowledge, institutional collections and living practice. This project is an attempt to make a durable, navigable index of that material while keeping provenance visible.

The archive is designed around a simple rule:

> **A claim is more useful when a reader can see where it came from, how it was classified, and whether it still needs review.**

## Current catalogue

The canonical dataset currently contains:

- **723 canonical records**
- **724 representations**
- **729 source records**
- **724 provenance assertions**
- **30 media records**
- **86 explicit record relationships**
- **9 record types**
- **71 award-recipient records**
- **20 catalogue works**
- **54 dictionary entries**

These numbers are release metadata, not a statement about the size of Mithila's heritage.

## Explore

The public site is organized for both general readers and researchers:

- **Literature** — works, authors, passages and literary context
- **Language** — dictionary material, transliteration and language-learning surfaces
- **Music** — songs, genres, occasions and external recordings
- **Art** — Mithila/Madhubani traditions, styles, motifs and media
- **Heritage** — places, traditions, festivals and cultural memory
- **People** — authors, artists, performers and other documented figures
- **Atlas** — source-backed geographic context
- **Timeline** — chronology derived only from explicit record metadata
- **Knowledge Graph** — explicit, sourced record-to-record relationships
- **Provenance** — evidence and editorial status
- **Source Explorer** — browse records through their cited sources
- **Research** — the machine-readable and scholarly entry point

## Evidence and editorial policy

Every canonical record has an explicit content status and verification status.

Verification statuses are:

- **Verified** — supported by the archive's current evidence standard
- **Community attested** — retained as oral/community evidence and labelled accordingly
- **Needs review** — useful material whose evidence, attribution, locator or interpretation remains incomplete
- **Disputed** — a documented disagreement is retained rather than hidden

The project deliberately distinguishes:

1. a source existing,
2. a source being reachable,
3. a record citing that source, and
4. a claim being independently verified.

A URL being reachable is **not** treated as proof of a cultural claim.

The archive does not fabricate citations, page numbers, dates, coordinates, relationships, quotations, media credits or verification metadata.

## Provenance

The data model separates source captures from normalized bibliographic identities and from provenance assertions. Where available, assertions can carry:

- source identity
- claim ID
- evidence role
- locator
- editorial note
- verification status
- checked-at timestamp
- reviewer identity

This lets the archive preserve uncertainty while still making the evidence trail inspectable.

## Media and rights

Media is tracked separately from cultural claims.

- Wikimedia Commons material is displayed with its recorded contributor and licence information.
- External audio remains on its original provider rather than being copied into this repository.
- Third-party material remains subject to its own copyright and licence terms.
- The archive does not imply ownership of external media.

See **docs/media-and-rights.md**.

## Public data and API

The canonical static archive is available through machine-readable endpoints.

- /api/archive — published archive envelope
- /api/archive?version=2 — research dataset envelope
- /api/archive/:type — published records for one record type
- /api/search?q=... — cross-collection search
- /api/search?version=2&... — filtered research search

The API is intentionally read-only. The Git repository remains the editorial source of truth.

See **docs/public-data.md** for the data contract and examples.

## Citation

Individual archive records have stable URLs and immutable archive IDs. Record pages expose the evidence trail and a machine-readable API representation.

When citing the archive, prefer the canonical record URL and include the record ID and access date. The archive is a catalogue and research aid; readers should consult the cited source for the underlying primary material.

## Contributing

Evidence-backed corrections are especially valuable.

You can contribute by:

- correcting a spelling or transliteration
- supplying a stronger source
- identifying an edition or page locator
- improving a biography
- correcting attribution
- identifying a place
- documenting a relationship
- supplying a properly licensed media reference
- reporting a disputed claim

Please do not submit large batches of unsourced facts. A smaller, well-supported correction is preferable to confident-looking but unverifiable content.

See **CONTRIBUTING.md** and **docs/editorial-workflow.md**.

## Development

Requirements:

- Node.js 20+ recommended
- Bun for the repository's scripts and lockfile

~~~bash
git clone https://github.com/Exploiter69/mithila-heritage-archives.git
cd mithila-heritage-archives
bun install
bun run dev
~~~

The development server normally runs at http://localhost:5173.

For a production build:

~~~bash
bun run build
bun run preview
~~~

## Validation

The repository has deterministic checks for:

- TypeScript
- archive identity and schema
- archive records and routes
- provenance
- data quality
- media preservation
- editorial workflow
- scholarly verification readiness
- contribution proposals
- runtime/API contracts
- browser accessibility and runtime health
- performance budgets
- production build
- linting

Run the full test suite with:

~~~bash
bun run test
bun run test:browser-audit
bun run lint
bun run typecheck
~~~

The browser audit uses a deterministic settle window rather than a fragile CDP runtime-readiness probe.

## Architecture

The project uses:

- React 19
- TanStack Start / TanStack Router
- TypeScript
- Vite
- Tailwind CSS
- Bun
- a canonical static archive graph
- provenance and evidence assertions
- deterministic validation and CI

The canonical data layer is deliberately static and version-controlled. There is no authentication, payment system, social layer, comments system, AI chatbot or mutable production database.

See **docs/architecture.md** and **src/data/types.ts**.

## Repository structure

~~~text
src/
  components/        reusable archive UI and record presentation
  data/              canonical archive, provenance, media, relations and audits
  routes/            public collections, research surfaces and API
  styles.css         archive visual system
scripts/              deterministic regression and browser audits
docs/                 editorial, research and operational documentation
contributions/        contribution format and workflow
public/               static public assets
~~~

## Release status

**Public-release preparation**

The engineering platform is substantially complete. Public deployment, release packaging and ongoing scholarly verification are maintained separately so that technical completeness is never confused with factual completeness.

See **CHANGELOG.md** for release history and **docs/public-release.md** for the public-launch checklist.

## License

The application code is licensed under the **MIT License**.

Archive data, third-party media, quotations and source material may have separate rights. The repository's code licence does not grant rights to third-party material.

See **LICENSE**, **docs/data-license.md**, and **docs/media-and-rights.md**.

## Acknowledgements

This project builds on the work of scholars, archivists, librarians, cultural practitioners, community knowledge holders, artists, musicians and institutions whose published or shared materials make this archive possible.

Source attribution belongs with the cited source, not with this project.

---

**Mithila Heritage Archives**  
An open, non-commercial research archive for Mithila and the Maithili language.
