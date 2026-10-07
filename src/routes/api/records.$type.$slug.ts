import { createFileRoute } from "@tanstack/react-router";
import { getPublicRecord } from "@/data/archive-export";
import { getArchiveImageMedia, getArchiveMedia, getArchiveRecordById } from "@/data/archive-read";
import { buildIiifManifest, buildPreservationManifest, getCitationBundle } from "@/data/research-infrastructure";
import { archiveRecordTypes, type ArchiveRecordType } from "@/data/types";

export const Route = createFileRoute("/api/records/$type/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        if (!(archiveRecordTypes as readonly string[]).includes(params.type)) {
          return Response.json({ error: "Unknown archive record type" }, { status: 404 });
        }
        const record = getPublicRecord(params.type as ArchiveRecordType, params.slug);
        if (!record) return Response.json({ error: "Record not found" }, { status: 404 });
        const canonicalRecord = getArchiveRecordById(record.id);
        if (!canonicalRecord) return Response.json({ error: "Canonical record not found" }, { status: 500 });
        const url = new URL(request.url);
        const format = url.searchParams.get("format");
        if (format === "citation") {
          return Response.json({ apiVersion: "2.0", recordId: record.id, ...getCitationBundle(canonicalRecord, url.origin) });
        }
        if (format === "iiif") {
          const image = getArchiveImageMedia(canonicalRecord)[0];
          if (!image) return Response.json({ error: "Record has no image media", recordId: record.id }, { status: 404 });
          const imagePayload = image.payload as { caption: string };
          const width = Number(url.searchParams.get("width"));
          const height = Number(url.searchParams.get("height"));
          const format = url.searchParams.get("mime") ?? "";
          if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0 || !format.startsWith("image/")) {
            return Response.json({
              error: "IIIF image metadata is required",
              recordId: record.id,
              requiredQuery: ["width", "height", "mime"],
              reason: "The archive will not fabricate image dimensions or MIME type for an external media asset.",
            }, { status: 422 });
          }
          return Response.json(buildIiifManifest(canonicalRecord, { ...image, payload: imagePayload }, url.origin, { width, height, format }), {
            headers: { "Content-Type": "application/ld+json;profile=http://iiif.io/api/presentation/3/context.json", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
          });
        }
        if (format === "preservation") {
          const media = getArchiveMedia(canonicalRecord);
          return Response.json({
            apiVersion: "2.0",
            recordId: record.id,
            media: media.map((item) => buildPreservationManifest(canonicalRecord, item)),
          }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
        }
        const version = url.searchParams.get("version");
        return Response.json(version === "2" ? { apiVersion: "2.0", record, citations: getCitationBundle(canonicalRecord, url.origin) } : record, {
          headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
        });
      },
    },
  },
});
