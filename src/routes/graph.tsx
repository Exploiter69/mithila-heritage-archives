import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EntryCard, PageHeader, Section } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";
import { graphNeighbors, titleFor } from "@/data/archive-experience";
import { findShortestRecordPath } from "@/data/research-infrastructure";
import { archiveRecordTitle } from "@/components/archive-record-page";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [
    { title: "Knowledge Graph Explorer — Mithila Digital Archive" },
    { name: "description", content: "Explore explicit, source-backed relationships between Mithila archive records." },
  ]}),
  component: GraphPage,
});

function GraphPage() {
  const [slug, setSlug] = useState("vidyapati");
  const [targetSlug, setTargetSlug] = useState("");
  const records = canonicalArchive.records;
  const selected = records.find((r) => r.slug === slug) ?? records[0];
  const neighbors = useMemo(() => selected ? graphNeighbors(selected) : [], [selected]);
  const target = records.find((r) => r.slug === targetSlug);
  const paths = useMemo(() => selected && target ? findShortestRecordPath(selected.id, target.id) : [], [selected, target]);

  return (
    <>
      <PageHeader eyebrow="Knowledge graph" title="Knowledge Graph Explorer" titleMai="सम्बन्धक जाल" intro="Explore one record at a time. Every edge shown here is an explicit archive assertion; no relationship is inferred from keyword similarity." />
      <Section>
        <label className="block max-w-2xl font-sans text-sm">
          <span className="label-eyebrow text-muted-foreground">Choose a record</span>
          <select value={selected?.slug ?? ""} onChange={(e) => setSlug(e.target.value)} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2">
            {records.filter((r) => r.relationIds.length > 0).map((r) => <option key={r.id} value={r.slug}>{titleFor(r)} — {r.type}</option>)}
          </select>
        </label>
        {selected && <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <EntryCard>
            <p className="label-eyebrow text-terracotta">{selected.type}</p>
            <h2 className="mt-2 text-2xl">{archiveRecordTitle(selected)}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Record ID: {selected.id}</p>
            <Link to="/archive/$type/$slug" params={{ type: selected.type, slug: selected.slug }} className="mt-5 inline-block text-sm text-terracotta hover:underline">Open record →</Link>
          </EntryCard>
          <div className="relative rounded-sm border border-border bg-secondary/20 p-6">
            <div className="flex min-h-72 flex-col items-center justify-center gap-4">
              <Link to="/archive/$type/$slug" params={{ type: selected.type, slug: selected.slug }} className="rounded-full border-2 border-terracotta bg-background px-5 py-4 text-center shadow-sm hover:bg-secondary">
                <span className="block text-lg">{archiveRecordTitle(selected)}</span>
                <span className="label-eyebrow text-muted-foreground">central record</span>
              </Link>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {neighbors.map(({ relation, target, typeLabel }) => (
                  <Link key={relation.id} to="/archive/$type/$slug" params={{ type: target.type, slug: target.slug }} className="rounded-sm border border-border bg-background p-4 hover:border-gold">
                    <span className="label-eyebrow text-terracotta">{relation.predicate} · {typeLabel}</span>
                    <span className="mt-2 block text-base">{archiveRecordTitle(target)}</span>
                  </Link>
                ))}
              </div>
              {neighbors.length === 0 && <p className="text-sm text-muted-foreground">No explicit relationships are currently asserted for this record.</p>}
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-sm border border-border p-6">
          <h2 className="text-xl">Shortest documented paths</h2>
          <p className="mt-2 text-sm text-muted-foreground">Paths use only explicit archive relations and treat them as navigable edges. The archive does not infer a path from keywords.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm"><span className="label-eyebrow text-muted-foreground">From</span><select value={selected?.slug ?? ""} onChange={(e) => setSlug(e.target.value)} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2">{records.map((r) => <option key={r.id} value={r.slug}>{titleFor(r)}</option>)}</select></label>
            <label className="text-sm"><span className="label-eyebrow text-muted-foreground">To</span><select value={targetSlug} onChange={(e) => setTargetSlug(e.target.value)} className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2"><option value="">Choose target</option>{records.map((r) => <option key={r.id} value={r.slug}>{titleFor(r)}</option>)}</select></label>
          </div>
          {target && <div className="mt-5 space-y-3">{paths.length === 0 ? <p className="text-sm text-muted-foreground">No documented path exists between these records.</p> : paths.map((path, pathIndex) => <ol key={path.map((r) => r.id).join("/")} className="flex flex-wrap items-center gap-2 text-sm" aria-label={\`Shortest path \${pathIndex + 1}\`}>{path.map((r, nodeIndex) => <li key={r.id} className="flex items-center gap-2"><Link to="/archive/$type/$slug" params={{ type: r.type, slug: r.slug }} className="rounded-sm border border-border px-3 py-1.5 hover:border-gold">{archiveRecordTitle(r)}</Link>{nodeIndex < path.length - 1 && <span aria-hidden="true">→</span>}</li>)}</ol>)}</div>}
        </div>
            </div>
          </div>
        </div>}
        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">The visual layout is an accessible graph view: every node is a normal keyboard-focusable link, and the relationship list remains usable without a canvas or client-side graph engine.</p>
      </Section>
    </>
  );
}
