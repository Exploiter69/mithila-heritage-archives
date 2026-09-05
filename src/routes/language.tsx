import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  FilterBar,
  PageHeader,
  Section,
  SearchField,
  SourceNote,
} from "@/components/archive-ui";
import { wordClasses } from "@/data/dictionary";
import { getArchiveContent, type DictionaryEntry } from "@/data/archive-read";

const TITLE = "Maithili Dictionary & Language — Mithila Digital Archive";
const DESC =
  "A live Maithili dictionary: search in Devanagari or Latin — ओसार / Osaar — with phonetics, Hindi and English senses, examples and sources.";

export const Route = createFileRoute("/language")({
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
  component: LanguagePage,
});

function LanguagePage() {
  const [q, setQ] = useState("");
  const dictionaryEntries = getArchiveContent<DictionaryEntry>("dictionary-entry");
  const [cls, setCls] = useState<string>("All");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return dictionaryEntries.filter((d) => {
      const matchesCls = cls === "All" || d.wordClass === cls;
      const hay = [
        d.headword,
        d.transliteration,
        d.phonetic,
        d.hindi,
        d.english,
        ...d.examples.flatMap((e) => [e.deva, e.translit, e.english]),
      ]
        .join(" ")
        .toLowerCase();
      return matchesCls && (!needle || hay.includes(needle));
    });
  }, [q, cls]);

  return (
    <>
      <PageHeader
        eyebrow="Collection — भाषा"
        title="Language & Dictionary"
        titleMai="मैथिली भाषा आ शब्दकोश"
        intro="Maithili is written in Devanagari today and in Tirhutā historically. Search the lexicon in either script — type ओसार or Osaar — and the list narrows as you type."
      />

      <Section>
        <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <SearchField
            id="lex-search"
            label="Search the lexicon"
            value={q}
            onChange={setQ}
            placeholder="ओसार, Osaar, verandah…"
          />
          <FilterBar
            label="Filter by word class"
            options={wordClasses as unknown as string[]}
            active={cls}
            onSelect={setCls}
          />
        </div>

        <p className="label-eyebrow mb-6 text-muted-foreground">
          {results.length} {results.length === 1 ? "entry" : "entries"}
        </p>

        <ul className="grid gap-6 lg:grid-cols-2">
          {results.map((d) => (
            <li key={d.slug} id={d.slug} className="scroll-mt-24">
              <article className="flex h-full flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-gold">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="deva text-3xl leading-snug text-foreground">{d.headword}</h2>
                  <span className="label-eyebrow text-terracotta">{d.wordClass}</span>
                </div>
                <p className="mt-1 font-sans text-sm tracking-wide text-muted-foreground">
                  {d.transliteration} · {d.phonetic}
                </p>

                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                  <dt className="label-eyebrow pt-1 text-muted-foreground">हिन्दी</dt>
                  <dd className="deva text-lg text-foreground/90">{d.hindi}</dd>
                  <dt className="label-eyebrow pt-1 text-muted-foreground">English</dt>
                  <dd className="leading-relaxed text-foreground/90">{d.english}</dd>
                </dl>

                <div className="mt-5 space-y-3">
                  {d.examples.map((e) => (
                    <div key={e.deva} className="border-l-2 border-gold pl-4">
                      <p className="deva text-lg text-foreground">{e.deva}</p>
                      <p className="font-sans text-xs text-muted-foreground italic">{e.translit}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{e.english}</p>
                    </div>
                  ))}
                </div>

                {d.note && (
                  <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground italic">
                    {d.note}
                  </p>
                )}

                <div className="mt-auto">
                  <SourceNote source={d.source} />
                </div>
              </article>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No entry for that yet. v0.1 seeds the lexicon with a small, fully
            sourced set rather than a large unsourced one.
          </p>
        )}

        <p className="mt-12 font-sans text-sm text-muted-foreground">
          Proverbs are collected separately in{" "}
          <Link to="/proverbs" className="text-terracotta hover:underline">
            Proverbs
          </Link>
          , and editorial method is set out in{" "}
          <Link to="/about" className="text-terracotta hover:underline">
            About & Sources
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
