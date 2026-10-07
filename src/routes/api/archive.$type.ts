import { createFileRoute } from "@tanstack/react-router";
import { getPublicArchiveEnvelope } from "@/data/archive-export";
import { archiveRecordTypes, type ArchiveRecordType } from "@/data/types";

export const Route = createFileRoute("/api/archive/$type")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!(archiveRecordTypes as readonly string[]).includes(params.type)) {
          return Response.json({ error: "Unknown archive record type" }, { status: 404 });
        }
        const type = params.type as ArchiveRecordType;
        const payload = getPublicArchiveEnvelope();
        return Response.json({
          apiVersion: payload.apiVersion,
          type,
          records: payload.records.filter((record) => record.type === type),
        }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
      },
    },
  },
});
