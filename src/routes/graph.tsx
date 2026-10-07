import { createFileRoute, Link } from "@tanstack/react-router";
import { EntryCard, PageHeader, Section } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";
import { archiveRecordTitle } from "@/components/archive-record-page";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [
    { title: "Archive Relationship Graph — Mithila Digital Archive" },
    { name: "description", content: "Evidence-backed relationships between canonical Mithila archive records." },
  ]}),
  component: GraphPage,
});

function GraphPage() {
  return (
    <>
      <PageHeader eyebrow="Knowledge graph" title="Relationships" titleMai="सम्बन्ध" intro="These links are explicit archive assertions, not algorithmic guesses. Each relation retains the source captures of its endpoint records." />
      <Section>
        <div className="space-y-4">
          {canonicalArchive.relations.map((relation) => {
            const from = canonicalArchive.records.find((record) => record.id === relation.fromRecordId);
            const to = canonicalArchive.records.find((record) => record.id === relation.toRecordId);
            if (!from || !to) return null;
            return (
              <EntryCard key={relation.id}>
                <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <Link to="/archive/$type/$slug" params={{ type: from.type, slug: from.slug }} className="text-lg hover:text-terracotta">{archiveRecordTitle(from)}</Link>
                  <span className="label-eyebrow text-terracotta text-center">{relation.predicate}</span>
                  <Link to="/archive/$type/$slug" params={{ type: to.type, slug: to.slug }} className="text-lg hover:text-terracotta md:text-right">{archiveRecordTitle(to)}</Link>
                </div>
                {relation.note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{relation.note}</p>}
              </EntryCard>
            );
          })}
        </div>
      </Section>
    </>
  );
}
