import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ChangeEvent } from "react";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { getArchiveContent } from "@/data/archive-read";
import type { DictionaryEntry } from "@/data/dictionary";

export const Route = createFileRoute("/language-lab")({
  head: () => ({
    meta: [{ title: "Maithili Language Lab — Mithila Digital Archive" }],
  }),
  component: LanguageLabPage,
});

type LanguageLabClass = "All" | DictionaryEntry["wordClass"];

function LanguageLabPage() {
  const all = getArchiveContent<DictionaryEntry>("dictionary-entry");
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<LanguageLabClass>("All");

  const classes: LanguageLabClass[] = [
    "All",
    ...Array.from(new Set(all.map((entry) => entry.wordClass))),
  ];

  const results = useMemo(
    () =>
      all.filter(
        (entry) =>
          (cls === "All" || entry.wordClass === cls) &&
          [entry.headword, entry.transliteration, entry.hindi, entry.english]
            .join(" ")
            .toLocaleLowerCase()
            .includes(q.toLocaleLowerCase()),
      ),
    [all, q, cls],
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQ(event.currentTarget.value);
  };

  const handleClassChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCls(event.currentTarget.value as LanguageLabClass);
  };

  return (
    <>
      <PageHeader
        eyebrow="Language research"
        title="Maithili Language Lab"
        titleMai="मैथिली भाषा प्रयोगशाला"
        intro="Browse lexical records with Devanagari, transliteration, pronunciation, part of speech, examples and source status. Research seeds remain visibly marked as needs-review."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            aria-label="Search dictionary"
            value={q}
            onChange={handleSearchChange}
            placeholder="घर / ghar / house…"
            className="rounded-sm border border-input bg-background px-3 py-2"
          />
          <select
            aria-label="Filter word class"
            value={cls}
            onChange={handleClassChange}
            className="rounded-sm border border-input bg-background px-3 py-2"
          >
            {classes.map((wordClass) => (
              <option key={wordClass} value={wordClass}>
                {wordClass}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          {results.length} lexical records
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {results.slice(0, 100).map((word) => (
            <EntryCard key={word.slug}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="deva text-2xl">{word.headword}</h2>
                  <p className="mt-1 text-sm italic text-muted-foreground">
                    {word.transliteration} · {word.phonetic}
                  </p>
                </div>
                <span className="label-eyebrow text-terracotta">
                  {word.wordClass}
                </span>
              </div>
              <p className="mt-4 text-sm">{word.hindi}</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">
                {word.english}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Evidence: {word.source.status}
              </p>
            </EntryCard>
          ))}
        </div>
      </Section>
    </>
  );
}
