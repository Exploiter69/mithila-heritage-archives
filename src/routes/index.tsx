import { createFileRoute, Link } from "@tanstack/react-router";

import { EntryCard, Section, SectionTitle, SourceNote } from "@/components/archive-ui";
import { wordOfTheDay } from "@/data/dictionary";
import { getArchiveContent, type HeritageEntry, type LiteraryWork } from "@/data/archive-read";

const TITLE = "Mithila Digital Archive — मिथिला डिजिटल आर्काइव";
const DESC =
  "A sourced archive of Mithila and the Maithili language: literature, music, Madhubani art, heritage sites and festivals, and a living Maithili dictionary.";

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
  component: HomePage,
});

const QUICK_CARDS = [
  {
    to: "/literature" as const,
    label: "Literature",
    deva: "साहित्य",
    blurb: "Vidyāpati, the Varṇa Ratnākara and modern prose, with translation.",
  },
  {
    to: "/music" as const,
    label: "Music",
    deva: "संगीत",
    blurb: "Sohar, baṭgamanī, Chhaṭhī Maiyā songs and lokgīt, by occasion.",
  },
  {
    to: "/art" as const,
    label: "Art",
    deva: "कला",
    blurb: "Bharnī, Kachnī, Tāntrik and Godnā — technique, dyes and motifs.",
  },
  {
    to: "/heritage" as const,
    label: "Heritage",
    deva: "धरोहर",
    blurb: "Rajnagar, Simraungadh, Kapileshwar Nath, Chhath, Sāmā Chakevā.",
  },
  {
    to: "/language" as const,
    label: "Dictionary",
    deva: "शब्दकोश",
    blurb: "Search Maithili in Devanagari or Latin, with Hindi and English.",
  },
];

function HomePage() {
  const word = wordOfTheDay();
  const literaryWorks = getArchiveContent<LiteraryWork>("literature-work");
  const heritage = getArchiveContent<HeritageEntry>("heritage-entry");
  const featured = literaryWorks.find((w) => w.slug === "bada-sukh-sar") ?? literaryWorks[0]!;
  const tradition = heritage.find((h) => h.slug === "sama-chakeva") ?? heritage[0]!;

  return (
    <>
      <section className="aripan-field border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="label-eyebrow text-terracotta">Mithila Digital Archive · v0.1</p>
          <h1 className="deva mt-5 max-w-4xl text-4xl leading-[1.35] text-foreground md:text-6xl md:leading-[1.3]">
            मिथिलाक माटी, भाषा आ संस्कृति
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A calm, sourced reference for the Mithila region and the Maithili
            language — its literature and song, its painting and its places.
            Every entry here names the edition, recording or attestation it
            rests on, and says plainly where the record is oral.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/literature"
              className="inline-flex items-center rounded-sm bg-terracotta px-5 py-3 font-sans text-sm tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
            >
              Explore Literature
            </Link>
            <Link
              to="/music"
              className="inline-flex items-center rounded-sm border border-terracotta px-5 py-3 font-sans text-sm tracking-wide text-terracotta uppercase transition-colors hover:bg-terracotta hover:text-primary-foreground"
            >
              Listen to Music
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <EntryCard>
            <p className="label-eyebrow text-terracotta">Word of the day · आजुक शब्द</p>
            <p className="deva mt-4 text-4xl leading-snug text-foreground">{word.headword}</p>
            <p className="mt-2 font-sans text-sm tracking-wide text-muted-foreground">
              {word.transliteration} · {word.phonetic}
            </p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="label-eyebrow pt-1 text-muted-foreground">हिन्दी</dt>
              <dd className="deva text-lg text-foreground/90">{word.hindi}</dd>
              <dt className="label-eyebrow pt-1 text-muted-foreground">English</dt>
              <dd className="leading-relaxed text-foreground/90">{word.english}</dd>
            </dl>
            {word.examples[0] && (
              <div className="mt-5 border-l-2 border-gold pl-4">
                <p className="deva text-lg text-foreground">{word.examples[0].deva}</p>
                <p className="mt-1 text-sm text-muted-foreground italic">
                  {word.examples[0].english}
                </p>
              </div>
            )}
            <Link
              to="/language"
              hash={word.slug}
              className="mt-6 inline-block font-sans text-xs tracking-wide text-terracotta uppercase hover:underline"
            >
              Open in the dictionary
            </Link>
          </EntryCard>

          <EntryCard>
            <p className="label-eyebrow text-terracotta">Featured work · विद्यापति</p>
            <h2 className="deva mt-4 text-2xl leading-snug text-foreground">
              {featured.titleDeva}
            </h2>
            <p className="mt-1 font-sans text-sm text-muted-foreground italic">
              {featured.transliteration} · {featured.author}, {featured.era}
            </p>
            <p className="deva mt-6 text-xl leading-loose whitespace-pre-line text-foreground/90">
              {featured.body[0]?.deva}
            </p>
            <p className="mt-4 border-l-2 border-gold pl-4 leading-relaxed text-muted-foreground">
              {featured.body[0]?.translation}
            </p>
            <Link
              to="/literature"
              hash={featured.slug}
              className="mt-6 inline-block font-sans text-xs tracking-wide text-terracotta uppercase hover:underline"
            >
              Read the full text
            </Link>
            <SourceNote source={featured.source} />
          </EntryCard>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Featured tradition" title={`${tradition.name} · ${tradition.nameDeva}`} />
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-foreground/90">{tradition.summary}</p>
            <ul className="mt-5 space-y-3">
              {tradition.context.slice(0, 2).map((c) => (
                <li key={c} className="border-l-2 border-gold pl-4 leading-relaxed text-muted-foreground">
                  {c}
                </li>
              ))}
            </ul>
            <Link
              to="/heritage"
              hash={tradition.slug}
              className="mt-6 inline-block font-sans text-xs tracking-wide text-terracotta uppercase hover:underline"
            >
              More on heritage
            </Link>
          </div>
          <div className="rounded-sm border border-border bg-secondary/60 p-6">
            <p className="label-eyebrow text-muted-foreground">When & where</p>
            <p className="mt-2 leading-relaxed text-foreground/90">{tradition.period}</p>
            <p className="mt-2 leading-relaxed text-muted-foreground">{tradition.place}</p>
            <SourceNote source={tradition.source} />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Collections" title="Enter the archive" />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {QUICK_CARDS.map((c) => (
            <li key={c.to}>
              <Link to={c.to} className="block h-full">
                <EntryCard className="h-full">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl tracking-tight text-foreground">{c.label}</h3>
                    <span className="deva text-lg text-terracotta">{c.deva}</span>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{c.blurb}</p>
                </EntryCard>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-sans text-sm text-muted-foreground">
          Also in the archive:{" "}
          <Link to="/authors" className="text-terracotta hover:underline">Authors</Link>,{" "}
          <Link to="/proverbs" className="text-terracotta hover:underline">Proverbs</Link>, and{" "}
          <Link to="/about" className="text-terracotta hover:underline">About & Sources</Link>.
        </p>
      </Section>
    </>
  );
}
