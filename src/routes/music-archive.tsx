import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { getArchiveContent, getArchiveRecordBySlug, type Song } from "@/data/archive-read";

export const Route = createFileRoute("/music-archive")({
  head: () => ({ meta: [{ title: "Mithila Music Archive — Mithila Digital Archive" }] }),
  component: MusicArchivePage,
});

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
      <PageHeader eyebrow="Sound archive" title="Mithila Music Archive" titleMai="मिथिलाक संगीत अभिलेख" intro="A research catalogue of ritual, seasonal, devotional and life-cycle repertoire. External recordings are linked only where the archive has a legitimate stream lead, and the archive does not claim ownership of those streams." />
      <Section>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input aria-label="Search music archive" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search title, performer, occasion…" className="rounded-sm border border-input bg-background px-3 py-2" />
          <span className="self-center text-sm text-muted-foreground">{results.length} songs</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={"rounded-sm border px-3 py-2 text-sm " + (category === value ? "border-terracotta text-terracotta" : "border-border")}>{value}</button>)}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((song) => {
            const record = getArchiveRecordBySlug("song", song.slug);
            return (
              <EntryCard key={song.slug}>
                <p className="label-eyebrow text-terracotta">{song.category} · {song.occasion}</p>
                <h2 className="mt-2 text-xl">{record ? <Link to="/archive/$type/$slug" params={{ type: "song", slug: song.slug }} className="hover:text-terracotta">{song.title}</Link> : song.title}</h2>
                <p className="deva text-muted-foreground">{song.titleDeva}</p>
                <p className="mt-2 text-sm">{song.performer} · {song.transliteration}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{song.about}</p>
                {song.lyrics.length > 0 && <details className="mt-4"><summary className="cursor-pointer text-sm text-terracotta">Show documented lyric excerpt</summary><div className="mt-3 space-y-3">{song.lyrics.slice(0, 4).map((line, index) => <div key={song.slug + "-lyric-" + index} className="border-l-2 border-gold pl-4"><p className="deva text-sm">{line.deva}</p><p className="text-xs text-muted-foreground">{line.translation}</p></div>)}</div></details>}
                {song.stream ? <a href={"https://www.youtube.com/watch?v=" + song.stream.youtubeId} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-terracotta hover:underline">Open legitimate recording lead →</a> : <p className="mt-4 text-xs text-muted-foreground">No external recording lead is currently attached.</p>}
                <p className="mt-2 text-xs text-muted-foreground">Rights remain with the original recording creator.</p>
              </EntryCard>
            );
          })}
        </div>
      </Section>
    </>
  );
}
