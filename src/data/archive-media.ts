import { canonicalArchive } from "./archive-foundation";
import type { MediaRecord } from "./types";

export interface MediaQualityFinding {
  severity: "error" | "warning";
  code: "orphan-media" | "missing-caption" | "missing-license" | "invalid-youtube-locator" | "locator-id-mismatch";
  mediaId: string;
  recordId: string;
  message: string;
}

export interface MediaQualityReport {
  media: number;
  images: number;
  audioStreams: number;
  findings: MediaQualityFinding[];
}

export function auditArchiveMedia(media: MediaRecord[] = canonicalArchive.media): MediaQualityReport {
  const recordIds = new Set(canonicalArchive.records.map((record) => record.id));
  const findings: MediaQualityFinding[] = [];

  for (const item of media) {
    if (!recordIds.has(item.recordId)) {
      findings.push({ severity: "error", code: "orphan-media", mediaId: item.id, recordId: item.recordId, message: "Media references a record that does not exist." });
      continue;
    }

    if (item.kind === "image") {
      if (!item.payload.caption.trim()) findings.push({ severity: "error", code: "missing-caption", mediaId: item.id, recordId: item.recordId, message: "Image media has no accessible caption." });
      if (!item.payload.licenseUrl.trim()) findings.push({ severity: "error", code: "missing-license", mediaId: item.id, recordId: item.recordId, message: "Image media has no license URL." });
      continue;
    }

    const expected = "https://www.youtube.com/watch?v=" + item.externalId;
    if (item.locator.url !== expected) findings.push({ severity: "error", code: "locator-id-mismatch", mediaId: item.id, recordId: item.recordId, message: "Audio playback URL does not match the recorded YouTube identifier." });
    if (!/^https:\\/\\/(?:www\\.)?youtube\\.com\\/watch\\?v=[^&]+$/.test(item.locator.url)) findings.push({ severity: "error", code: "invalid-youtube-locator", mediaId: item.id, recordId: item.recordId, message: "Audio locator is not a canonical YouTube watch URL." });
  }

  return {
    media: media.length,
    images: media.filter((item) => item.kind === "image").length,
    audioStreams: media.filter((item) => item.kind === "audio-stream").length,
    findings,
  };
}
