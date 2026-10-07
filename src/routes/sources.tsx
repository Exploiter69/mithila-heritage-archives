import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EntryCard, PageHeader, Section } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";

export const Route = createFileRoute("/sources")({
  head: () => ({ meta: [
    { title: "Sources & Bibliography — Mithila Digital Archive" },
    { name: "description", content: "Browse normalized bibliographic sources, source captures and provenance coverage in the Mithila Digital Archive." },
  ]}),
  component: SourcesPage,
});

function SourcesPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const sources = useMemo(() => canonicalArchive.bibliographicSources
    .filter((source) => kind === "all" || source.sourceType === kind)
    .filter((source) => `${source.citation} ${source.detail ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.citation.localeCompare(b.citation)), [query, kind]);

  return (
    <>
      <PageHeader eyebrow="Research infrastructure" title="Sources & bibliography" titleMai="स्रोत" intro="A normalized view of the archive's bibliographic identities. Repeated source captures remain traceable to their original records; missing metadata is shown as a gap rather than silently filled." />
      <Section>
        <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row">
          <input aria-label="Search sources" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search citations..." className="min-w-0 flex-1 rounded-sm border border-input bg-background px-3 py-2" />
          <select aria-label="Filter source type" value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-sm border border-input bg-background px-3 py-2">
            <option value="all">All source types</option>
            <option value="book">Book</option><option value="article">Article</option><option value="website">Website</option><option value="archive">Archive</option><option value="community">Community</option><option value="unclassified">Unclassified</option>
          </select>
        </div>
        <p className="mt-6 font-sans text-sm text-muted-foreground">{sources.length} normalized sources</p>
        <ol className="mt-5 space-y-4">
          {sources.map((source) => (
            <li key={source.id}>
              <EntryCard>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="max-w-3xl text-lg text-foreground">{source.citation}</h2>
                  <span className="label-eyebrow text-muted-foreground">{source.sourceType}</span>
                </div>
                {source.detail && <p className="mt-2 text-sm text-muted-foreground">{source.detail}</p>}
                <p className="mt-3 font-sans text-xs text-muted-foreground">Source captures: {source.captureIds.length}</p>
                {source.url && <a className="mt-3 inline-block text-sm text-terracotta hover:underline" href={source.url} target="_blank" rel="noopener noreferrer">Open source</a>}
                <div className="mt-4">
                  <p className="label-eyebrow text-muted-foreground">Used by</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {canonicalArchive.records
                      .filter((record) => record.sourceIds.some((captureId) => source.captureIds.includes(captureId)))
                      .map((record) => (
                        <li key={record.id}>
                          <a href={`/archive/${record.type}/${record.slug}`} className="text-xs text-terracotta hover:underline">
                            {record.slug}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Identity: {source.id}</p>
              </EntryCard>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
