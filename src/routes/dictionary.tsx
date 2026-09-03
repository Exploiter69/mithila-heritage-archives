import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  FilterBar,
  PageHeader,
  Section,
  SearchField,
  SourceNote,
} from "@/components/archive-ui";
import { dictionary } from "@/data/archive";

const TITLE = "Maithili Dictionary — Mithila Digital Archive";
const DESC =
  "A growing Maithili lexicon: headwords in Devanagari with transliteration, part of speech, gloss, attested usage and source for each entry.";

export const Route = createFileRoute("/dictionary")({
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
  component: DictionaryPage,
});

function DictionaryPage() {
  const [q, setQ] = useState("");
  const [reg, setReg] = useState("All registers");

  const registers = useMemo(
    () => ["All registers", ...Array.from(new Set(dictionary.map((d) => d.register)))],
    [],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return dictionary
      .filter((d) => {
        const matchesReg = reg === "All registers" || d.register === reg;
        const matchesQ =
          !needle ||
          [d.headword, d.transliteration, d.gloss, d.usage, d.usageGloss]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        return matchesReg && matchesQ;
      })
      .sort((a, b) => a.transliteration.localeCompare(b.transliteration));
  }, [q, reg]);

  return (
    <>
      <PageHeader
        eyebrow="Collection 04"
        title="Dictionary"
        titleMai="शब्दकोश"
        intro="Headwords are given in Devanagari with a Latin transliteration, a gloss, and a sentence in which the word is actually used. Search matches script, transliteration and English gloss alike."
      />

      <Section>
        <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <SearchField
            id="dict-search"
            label="Search the lexicon"
            value={q}
            onChange={setQ}
            placeholder="gām, गाम, village…"
          />
          <FilterBar
            label="Filter by register"
            options={registers}
            active={reg}
            onSelect={setReg}
          />
        </div>

        <p className="label-eyebrow mb-6 text-muted-foreground">
          {results.length} {results.length === 1 ? "entry" : "entries"}
        </p>

        <dl className="divide-y divide-border border-y border-border">
          {results.map((d) => (
            <div
              key={d.transliteration}
              className="grid gap-4 py-7 md:grid-cols-[minmax(0,14rem)_1fr]"
            >
              <dt>
                <span className="deva block text-2xl text-foreground">{d.headword}</span>
                <span className="mt-1 block font-sans text-sm tracking-wide text-muted-foreground">
                  {d.transliteration}
                </span>
                <span className="mt-2 inline-block rounded-sm bg-secondary px-2 py-0.5 font-sans text-xs text-muted-foreground italic">
                  {d.pos} · {d.register}
                </span>
              </dt>
              <dd>
                <p className="text-lg leading-relaxed text-foreground">{d.gloss}</p>
                <div className="mt-4 border-l-2 border-gold pl-4">
                  <p className="deva text-lg text-foreground/90">{d.usage}</p>
                  <p className="mt-1 text-sm text-muted-foreground italic">{d.usageGloss}</p>
                </div>
                <SourceNote source={d.source} />
              </dd>
            </div>
          ))}
        </dl>

        {results.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No entry for that yet. v0.1 seeds the lexicon with a small, fully
            sourced set rather than a large unsourced one.
          </p>
        )}
      </Section>
    </>
  );
}
