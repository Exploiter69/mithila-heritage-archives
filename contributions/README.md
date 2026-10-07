# Research contributions

The archive accepts proposed corrections and additions as reviewable GitHub pull requests. A proposal is not a published fact: it becomes part of the canonical archive only after editorial review.

Each proposal JSON file must validate against `src/data/contribution-schema.ts`.

Required fields:

- `id`
- `targetRecordId`
- `targetType`
- `field`
- `proposedValue`
- `reason`
- `sourceCitation`
- `contributor`
- `requestedStatus`
- `submittedAt`

For new records use `targetType: "new-record"`. Never use a guessed source, invented quotation, fabricated coordinate, or unverified media attribution.

For media proposals, provide both `mediaAttribution` and `mediaLicense`.

The CI contribution audit validates every JSON proposal and rejects unresolved target records, malformed timestamps, invalid statuses, and incomplete media rights metadata.
