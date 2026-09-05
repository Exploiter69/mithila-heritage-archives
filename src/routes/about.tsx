import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader, Section, SectionTitle } from "@/components/archive-ui";
import { getArchiveBibliography } from "@/data/archive-read";

const TITLE = "About & Sources — Mithila Digital Archive";
const DESC =
  "Editorial method, attribution policy and the reference works behind the Mithila Digital Archive.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const PRINCIPLES = [
  {
    title: "Every entry names its source",
    body: "No record is published without a citation field. Where the citation is a person rather than a book, the entry says so and is labelled community-attested.",
  },
  {
    title: "Uncertainty is shown, not smoothed",
    body: "Disputed attributions, approximate dates and unlocated printed sources carry a 'needs review' marker. A smaller confident archive is more useful than a large confident-sounding one.",
  },
  {
    title: "Maithili first, transliteration always",
    body: "Devanagari is the primary text. A Latin transliteration accompanies every headword and quoted line so the material stays reachable to readers who do not read the script.",
  },
  {
    title: "Nothing published without permission",
    body: "Images are freely licensed Wikimedia Commons files shown with contributor credit and licence; audio is never hosted here — it streams from the publishers' own YouTube channels, and rights remain with the original creators.",
  },
];

const STATUS: [string, string][] = [
  ["Literature", "6 works seeded · expanding"],
  ["Authors", "5 records · expanding"],
  ["Language", "4 topics · outline stage"],
  ["Dictionary", "12 headwords · early"],
  ["Proverbs", "6 entries · early"],
  ["Art & Heritage", "5 styles + 6 sites · CC-licensed images"],
  ["Music", "5 songs · streamed from YouTube"],
];

function AboutPage() {
  const sources = getArchiveBibliography();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About & Sources"
        titleMai="परिचय आ स्रोत"
        intro="The Mithila Digital Archive is a non-commercial reference project on the Maithili language and the cultural region of Mithila. This page states how it works and what it is built on."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionTitle eyebrow="Method" title="Four editorial rules" />
            <ol className="space-y-8">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-4">
                  <span className="label-eyebrow pt-1.5 text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl tracking-tight text-foreground">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-sm border border-border bg-secondary/60 p-6">
              <p className="label-eyebrow text-terracotta">v0.1 coverage</p>
              <dl className="mt-4 space-y-3">
                {STATUS.map(([k, v]) => (
                  <div key={k} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <dt className="font-sans text-sm text-foreground">{k}</dt>
                    <dd className="mt-0.5 font-sans text-xs text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="References" title="Works and institutions consulted" />
        <ul className="divide-y divide-border border-y border-border">
          {sources.map((s) => (
            <li key={s.name} className="grid gap-2 py-6 md:grid-cols-[1.2fr_1.8fr] md:gap-8">
              <div>
                <p className="text-lg leading-snug text-foreground">{s.name}</p>
                <p className="label-eyebrow mt-1.5 text-muted-foreground">{s.kind}</p>
              </div>
              <p className="leading-relaxed text-muted-foreground">{s.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-sm border border-gold/50 bg-gold-soft/30 p-6 md:p-8">
          <h2 className="text-xl tracking-tight text-foreground">Corrections</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            Entries marked “needs review” are the archive's open questions. If a
            printed source can be supplied for one of them — or an existing
            citation is wrong — that correction is worth more to this project
            than a new entry. Start with the{" "}
            <Link to="/proverbs" className="text-terracotta hover:underline">
              proverbs
            </Link>{" "}
            and{" "}
            <Link to="/literature" className="text-terracotta hover:underline">
              literature
            </Link>{" "}
            collections, where attestation is thinnest.
          </p>
        </div>
      </Section>
    </>
  );
}
