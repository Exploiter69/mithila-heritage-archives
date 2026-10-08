import { createFileRoute, Link } from "@tanstack/react-router";
import { EntryCard, PageHeader, Section, SectionTitle } from "@/components/archive-ui";
import { ARCHIVE_RELEASE, ARCHIVE_RELEASE_DATE } from "@/data/archive-export";
import { getArchiveStats, getResearchFacets } from "@/data/archive-platform";
import { getArchiveRecords } from "@/data/archive-read";
import { archiveRecordTitle } from "@/components/archive-record-page";
import type { ArchiveRecord } from "@/data/types";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [
    { title: "Research & Data — Mithila Digital Archive" },
    { name: "description", content: "Research-oriented entry point to the Mithila Digital Archive: downloadable data, sources, relationships, search and public API." },
  ]}),
  component: ResearchPage,
});

function ResearchPage() {
  const stats = getArchiveStats();
  const facets = getResearchFacets();
  const chronology = getArchiveRecords()
    .map((record) => {
      const content = record.content as Record<string, unknown>;
      const dateText = [content["era"], content["period"], content["lifespan"]]
        .filter((value): value is string => typeof value === "string")
        .join(" ");
      const match = dateText.match(/\b(\d{4})\b/);
      return match ? { record, year: Number(match[1]) } : null;
    })
    .filter((item): item is { record: ArchiveRecord; year: number } => item !== null)
    .sort((a, b) => a.year - b.year || archiveRecordTitle(a.record).localeCompare(archiveRecordTitle(b.record)));

  const researchLinks = [
    ["/search", "Search", "Cross-collection search with collection and evidence filters."],
    ["/sources", "Bibliography", "Normalized source identities and their captured citation trail."],
    ["/sources-explorer", "Source Explorer", "Select a source and inspect every record that cites it."],
    ["/provenance", "Claim provenance", "Audit claim IDs, locators and editorial review coverage."],
    ["/graph", "Knowledge graph", "Explore explicit record-to-record relationships."],
    ["/atlas", "Cultural atlas", "Open the source-backed geographic view."],
    ["/api/archive", "JSON API", "Machine-readable published records and relationships."],
    ["/api/search", "API search", "A small query endpoint for research tools and scripts."],
    ["/about", "Methods", "Editorial boundaries, migration rules and provenance notes."],
    ["/stats", "Archive status", "Live corpus and evidence-status counts."],
    ["/", "Archive home", "Return to the public reading experience."],
  ] as const;

  return (
    <>
      <PageHeader eyebrow="Public research & data" title="Research & Data" titleMai="अनुसंधान आ डेटा" intro="Use the archive as a source-oriented research dataset: browse canonical records, inspect provenance, follow relationships, search across scripts and download the current published record set." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            ["Records", stats.records],
            ["Sources", stats.sources],
            ["Bibliography", stats.bibliographicSources],
            ["Provenance", stats.provenanceAssertions],
            ["Media", stats.media],
            ["Relations", stats.relations],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-sm border border-border bg-secondary/50 p-5">
              <p className="label-eyebrow text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <EntryCard>
            <p className="label-eyebrow text-terracotta">Current public release</p>
            <h2 className="mt-3 text-2xl text-foreground">Archive release {ARCHIVE_RELEASE}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Snapshot date: {ARCHIVE_RELEASE_DATE}. Release identifiers describe the published software/data snapshot; they do not imply that every cultural claim is permanently verified.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/api/archive?format=csv" className="inline-flex items-center rounded-sm bg-terracotta px-4 py-2.5 font-sans text-sm text-primary-foreground hover:opacity-90">Download CSV</a>
              <a href="/api/archive?format=json" className="inline-flex items-center rounded-sm border border-border px-4 py-2.5 font-sans text-sm text-foreground hover:border-gold">Download JSON</a>
              <a href="/api/archive?format=research-json" className="inline-flex items-center rounded-sm border border-border px-4 py-2.5 font-sans text-sm text-foreground hover:border-gold">Download research JSON</a>
            </div>
          </EntryCard>
          <div className="rounded-sm border border-border bg-secondary/40 p-6">
            <p className="label-eyebrow text-muted-foreground">Download contract</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">JSON</strong> — downloadable snapshot of complete published records and explicit relations.</li>
              <li><strong className="text-foreground">Research JSON</strong> — downloadable versioned research dataset envelope with current counts.</li>
              <li><strong className="text-foreground">CSV</strong> — one row per published record; nested content remains JSON in the final column.</li>
              <li><strong className="text-foreground">Stable IDs</strong> — record identifiers and slugs are preserved across exports.</li>
              <li><strong className="text-foreground">Release metadata</strong> — <a href="/release.json" className="text-terracotta hover:underline">machine-readable release manifest</a> records the dataset snapshot and schema versions.</li>
            </ul>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          API responses are read-only projections of the canonical Git dataset. Inspect each record's verificationStatus and provenance before using it as evidence. Third-party text, images and recordings retain their original rights and attribution.
        </p>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Research surfaces" title="Explore the archive as data" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {researchLinks.map(([href, title, description]) => (
            <Link key={href} to={href}><EntryCard className="h-full hover:border-gold"><h2 className="text-xl">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></EntryCard></Link>
          ))}
        </div>
      </Section>
      <Section className="pt-0">
        <SectionTitle eyebrow="Chronology" title="Recorded chronology" />
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This timeline only uses explicit four-digit years already present in record metadata. It does not infer dates from prose or manufacture precision where the archive has none.
        </p>
        <ol className="grid gap-3 md:grid-cols-2">
          {chronology.map(({ record, year }) => (
            <li key={record.id}>
              <Link
                to="/archive/$type/$slug"
                params={{ type: record.type, slug: record.slug }}
                className="flex gap-4 rounded-sm border border-border bg-secondary/40 p-4 transition-colors hover:border-gold"
              >
                <span className="font-sans text-sm text-terracotta">{year}</span>
                <span className="text-foreground">{archiveRecordTitle(record)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="pt-0">
        <SectionTitle eyebrow="Coverage" title="What is in the corpus" />
        <ul className="grid gap-3 md:grid-cols-2">
          {facets.types.map((facet) => <li key={facet.value} className="flex justify-between border-b border-border py-3"><span>{facet.label}</span><span className="font-sans text-sm text-muted-foreground">{facet.count}</span></li>)}
        </ul>
      </Section>
    </>
  );
}
