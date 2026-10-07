import { createFileRoute, Link } from "@tanstack/react-router";
import { EntryCard, PageHeader, Section } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";
import { auditArchiveQuality } from "@/data/archive-quality";

export const Route = createFileRoute("/media")({
  head: () => ({ meta: [
    { title: "Media Register — Mithila Digital Archive" },
    { name: "description", content: "Digital media register with attribution, licensing and external-provider metadata." },
  ]}),
  component: MediaPage,
});

function MediaPage() {
  const mediaGaps = auditArchiveQuality().warnings.filter((finding) => finding.code === "missing-image-media");
  return (
    <>
      <PageHeader eyebrow="Digital preservation" title="Media register" titleMai="मीडिया" intro="Media is tracked separately from cultural claims. External files remain external while attribution, licensing, provider and locator metadata stay auditable." />
      <Section>
        <ul className="grid gap-5 md:grid-cols-2">
          {canonicalArchive.media.map((item) => {
            const record = canonicalArchive.records.find((candidate) => candidate.id === item.recordId);
            if (!record) return null;
            return (
              <li key={item.id}>
                <EntryCard className="h-full">
                  <p className="label-eyebrow text-terracotta">{item.kind} · {item.provider}</p>
                  <Link to="/archive/$type/$slug" params={{ type: record.type, slug: record.slug }} className="mt-2 block text-xl hover:text-terracotta">{record.slug}</Link>
                  {item.kind === "image" && (
                    <p className="mt-3 text-sm text-muted-foreground">{item.payload.credit} · {item.payload.license}</p>
                  )}
                  {item.kind === "audio-stream" && (
                    <p className="mt-3 text-sm text-muted-foreground">{item.payload.channel} · {item.externalId}</p>
                  )}
                </EntryCard>
              </li>
            );
          })}
        </ul>
      </Section>

      {mediaGaps.length > 0 && (
        <Section className="pt-0">
          <div className="rounded-sm border border-terracotta/40 bg-terracotta-soft/30 p-6">
            <p className="label-eyebrow text-terracotta">Editorial media gaps</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These records are intentionally shown as gaps until a source-backed image is available. The archive does not substitute unrelated imagery just to remove a warning.
            </p>
            <ul className="mt-4 space-y-2">
              {mediaGaps.map((finding) => (
                <li key={finding.recordId} className="font-sans text-sm text-foreground/85">
                  {finding.recordKey ?? finding.recordId}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </>
  );
}
