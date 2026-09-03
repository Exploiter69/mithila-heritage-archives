import { createFileRoute, Link } from "@tanstack/react-router";

import { EntryCard, Section, SectionTitle, SourceNote } from "@/components/archive-ui";
import { art, authors, literature, music, proverbs } from "@/data/archive";

const TITLE = "Mithila Digital Archive — Maithili Language, Letters & Heritage";
const DESC =
  "A sourced reference archive of Maithili literature, authors, lexicon, proverbs, art and music from the Mithila region.";

export const Route = createFileRoute("/")({
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
  component: Home,
});

const AREAS = [
  {
    to: "/literature" as const,
    label: "Literature",
    mai: "साहित्य",
    note: "From the Varṇa Ratnākara to the modern novel.",
    count: literature.length,
  },
  {
    to: "/authors" as const,
    label: "Authors",
    mai: "रचनाकार",
    note: "Poets, editors and prose writers, with dates and sources.",
    count: authors.length,
  },
  {
    to: "/language" as const,
    label: "Language",
    mai: "भाषा",
    note: "Script history, grammar sketch, honorific system.",
    count: 4,
  },
  {
    to: "/dictionary" as const,
    label: "Dictionary",
    mai: "शब्दकोश",
    note: "Headwords with transliteration, gloss and attested usage.",
    count: 12,
  },
  {
    to: "/proverbs" as const,
    label: "Proverbs",
    mai: "लोकोक्ति",
    note: "Lokokti with literal and idiomatic readings.",
    count: proverbs.length,
  },
  {
    to: "/art-heritage" as const,
    label: "Art & Heritage",
    mai: "कला",
    note: "Mithila painting, aripan, sikkī and painted architecture.",
    count: art.length,
  },
  {
    to: "/music" as const,
    label: "Music",
    mai: "संगीत",
    note: "Life-cycle, devotional and seasonal song forms.",
    count: music.length,
  },
  {
    to: "/about" as const,
    label: "About & Sources",
    mai: "स्रोत",
    note: "Editorial method, attribution policy, references.",
    count: 5,
  },
];

function Home() {
  const featured = literature[0]!;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="aripan-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-32">
          <p className="label-eyebrow text-terracotta">मिथिला · Maithili · est. v0.1</p>
          <h1 className="mt-6 max-w-4xl text-[2.6rem] leading-[1.05] font-normal tracking-tight text-foreground md:text-6xl">
            A reference archive for the language, letters and material culture
            of Mithila.
          </h1>
          <p className="deva mt-6 text-2xl text-terracotta md:text-3xl">
            मिथिला डिजिटल अभिलेखागार
          </p>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Maithili has a written record running back seven centuries and a
            living oral tradition older than that. This archive collects both,
            entry by entry, and shows you where each one came from — including
            when the answer is only a household informant.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/literature"
              className="rounded-sm bg-terracotta px-5 py-2.5 font-sans text-sm text-primary-foreground transition-opacity hover:opacity-90"
            >
              Enter the archive
            </Link>
            <Link
              to="/about"
              className="rounded-sm border border-border px-5 py-2.5 font-sans text-sm text-foreground transition-colors hover:border-gold"
            >
              How entries are sourced
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="Collections" title="Nine areas, one method" />
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group flex flex-col justify-between bg-card p-6 transition-colors hover:bg-accent/40"
            >
              <div>
                <span className="deva block text-lg text-terracotta">{a.mai}</span>
                <span className="mt-1 block text-xl tracking-tight text-foreground">
                  {a.label}
                </span>
                <span className="mt-3 block font-sans text-sm leading-relaxed text-muted-foreground">
                  {a.note}
                </span>
              </div>
              <span className="label-eyebrow mt-6 text-muted-foreground/70">
                {a.count} entries
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle
          eyebrow="From the collection"
          title="Featured text"
          action={
            <Link
              to="/literature"
              className="font-sans text-sm text-terracotta hover:underline"
            >
              All literature →
            </Link>
          }
        />
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <EntryCard className="bg-secondary/50">
            <p className="label-eyebrow text-terracotta">{featured.period}</p>
            <h3 className="mt-3 text-3xl tracking-tight text-foreground">
              {featured.title}
            </h3>
            <p className="deva mt-1 text-xl text-muted-foreground">
              {featured.titleMai}
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {featured.summary}
            </p>
            <SourceNote source={featured.source} />
          </EntryCard>

          {featured.excerpt && (
            <figure className="flex flex-col justify-center rounded-sm border border-gold/50 bg-gold-soft/40 p-8">
              <blockquote className="deva text-2xl leading-relaxed text-foreground">
                {featured.excerpt.text}
              </blockquote>
              <figcaption className="mt-6 border-t border-gold/40 pt-4">
                <p className="text-base leading-relaxed text-muted-foreground italic">
                  {featured.excerpt.translation}
                </p>
                <p className="label-eyebrow mt-3 text-muted-foreground">
                  Vidyāpati Ṭhākur · Padāvalī
                </p>
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Everyday speech" title="A proverb, and what it carries" />
        <ul className="grid gap-6 md:grid-cols-3">
          {proverbs.slice(0, 3).map((p) => (
            <li key={p.transliteration}>
              <EntryCard className="h-full">
                <p className="deva text-xl text-foreground">{p.text}</p>
                <p className="mt-2 font-sans text-xs tracking-wide text-muted-foreground">
                  {p.transliteration}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                  {p.literal}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                  {p.meaning}
                </p>
                <SourceNote source={p.source} />
              </EntryCard>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
