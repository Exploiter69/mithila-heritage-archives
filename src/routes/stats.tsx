import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { archiveEvidenceStats } from "@/data/archive-experience";
import { getProvenanceAuditReport } from "@/data/provenance-report";
import { getEditorialQueue } from "@/data/editorial-workflow";
import { auditArchiveMedia } from "@/data/archive-media";
import { auditArchiveQuality } from "@/data/archive-quality";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Archive Statistics — Mithila Digital Archive" }] }),
  component: StatsPage,
});

function StatsPage() {
  const s = archiveEvidenceStats();
  const provenance = getProvenanceAuditReport();
  const editorial = getEditorialQueue();
  const media = auditArchiveMedia();
  const quality = auditArchiveQuality();
  const cards: Array<[string, number]> = [
    ["Records", s.records], ["Sources", s.sources], ["Relationships", s.relations], ["Media", s.media],
    ["People", s.people], ["Literature", s.literature], ["Language", s.language], ["Music", s.music],
    ["Art", s.art], ["Heritage", s.heritage], ["Provenance gaps", provenance.findings.length],
    ["Editorial high priority", editorial.filter((item) => item.priority === "high").length],
  ];
  return (
    <>
      <PageHeader eyebrow="Archive transparency" title="Archive status" titleMai="अभिलेखक स्थिति" intro="A live summary of the canonical archive. Counts describe the dataset currently published by the application; they are not claims about the completeness of Mithila itself." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <EntryCard key={label}><p className="label-eyebrow text-muted-foreground">{label}</p><p className="mt-2 text-3xl">{value}</p></EntryCard>)}</div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-sm border border-border p-6"><h2 className="text-xl">Evidence status</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(s.statuses).map(([key, value]) => <div key={key}><p className="text-sm capitalize text-muted-foreground">{key.replaceAll("-", " ")}</p><p className="text-2xl">{value}</p></div>)}</div></div>
          <div className="rounded-sm border border-border p-6"><h2 className="text-xl">Quality signals</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Media errors</p><p className="text-2xl">{media.findings.filter((item) => item.severity === "error").length}</p></div><div><p className="text-xs text-muted-foreground">Quality warnings</p><p className="text-2xl">{quality.warnings.length}</p></div><div><p className="text-xs text-muted-foreground">Records with relations</p><p className="text-2xl">{s.recordsWithRelations}</p></div><div><p className="text-xs text-muted-foreground">Records with media</p><p className="text-2xl">{s.recordsWithMedia}</p></div></div></div>
        </div>
      </Section>
    </>
  );
}
