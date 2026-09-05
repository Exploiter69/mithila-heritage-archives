import { z } from "zod";

import {
  archiveRecordTypes,
  contentStatuses,
  mediaKinds,
  relationPredicates,
  verificationStatuses,
} from "./types";

const idSchema = z
  .string()
  .min(1, "must not be empty")
  .regex(/^[^:\s]+(?::[^:\s]+)*$/, "must be a stable identifier without whitespace");

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a URL-safe slug");

const urlSchema = z
  .string()
  .url()
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "must use http or https");

const moduleSchema = z.enum([
  "archive.ts",
  "literature.ts",
  "music.ts",
  "art.ts",
  "heritage.ts",
  "dictionary.ts",
]);

const migrationRepresentationSchema = z.object({
  id: idSchema,
  origin: z.object({
    module: moduleSchema,
    exportName: z.string().min(1),
  }),
  payload: z.unknown(),
});

export const archiveRecordSchema = z.object({
  id: idSchema,
  type: z.enum(archiveRecordTypes),
  slug: slugSchema,
  contentStatus: z.enum(contentStatuses),
  verificationStatus: z.enum(verificationStatuses),
  sourceIds: z.array(idSchema),
  provenanceIds: z.array(idSchema),
  mediaIds: z.array(idSchema),
  relationIds: z.array(idSchema),
  representations: z.array(migrationRepresentationSchema),
  content: z.unknown(),
});

export const sourceRecordSchema = z.object({
  id: idSchema,
  citation: z.string().min(1),
  detail: z.string().min(1).optional(),
  captureKind: z.enum(["record-citation", "bibliography-entry"]),
  representationId: idSchema.optional(),
  legacyKind: z.string().min(1).optional(),
  legacyStatus: z.enum(["verified", "community", "needs-review"]).optional(),
  url: urlSchema.optional(),
});

const commonsImageSchema = z.object({
  url: urlSchema,
  filePage: urlSchema,
  fileTitle: z.string().min(1),
  credit: z.string().min(1),
  license: z.string().min(1),
  licenseUrl: urlSchema,
  caption: z.string().min(1),
  motifs: z
    .array(
      z.object({
        name: z.string().min(1),
        meaning: z.string().min(1),
      }),
    )
    .optional(),
  note: z.string().min(1).optional(),
});
const commonsImageMediaSchema = z.object({
  id: idSchema,
  kind: z.literal("image"),
  recordId: idSchema,
  displayUrl: urlSchema,
  sourceUrl: urlSchema,
  licenseUrl: urlSchema,
  provider: z.literal("wikimedia-commons"),
  payload: commonsImageSchema,
});

const youtubeStreamPayloadSchema = z.object({
  youtubeId: z.string().min(1),
  channel: z.string().min(1),
  channelKind: z.enum([
    "Official artist channel",
    "Label channel",
    "Regional music channel",
  ]),
  note: z.string().min(1),
});

const youtubeAudioStreamMediaSchema = z.object({
  id: idSchema,
  kind: z.literal("audio-stream"),
  recordId: idSchema,
  provider: z.literal("youtube"),
  externalId: z.string().min(1),
  locator: z.object({
    kind: z.literal("deterministic-playback"),
    url: urlSchema,
    derivedFrom: z.literal("youtubeId"),
  }),
  payload: youtubeStreamPayloadSchema,
});

export const mediaRecordSchema = z.discriminatedUnion("kind", [
  commonsImageMediaSchema,
  youtubeAudioStreamMediaSchema,
]);

export const provenanceAssertionSchema = z.object({
  id: idSchema,
  recordId: idSchema,
  sourceId: idSchema,
  verificationStatus: z.enum(verificationStatuses),
  evidenceRole: z.enum(["record-level", "claim-level"]),
  locator: z.string().min(1).optional(),
  editorialNote: z.string().min(1).optional(),
});

export const recordRelationSchema = z.object({
  id: idSchema,
  fromRecordId: idSchema,
  toRecordId: idSchema,
  predicate: z.enum(relationPredicates),
  sourceIds: z.array(idSchema),
  note: z.string().min(1).optional(),
});

export const canonicalArchiveSchema = z.object({
  records: z.array(archiveRecordSchema),
  sources: z.array(sourceRecordSchema),
  media: z.array(mediaRecordSchema),
  provenance: z.array(provenanceAssertionSchema),
  relations: z.array(recordRelationSchema),
});
