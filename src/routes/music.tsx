import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

import {
  EntryCard,
  FilterBar,
  MetaRow,
  PageHeader,
  Section,
  SourceNote,
} from "@/components/archive-ui";
import { usePlayer } from "@/components/player";
import { musicFilters, songs } from "@/data/music";

const TITLE = "Maithili Music — Sohar, Baṭgamanī & Chhath Songs — Mithila Digital Archive";
const DESC =
  "Maithili song by occasion: sohar for a birth, baṭgamanī for the road, Chhaṭhī Maiyā songs and lokgīt, with performers, lyrics and translation.";

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
  const [cat, setCat] = useState<string>("All");
  const [openLyrics, setOpenLyrics] = useState<string | null>(null);
  const { play, playing, isCurrent } = usePlayer();

  const results = songs.filter((s) => cat === "All" || s.category === cat);

  return (
    <>
      <PageHeader
        eyebrow="Collection — संगीत"
        title="Music"
        titleMai="मैथिली संगीत"
        intro="Most Maithili song is occasional: it belongs to a birth, a departure, a night of the festival calendar. Forms are listed by the moment they are sung."
      />

      <Section>
        <div className="mb-10 border-b border-border pb-8">
          <FilterBar
            label="Filter by form"
            options={musicFilters as unknown as string[]}
            active={cat}
            onSelect={setCat}
          />
        </div>

        <ul className="grid gap-6 lg:grid-cols-2">
          {results.map((s) => {
            const current = isCurrent(s.slug);
            const showing = openLyrics === s.slug;
            return (
              <li key={s.slug} id={s.slug} className="scroll-mt-24">
                <EntryCard className="h-full">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="deva text-2xl leading-snug text-foreground">{s.titleDeva}</h2>
                    <span className="label-eyebrow text-terracotta">{s.category}</span>
                  </div>
                  <p className="mt-1 font-sans text-sm text-muted-foreground italic">
                    {s.transliteration}
                  </p>

                  <MetaRow
                    items={[
                      ["Performer", s.performer],
                      ["Occasion", s.occasion],
                    ]}
                  />

                  <p className="mt-5 leading-relaxed text-muted-foreground">{s.about}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        play({
                          id: s.slug,
                          title: s.transliteration,
                          titleDeva: s.titleDeva,
                          artist: s.performer,
                          duration: s.duration,
                        })
                      }
                      aria-label={current && playing ? `Pause ${s.title}` : `Play ${s.title}`}
                      className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-3.5 py-2 font-sans text-xs tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
                    >
                      {current && playing ? (
                        <Pause className="size-3.5 fill-current" />
                      ) : (
                        <Play className="size-3.5 fill-current" />
                      )}
                      {current && playing ? "Playing" : "Play"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenLyrics(showing ? null : s.slug)}
                      aria-expanded={showing}
                      className="inline-flex items-center rounded-sm border border-border px-3.5 py-2 font-sans text-xs tracking-wide text-muted-foreground uppercase transition-colors hover:border-gold hover:text-foreground"
                    >
                      {showing ? "Hide lyrics" : "Lyrics"}
                    </button>
                  </div>

                  {showing && (
                    <div className="mt-6 space-y-5 border-t border-border pt-6">
                      {s.lyrics.map((l, i) => (
                        <div key={i}>
                          <p className="deva text-xl leading-loose text-foreground">{l.deva}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground italic">
                            {l.translation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    <SourceNote source={s.source} />
                  </div>
                </EntryCard>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 rounded-sm border border-border bg-secondary/60 p-6 md:p-8">
          <p className="label-eyebrow text-terracotta">On the player</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            v0.1 carries no audio files. The player demonstrates how recordings
            will behave; field recordings will be added only where the singer's
            consent and the recordist's terms can be published with the file.
          </p>
        </div>
      </Section>
    </>
  );
}
