import { createFileRoute } from "@tanstack/react-router";

import { EntryCard, MetaRow, PageHeader, Section, SourceNote } from "@/components/archive-ui";
import { music } from "@/data/archive";

const TITLE = "Maithili Music & Song Forms — Mithila Digital Archive";
const DESC =
  "Sohar, samdāun, nacārī, jhijhiyā and other Maithili song forms, described by occasion, performers and source.";

export const Route = createFileRoute("/music")({
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
  component: MusicPage,
});

function MusicPage() {
  return (
    <>
      <PageHeader
        eyebrow="Collection 07"
        title="Music"
        titleMai="संगीत"
        intro="Most Maithili song is occasional: it belongs to a birth, a departure, a night of the festival calendar. Forms are listed by the moment they are sung rather than by musical structure."
      />

      <Section>
        <ul className="grid gap-6 lg:grid-cols-2">
          {music.map((m) => (
            <li key={m.slug} id={m.slug}>
              <EntryCard className="h-full">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-2xl tracking-tight text-foreground">{m.title}</h2>
                  <span className="label-eyebrow text-terracotta">{m.genre}</span>
                </div>
                <p className="deva mt-1 text-xl text-muted-foreground">{m.titleMai}</p>
                <MetaRow items={[["Occasion", m.occasion]]} />
                <p className="mt-5 leading-relaxed text-muted-foreground">{m.description}</p>
                <div className="mt-auto">
                  <SourceNote source={m.source} />
                </div>
              </EntryCard>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-sm border border-border bg-secondary/60 p-6 md:p-8">
          <p className="label-eyebrow text-terracotta">Planned</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            Audio is not included in v0.1. Field recordings will be added only
            where the singer's consent and the recordist's terms can be published
            with the file.
          </p>
        </div>
      </Section>
    </>
  );
}
