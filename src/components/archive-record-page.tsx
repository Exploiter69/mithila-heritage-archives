import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import {
  MetaRow,
  Section,
  SectionTitle,
  SourceNote,
} from "@/components/archive-ui";
import { CommonsImageFigure } from "@/components/commons-image";
import {
  getArchiveAudioMedia,
  getArchiveEvidence,
  getArchiveImageMedia,
  getArchiveMedia,
  type ArtStyle,
  type Author,
  type DictionaryEntry,
  type HeritageEntry,
  type LiteraryWork,
  type Proverb,
  type Song,
} from "@/data/archive-read";
import type { ArchiveRecord, ArchiveRecordType, Source } from "@/data/types";

export const ARCHIVE_ROUTE_CONFIG: Record<
  ArchiveRecordType,
  { collectionPath: string; label: string }
> = {
  "literature-work": { collectionPath: "/literature", label: "Literature" },
  author: { collectionPath: "/authors", label: "Authors" },
  "dictionary-entry": { collectionPath: "/language", label: "Dictionary" },
  proverb: { collectionPath: "/proverbs", label: "Proverbs" },
  "art-entry": { collectionPath: "/art", label: "Art" },
  "art-style": { collectionPath: "/art", label: "Art" },
  "music-entry": { collectionPath: "/music", label: "Music" },
  song: { collectionPath: "/music", label: "Music" },
  "heritage-entry": { collectionPath: "/heritage", label: "Heritage" },
};

const TYPE_LABELS: Record<ArchiveRecordType, string> = {
  "literature-work": "Literature",
  author: "Author",
  "dictionary-entry": "Dictionary",
  proverb: "Proverb",
  "art-entry": "Art",
  "art-style": "Art",
  "music-entry": "Music",
  song: "Music",
  "heritage-entry": "Heritage",
};

function sourceFromRecord(record: ArchiveRecord): Source | undefined {
  const evidence = getArchiveEvidence(record)[0];
  if (!evidence) return undefined;
  const status = evidence.provenance?.verificationStatus;
  return {
    citation: evidence.source.citation,
    ...(evidence.source.detail ? { detail: evidence.source.detail } : {}),
    status:
      status === "community-attested"
        ? "community"
        : status === "needs-review" || status === "disputed"
          ? "needs-review"
          : "verified",
  };
}

function displayTitle(record: ArchiveRecord): { title: string; titleDeva?: string } {
  const c = record.content as Record<string, unknown>;
  const title =
    typeof c.title === "string"
      ? c.title
      : typeof c.name === "string"
        ? c.name
        : typeof c.headword === "string"
          ? c.headword
          : typeof c.text === "string"
            ? c.text
            : record.slug;
  const titleDeva =
    typeof c.titleDeva === "string"
      ? c.titleDeva
      : typeof c.nameDeva === "string"
        ? c.nameDeva
        : undefined;
  return { title, ...(titleDeva ? { titleDeva } : {}) };
}

export function archiveRecordTitle(record: ArchiveRecord): string {
  return displayTitle(record).title;
}

export function archiveRecordDescription(record: ArchiveRecord): string {
  const c = record.content as Record<string, unknown>;
  for (const key of ["summary", "about", "description", "bio", "meaning", "gloss"]) {
    if (typeof c[key] === "string" && c[key].trim()) return c[key];
  }
  return `${TYPE_LABELS[record.type]} record for ${displayTitle(record).title}.`;
}

function RecordBody({ record }: { record: ArchiveRecord }) {
  const c = record.content as Record<string, unknown>;

  switch (record.type) {
    case "literature-work": {
      const work = c as unknown as LiteraryWork & Record<string, unknown>;
      const isCurrentCollection = Array.isArray(work.body);
      return (
        <>
          <MetaRow
            items={[
              ["Author", String(work.author ?? "—")],
              ["Era", String(work.era ?? work.period ?? "—")],
              ["Form", String(work.form ?? "—")],
              ...("language" in work ? [["Language", String(work.language)]] as [string, string][] : []),
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {String(work.summary ?? work.note ?? "No summary recorded.")}
          </p>
          {isCurrentCollection ? (
            <div className="mt-8 space-y-6">
              {(work.body ?? []).map((passage, index) => (
                <div key={index} className="border-l-2 border-gold pl-5">
                  <p className="deva text-xl leading-loose whitespace-pre-line text-foreground">
                    {passage.deva}
                  </p>
                  {passage.translit && (
                    <p className="mt-2 text-sm italic text-muted-foreground">{passage.translit}</p>
                  )}
                  <p className="mt-2 leading-relaxed text-muted-foreground">{passage.translation}</p>
                </div>
              ))}
            </div>
          ) : work.excerpt ? (
            <div className="mt-8 border-l-2 border-gold pl-5">
              <p className="text-lg leading-relaxed text-foreground">{work.excerpt.text}</p>
              <p className="mt-2 text-muted-foreground">{work.excerpt.translation}</p>
            </div>
          ) : null}
          {"note" in work && typeof work.note === "string" && (
            <p className="mt-8 leading-relaxed text-muted-foreground">{work.note}</p>
          )}
        </>
      );
    }
    case "author": {
      const author = c as unknown as Author;
      return (
        <>
          <MetaRow items={[["Dates", author.lifespan], ["Place", author.place], ["Role", author.role]]} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{author.bio}</p>
          <SectionTitle eyebrow="Works" title="Principal works" />
          <ul className="flex flex-wrap gap-2">
            {author.works.map((work) => (
              <li key={work} className="rounded-sm border border-border px-3 py-1.5 text-sm">{work}</li>
            ))}
          </ul>
        </>
      );
    }
    case "dictionary-entry": {
      const entry = c as unknown as DictionaryEntry & Record<string, unknown>;
      return (
        <>
          <MetaRow
            items={[
              ["Transliteration", String(entry.transliteration ?? "—")],
              ["Part of speech", String(entry.pos ?? entry.wordClass ?? "—")],
              ["Register", String(entry.register ?? "—")],
            ]}
          />
          <p className="mt-8 text-xl leading-relaxed text-foreground">
            {String(entry.gloss ?? entry.english ?? "—")}
          </p>
          {typeof entry.usage === "string" && (
            <div className="mt-6 border-l-2 border-gold pl-5">
              <p className="deva text-lg leading-relaxed">{entry.usage}</p>
              {typeof entry.usageGloss === "string" && (
                <p className="mt-2 text-muted-foreground">{entry.usageGloss}</p>
              )}
            </div>
          )}
        </>
      );
    }
    case "proverb": {
      const proverb = c as unknown as Proverb;
      return (
        <>
          <MetaRow items={[["Theme", proverb.theme], ["Transliteration", proverb.transliteration]]} />
          <div className="mt-8 space-y-6">
            <div>
              <p className="label-eyebrow text-muted-foreground">Literal</p>
              <p className="mt-2 text-lg leading-relaxed italic">{proverb.literal}</p>
            </div>
            <div>
              <p className="label-eyebrow text-muted-foreground">Sense</p>
              <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{proverb.meaning}</p>
            </div>
          </div>
        </>
      );
    }
    case "art-entry": {
      const art = c as Record<string, string>;
      return (
        <>
          <MetaRow items={[["Tradition", art.tradition ?? "—"], ["Region", art.region ?? "—"], ["Materials", art.materials ?? "—"]} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{art.description}</p>
        </>
      );
    }
    case "art-style": {
      const art = c as unknown as ArtStyle & Record<string, unknown>;
      return (
        <>
          <MetaRow items={[
            ["Region", String(art.region ?? "—")],
            ["Technique", String(art.technique ?? "—")],
            ["Materials", String(art.materials ?? "—")],
          ]} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {String(art.description ?? art.summary ?? "No description recorded.")}
          </p>
        </>
      );
    }
    case "music-entry": {
      const music = c as Record<string, string>;
      return (
        <>
          <MetaRow items={[["Genre", music.genre ?? "—"], ["Occasion", music.occasion ?? "—"]]} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{music.description}</p>
        </>
      );
    }
    case "song": {
      const song = c as unknown as Song;
      const audio = getArchiveAudioMedia(record)[0];
      return (
        <>
          <MetaRow items={[["Performer", song.performer], ["Occasion", song.occasion], ["Category", song.category]]} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{song.about}</p>
          {audio && (
            <a href={audio.playbackUrl} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 font-sans text-sm text-foreground hover:border-gold hover:text-terracotta">
              Open recording on YouTube <ExternalLink className="size-4" />
            </a>
          )}
          {song.lyrics.length > 0 && (
            <div className="mt-8 space-y-5">
              <p className="label-eyebrow text-muted-foreground">Lyrics</p>
              {song.lyrics.map((line, index) => (
                <div key={index} className="border-l-2 border-gold pl-5">
                  <p className="deva text-xl leading-loose">{line.deva}</p>
                  <p className="mt-1 text-sm leading-relaxed italic text-muted-foreground">{line.translation}</p>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }
    case "heritage-entry": {
      const heritage = c as unknown as HeritageEntry;
      return (
        <>
          <MetaRow items={[["Kind", heritage.kind], ["Place", heritage.place], ["Period", heritage.period]]} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{heritage.summary}</p>
          <ul className="mt-6 space-y-3">
            {heritage.context.map((item) => (
              <li key={item} className="border-l-2 border-gold pl-5 leading-relaxed text-muted-foreground">{item}</li>
            ))}
          </ul>
        </>
      );
    }
  }
}

export function ArchiveRecordPage({ record, canonicalUrl }: { record: ArchiveRecord; canonicalUrl: string }) {
  const title = displayTitle(record);
  const source = sourceFromRecord(record);
  const image = getArchiveImageMedia(record)[0];

  return (
    <Section>
      <nav aria-label="Breadcrumb" className="mb-8 font-sans text-sm text-muted-foreground">
        <Link to="/">Archive</Link>
        <span className="mx-2">/</span>
        <a href={ARCHIVE_ROUTE_CONFIG[record.type].collectionPath}>
          {ARCHIVE_ROUTE_CONFIG[record.type].label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title.title}</span>
      </nav>
      <article>
        <header className="border-b border-border pb-8">
          <p className="label-eyebrow text-terracotta">{TYPE_LABELS[record.type]}</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-tight font-normal tracking-tight text-foreground md:text-5xl">
            {title.title}
          </h1>
          {title.titleDeva && <p className="deva mt-3 text-2xl text-muted-foreground">{title.titleDeva}</p>}
          <p className="mt-3 font-sans text-xs tracking-wide text-muted-foreground">Record ID · {record.id}</p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <RecordBody record={record} />
            {source && <SourceNote source={source} />}
          </div>
          {image && (
            <aside>
              <CommonsImageFigure image={image.payload} subject={title.titleDeva ?? title.title} />
            </aside>
          )}
        </div>

        <section className="mt-12 border-t border-border pt-8" aria-labelledby="evidence-heading">
          <h2 id="evidence-heading" className="text-2xl font-normal tracking-tight text-foreground">Sources & evidence</h2>
          <div className="mt-5 space-y-5">
            {getArchiveEvidence(record).map((evidence) => (
              <div key={evidence.source.id} className="border-l-2 border-gold pl-5">
                <p className="font-sans text-sm leading-relaxed text-foreground/90">{evidence.source.citation}</p>
                {evidence.source.detail && <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">{evidence.source.detail}</p>}
                <p className="mt-2 label-eyebrow text-muted-foreground">
                  Evidence status: {evidence.provenance?.verificationStatus ?? "not recorded"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {getArchiveMedia(record).length > 0 && (
          <section className="mt-12 border-t border-border pt-8" aria-labelledby="media-heading">
            <h2 id="media-heading" className="text-2xl font-normal tracking-tight text-foreground">Media</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Media shown here is linked from its original provider; this archive does not claim ownership of external media.
            </p>
          </section>
        )}

        <div className="mt-12 border-t border-border pt-6">
          <Link to={ARCHIVE_ROUTE_CONFIG[record.type].collectionPath}
            className="font-sans text-sm text-terracotta hover:underline">
            ← Back to {ARCHIVE_ROUTE_CONFIG[record.type].label}
          </Link>
          <span className="mx-3 text-border">·</span>
          <a href={canonicalUrl} className="font-sans text-sm text-muted-foreground hover:text-foreground">
            Canonical URL
          </a>
        </div>
      </article>
    </Section>
  );
}
