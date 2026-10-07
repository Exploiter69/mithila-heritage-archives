import { createFileRoute } from "@tanstack/react-router";
import { getPublicArchiveEnvelope } from "@/data/archive-export";
import { getResearchDataset } from "@/data/research-infrastructure";

export const Route = createFileRoute("/api/archive")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const version = url.searchParams.get("version");
        if (version === "2") {
          return Response.json({
            apiVersion: "2.0",
            dataset: getResearchDataset({ limit: 1000 }),
            counts: {\n              records: getPublicArchiveEnvelope().recordCount,\n              sources: getPublicArchiveEnvelope().sourceCount,\n              media: getPublicArchiveEnvelope().mediaCount,\n              relations: getPublicArchiveEnvelope().relationCount,\n            },
          }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
        }
        return Response.json(getPublicArchiveEnvelope(), {
          headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
        });
      },
    },
  },
});
