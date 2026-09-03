import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  EntryCard,
  FilterBar,
  MetaRow,
  PageHeader,
  Section,
  SearchField,
  SourceNote,
} from "@/components/archive-ui";
import { literature } from "@/data/archive";

const TITLE = "Maithili Literature — Mithila Digital Archive";
const DESC =
  "Seven centuries of Maithili writing: the Varṇa Ratnākara, Vidyāpati's Padāvalī, kīrtaniyā drama, and modern prose — each entry with its edition and source.";

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
  const [q, setQ] = useState("");
  const [form, setForm] = useState("All forms");

  const forms = useMemo(
    () => ["All forms", ...Array.from(new Set(literature.map((w) => w.form)))],
    [],
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return literature.filter((w) => {
      const matchesForm = form === "All forms" || w.form === form;
      const matchesQ =
        !needle ||
        [w.title, w.titleMai, w.author, w.summary, w.period]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesForm && matchesQ;
    });
  }, [q, form]);

  return (
    <>
      <PageHeader
        eyebrow="Collection 01"
        title="Literature"
        titleMai="मैथिली साहित्य"
        intro="Maithili's written record begins with descriptive prose in the fourteenth century and has not stopped since. Listed here are foundational texts, with the editions consulted."
      />

      <Section>
        <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <SearchField
            id="lit-search"
            label="Search titles, authors, periods"
            value={q}
            onChange={setQ}
            placeholder="Vidyāpati, prose, 14th century…"
          />
          <FilterBar label="Filter by form" options={forms} active={form} onSelect={setForm} />
        </div>

        <p className="label-eyebrow mb-6 text-muted-foreground">
          {results.length} {results.length === 1 ? "work" : "works"}
        </p>

        <ul className="grid gap-6 lg:grid-cols-2">
          {results.map((w) => (
            <li key={w.slug} id={w.slug}>
              <EntryCard className="h-full">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-2xl tracking-tight text-foreground">{w.title}</h2>
                  <span className="label-eyebrow text-terracotta">{w.form}</span>
                </div>
                <p className="deva mt-1 text-lg text-muted-foreground">{w.titleMai}</p>

                <MetaRow
                  items={[
                    ["Author", w.author],
                    ["Period", w.period],
                    ["Language", w.language],
                  ]}
                />

                <p className="mt-5 leading-relaxed text-muted-foreground">{w.summary}</p>

                {w.excerpt && (
                  <figure className="mt-5 border-l-2 border-gold pl-4">
                    <blockquote className="deva text-lg text-foreground">
                      {w.excerpt.text}
                    </blockquote>
                    <figcaption className="mt-2 text-sm text-muted-foreground italic">
                      {w.excerpt.translation}
                    </figcaption>
                  </figure>
                )}

                <div className="mt-auto">
                  <SourceNote source={w.source} />
                </div>
              </EntryCard>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No works match that query yet. The archive is at v0.1.
          </p>
        )}
      </Section>
    </>
  );
}
