import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  ArchiveRecordPage,
  archiveRecordDescription,
  archiveRecordTitle,
} from "@/components/archive-record-page";
import {
  getArchiveImageMedia,
  getArchiveRecordByTypeAndSlug,
} from "@/data/archive-read";
import { archiveRecordTypes, type ArchiveRecordType } from "@/data/types";

function isArchiveRecordType(value: string): value is ArchiveRecordType {
  return (archiveRecordTypes as readonly string[]).includes(value);
}

export const Route = createFileRoute("/archive/$type/$slug")({
  loader: ({ params }) => {
    if (!isArchiveRecordType(params.type)) throw notFound();
    const record = getArchiveRecordByTypeAndSlug(params.type, params.slug);
    if (!record) throw notFound();
    return record;
  },
  head: ({ params }) => {
    if (!isArchiveRecordType(params.type)) {
      return { meta: [{ title: "Record not found — Mithila Digital Archive" }] };
    }

    const record = getArchiveRecordByTypeAndSlug(params.type, params.slug);
    if (!record) {
      return { meta: [{ title: "Record not found — Mithila Digital Archive" }] };
    }

    const title = archiveRecordTitle(record);
    const description = archiveRecordDescription(record);
    const canonicalPath = `/archive/${record.type}/${record.slug}`;
    const siteUrl = import.meta.env["VITE_SITE_URL"]?.replace(/\/$/, "") ?? "";
    const canonicalUrl = siteUrl + canonicalPath;
    const image = getArchiveImageMedia(record)[0];

    return {
      meta: [
        { title: `${title} — Mithila Digital Archive` },
        { name: "description", content: description },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        ...(image ? [{ property: "og:image", content: image.displayUrl }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: RecordRoute,
});

function RecordRoute() {
  const record = Route.useLoaderData();
  const canonicalUrl = `/archive/${record.type}/${record.slug}`;
  return (
    <>
      <ArchiveStructuredData record={record} canonicalUrl={canonicalUrl} />
      <ArchiveRecordPage record={record} canonicalUrl={canonicalUrl} />
    </>
  );
}
