import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EntryCard, PageHeader, Section } from "@/components/archive-ui";
import { searchArchiveAdvanced, getResearchFacets, TYPE_LABELS } from "@/data/archive-platform";
import type { ArchiveRecordType, VerificationStatus } from "@/data/types";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search the Mithila Digital Archive" },
      { name: "description", content: "Search literature, authors, language, music, art and heritage across the canonical Mithila archive." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q);
  const [type, setType] = useState<ArchiveRecordType | "all">("all");
  const [status, setStatus] = useState<VerificationStatus | "all">("all");
  const facets = getResearchFacets();
  const results = useMemo(() => searchArchiveAdvanced(query, {
    types: type === "all" ? undefined : [type],
    statuses: status === "all" ? undefined : [status],
    limit: 50,
  }), [query, type, status]);

  return (
    <>
      <PageHeader eyebrow="Research tool" title="Search" titleMai="खोज" intro="Search the canonical archive by Devanagari, transliteration, English glosses, metadata and source text. Filters narrow the published research set without changing the underlying records." />
      <Section>
        <div className="grid gap-4 rounded-sm border border-border bg-secondary/50 p-5 md:grid-cols-[1fr_auto_auto]">
          <label className="font-sans text-sm">
            <span className="label-eyebrow block text-muted-foreground">Query</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="विद्यापति, Vidyapati, Chhath..." className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="font-sans text-sm">
            <span className="label-eyebrow block text-muted-foreground">Collection</span>
            <select value={type} onChange={(e) => setType(e.target.value as ArchiveRecordType | "all")} className="mt-2 rounded-sm border border-input bg-background px-3 py-2">
              <option value="all">All collections</option>
              {facets.types.map((facet) => <option key={facet.value} value={facet.value}>{facet.label} ({facet.count})</option>)}
            </select>
          </label>
          <label className="font-sans text-sm">
            <span className="label-eyebrow block text-muted-foreground">Evidence status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as VerificationStatus | "all")} className="mt-2 rounded-sm border border-input bg-background px-3 py-2">
              <option value="all">All statuses</option>
              {facets.statuses.map((facet) => <option key={facet.value} value={facet.value}>{facet.label} ({facet.count})</option>)}
            </select>
          </label>
        </div>
        <p className="mt-6 font-sans text-sm text-muted-foreground">{query.trim() ? `\${results.length} result\${results.length === 1 ? "" : "s"}` : "Enter a query to search."}</p>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {results.map((hit) => (
            <li key={hit.record.id}>
              <Link to={hit.url}>
                <EntryCard className="h-full transition-colors hover:border-gold">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="label-eyebrow text-terracotta">{TYPE_LABELS[hit.record.type]}</p>
                      <h2 className="deva mt-2 text-xl text-foreground">{hit.title}</h2>
                    </div>
                    <span className="font-sans text-xs text-muted-foreground">{hit.record.verificationStatus}</span>
                  </div>
                  {hit.secondary && <p className="mt-3 text-sm text-muted-foreground">{hit.secondary}</p>}
                </EntryCard>
              </Link>
            </li>
          ))}
        </ul>
        {query.trim() && results.length === 0 && <p className="py-12 text-center text-muted-foreground">No published record matches that query.</p>}
      </Section>
    </>
  );
}
