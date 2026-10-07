# Editorial workflow

The archive is intentionally a static, public, source-oriented project with no authentication or database. Editorial workflow therefore separates machine-detectable review work from human scholarly decisions.

## Queue generation

Run:

bun run archive:editorial

The queue currently includes:

- published records whose provenance is explicitly needs-review;
- media findings that require preservation or attribution review.

The queue is deterministic and derived from canonical data. It does not mutate records.

## Review rules

1. Never change a verification status merely because metadata is missing.
2. Never invent a reviewer or checked-at timestamp.
3. Never turn a bibliographic URL into evidence for a claim unless the destination itself supports the claim.
4. Relationship assertions require explicit support in archive data or a later human editorial decision.
5. Community-attested material remains community-attested until evidence warrants another status.
6. External media remains external; preserve provider, attribution and license metadata.
7. A source citation may be normalized for identity without being treated as verified scholarship.

## Future authenticated editor

If a database-backed editorial application is added later, it should consume the same canonical IDs and validation contracts. Authentication and authorization must be added before allowing mutations; this repository does not currently pretend that a public route is an admin interface.
