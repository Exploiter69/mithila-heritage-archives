# Content Expansion Program

## Objective
Make Mithila Heritage Archives the deepest, most useful and most carefully sourced public digital archive of Mithila culture—not merely the site with the largest record count.

The target is breadth **and** depth: every important record should connect to people, works, places, practices, language, media and sources.

## Editorial principles
1. **Source before scale.** No record is added only to increase counts.
2. **Separate fact from interpretation.** Biographical, historical and cultural claims must be traceable to a source.
3. **Never fabricate missing details.** A bibliographic record may be published with recognition metadata while its synopsis remains explicitly pending.
4. **Preserve uncertainty.** `needs-review`, community-attested and disputed evidence remain visible.
5. **Prefer primary/institutional sources.** Sahitya Akademi, government cultural bodies, museums, libraries, archaeological departments, academic publications and creator-held sources take priority.
6. **Use community knowledge as evidence, not as an invisible replacement for scholarship.**
7. **Rights-aware media.** Link external media unless the archive has a lawful preservation copy.
8. **Connect the archive.** New records should create explicit relationships only when the relationship is sourced or editorially asserted.
9. **Maithili-first data.** Store Devanagari, transliteration, Hindi/English explanations where reliable; do not invent translations.
10. **Depth over duplicate SEO pages.** One authoritative record plus rich relationships is better than several thin pages.

## Collection targets
### Literature
- Complete Sahitya Akademi Maithili award corpus.
- Major medieval and early-modern works.
- Modern novels, short-story collections, poetry, essays and drama.
- Folk epics, oral literature and performance texts.
- Author biographies and bibliographies.
- Literary movements, periods and journals.
- Editions, manuscripts and library holdings where identifiable.

### Language
- 1,000+ carefully sourced lexical entries as the first major target.
- Grammar topics: phonology, noun phrase, case, agreement, honorifics, tense/aspect, negation, pronouns and syntax.
- Idioms, proverbs, kinship vocabulary, agricultural vocabulary and ritual vocabulary.
- Dialect/geographic variants with explicit labels.
- Devanagari + transliteration + Hindi/English glosses.
- Examples must be sourced or explicitly marked as editorial examples.

### Folk culture
- Festivals and ritual calendars.
- Life-cycle ceremonies.
- Marriage traditions and song cycles.
- Agricultural and seasonal practices.
- Foodways, dress, household architecture and material culture.
- Children's games and oral traditions.
- Women's song traditions and gendered performance contexts.

### Art and craft
- Madhubani/Mithila painting traditions and substyles.
- Kohbar iconography and motif lexicon.
- Aripan.
- Sikki, Sujuni, bamboo craft, terracotta and other material traditions.
- Named artists and schools.
- Museum/exhibition records.
- Motif-to-meaning relationships with evidence.

### Music
- Sanskar geet.
- Wedding repertoire.
- Birth/death songs.
- Seasonal songs.
- Devotional traditions.
- Folk epics and narrative performance.
- Named performers and recordings.
- Audio provenance and rights metadata.

### Heritage and places
- Archaeological sites.
- Temples and pilgrimage places.
- Palaces and historical settlements.
- Ponds, rivers and cultural landscapes.
- Janakpur and Nepal Tarai heritage.
- Historical Mithila polities and routes.
- Intangible heritage locations and festival sites.

### People
- Poets, writers, linguists, artists, musicians, scholars, historians and cultural practitioners.
- Awards, major works, institutional affiliations and bibliographies.
- Do not publish sensitive personal information.

### Sources
Build a research-grade bibliography of books, editions, journal articles, archives, museums, government documents, academic projects and stable digital collections.

## Expansion sequence
### Wave 1 — authoritative literary backbone
Seed the Sahitya Akademi Maithili award register as bibliographic records. These entries are intentionally conservative until the underlying books are consulted.

### Wave 2 — literary canon and authors
Add major works and author profiles with richer summaries, dates, editions, relationships and source locators.

### Wave 3 — language corpus
Expand the dictionary from the current small seed to hundreds, then 1,000+ entries. Add grammar and semantic-domain navigation.

### Wave 4 — ritual and folk culture
Build a structured calendar and connect each festival/practice to songs, vocabulary, art, places and sources.

### Wave 5 — art and craft atlas
Create an art-style, motif, artist, material and place network with museum/GI/institutional sources.

### Wave 6 — music archive
Expand song metadata, performers, occasions, variants, external recordings and rights/provenance.

### Wave 7 — heritage atlas
Expand sites and cultural landscapes, then connect historical events, dynasties, people and literature.

### Wave 8 — scholarly depth
Add editions, bibliography, manuscript references, page/section locators, citation bundles and research datasets.

## Quality gates for every batch
Before publication:
- `bun run archive:validate`
- `bun run archive:quality`
- `bun run archive:media`
- `bun run archive:qa`
- `bun run archive:editorial`
- `bun run test`
- `bun run typecheck`
- `bun run lint`

For UI-facing batches:
- `bun run test:http-smoke`
- `bun run test:browser-audit`
- `bun run test:performance-budget`

## Success metrics
We will track:
- total records by collection;
- percentage with stable source URLs;
- percentage with normalized bibliographic sources;
- provenance assertions per record;
- records with explicit evidence roles;
- records with media;
- records with relations;
- records with Devanagari + transliteration;
- literature works with consulted full text;
- dictionary entries with source locators;
- heritage entries with institutional/archaeological sources;
- duplicate/near-duplicate rate;
- unresolved editorial queue size.

The archive is considered content-rich only when **depth, provenance and cross-linking** grow with record count.