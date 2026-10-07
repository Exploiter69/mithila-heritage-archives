import type { ArchiveRecord } from "@/data/types";
import { archiveRecordDescription, archiveRecordTitle } from "./archive-record-page";

export function ArchiveStructuredData({
  record,
  canonicalUrl,
}: {
  record: ArchiveRecord;
  canonicalUrl: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": canonicalUrl,
    name: archiveRecordTitle(record),
    description: archiveRecordDescription(record),
    url: canonicalUrl,
    isAccessibleForFree: true,
    inLanguage: "mai",
  };

  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
