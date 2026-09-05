import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { EntryCard, PageHeader, Section, SourceNote } from "@/components/archive-ui";
import { FilterBar } from "@/components/archive-ui";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { literatureFilters } from "@/data/literature";
import { getArchiveContent, type LiteraryWork } from "@/data/archive-read";

const TITLE = "Maithili Literature — Mithila Digital Archive";
const DESC =
  "Vidyāpati's padāvalī, the Varṇa Ratnākara and modern Maithili prose — poetry, story and classical texts with translation, author notes and sources.";

export const Route = createFileRoute("/literature")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LiteraturePage,
});

function LiteraturePage() {
  const [form, setForm] = useState<string>("All");
  const [reading, setReading] = useState<LiteraryWork | null>(null);
  const [size, setSize] = useState(1.25); // rem

  const literaryWorks = getArchiveContent<LiteraryWork>("literature-work");
  const results = literaryWorks.filter((w) => form === "All" || w.form === form);

  return (
    <>
      <PageHeader
        eyebrow="Collection — साहित्य"
        title="Literature"
        titleMai="मैथिली साहित्य"
        intro="Maithili's written record begins in the fourteenth century and has not stopped since. Open any entry to read it in a quiet, resizable page with its translation alongside."
      />

      <Section>
        <div className="mb-10 border-b border-border pb-8">
          <FilterBar
            label="Filter by form"
            options={literatureFilters as unknown as string[]}
            active={form}
            onSelect={setForm}
          />
        </div>

        <ul className="grid gap-6 lg:grid-cols-2">
          {results.map((w) => (
            <li key={w.slug} id={w.slug} className="scroll-mt-24">
              <EntryCard className="h-full">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="deva text-2xl leading-snug text-foreground">{w.titleDeva}</h2>
                  <span className="label-eyebrow text-terracotta">{w.form}</span>
                </div>
                <p className="mt-1 font-sans text-sm tracking-wide text-muted-foreground italic">
                  {w.transliteration}
                </p>

                <p className="mt-4 font-sans text-sm text-foreground/85">
                  {w.author} · <span className="deva">{w.authorDeva}</span>
                </p>
                <p className="font-sans text-xs text-muted-foreground">{w.era}</p>

                <p className="deva mt-5 line-clamp-2 text-lg whitespace-pre-line text-muted-foreground">
                  {w.snippet}
                </p>

                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => setReading(w)}
                    className="mt-6 inline-flex items-center rounded-sm border border-terracotta px-3 py-1.5 font-sans text-xs tracking-wide text-terracotta uppercase transition-colors hover:bg-terracotta hover:text-primary-foreground"
                  >
                    Read
                  </button>
                  <SourceNote source={w.source} />
                </div>
              </EntryCard>
            </li>
          ))}
        </ul>
      </Section>

      <Dialog open={!!reading} onOpenChange={(o) => !o && setReading(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto bg-card p-0 sm:w-full">
          {reading && (
            <div>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-5 py-3 backdrop-blur-sm md:px-8">
                <DialogTitle className="deva truncate text-base font-normal text-foreground">
                  {reading.titleDeva}
                </DialogTitle>
                <div className="flex shrink-0 items-center gap-1 pr-6">
                  <button
                    type="button"
                    aria-label="Decrease text size"
                    onClick={() => setSize((s) => Math.max(1, +(s - 0.125).toFixed(3)))}
                    className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground hover:border-gold hover:text-foreground"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="label-eyebrow px-1 text-muted-foreground">A</span>
                  <button
                    type="button"
                    aria-label="Increase text size"
                    onClick={() => setSize((s) => Math.min(2.25, +(s + 0.125).toFixed(3)))}
                    className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground hover:border-gold hover:text-foreground"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <article className="px-5 py-8 md:px-12 md:py-12">
                <p className="label-eyebrow text-terracotta">{reading.form}</p>
                <h2 className="deva mt-3 text-3xl leading-snug text-foreground">
                  {reading.titleDeva}
                </h2>
                <p className="mt-2 font-sans text-sm text-muted-foreground italic">
                  {reading.transliteration} · {reading.era}
                </p>

                <div className="mt-9 space-y-9">
                  {reading.body.map((b, i) => (
                    <div key={i}>
                      <p
                        className="deva whitespace-pre-line text-foreground"
                        style={{ fontSize: `${size}rem`, lineHeight: 2.05 }}
                      >
                        {b.deva}
                      </p>
                      {b.translit && (
                        <p className="mt-3 font-sans text-sm tracking-wide text-muted-foreground/90 italic">
                          {b.translit}
                        </p>
                      )}
                      <p className="mt-3 border-l-2 border-gold pl-4 leading-relaxed text-muted-foreground">
                        {b.translation}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-10 leading-relaxed text-muted-foreground">{reading.note}</p>

                <div className="mt-8 rounded-sm border border-border bg-secondary/60 p-5">
                  <p className="label-eyebrow text-terracotta">Author</p>
                  <p className="mt-2 text-lg text-foreground">
                    {reading.author} · <span className="deva">{reading.authorDeva}</span>
                  </p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {reading.authorBio}
                  </p>
                </div>

                <SourceNote source={reading.source} />
              </article>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
