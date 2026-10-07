# Production operations

## Release gates

Run in order:

    bun run build
    bun run typecheck
    bun run test
    bun run archive:validate
    bun run archive:provenance-report
    bun run archive:quality
    bun run archive:media
    bun run archive:qa
    bun run archive:editorial
    bun run archive:export >/tmp/archive-export.json
    bun run test:performance-budget
    bun run test:http-smoke
    bun run test:browser-audit
    bun run lint

## Runtime posture
- The public archive is read-only.
- External media is linked and attributed; it is not silently mirrored.
- Cache only immutable/public research responses.
- Never expose credentials or private editor metadata.
- Keep the generated route tree committed.
- Treat provenance warnings as editorial work, not software failures.

## Recovery
The canonical archive is source-controlled. A known-good release can be reconstructed from Git history and a public archive export. Never repair production data by hand without committing the canonical change.
