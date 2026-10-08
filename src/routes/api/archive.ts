import { createFileRoute } from "@tanstack/react-router";
import { getPublicArchiveCsv, getPublicArchiveEnvelope } from "@/data/archive-export";
import { getResearchDataset } from "@/data/research-infrastructure";

export const Route = createFileRoute("/api/archive")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const version = url.searchParams.get("version");
        const format = url.searchParams.get("format");

        if (format === "csv") {
          return new Response(getPublicArchiveCsv(), {
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": 'attachment; filename="mithila-archive-records.csv"',
              "Cache-Control": "public, max-age=300, s-maxage=3600",
            },
          });
        }

        if (version === "2") {
          return Response.json({
            apiVersion: "2.0",
            archiveRelease: getPublicArchiveEnvelope().archiveRelease,
            releaseDate: getPublicArchiveEnvelope().releaseDate,
            dataset: getResearchDataset({ limit: 1000 }),
            counts: {
              records: getPublicArchiveEnvelope().recordCount,
              sources: getPublicArchiveEnvelope().sourceCount,
              media: getPublicArchiveEnvelope().mediaCount,
              relations: getPublicArchiveEnvelope().relationCount,
            },
          }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
        }

        return Response.json(getPublicArchiveEnvelope(), {
          headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
        });
      },
    },
  },
});
