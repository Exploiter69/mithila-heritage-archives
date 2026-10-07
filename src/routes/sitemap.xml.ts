import { createFileRoute } from "@tanstack/react-router";
import { canonicalArchive } from "@/data/archive-foundation";
import { getArchiveRecordPath } from "@/data/archive-read";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = [
          "/",
          "/literature",
          "/authors",
          "/language",
          "/proverbs",
          "/art",
          "/music",
          "/heritage",
          "/about",
          "/search",
          "/sources",
          "/research",
          ...canonicalArchive.records
            .filter((record) => record.contentStatus === "published")
            .map(getArchiveRecordPath),
        ];
        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.map((path) => '<url><loc>' + origin + path + '</loc></url>'),
          "</urlset>",
        ].join("");
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
