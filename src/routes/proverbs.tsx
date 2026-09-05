import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  EntryCard,
  FilterBar,
  PageHeader,
  Section,
  SearchField,
  SourceNote,
} from "@/components/archive-ui";
import { getArchiveContent, type Proverb } from "@/data/archive-read";

const TITLE = "Maithili Proverbs (Lokokti) — Mithila Digital Archive";
const DESC =
  "Maithili lokokti with Devanagari text, transliteration, literal translation and idiomatic meaning, each with its attestation.";

export const Route = createFileRoute("/proverbs")({
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
  component: ProverbsPage,
});

function ProverbsPage() {
  const [q, setQ] = useState("");
  const proverbs = getArchiveContent<Proverb>("proverb");
  const [theme, setTheme] = useState("All themes");

  const themes = useMemo(
    () => ["All themes", ...Array.from(new Set(proverbs.map((p) => p.theme)))],
    [],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return proverbs.filter((p) => {
      const matchesTheme = theme === "All themes" || p.theme === theme;
      const matchesQ =
        !needle ||
        [p.text, p.transliteration, p.literal, p.meaning]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesTheme && matchesQ;
    });
  }, [q, theme]);

  return (
    <>
      <PageHeader
        eyebrow="Collection 05"
        title="Proverbs"
        titleMai="लोकोक्ति"
        intro="Lokokti are the compressed argument of a speech community. Each is given literally first, then in the sense it actually carries — the two are often some distance apart."
      />

      <Section>
        <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <SearchField
            id="prov-search"
            label="Search proverbs"
            value={q}
            onChange={setQ}
            placeholder="rain, field, kinship…"
          />
          <FilterBar label="Filter by theme" options={themes} active={theme} onSelect={setTheme} />
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {results.map((p) => (
            <li key={p.transliteration}>
              <EntryCard className="h-full">
                <span className="label-eyebrow text-terracotta">{p.theme}</span>
                <p className="deva mt-3 text-2xl leading-relaxed text-foreground">{p.text}</p>
                <p className="mt-2 font-sans text-sm tracking-wide text-muted-foreground">
                  {p.transliteration}
                </p>
                <div className="mt-5 space-y-3">
                  <div>
                    <p className="label-eyebrow text-muted-foreground">Literal</p>
                    <p className="mt-1 leading-relaxed text-foreground/85 italic">{p.literal}</p>
                  </div>
                  <div>
                    <p className="label-eyebrow text-muted-foreground">Sense</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{p.meaning}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <SourceNote source={p.source} />
                </div>
              </EntryCard>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No proverbs match that query.</p>
        )}
      </Section>
    </>
  );
}
