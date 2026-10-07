# Archive Foundation Migration Invariants

These invariants define what must remain true while Archive Foundation v1 is migrated into the application.

## Identity

- Canonical record IDs are explicit and stable.
- Canonical slugs are explicit and URL-safe.
- A `(type, slug)` pair is unique.
- Representation IDs are globally unique.
- Migration identities must not be regenerated from array position or source order.

## Ownership

- Every published record has at least one provenance assertion.
- Every record source reference resolves to a source record.
- Every provenance reference resolves and belongs to the same record.
- Every provenance source is also listed by its owning record.
- Every media reference resolves and belongs to the same record.
- Every relation reference resolves and is owned by both endpoint records.
- Every relation has at least one source supporting the edge.
- Record-citation sources point to an existing migration representation owned by their record.

## Migration preservation

Foundation v1 retains original collection payloads as migration representations.

Intentional representation merges must be explicit. The current intentional merge is:

- legacy `archive.ts` Varṇa Ratnākara + collection `literature.ts` Varṇa Ratnākara → one canonical literature record with two representations.

No other merge should happen implicitly.

## Inventory baseline

The regression suite currently protects this baseline:

| Object | Count |
| --- | ---: |
| Canonical records | 122 |
| Migration representations | 123 |
| Source records | 71 |
| Provenance assertions | 66 |
| Media records | 15 |
| Record relations | 0 |

A count change is a migration/content change and must be deliberate. Update the regression baseline in the same change that intentionally adds/removes/merges archive objects.

## Validation boundary

Local validation is deterministic and must not depend on live external websites.

The validator checks schema, identity, references, ownership, and graph integrity. It does **not** claim that an external source actually supports a factual statement or that a remote URL is currently reachable. Those checks belong to later editorial/source-audit tooling.

## CI contract

Every push to `main` and every pull request must pass:

1. TypeScript typecheck
2. ESLint
3. canonical archive validation
4. archive regression tests
5. production build

Do not bypass these checks by rewriting published history. The repository is connected to Lovable, so published commits must remain intact.
