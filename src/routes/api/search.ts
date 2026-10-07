import { createFileRoute } from "@tanstack/react-router";
import { searchArchive, searchArchiveAdvanced } from "@/data/archive-read";
import type { ArchiveRecordType, VerificationStatus } from "@/data/types";

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get("q")?.trim() ?? "";
        const requestedLimit = Number(url.searchParams.get("limit") ?? 20);
        const limit = Number.isFinite(requestedLimit) ? Math.min(50, Math.max(1, Math.trunc(requestedLimit))) : 20;
        const version = url.searchParams.get("version");
        if (!query) return Response.json({ apiVersion: version === "2" ? "2.0" : "1.0", query, results: [] });
        if (version === "2") {
          const type = url.searchParams.get("type") as ArchiveRecordType | null;
          const status = url.searchParams.get("status") as VerificationStatus | null;
          return Response.json({
            apiVersion: "2.0",
            query,
            results: searchArchiveAdvanced(query, {
              ...(type ? { types: [type] } : {}),
              ...(status ? { statuses: [status] } : {}),
              limit,
            }),
          }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
        }
        return Response.json({
          apiVersion: "1.0",
          query,
          results: searchArchive(query, { limit }),
        }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
      },
    },
  },
});
