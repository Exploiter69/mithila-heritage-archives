import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Pause, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EntryCard,
  FilterBar,
  MetaRow,
  PageHeader,
  Section,
  SectionTitle,
  SourceNote,
} from "@/components/archive-ui";
import { usePlayer } from "@/components/player";
import { ARCHIVE_STREAM_ATTRIBUTION_TEXT, getArchiveMusicCategories, getArchiveSongs } from "@/data/archive-read";
import type { RecordingStatus } from "@/data/music";

const TITLE = "Maithili Music — Folk, Ritual & Devotional Songs — Mithila Digital Archive";
const DESC =
  "A research catalogue of Maithili music across life-cycle rites, festivals, devotional forms, seasonal songs and folk narrative traditions.";

const STATUS = {
  "verified-live": {
    label: "Recording lead",
    detail: "An external recording lead is currently attached.",
    className: "bg-gold-soft text-accent-foreground",
  },
  "needs-recheck": {
    label: "Needs re-check",
    detail: "The external recording lead should be checked before treating it as live.",
    className: "bg-terracotta-soft text-foreground",
  },
  "no-recording-located": {
    label: "No recording located",
    detail: "The cultural record is retained even though no current external recording is attached.",
    className: "border border-border text-muted-foreground",
  },
} satisfies Record<RecordingStatus, { label: string; detail: string; className: string }>;

function getRecordingStatus(song: { stream?: unknown; recordingStatus?: RecordingStatus }): RecordingStatus {
  if (song.recordingStatus) return song.recordingStatus;
  return song.stream ? "needs-recheck" : "no-recording-located";
}

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
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [openLyrics, setOpenLyrics] = useState<string | null>(null);
  const { play, playing, isCurrent } = usePlayer();
  const songs = getArchiveSongs();
  const categories = getArchiveMusicCategories();
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return songs.filter((song) => {
      const matchesCategory = cat === "All" || song.category === cat;
      const haystack = [
        song.title,
        song.titleDeva,
        song.transliteration,
        song.performer,
        song.occasion,
        song.about,
      ].join(" ").toLocaleLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [songs, cat, query]);

  const withRecordings = songs.filter((song) => Boolean(song.stream)).length;
  const needsReview = songs.filter((song) => getRecordingStatus(song) === "needs-recheck").length;
  const noRecording = songs.filter((song) => getRecordingStatus(song) === "no-recording-located").length;

  return (
    <>
      <PageHeader
        eyebrow="Collection — संगीत"
        title="Music"
        titleMai="मैथिलीक गीत-संगीत"
        intro="Maithili music belongs to occasions: birth, marriage, departure, festivals, seasons, devotion and storytelling. This catalogue separates the cultural record from fragile external recordings, so a missing video never erases the song tradition."
      />

      <Section className="pt-8 md:pt-10">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-sm border border-border bg-secondary/50 p-6 md:p-8">
            <p className="label-eyebrow text-terracotta">How to read this collection</p>
            <h2 className="mt-3 text-2xl font-normal tracking-tight">A catalogue first, a player second.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Printed and institutional evidence anchors the records. YouTube and other external recordings are only playback leads; they are not the archive's preservation copy and their rights remain with their providers.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/music-archive" className="rounded-sm border border-terracotta px-3 py-2 text-xs uppercase tracking-wide text-terracotta hover:bg-terracotta hover:text-primary-foreground">
                Research view
              </Link>
              <Link to="/research" className="rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground hover:border-gold hover:text-foreground">
                Sources & evidence
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Songs", songs.length],
              ["Recording leads", withRecordings],
              ["Needs re-check", needsReview],
            ].map(([label, value]) => (
              <div key={label} className="rounded-sm border border-border bg-card p-4">
                <p className="label-eyebrow text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl text-foreground">{value}</p>
              </div>
            ))}
            <div className="col-span-3 rounded-sm border border-dashed border-border p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {noRecording} catalogue records currently have no external recording attached. They remain searchable and citable.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Explore by tradition" title="Find a form, occasion or repertoire" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["संस्कार गीत", "Life-cycle rites", "Birth, marriage, departure and household ceremony"],
            ["पर्व गीत", "Festival songs", "Chhath, Sāmā-Chakevā and seasonal observances"],
            ["देवगीत", "Devotional", "Śiva, goddess, Krishna and household-deity repertoires"],
            ["लोकगाथा", "Narrative", "Katha-gāthā, Jat-Jatin, Salhesh and community traditions"],
          ].map(([deva, label, blurb]) => (
            <button
              key={deva}
              type="button"
              onClick={() => setCat(deva)}
              className="rounded-sm border border-border bg-card p-5 text-left transition-colors hover:border-gold"
            >
              <p className="deva text-xl text-terracotta">{deva}</p>
              <p className="mt-2 font-medium text-foreground">{label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-sm border border-border bg-card p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-md">
              <label htmlFor="music-search" className="label-eyebrow text-muted-foreground">Search the music catalogue</label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="music-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Title, performer, occasion…"
                  className="w-full rounded-sm border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{results.length} of {songs.length} records</p>
          </div>
          <div className="mt-5 overflow-x-auto pb-1">
            <FilterBar label="Filter by music form" options={categories} active={cat} onSelect={setCat} />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <ul className="grid gap-5 lg:grid-cols-2">
          {results.map((song) => {
            const current = isCurrent(song.slug);
            const showing = openLyrics === song.slug;
            const status = getRecordingStatus(song);
            const statusMeta = STATUS[status];
            return (
              <li key={song.slug} id={song.slug} className="scroll-mt-24">
                <EntryCard className="h-full">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="label-eyebrow text-terracotta">{song.category}</p>
                      <h2 className="deva mt-2 text-2xl leading-snug text-foreground">
                        <Link to="/archive/$type/$slug" params={{ type: "song", slug: song.slug }} className="hover:text-terracotta">
                          {song.titleDeva}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm italic text-muted-foreground">{song.title} · {song.transliteration}</p>
                    </div>
                    <span className={"rounded-sm px-2 py-1 text-[0.62rem] uppercase tracking-wide " + statusMeta.className}>
                      {statusMeta.label}
                    </span>
                  </div>

                  <MetaRow items={[["Performer", song.performer], ["Occasion", song.occasion]]} />

                  <p className="mt-5 leading-relaxed text-muted-foreground">{song.about}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {song.stream && (
                      <button
                        type="button"
                        onClick={() => play({
                          id: song.slug,
                          title: song.transliteration,
                          titleDeva: song.titleDeva,
                          artist: song.performer,
                          youtubeId: song.stream!.youtubeId,
                          channel: song.stream!.channel,
                        })}
                        aria-label={current && playing ? "Pause recording" : "Play recording lead"}
                        className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-3 py-2 text-xs uppercase tracking-wide text-primary-foreground hover:opacity-90"
                      >
                        {current && playing ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
                        {current && playing ? "Pause" : "Play lead"}
                      </button>
                    )}
                    {song.stream && (
                      <a
                        href={"https://www.youtube.com/watch?v=" + song.stream.youtubeId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground hover:border-gold hover:text-foreground"
                      >
                        Open source <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                    )}
                    {song.lyrics.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenLyrics(showing ? null : song.slug)}
                        aria-expanded={showing}
                        className="rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground hover:border-gold hover:text-foreground"
                      >
                        {showing ? "Hide excerpt" : "Read excerpt"}
                      </button>
                    )}
                    <Link
                      to="/archive/$type/$slug"
                      params={{ type: "song", slug: song.slug }}
                      className="ml-auto text-xs uppercase tracking-wide text-terracotta hover:underline"
                    >
                      Record →
                    </Link>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {statusMeta.detail}
                  </p>

                  {showing && (
                    <div className="mt-5 space-y-3 border-t border-border pt-5">
                      {song.lyrics.slice(0, 4).map((line, index) => (
                        <div key={song.slug + "-lyric-" + index} className="border-l-2 border-gold pl-4">
                          <p className="deva text-sm leading-relaxed">{line.deva}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{line.translation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <SourceNote source={song.source} />
                </EntryCard>
              </li>
            );
          })}
        </ul>

        {results.length === 0 && (
          <div className="rounded-sm border border-dashed border-border p-10 text-center">
            <p className="text-lg text-foreground">No music records match this filter.</p>
            <button type="button" onClick={() => { setCat("All"); setQuery(""); }} className="mt-3 text-sm text-terracotta hover:underline">
              Clear filters
            </button>
          </div>
        )}

        <p className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          {ARCHIVE_STREAM_ATTRIBUTION_TEXT}
        </p>
      </Section>
    </>
  );
}
