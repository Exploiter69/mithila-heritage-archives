import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  ArchiveRecordPage,
  archiveRecordDescription,
  archiveRecordTitle,
} from "@/components/archive-record-page";
import { getArchiveRecordBySlug } from "@/data/archive-read";

export const Route = createFileRoute("/music/$slug")({
  loader: ({ params }) => {
    const record = getArchiveRecordBySlug("music-entry", params.slug) ?? getArchiveRecordBySlug("song", params.slug);
    if (!record) throw notFound();
    return record;
  },
  head: ({ params }) => {
    const record = getArchiveRecordBySlug("music-entry", params.slug) ?? getArchiveRecordBySlug("song", params.slug);
    if (!record) return { meta: [{ title: "Record not found — Mithila Digital Archive" }] };
    const title = archiveRecordTitle(record);
    const description = archiveRecordDescription(record);
    const canonicalPath = "/music/" + record.slug;
    const image = record.mediaIds.length > 0 ? undefined : undefined;
    return {
      meta: [
        { title: title + " — Music — Mithila Digital Archive" },
        { name: "description", content: description },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalPath },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalPath }],
    };
  },
  component: RecordRoute,
});

function RecordRoute() {
  const record = Route.useLoaderData();
  const canonicalUrl = "/music/" + record.slug;
  return <ArchiveRecordPage record={record} canonicalUrl={canonicalUrl} />;
}
