import { Link } from "@tanstack/react-router";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

import {
  MetaRow,
  Section,
  SectionTitle,
  SourceNote,
} from "@/components/archive-ui";
import { CommonsImageFigure } from "@/components/commons-image";
import { getRelatedRecords, RELATION_PREDICATE_LABELS } from "@/data/archive-platform";
import {
  getArchiveAudioMedia,
  getArchiveEvidence,
  getArchiveImageMedia,
  getArchiveMedia,
  type Author,
  type HeritageEntry,
  type Proverb,
  type Song,
} from "@/data/archive-read";
import type { ArchiveRecord, ArchiveRecordType, CommonsImage, Source } from "@/data/types";

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
  "art-style": "Art style",
  "music-entry": "Music",
  song: "Song",
  "heritage-entry": "Heritage",
};

function citationTitle(record: ArchiveRecord): string {
  return archiveRecordTitle(record);
}

function CitationPanel({ record, canonicalUrl }: { record: ArchiveRecord; canonicalUrl: string }) {
  const [copied, setCopied] = useState<"plain" | "bibtex" | null>(null);
  const title = citationTitle(record);
  const year = new Date().getFullYear();
  const plain = title + ". Mithila Heritage Archives. Record " + record.id + ". " + canonicalUrl + ". Accessed " + year + ".";
  const bibtexKey = "mithila_" + record.type + "_" + record.slug.replace(/[^a-z0-9]+/gi, "_");
  const bibtex =
    "@misc{" + bibtexKey + ",\n" +
    "  title = {" + title.replace(/[{}]/g, "") + "},\n" +
    "  organization = {Mithila Heritage Archives},\n" +
    "  note = {Archive record " + record.id + "},\n" +
    "  url = {" + canonicalUrl + "},\n" +
    "  year = {" + year + "}\n" +
    "}";

  async function copy(value: string, kind: "plain" | "bibtex") {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <section className="mt-12 border-t border-border pt-8" aria-labelledby="citation-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="label-eyebrow text-terracotta">Stable citation</p>
          <h2 id="citation-heading" className="mt-1 text-2xl font-normal tracking-tight text-foreground">
            Cite this record
          </h2>
        </div>
        <span className="font-sans text-xs text-muted-foreground">ID · {record.id}</span>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-sm border border-border bg-secondary/40 p-4">
          <p className="label-eyebrow text-muted-foreground">Plain text</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{plain}</p>
          <button
            type="button"
            onClick={() => void copy(plain, "plain")}
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-sans text-xs text-foreground hover:border-gold hover:text-terracotta"
          >
            {copied === "plain" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied === "plain" ? "Copied" : "Copy citation"}
          </button>
        </div>
        <div className="rounded-sm border border-border bg-secondary/40 p-4">
          <p className="label-eyebrow text-muted-foreground">BibTeX</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground/90">{bibtex}</pre>
          <button
            type="button"
            onClick={() => void copy(bibtex, "bibtex")}
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 font-sans text-xs text-foreground hover:border-gold hover:text-terracotta"
          >
            {copied === "bibtex" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied === "bibtex" ? "Copied" : "Copy BibTeX"}
          </button>
        </div>
      </div>
    </section>
  );
}

function sourceFromRecord(record: ArchiveRecord): Source | undefined {
  const evidence = getArchiveEvidence(record)[0];
  if (!evidence) return undefined;
  const status = evidence.provenance?.verificationStatus;
  return {
    citation: evidence.source.citation,
    ...(evidence.source.detail ? { detail: evidence.source.detail } : {}),
    ...(evidence.source.url ? { url: evidence.source.url } : {}),
    status:
      status === "community-attested"
        ? "community"
        : status === "needs-review" || status === "disputed"
          ? "needs-review"
          : "verified",
  };
}

function stringField(
  content: Record<string, unknown>,
  key: string,
  fallback = "—",
): string {
  const value = content[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function stringArrayField(
  content: Record<string, unknown>,
  key: string,
): string[] {
  const value = content[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function displayTitle(record: ArchiveRecord): { title: string; titleDeva?: string } {
  const c = record.content as Record<string, unknown>;
  const title =
    stringField(c, "title", "") ||
    stringField(c, "name", "") ||
    stringField(c, "headword", "") ||
    stringField(c, "text", "") ||
    record.slug;
  const titleDeva =
    stringField(c, "titleDeva", "") || stringField(c, "nameDeva", "");
  return { title, ...(titleDeva ? { titleDeva } : {}) };
}

export function archiveRecordTitle(record: ArchiveRecord): string {
  return displayTitle(record).title;
}

export function archiveRecordDescription(record: ArchiveRecord): string {
  const c = record.content as Record<string, unknown>;
  for (const key of ["summary", "about", "description", "bio", "meaning", "gloss"]) {
    const value = c[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return `${TYPE_LABELS[record.type]} record for ${displayTitle(record).title}.`;
}

function RecordBody({ record }: { record: ArchiveRecord }) {
  const c = record.content as Record<string, unknown>;

  switch (record.type) {
    case "literature-work": {
      const body = Array.isArray(c["body"]) ? c["body"] : [];
      const excerpt =
        c["excerpt"] && typeof c["excerpt"] === "object"
          ? (c["excerpt"] as Record<string, unknown>)
          : undefined;
      return (
        <>
          <MetaRow
            items={[
              ["Author", stringField(c, "author")],
              ["Era", stringField(c, "era", stringField(c, "period"))],
              ["Form", stringField(c, "form")],
              ...(typeof c["language"] === "string"
                ? [["Language", c["language"]] as [string, string]]
                : []),
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {stringField(c, "summary", stringField(c, "note", "No summary recorded."))}
          </p>
          {body.length > 0 ? (
            <div className="mt-8 space-y-6">
              {body.map((item, index) => {
                const passage =
                  item && typeof item === "object"
                    ? (item as Record<string, unknown>)
                    : {};
                return (
                  <div key={index} className="border-l-2 border-gold pl-5">
                    <p className="deva text-xl leading-loose whitespace-pre-line text-foreground">
                      {stringField(passage, "deva", "")}
                    </p>
                    {typeof passage["translit"] === "string" && (
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        {passage["translit"]}
                      </p>
                    )}
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {stringField(passage, "translation", "")}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : excerpt ? (
            <div className="mt-8 border-l-2 border-gold pl-5">
              <p className="text-lg leading-relaxed text-foreground">
                {stringField(excerpt, "text", "")}
              </p>
              <p className="mt-2 text-muted-foreground">
                {stringField(excerpt, "translation", "")}
              </p>
            </div>
          ) : null}
        </>
      );
    }

    case "author": {
      const author = c as unknown as Author;
      return (
        <>
          <MetaRow
            items={[
              ["Dates", author.lifespan],
              ["Place", author.place],
              ["Role", author.role],
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{author.bio}</p>
          <SectionTitle eyebrow="Works" title="Principal works" />
          <ul className="flex flex-wrap gap-2">
            {author.works.map((work) => (
              <li key={work} className="rounded-sm border border-border px-3 py-1.5 text-sm">
                {work}
              </li>
            ))}
          </ul>
        </>
      );
    }

    case "dictionary-entry":
      return (
        <>
          <MetaRow
            items={[
              ["Transliteration", stringField(c, "transliteration")],
              ["Part of speech", stringField(c, "pos", stringField(c, "wordClass"))],
              ["Register", stringField(c, "register")],
            ]}
          />
          <p className="mt-8 text-xl leading-relaxed text-foreground">
            {stringField(c, "gloss", stringField(c, "english"))}
          </p>
          {typeof c["usage"] === "string" && (
            <div className="mt-6 border-l-2 border-gold pl-5">
              <p className="deva text-lg leading-relaxed">{c["usage"]}</p>
              {typeof c["usageGloss"] === "string" && (
                <p className="mt-2 text-muted-foreground">{c["usageGloss"]}</p>
              )}
            </div>
          )}
        </>
      );

    case "proverb": {
      const proverb = c as unknown as Proverb;
      return (
        <>
          <MetaRow
            items={[
              ["Theme", proverb.theme],
              ["Transliteration", proverb.transliteration],
            ]}
          />
          <div className="mt-8 space-y-6">
            <div>
              <p className="label-eyebrow text-muted-foreground">Literal</p>
              <p className="mt-2 text-lg leading-relaxed italic">{proverb.literal}</p>
            </div>
            <div>
              <p className="label-eyebrow text-muted-foreground">Sense</p>
              <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
                {proverb.meaning}
              </p>
            </div>
          </div>
        </>
      );
    }

    case "art-entry":
      return (
        <>
          <MetaRow
            items={[
              ["Tradition", stringField(c, "tradition")],
              ["Region", stringField(c, "region")],
              ["Materials", stringField(c, "materials")],
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {stringField(c, "description")}
          </p>
        </>
      );

    case "art-style":
      return (
        <>
          <MetaRow
            items={[
              ["Region", stringField(c, "region")],
              ["Technique", stringField(c, "technique")],
              ["Materials", stringField(c, "materials")],
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {stringField(c, "description", stringField(c, "summary", "No description recorded."))}
          </p>
        </>
      );

    case "music-entry":
      return (
        <>
          <MetaRow
            items={[
              ["Genre", stringField(c, "genre")],
              ["Occasion", stringField(c, "occasion")],
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {stringField(c, "description")}
          </p>
        </>
      );

    case "song": {
      const song = c as unknown as Song;
      const audio = getArchiveAudioMedia(record)[0];
      return (
        <>
          <MetaRow
            items={[
              ["Performer", song.performer],
              ["Occasion", song.occasion],
              ["Category", song.category],
            ]}
          />
          <div className="mt-6 rounded-sm border border-border bg-secondary/40 p-4">
            <p className="label-eyebrow text-terracotta">Recording status</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {song.recordingStatus === "verified-live"
                ? "An external recording lead is currently attached."
                : song.recordingStatus === "needs-recheck" || song.stream
                  ? "An external recording lead exists, but it should be re-checked before being treated as a live link."
                  : "No current external recording was located. The cultural record remains published independently of media availability."}
            </p>
          </div>
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">{song.about}</p>
          {audio && (
            <a
              href={audio.playbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 font-sans text-sm text-foreground hover:border-gold hover:text-terracotta"
            >
              Open recording on YouTube <ExternalLink className="size-4" />
            </a>
          )}
          {song.lyrics.length > 0 && (
            <div className="mt-8 space-y-5">
              <p className="label-eyebrow text-muted-foreground">Lyrics</p>
              {song.lyrics.map((line, index) => (
                <div key={index} className="border-l-2 border-gold pl-5">
                  <p className="deva text-xl leading-loose">{line.deva}</p>
                  <p className="mt-1 text-sm leading-relaxed italic text-muted-foreground">
                    {line.translation}
                  </p>
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
          <MetaRow
            items={[
              ["Kind", heritage.kind],
              ["Place", heritage.place],
              ["Period", heritage.period],
            ]}
          />
          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {heritage.summary}
          </p>
          <ul className="mt-6 space-y-3">
            {heritage.context.map((item) => (
              <li
                key={item}
                className="border-l-2 border-gold pl-5 leading-relaxed text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      );
    }
  }
}

export function ArchiveRecordPage({
  record,
  canonicalUrl,
}: {
  record: ArchiveRecord;
  canonicalUrl: string;
}) {
  const title = displayTitle(record);
  const source = sourceFromRecord(record);
  const image = getArchiveImageMedia(record)[0];
  const imagePayload = image?.payload as CommonsImage | undefined;
  const collection = ARCHIVE_ROUTE_CONFIG[record.type];

  return (
    <Section>
      <nav
        aria-label="Breadcrumb"
        className="mb-8 font-sans text-sm text-muted-foreground"
      >
        <Link to="/">Archive</Link>
        <span className="mx-2">/</span>
        <a href={collection.collectionPath}>{collection.label}</a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title.title}</span>
      </nav>

      <article>
        <header className="border-b border-border pb-8">
          <p className="label-eyebrow text-terracotta">{TYPE_LABELS[record.type]}</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-tight font-normal tracking-tight text-foreground md:text-5xl">
            {title.title}
          </h1>
          {title.titleDeva && (
            <p className="deva mt-3 text-2xl text-muted-foreground">{title.titleDeva}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 font-sans text-xs text-muted-foreground">
            <span>Record ID · {record.id}</span>
            <span className="rounded-full border border-border px-2.5 py-1 capitalize">
              {record.verificationStatus.replaceAll("-", " ")}
            </span>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <RecordBody record={record} />
            {source && <SourceNote source={source} />}
          </div>
          {imagePayload && (
            <aside>
              <CommonsImageFigure
                image={imagePayload}
                subject={title.titleDeva ?? title.title}
                loading="eager"
              />
            </aside>
          )}
        </div>

        <section
          className="mt-12 border-t border-border pt-8"
          aria-labelledby="evidence-heading"
        >
          <h2
            id="evidence-heading"
            className="text-2xl font-normal tracking-tight text-foreground"
          >
            Sources & evidence
          </h2>
          <div className="mt-5 space-y-5">
            {getArchiveEvidence(record).map((evidence) => (
              <div key={evidence.source.id} className="border-l-2 border-gold pl-5">
                <p className="font-sans text-sm leading-relaxed text-foreground/90">
                  {evidence.source.citation}
                </p>
                {evidence.source.detail && (
                  <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                    {evidence.source.detail}
                  </p>
                )}
                <p className="mt-2 label-eyebrow text-muted-foreground">
                  Evidence status:{" "}
                  {evidence.provenanceV2?.verificationStatus ??
                    evidence.provenance?.verificationStatus ??
                    "not recorded"}
                </p>
                {evidence.normalizedSource && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Source type: {evidence.normalizedSource.sourceType}
                  </p>
                )}
                {evidence.provenanceV2?.evidenceRole && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Evidence role: {evidence.provenanceV2.evidenceRole}
                  </p>
                )}
                {evidence.provenanceV2?.claimId && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Claim: {evidence.provenanceV2.claimId}
                  </p>
                )}
                {evidence.provenanceV2?.locator && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Locator: {evidence.provenanceV2.locator}
                  </p>
                )}
                {evidence.provenanceV2?.checkedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Checked: {evidence.provenanceV2.checkedAt}
                    {evidence.provenanceV2.checkedBy
                      ? ` · ${evidence.provenanceV2.checkedBy}`
                      : ""}
                  </p>
                )}
                {evidence.source.url && (
                  <a href={evidence.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-terracotta hover:underline">
                    Open cited source
                  </a>
                )}
                {evidence.provenanceV2?.editorialNote && (
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    {evidence.provenanceV2.editorialNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <CitationPanel record={record} canonicalUrl={canonicalUrl} />

        {getRelatedRecords(record).length > 0 && (
          <section className="mt-12 border-t border-border pt-8" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-normal tracking-tight text-foreground">
              Related records
            </h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {getRelatedRecords(record).map(({ relation, target }) => (
                <li key={relation.id}>
                  <Link
                    to="/archive/$type/$slug"
                    params={{ type: target.type, slug: target.slug }}
                    className="block rounded-sm border border-border bg-secondary/40 p-4 transition-colors hover:border-gold"
                  >
                    <span className="label-eyebrow text-terracotta">{RELATION_PREDICATE_LABELS[relation.predicate]} · {relation.sourceIds.length} source{relation.sourceIds.length === 1 ? "" : "s"}</span>
                    <span className="mt-2 block text-lg text-foreground">{archiveRecordTitle(target)}</span>
                    {relation.note && <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{relation.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {getArchiveMedia(record).length > 0 && (
          <section
            className="mt-12 border-t border-border pt-8"
            aria-labelledby="media-heading"
          >
            <h2
              id="media-heading"
              className="text-2xl font-normal tracking-tight text-foreground"
            >
              Media
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Media shown here is linked from its original provider; this archive does not
              claim ownership of external media.
            </p>
          </section>
        )}

        <div className="mt-12 border-t border-border pt-6">
          <a
            href={collection.collectionPath}
            className="font-sans text-sm text-terracotta hover:underline"
          >
            ← Back to {collection.label}
          </a>
          <span className="mx-3 text-border">·</span>
          <a
            href={canonicalUrl}
            className="font-sans text-sm text-muted-foreground hover:text-foreground"
          >
            Canonical URL
          </a>
        </div>
      </article>
    </Section>
  );
}
