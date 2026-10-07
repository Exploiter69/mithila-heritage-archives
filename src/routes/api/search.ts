// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { searchArchive } from "@/data/archive-read";

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get("q")?.trim() ?? "";
        const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
        if (!query) return Response.json({ query: "", results: [] });
        return Response.json({
          apiVersion: "1.0",
          query,
          results: searchArchive(query, { limit }),
        }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
      },
    },
  },
});
