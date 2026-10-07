# Phases 15–22 implementation record

This document records the hardening work added after the Phase 5–14 platform implementation.

## Phase 15 — Runtime & integration hardening
- Typed collection selectors now reject legacy/current payloads that do not satisfy the nested shape required by the collection UI.
- A runtime contract test covers all collection selectors and all public canonical record URLs.
- CI starts the real Vite dev server and smoke-tests every public research route plus representative API routes and invalid routes.
- Search API limit parsing rejects NaN/infinite input instead of passing invalid values into slicing.

## Phase 16 — UX/UI visual system
- Added a persistent light/dark theme control with accessible labelling.
- Exposed Research directly in the header and expanded the footer research navigation.
- Record pages now expose evidence-backed related records.

## Phase 17 — Responsive & accessibility
- Search result counts use an aria-live region.
- Theme control exposes pressed state and an accessible label.
- Existing skip-link and focus-visible foundations remain part of the public shell.
- Runtime smoke coverage protects the route-level rendering contract.

## Phase 18 — Media & preservation v2
- Three missing-image warnings were resolved using verified Wikimedia Commons files with explicit attribution and CC licensing: Mithila painting, Sikkī craft, and Kohbar painting.
- Media records now explicitly identify their preservation role as external-reference.
- Media register surfaces the remaining unresolved editorial gaps rather than substituting unrelated images.
- The remaining two image gaps are Aripan and Kapileshwar-Nath; they remain open until a directly relevant, source-backed image is located.

## Phase 19 — Scholarly provenance v3
- Provenance findings are now categorized by deterministic gap code.
- A research policy documents when URLs, locators, claims, dates and reviewers may be recorded.
- No reviewer, locator or verification date is invented to reduce the queue.
- The remaining provenance queue remains a human scholarly research task where the archive lacks sufficient evidence.

## Phase 20 — Research & discovery v3
- Search supports media and relationship facets.
- Research portal includes a transparent chronology derived only from explicit four-digit years already present in record metadata.
- Source explorer connects normalized bibliography entries back to records using their captured source identities.

## Phase 21 — Performance & production
- Above-the-fold record images can load eagerly with high fetch priority; collection images remain lazy by default.
- HTTP smoke tests run against the actual development server.
- Invalid canonical/API routes are tested as part of the runtime gate.

## Phase 22 — Continuous archive QA
- Runtime contracts are included in the normal test suite.
- CI verifies that the generated TanStack route tree remains committed.
- Consolidated QA now reports provenance-gap and high-priority editorial counts in addition to structural archive checks.

## Deliberate non-goals
- No dynamic sitemap was reintroduced.
- No authenticated CMS/admin backend was fabricated.
- No JSON-LD implementation was added merely to mark a checkbox.
- No unresolved provenance or media gap was hidden or converted into a false positive.