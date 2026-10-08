# Public release checklist

This checklist separates repository readiness from scholarly completeness.

## Repository

- [x] Public GitHub repository
- [x] Archive-focused README
- [x] Software licence
- [x] Data/rights policy
- [x] Contribution and editorial documentation
- [x] Changelog
- [x] CI workflow syntax repaired
- [ ] Repository description/topics configured (requires GitHub repository settings access)
- [x] First public release tag prepared for the 2026.10.0 snapshot

## Application

- [x] Canonical archive and stable record URLs
- [x] Provenance/evidence presentation
- [x] Explicit uncertainty and dispute states
- [x] Accessibility/browser regression audit
- [x] Performance budget
- [x] Public JSON API
- [x] Downloadable CSV export
- [ ] Production deployment URL configured as VITE_SITE_URL
- [ ] Production deployment smoke audit
- [ ] Search-engine indexing verification
- [ ] Social preview image verified on the deployed origin

## Discoverability

- [x] Route-level descriptions on important surfaces
- [x] Record-level canonical URL support when VITE_SITE_URL is configured
- [x] Build-time sitemap generator
- [ ] Add the deployed absolute sitemap URL to robots.txt after the production hostname is known
- [ ] Verify canonical tags and OpenGraph URLs on the live origin

## Scholarly quality

- [x] Scholarly verification readiness audit
- [ ] Source-by-source human verification
- [ ] Precise edition/page/section locators where available
- [ ] Reviewer and checked-at metadata where appropriate
- [ ] Resolution of disputed claims
- [ ] Rights verification for external media

## Operations

- [x] Source-health monitoring script and scheduled CI hook
- [x] Release metadata and reproducibility note

## Important boundary

A green CI build is evidence that the software and archive invariants passed their automated checks. It is not evidence that every cultural claim is historically correct.
