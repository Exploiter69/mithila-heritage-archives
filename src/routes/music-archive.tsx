import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EntryCard, FilterBar, PageHeader, Section, SectionTitle, SourceNote } from "@/components/archive-ui";
import { getArchiveContent, getArchiveRecordBySlug, type Song } from "@/data/archive-read";

const TITLE = "Music Research Catalogue — Mithila Digital Archive";
const DESC = "Research-facing catalogue of Maithili song forms, oral traditions, ritual repertoires and external recording leads.";

export const Route = createFileRoute("/music-archive")({
  head: () => ({ meta: [{ title: TITLE }, { name: "description", content: DESC }] }),
  component: MusicArchivePage,
});

function recordingLabel(song: Song) {
  if (song.recordingStatus === "verified-live") return "Recording lead attached";
  if (song.recordingStatus === "needs-recheck" || song.stream) return "External lead needs re-check";
  return "No recording located";
}

function MusicArchivePage() {
  const songs = getArchiveContent<Song>("song");
  const categories = ["All", ...Array.from(new Set(songs.map((song) => song.category))).sort()];
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return songs.filter((song) =>
      (category === "All" || song.category === category) &&
      (!needle || [song.title, song.titleDeva, song.transliteration, song.performer, song.occasion, song.about].join(" ").toLocaleLowerCase().includes(needle)),
    );
  }, [songs, category, query]);

  return (
    <>
      <PageHeader
        eyebrow="Research catalogue — संगीत"
        title="Music Research Catalogue"
        titleMai="संगीतक शोध-सूची"
        intro="A structured view of the music corpus behind the public collection. Genre-level records are legitimate research objects even when no recording is currently available; external media is treated as a lead, not as archival preservation."
      />

      <Section className="pt-8 md:pt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Total records", songs.length],
            ["With external lead", songs.filter((song) => Boolean(song.stream)).length],
            ["Without recording", songs.filter((song) => !song.stream).length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-sm border border-border bg-card p-5">
              <p className="label-eyebrow text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Corpus map" title="Forms represented in the catalogue" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.filter((item) => item !== "All").map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className="rounded-sm border border-border p-4 text-left hover:border-gold">
              <p className="deva text-lg text-terracotta">{item}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {songs.filter((song) => song.category === item).length} catalogue records
              </p>
            </button>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-sm border border-border bg-card p-5">
          <label htmlFor="music-research-search" className="label-eyebrow text-muted-foreground">Search the research corpus</label>
          <div className="relative mt-2 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input id="music-research-search" type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Form, title, performer, occasion…" className="w-full rounded-sm border border-input bg-background py-2.5 pl-9 pr-3 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div className="mt-5 overflow-x-auto pb-1">
            <FilterBar label="Research music category" options={categories} active={category} onSelect={setCategory} />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mb-5 flex items-end justify-between gap-4">
          <p className="text-sm text-muted-foreground">Showing {results.length} records.</p>
          <Link to="/music" className="text-sm text-terracotta hover:underline">← Public collection view</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((song) => {
            const record = getArchiveRecordBySlug("song", song.slug);
            return (
              <EntryCard key={song.slug}>
                <p className="label-eyebrow text-terracotta">{song.category}</p>
                <h2 className="mt-2 text-xl font-normal">
                  {record ? (
                    <Link to="/archive/$type/$slug" params={{ type: "song", slug: song.slug }} className="hover:text-terracotta">
                      {song.title}
                    </Link>
                  ) : song.title}
                </h2>
                <p className="deva mt-1 text-muted-foreground">{song.titleDeva}</p>
                <p className="mt-2 text-sm">{song.performer} · {song.occasion}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{song.about}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-sm border border-border px-2 py-1 text-[0.65rem] uppercase tracking-wide text-muted-foreground">{recordingLabel(song)}</span>
                  {song.stream && (
                    <a href={"https://www.youtube.com/watch?v=" + song.stream.youtubeId} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-terracotta px-2 py-1 text-[0.65rem] uppercase tracking-wide text-terracotta hover:bg-terracotta hover:text-primary-foreground">
                      External recording
                    </a>
                  )}
                </div>
                <SourceNote source={song.source} />
              </EntryCard>
            );
          })}
        </div>
      </Section>
    </>
  );
}
