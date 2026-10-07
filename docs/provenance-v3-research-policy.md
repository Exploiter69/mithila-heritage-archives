# Provenance v3 — research and review policy

This phase separates **evidence discovery** from **editorial verification**.

## Non-negotiable rules

1. A URL is added only when it points to the actual source or a stable institutional/catalogue record.
2. A locator is added only when the cited source has been consulted and the page, section, chapter, item, timestamp, or equivalent locator is known.
3. checkedAt and checkedBy describe an actual editorial check. They are never generated merely because a build or script ran.
4. A claim ID is required for claim-level assertions and must identify the scope of the claim being supported.
5. Missing metadata remains a gap. It is never replaced with a guessed page number, reviewer, date, or quotation.
6. Community/oral attestations remain explicitly labelled and are not upgraded to printed-source verification without evidence.
7. Conflicting evidence is recorded as disputed rather than silently choosing the preferred account.

## Gap categories

The deterministic report currently classifies gaps as:

- missing-url
- missing-locator
- missing-review
- missing-claim-scope
- vague-citation

The counts are generated from the canonical archive at build/test time. They are not manually maintained.

## Research workflow

For each queue item:

1. Identify the exact claim supported by the source.
2. Locate the strongest available primary, institutional, bibliographic, or scholarly source.
3. Record the stable source URL when one exists.
4. Consult the source and record a precise locator when possible.
5. Record the actual review date and reviewer.
6. Add a claim ID when the assertion is narrower than the whole record.
7. Run archive validation, provenance audit, quality audit and regression tests.
8. Leave the item open if any of those facts cannot be established.

The target is **better evidence, not a smaller warning count**.