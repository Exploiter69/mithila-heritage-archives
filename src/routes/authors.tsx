import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  EntryCard,
  MetaRow,
  PageHeader,
  Section,
  SearchField,
  SourceNote,
} from "@/components/archive-ui";
import { authors } from "@/data/archive";

const TITLE = "Maithili Authors — Mithila Digital Archive";
const DESC =
  "Biographical records for Maithili writers from Jyotirīśvara and Vidyāpati to Yātrī and Lilī Rāy, with dates, works and cited sources.";

export const Route = createFileRoute("/authors")({
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
  component: AuthorsPage,
});

function AuthorsPage() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return authors;
    return authors.filter((a) =>
      [a.name, a.nameMai, a.place, a.role, a.bio, a.works.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  return (
    <>
      <PageHeader
        eyebrow="Collection 02"
        title="Authors"
        titleMai="रचनाकार"
        intro="Short biographical records. Dates for pre-modern figures are reconstructed from patron chronology and are marked approximate where they are."
      />

      <Section>
        <div className="mb-10 border-b border-border pb-8">
          <SearchField
            id="author-search"
            label="Search names, places, works"
            value={q}
            onChange={setQ}
            placeholder="Darbhanga, Sahitya Akademi, Padāvalī…"
          />
        </div>

        <ol className="space-y-6">
          {results.map((a) => (
            <li key={a.slug} id={a.slug}>
              <EntryCard>
                <div className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
                  <div>
                    <h2 className="text-2xl leading-tight tracking-tight text-foreground">
                      {a.name}
                    </h2>
                    <p className="deva mt-1 text-lg text-terracotta">{a.nameMai}</p>
                    <MetaRow
                      items={[
                        ["Dates", a.lifespan],
                        ["Place", a.place],
                        ["Role", a.role],
                      ]}
                    />
                  </div>
                  <div>
                    <p className="leading-relaxed text-muted-foreground">{a.bio}</p>
                    <p className="label-eyebrow mt-5 text-muted-foreground">
                      Principal works
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {a.works.map((w) => (
                        <li
                          key={w}
                          className="rounded-sm border border-border px-2.5 py-1 font-sans text-xs text-foreground/85"
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                    <SourceNote source={a.source} />
                  </div>
                </div>
              </EntryCard>
            </li>
          ))}
        </ol>

        {results.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No author records match that query.{" "}
            <Link to="/about" className="text-terracotta hover:underline">
              See what the archive covers
            </Link>
            .
          </p>
        )}
      </Section>
    </>
  );
}
