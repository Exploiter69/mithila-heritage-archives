// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { getPublicRecord } from "@/data/archive-export";
import { archiveRecordTypes, type ArchiveRecordType } from "@/data/types";

export const Route = createFileRoute("/api/records/$type/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!(archiveRecordTypes as readonly string[]).includes(params.type)) {
          return Response.json({ error: "Unknown archive record type" }, { status: 404 });
        }
        const record = getPublicRecord(params.type as ArchiveRecordType, params.slug);
        if (!record) return Response.json({ error: "Record not found" }, { status: 404 });
        return Response.json(record, {
          headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
        });
      },
    },
  },
});
