import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Section } from "@/components/archive-ui";
import { MITHILA_TIMELINE, getCorpusTimelineEvents, recordBySlug } from "@/data/archive-experience";

export const Route = createFileRoute("/timeline")({
  head: () => ({ meta: [{ title: "Mithila Timeline — Mithila Digital Archive" }] }),
  component: TimelinePage,
});

function TimelinePage() {
  const [mode, setMode] = useState<"orientation" | "corpus">("orientation");
  const corpus = useMemo(() => getCorpusTimelineEvents(), []);
  const events = mode === "orientation" ? MITHILA_TIMELINE : corpus;

  return (
    <>
      <PageHeader eyebrow="Chronology" title="Mithila Timeline" titleMai="मिथिला समयरेखा" intro="A cautious cultural chronology. Orientation dates are editorial anchors; the corpus view uses only years explicitly present in structured archive records and labels their precision." />
      <Section>
        <div className="mb-8 flex flex-wrap gap-2">
          <button type="button" aria-pressed={mode === "orientation"} onClick={() => setMode("orientation")} className={"rounded-sm border px-3 py-2 text-sm " + (mode === "orientation" ? "border-terracotta text-terracotta" : "border-border")}>Curated orientation</button>
          <button type="button" aria-pressed={mode === "corpus"} onClick={() => setMode("corpus")} className={"rounded-sm border px-3 py-2 text-sm " + (mode === "corpus" ? "border-terracotta text-terracotta" : "border-border")}>Structured corpus ({corpus.length})</button>
        </div>
        <ol className="relative ml-3 space-y-8 border-l border-border pl-7">
          {events.map((event, index) => {
            const record = event.slug ? recordBySlug(event.slug) : undefined;
            return (
              <li key={mode + "/" + (event.slug ?? event.label) + "/" + index} className="relative">
                <span className="absolute -left-[2.05rem] top-1.5 size-3 rounded-full border-2 border-background bg-terracotta" />
                <p className="label-eyebrow text-terracotta">{event.year}</p>
                <h2 className="mt-1 text-xl">{record ? <Link to="/archive/$type/$slug" params={{ type: record.type, slug: record.slug }} className="hover:text-terracotta">{event.label}</Link> : event.label}</h2>
                <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">{event.description}</p>
                {"status" in event && event.status && <p className="mt-2 text-xs text-muted-foreground">{event.status}</p>}
              </li>
            );
          })}
        </ol>
        {events.length === 0 && <p className="text-sm text-muted-foreground">No structured chronological anchors are currently available.</p>}
      </Section>
    </>
  );
}
