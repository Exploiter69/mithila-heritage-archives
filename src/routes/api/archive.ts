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


        if (format === "json" || format === "research-json") {
          const envelope = getPublicArchiveEnvelope();
          const payload =
            format === "research-json"
              ? {
                  apiVersion: "2.0",
                  archiveRelease: envelope.archiveRelease,
                  releaseDate: envelope.releaseDate,
                  dataset: getResearchDataset({ limit: 1000 }),
                  counts: {
                    records: envelope.recordCount,
                    sources: envelope.sourceCount,
                    media: envelope.mediaCount,
                    relations: envelope.relationCount,
                  },
                }
              : envelope;
          const filename =
            format === "research-json"
              ? "mithila-archive-research.json"
              : "mithila-archive.json";
          return new Response(JSON.stringify(payload, null, 2) + "\n", {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Content-Disposition": `attachment; filename="${filename}"`,
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
