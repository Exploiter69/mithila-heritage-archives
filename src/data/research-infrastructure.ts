import { canonicalArchive } from "./archive-foundation";
import { searchArchiveAdvanced } from "./archive-platform";
import type { ArchiveRecord, ArchiveRecordType, BibliographicSource } from "./types";

export const ARCHIVE_LOCALES = ["mai", "hi", "en"] as const;
export type ArchiveLocale = (typeof ARCHIVE_LOCALES)[number];

export const ARCHIVE_UI_LABELS: Record<ArchiveLocale, {
  search: string;
  sources: string;
  research: string;
  evidence: string;
  related: string;
  media: string;
  language: string;
}> = {
  mai: { search: "खोजू", sources: "स्रोत", research: "अनुसन्धान", evidence: "प्रमाण", related: "सम्बन्धित अभिलेख", media: "मीडिया", language: "भाषा" },
  hi: { search: "खोज", sources: "स्रोत", research: "अनुसंधान", evidence: "प्रमाण", related: "संबंधित अभिलेख", media: "मीडिया", language: "भाषा" },
  en: { search: "Search", sources: "Sources", research: "Research", evidence: "Evidence", related: "Related records", media: "Media", language: "Language" },
};

function recordTitle(record: ArchiveRecord): string {
  const content = record.content as Record<string, unknown>;
  for (const key of ["title", "name", "headword", "text"]) {
    const value = content[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return record.slug;
}

function slugifyCitation(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getRecordPermalink(record: ArchiveRecord, origin = "https://mithila-heritage-archives.example"): string {
  return new URL("/archive/" + record.type + "/" + record.slug, origin).toString();
}

function firstYear(record: ArchiveRecord): string | undefined {
  const content = record.content as Record<string, unknown>;
  return [content["period"], content["era"], content["lifespan"]]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .match(/\b(\d{4})\b/)?.[1];
}

export function toCslJson(record: ArchiveRecord, origin?: string) {
  const content = record.content as Record<string, unknown>;
  const author = typeof content["author"] === "string" ? content["author"] : undefined;
  const today = new Date();
  return {
    id: record.id,
    type: "webpage",
    title: recordTitle(record),
    ...(author ? { author: [{ literal: author }] } : {}),
    ...(firstYear(record) ? { issued: { "date-parts": [[Number(firstYear(record))]] } } : {}),
    URL: getRecordPermalink(record, origin),
    publisher: "Mithila Digital Archive",
    accessed: { "date-parts": [[today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()]] },
  };
}

export function toBibtex(record: ArchiveRecord, origin?: string): string {
  const content = record.content as Record<string, unknown>;
  const author = typeof content["author"] === "string" ? content["author"] : "Mithila Digital Archive";
  const key = slugifyCitation(author + "-" + recordTitle(record) + "-" + record.id) || record.id;
  return [
    "@misc{" + key + ",",
    "  author = {" + author + "},",
    "  title = {" + recordTitle(record).replace(/[{}]/g, "") + "},",
    "  publisher = {Mithila Digital Archive},",
    ...(firstYear(record) ? ["  year = {" + firstYear(record) + "},"] : []),
    "  url = {" + getRecordPermalink(record, origin) + "},",
    "}",
  ].join("\n");
}

export function getCitationBundle(record: ArchiveRecord, origin?: string) {
  return { cslJson: toCslJson(record, origin), bibtex: toBibtex(record, origin), permalink: getRecordPermalink(record, origin) };
}

export interface IiifManifest {
  "@context": "http://iiif.io/api/presentation/3/context.json";
  id: string;
  type: "Manifest";
  label: { none: [string] };
  items: Array<{
    id: string;
    type: "Canvas";
    width: number;
    height: number;
    items: Array<{
      id: string;
      type: "AnnotationPage";
      items: Array<{
        id: string;
        type: "Annotation";
        motivation: "painting";
        body: { id: string; type: "Image"; format: string; width: number; height: number };
        target: string;
      }>;
    }>;
  }>;
  provider?: Array<{ id: string; type: "Agent"; label: { none: [string] } }>;
}

export function buildIiifManifest(
  record: ArchiveRecord,
  image: { displayUrl: string; sourceUrl: string; payload: { caption: string } },
  origin = "https://mithila-heritage-archives.example",
): IiifManifest {
  const manifestId = new URL("/api/records/" + record.type + "/" + record.slug + "?format=iiif", origin).toString();
  const canvasId = manifestId + "#canvas-1";
  return {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: manifestId,
    type: "Manifest",
    label: { none: [recordTitle(record)] },
    items: [{
      id: canvasId,
      type: "Canvas",
      width: 2000,
      height: 2000,
      items: [{
        id: canvasId + "/page",
        type: "AnnotationPage",
        items: [{
          id: canvasId + "/annotation",
          type: "Annotation",
          motivation: "painting",
          body: { id: image.displayUrl, type: "Image", format: "image/jpeg", width: 2000, height: 2000 },
          target: canvasId,
        }],
      }],
    }],
    provider: [{ id: image.sourceUrl, type: "Agent", label: { none: [image.payload.caption] } }],
  };
}

export interface PreservationManifest {
  schemaVersion: "1.0";
  generatedAt: string;
  recordId: string;
  mediaId: string;
  preservation: "external-reference";
  provider: string;
  sourceUrl?: string;
  displayUrl?: string;
  locator?: string;
  integrity: { checksum: null; status: "not-captured"; reason: string };
  verification: { mimeType: "not-captured"; dimensions: "not-captured"; duration: "not-applicable" | "not-captured" };
}

export function buildPreservationManifest(record: ArchiveRecord, media: (typeof canonicalArchive.media)[number]): PreservationManifest {
  return {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    recordId: record.id,
    mediaId: media.id,
    preservation: media.preservation,
    provider: media.provider,
    ...(media.kind === "image" ? { sourceUrl: media.sourceUrl, displayUrl: media.displayUrl } : { locator: media.locator.url }),
    integrity: { checksum: null, status: "not-captured", reason: "External-provider media is referenced but no preservation copy is claimed by this archive." },
    verification: { mimeType: "not-captured", dimensions: "not-captured", duration: media.kind === "audio-stream" ? "not-captured" : "not-applicable" },
  };
}

export function findShortestRecordPath(fromId: string, toId: string): ArchiveRecord[][] {
  if (fromId === toId) {
    const record = canonicalArchive.records.find((item) => item.id === fromId);
    return record ? [[record]] : [];
  }
  const queue: string[][] = [[fromId]];
  const visited = new Set([fromId]);
  const adjacency = new Map<string, string[]>();
  for (const relation of canonicalArchive.relations) {
    adjacency.set(relation.fromRecordId, [...(adjacency.get(relation.fromRecordId) ?? []), relation.toRecordId]);
    adjacency.set(relation.toRecordId, [...(adjacency.get(relation.toRecordId) ?? []), relation.fromRecordId]);
  }
  const results: ArchiveRecord[][] = [];
  let shortest = Infinity;
  while (queue.length) {
    const path = queue.shift()!;
    if (path.length > shortest) continue;
    const current = path[path.length - 1]!;
    for (const next of adjacency.get(current) ?? []) {
      if (path.includes(next)) continue;
      const nextPath = [...path, next];
      if (next === toId) {
        shortest = nextPath.length;
        const records = nextPath.map((id) => canonicalArchive.records.find((item) => item.id === id)).filter((item): item is ArchiveRecord => Boolean(item));
        results.push(records);
      } else if (!visited.has(next)) {
        visited.add(next);
        queue.push(nextPath);
      }
    }
  }
  return results;
}

export function getResearchDataset(options: { query?: string; type?: ArchiveRecordType; limit?: number } = {}) {
  const records = options.query
    ? searchArchiveAdvanced(options.query, { ...(options.type ? { types: [options.type] } : {}), limit: options.limit ?? 50 }).map((hit) => hit.record)
    : canonicalArchive.records.filter((record) => record.contentStatus === "published").slice(0, options.limit ?? 50);
  return records.map((record) => ({
    id: record.id,
    type: record.type,
    slug: record.slug,
    title: recordTitle(record),
    verificationStatus: record.verificationStatus,
    sources: record.sourceIds,
    provenance: record.provenanceIds,
    media: record.mediaIds,
    relations: record.relationIds,
  }));
}

export function getBibliographicSourceById(id: string): BibliographicSource | undefined {
  return canonicalArchive.bibliographicSources.find((source) => source.id === id);
}
