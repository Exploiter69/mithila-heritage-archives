# Contributing

Thank you for helping document Mithila and the Maithili language.

## Best contributions

The most useful contributions improve evidence quality:

- correct a spelling, transliteration or name
- add a bibliographic source
- identify an edition, page or section locator
- correct an attribution
- document a relationship between existing records
- improve a biography with a reliable source
- provide a properly licensed media reference
- report a disputed or uncertain claim

## Evidence standard

Please distinguish clearly between:

- published/archival evidence
- community or oral attestation
- interpretation
- unresolved uncertainty

Do not invent citations, page numbers, dates, coordinates, quotations, identities, relationships or licences.

A source URL being reachable does not by itself verify a claim.

## Data changes

The canonical archive is version-controlled. Preserve stable record IDs and slugs unless an identity correction requires a documented change.

When adding or changing a claim, update its provenance information where appropriate.

Do not create a second hand-maintained copy of the canonical dataset.

## Media

For images, provide the original provider/file page, contributor, licence and licence URL. For external audio, retain the provider identifier rather than copying the recording into the repository.

## Pull requests

Please explain:

1. what changed,
2. why it changed,
3. what source or evidence supports the change,
4. whether uncertainty remains.

Run the repository checks before opening a pull request:

~~~bash
bun run typecheck
bun run test
bun run test:browser-audit
bun run lint
~~~

## Corrections without code

If you are not comfortable editing TypeScript, open a GitHub issue with:

- the record URL or record ID,
- the correction,
- the source,
- the exact locator if available,
- any uncertainty or competing evidence.

Evidence-backed corrections are preferred over large batches of unsourced additions.
