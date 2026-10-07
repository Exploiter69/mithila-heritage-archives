import { createFileRoute, Link } from "@tanstack/react-router";
import { EntryCard, PageHeader, Section, SectionTitle } from "@/components/archive-ui";
import { getArchiveStats, getResearchFacets } from "@/data/archive-platform";
import { getArchiveRecords } from "@/data/archive-read";
import { archiveRecordTitle } from "@/components/archive-record-page";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [
    { title: "Research Portal — Mithila Digital Archive" },
    { name: "description", content: "Research-oriented entry point to the Mithila Digital Archive: data, sources, relationships, search and public API." },
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
    .filter((item): item is { record: (typeof getArchiveRecords())[number]; year: number } => item !== null)
    .sort((a, b) => a.year - b.year || archiveRecordTitle(a.record).localeCompare(archiveRecordTitle(b.record)));

  const researchLinks = [
    ["/search", "Search", "Cross-collection search with collection and evidence filters."],
    ["/sources", "Bibliography", "Normalized source identities and their captured citation trail."],
    ["/api/archive", "JSON API", "Machine-readable published records and relationships."],
    ["/api/search", "API search", "A small query endpoint for research tools and scripts."],
    ["/about", "Methods", "Editorial boundaries, migration rules and provenance notes."],
    ["/", "Archive home", "Return to the public reading experience."],
  ] as const;

  return (
    <>
      <PageHeader eyebrow="Public research portal" title="Research" titleMai="अनुसंधान" intro="Use the archive as a source-oriented research dataset: browse canonical records, inspect provenance, follow relationships, search across scripts and consume stable JSON endpoints." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[["Records", stats.records], ["Sources", stats.sources], ["Bibliography", stats.bibliographicSources], ["Media", stats.media], ["Relations", stats.relations]].map(([label, value]) => (
            <div key={String(label)} className="rounded-sm border border-border bg-secondary/50 p-5">
              <p className="label-eyebrow text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl text-foreground">{value}</p>
            </div>
          ))}
        </div>
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
