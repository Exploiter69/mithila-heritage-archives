import { createFileRoute } from "@tanstack/react-router";

import { EntryCard, PageHeader, Section, SectionTitle, SourceNote } from "@/components/archive-ui";
import { CommonsImageFigure } from "@/components/commons-image";
import { motifs } from "@/data/art";
import { getArchiveContent, type ArtStyle } from "@/data/archive-read";

const TITLE = "Madhubani Painting Styles — Mithila Digital Archive";
const DESC =
  "Bharnī, Kachnī, Tāntrik, Godnā and the kohbar wall: Madhubani painting styles with technique, natural dyes and the meaning of lotus, fish, bamboo and sun.";

export const Route = createFileRoute("/art")({
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
  component: ArtPage,
});

function ArtPage() {
  const artStyles = getArchiveContent<ArtStyle>("art-style");

  return (
    <>
      <PageHeader
        eyebrow="Collection — कला"
        title="Mithila Art"
        titleMai="मिथिला चित्रकला"
        intro="Madhubani painting is not one style but several, distinguished by line, fill and by who historically painted them. Each register is described here by its technique, its pigments and the motifs it carries."
      />

      <Section>
        <ul className="space-y-6">
          {artStyles.map((a) => (
            <li key={a.slug} id={a.slug} className="scroll-mt-24">
              <EntryCard>
                <div className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
                  <div>
                    <h2 className="text-2xl leading-tight tracking-tight text-foreground">
                      {a.name}
                    </h2>
                    <p className="deva mt-1 text-xl text-terracotta">{a.nameDeva}</p>
                    <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                      {a.origin}
                    </p>

                    <p className="label-eyebrow mt-6 text-muted-foreground">Dyes & materials</p>
                    <ul className="mt-2 space-y-1.5">
                      {a.dyes.map((d) => (
                        <li
                          key={d}
                          className="border-l-2 border-gold pl-3 font-sans text-sm text-foreground/85"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    <p className="label-eyebrow mt-6 text-muted-foreground">Technique</p>
                    <p className="mt-2 leading-relaxed text-foreground/85">{a.technique}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {a.motifs.map((m) => (
                        <span
                          key={m}
                          className="rounded-sm bg-gold-soft px-2 py-1 font-sans text-xs tracking-wide text-accent-foreground uppercase"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    <CommonsImageFigure
                      className="mt-6"
                      image={a.image}
                      subject={`${a.name} — ${a.nameDeva}`}
                    />

                    <SourceNote source={a.source} />
                  </div>
                </div>
              </EntryCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Iconography" title="What the motifs mean" />
        <ul className="grid gap-6 md:grid-cols-2">
          {motifs.map((m) => (
            <li key={m.name}>
              <EntryCard className="h-full">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl tracking-tight text-foreground">{m.name}</h3>
                  <span className="deva text-lg text-terracotta">{m.nameDeva}</span>
                </div>
                <p className="mt-3 leading-relaxed text-muted-foreground">{m.meaning}</p>
              </EntryCard>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-sm border border-gold/50 bg-gold-soft/40 p-6 md:p-8">
          <p className="label-eyebrow text-terracotta">Images & licensing</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            Every image on this page is a freely licensed file from Wikimedia
            Commons, reproduced with the contributor credit and licence recorded
            on its file page and linked back to that page. Where a file does not
            itself state a school of painting, the style attribution is this
            archive's reading and is marked as such.
          </p>
        </div>
      </Section>
    </>
  );
}
