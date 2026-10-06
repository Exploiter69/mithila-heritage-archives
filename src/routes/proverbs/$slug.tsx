import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  ArchiveRecordPage,
  archiveRecordDescription,
  archiveRecordTitle,
} from "@/components/archive-record-page";
import { getArchiveImageMedia, getArchiveRecordBySlug } from "@/data/archive-read";

export const Route = createFileRoute("/proverbs/$slug")({
  loader: ({ params }) => {
    const record = getArchiveRecordBySlug("proverb", params.slug);
    if (!record) throw notFound();
    return record;
  },
  head: ({ params }) => {
    const record = getArchiveRecordBySlug("proverb", params.slug);
    if (!record) return { meta: [{ title: "Record not found — Mithila Digital Archive" }] };
    const title = archiveRecordTitle(record);
    const description = archiveRecordDescription(record);
    const canonicalPath = "/proverbs/" + record.slug;
    const image = getArchiveImageMedia(record)[0];
    const canonicalUrl = (import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "") + canonicalPath;
    return {
      meta: [
        { title: title + " — Proverbs — Mithila Digital Archive" },
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
  const canonicalUrl = "/proverbs/" + record.slug;
  return <ArchiveRecordPage record={record} canonicalUrl={canonicalUrl} />;
}
