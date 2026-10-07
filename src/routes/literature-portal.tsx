import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { getArchiveAuthors, getArchiveLiteraryWorks, getArchiveLiteratureForms, getArchiveRecordBySlug } from "@/data/archive-read";

export const Route = createFileRoute("/literature-portal")({
  head: () => ({ meta: [{ title: "Mithila Literature Portal — Mithila Digital Archive" }] }),
  component: LiteraturePortalPage,
});

function LiteraturePortalPage() {
  const works = getArchiveLiteraryWorks();
  const authors = getArchiveAuthors();
  const [form, setForm] = useState("All");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("All");
  const forms = getArchiveLiteratureForms();
  const periods = ["All", ...Array.from(new Set(works.map((work) => work.era).filter(Boolean)))].sort();

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return works.filter((work) => {
      const matchesForm = form === "All" || work.form === form;
      const matchesPeriod = period === "All" || work.era === period;
      const text = [work.titleDeva, work.transliteration, work.author, work.authorDeva, work.snippet, work.form, work.era].join(" ").toLocaleLowerCase();
      return matchesForm && matchesPeriod && (!needle || text.includes(needle));
    });
  }, [works, form, period, query]);

  return (
    <>
      <PageHeader
        eyebrow="Scholarly collection"
        title="Mithila Literature Portal"
        titleMai="मैथिली साहित्य पोर्टल"
        intro="Browse the literary corpus by form, author and period. Full texts are shown only where the archive has legitimately sourced text; catalogue and award records remain bibliographic research entries."
      />
      <Section>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input aria-label="Search literature" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search title, author, form…" className="rounded-sm border border-input bg-background px-3 py-2" />
          <select aria-label="Filter literature period" value={period} onChange={(event) => setPeriod(event.currentTarget.value)} className="rounded-sm border border-input bg-background px-3 py-2">
            {periods.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <span className="self-center text-sm text-muted-foreground">{results.length} works</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Literature forms">
          {forms.map((value) => (
            <button key={value} type="button" onClick={() => setForm(value)} aria-pressed={form === value} className={"rounded-sm border px-3 py-2 text-sm " + (form === value ? "border-terracotta text-terracotta" : "border-border")}>{value}</button>
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {results.map((work) => {
            const record = getArchiveRecordBySlug("literature-work", work.slug);
            const authorMatch = typeof work.author === "string"
              ? authors.find((author) => [author.name, author.nameMai].filter(Boolean).some((name) => name.toLocaleLowerCase() === work.author.toLocaleLowerCase()))
              : undefined;
            const authorRecord = authorMatch
              ? getArchiveRecordBySlug("author", authorMatch.slug)
              : undefined;
            return (
              <EntryCard key={work.slug}>
                <p className="label-eyebrow text-terracotta">{work.form} · {work.era}</p>
                <h2 className="deva mt-2 text-2xl">
                  <Link to="/archive/$type/$slug" params={{ type: "literature-work", slug: work.slug }} className="hover:text-terracotta">{work.titleDeva}</Link>
                </h2>
                <p className="mt-1 text-sm italic text-muted-foreground">{work.transliteration}</p>
                <p className="mt-3 text-sm">
                  {authorRecord ? <Link to="/archive/$type/$slug" params={{ type: "author", slug: authorRecord.slug }} className="hover:text-terracotta">{work.author} · {work.authorDeva}</Link> : <>{work.author} · {work.authorDeva}</>}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{work.snippet}</p>
              </EntryCard>
            );
          })}
        </div>
        {results.length === 0 && <p className="mt-8 text-sm text-muted-foreground">No works match the current filters.</p>}
      </Section>
    </>
  );
}
