import { createFileRoute, Link } from "@tanstack/react-router";

import { EntryCard, PageHeader, Section, SectionTitle, SourceNote } from "@/components/archive-ui";

const TITLE = "The Maithili Language — Mithila Digital Archive";
const DESC =
  "Maithili in outline: Tirhuta script, the honorific verb system, dialect geography, and the language's official status — with sources for each claim.";

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

const TOPICS = [
  {
    id: "script",
    title: "Script: Tirhutā and Devanagari",
    body: "Maithili was written for centuries in Tirhutā (Mithilākṣara), a Brahmic script closely related to early Bengali-Assamese letterforms and used for manuscripts, land records and ritual documents. Devanagari became the dominant print script through the nineteenth and twentieth centuries. Tirhutā was encoded in Unicode 7.0 (2014), which makes digital preservation of manuscript material feasible for the first time.",
    source: {
      citation: "Unicode Standard 7.0, Tirhuta block U+11480–U+114DF; Mithilakshar manuscript surveys.",
      status: "verified" as const,
    },
  },
  {
    id: "honorifics",
    title: "Three-way honorific agreement",
    body: "Maithili verbs agree not only with the subject but, distinctively, with the addressee and with a non-subject participant, across a graded honorific scale. This makes a single verb form carry social information that most neighbouring languages express lexically — one reason Maithili verb morphology is heavily cited in typological literature.",
    source: {
      citation: "Yadava, Y. P., work on Maithili verb agreement; Bickel et al. on non-subject agreement.",
      detail: "Terminology for the honorific grades varies between descriptions.",
      status: "verified" as const,
    },
  },
  {
    id: "dialects",
    title: "Dialect geography",
    body: "Commonly described varieties include Standard (Sotipurā, around Darbhanga and Madhubani), Dehātī, Jolāhā, Kortha, Thēṭhī and the Nepal-side varieties of Dhanusha, Siraha and Saptari. Boundaries are gradients rather than lines, and speakers' own labels do not always match survey categories.",
    source: {
      citation: "Grierson, Linguistic Survey of India, Vol. V; later dialect surveys in Bihar and Nepal.",
      detail: "Grierson's classification is a century old and is retained here as a historical reference point.",
      status: "needs-review" as const,
    },
  },
  {
    id: "status",
    title: "Official status",
    body: "Maithili was included in the Eighth Schedule of the Constitution of India by the 92nd Amendment (2003), alongside Bodo, Dogri and Santali. In Nepal it is recognised as one of the country's most widely spoken languages after Nepali. Formal status has not by itself produced schooling in the language at scale.",
    source: {
      citation: "Constitution (Ninety-Second Amendment) Act, 2003; Census of Nepal language tables.",
      status: "verified" as const,
    },
  },
];

const FACTS: [string, string][] = [
  ["Family", "Indo-European › Indo-Aryan › Eastern"],
  ["Historic script", "Tirhutā / Mithilākṣara"],
  ["Present script", "Devanagari"],
  ["Region", "North Bihar & Jharkhand (India); Madhesh (Nepal)"],
  ["Earliest prose", "Varṇa Ratnākara, c. 1324 CE"],
  ["ISO 639-3", "mai"],
];

function LanguagePage() {
  return (
    <>
      <PageHeader
        eyebrow="Collection 03"
        title="Language"
        titleMai="मैथिली भाषा"
        intro="An outline of Maithili as a linguistic object: how it has been written, what makes its grammar unusual, where it is spoken, and what its official recognition does and does not mean."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-sm border border-border bg-secondary/60 p-6">
              <p className="label-eyebrow text-terracotta">At a glance</p>
              <dl className="mt-4 space-y-3">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <dt className="label-eyebrow text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-sans text-sm text-foreground/90">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <nav className="mt-6" aria-label="On this page">
              <p className="label-eyebrow text-muted-foreground">On this page</p>
              <ul className="mt-3 space-y-2">
                {TOPICS.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="font-sans text-sm text-muted-foreground transition-colors hover:text-terracotta"
                    >
                      {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-10">
            {TOPICS.map((t) => (
              <article key={t.id} id={t.id} className="scroll-mt-28">
                <h2 className="text-2xl tracking-tight text-foreground">{t.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t.body}</p>
                <SourceNote source={t.source} />
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Reading practice" title="A sentence, taken apart" />
        <EntryCard>
          <p className="deva text-2xl text-foreground">हम अहाँके पोथी देलहुँ।</p>
          <p className="mt-3 font-sans text-sm tracking-wide text-muted-foreground">
            ham ahā̃ke pothī delahũ
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            “I gave you the book.” The verb <span className="deva">देलहुँ</span> encodes
            the first-person subject <em>and</em> the honorific grade of the addressee
            <span className="deva"> अहाँ</span>. Change the addressee to the familiar
            <span className="deva"> तों</span> and the verb changes with it — the object
            of the sentence does not.
          </p>
          <SourceNote
            source={{
              citation: "Constructed example following standard descriptions of Maithili agreement.",
              detail: "Illustrative; not drawn from a corpus.",
              status: "needs-review",
            }}
          />
        </EntryCard>
        <p className="mt-8 font-sans text-sm text-muted-foreground">
          Lexicon entries live in the{" "}
          <Link to="/dictionary" className="text-terracotta hover:underline">
            dictionary
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
