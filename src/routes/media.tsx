import { createFileRoute, Link } from "@tanstack/react-router";
import { EntryCard, PageHeader, Section } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";

export const Route = createFileRoute("/media")({
  head: () => ({ meta: [
    { title: "Media Register — Mithila Digital Archive" },
    { name: "description", content: "Digital media register with attribution, licensing and external-provider metadata." },
  ]}),
  component: MediaPage,
});

function MediaPage() {
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
    </>
  );
}
