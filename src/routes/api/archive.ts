import { createFileRoute } from "@tanstack/react-router";
import { getPublicArchiveEnvelope } from "@/data/archive-export";

export const Route = createFileRoute("/api/archive")({
  server: {
    handlers: {
      GET: async () => Response.json(getPublicArchiveEnvelope(), {
        headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
      }),
    },
  },
});
