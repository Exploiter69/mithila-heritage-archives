import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";
import { getProvenanceAuditReport, type ProvenanceGapCode } from "@/data/provenance-report";

export const Route = createFileRoute("/provenance")({
  head: () => ({ meta: [
    { title: "Claim & Provenance Audit — Mithila Digital Archive" },
    { name: "description", content: "Inspect claim-level provenance coverage, locators and editorial review gaps in the Mithila archive." },
  ]}),
  component: ProvenancePage,
});

const GAP_FILTERS: Array<["all" | ProvenanceGapCode, string]> = [
  ["all", "All gaps"], ["missing-url", "Missing URL"], ["missing-locator", "Missing locator"],
  ["missing-review", "Missing review"], ["missing-claim-scope", "Missing claim scope"], ["vague-citation", "Vague citation"],
];

function ProvenancePage() {
  const report = getProvenanceAuditReport();
  const assertions = canonicalArchive.provenanceV2;
  const [query, setQuery] = useState("");
  const [gap, setGap] = useState<"all" | ProvenanceGapCode>("all");
  const withLocator = assertions.filter((item) => Boolean(item.locator)).length;
  const withClaim = assertions.filter((item) => Boolean(item.claimId)).length;
  const withReview = assertions.filter((item) => Boolean(item.checkedAt && item.checkedBy)).length;

  const findings = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return report.findings.filter((finding) =>
      (gap === "all" || finding.codes.includes(gap)) &&
      (!needle || [finding.recordSlug, finding.citation, finding.sourceId, finding.codes.join(" ")].join(" ").toLocaleLowerCase().includes(needle)),
    );
  }, [gap, query, report]);

  return (
    <>
      <PageHeader eyebrow="Scholarly evidence" title="Claim & Provenance Audit" titleMai="प्रमाण आकलन" intro="Evidence coverage is measurable and incomplete metadata remains visible. This interface never invents page numbers, reviewers, claim scopes or verification." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Claim scope", assertions.length - withClaim],
            ["Locator/page/section", assertions.length - withLocator],
            ["Reviewer + check date", assertions.length - withReview],
            ["Any editorial note", assertions.filter((item) => !item.editorialNote).length],
          ].map(([label, count]) => <EntryCard key={String(label)}><p className="label-eyebrow text-muted-foreground">{label}</p><p className="mt-2 text-3xl">{count}</p><p className="mt-1 text-xs text-muted-foreground">assertions without this field</p></EntryCard>)}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <input aria-label="Search provenance findings" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search record, source or gap…" className="rounded-sm border border-input bg-background px-3 py-2" />
          <select aria-label="Filter provenance gaps" value={gap} onChange={(event) => setGap(event.currentTarget.value as "all" | ProvenanceGapCode)} className="rounded-sm border border-input bg-background px-3 py-2">
            {GAP_FILTERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>

        <div className="mt-6 rounded-sm border border-border p-6">
          <h2 className="text-xl">Coverage</h2>
          <p className="mt-2 text-sm text-muted-foreground">{assertions.length} provenance assertions are linked to normalized bibliographic sources.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="text-xs text-muted-foreground">Claim-scoped</p><p className="text-2xl">{withClaim}</p></div>
            <div><p className="text-xs text-muted-foreground">Located</p><p className="text-2xl">{withLocator}</p></div>
            <div><p className="text-xs text-muted-foreground">Reviewed</p><p className="text-2xl">{withReview}</p></div>
            <div><p className="text-xs text-muted-foreground">Findings</p><p className="text-2xl">{findings.length}</p></div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {findings.map((finding) => (
            <EntryCard key={finding.recordId + "/" + finding.sourceId}>
              <p className="label-eyebrow text-terracotta">{finding.codes.join(" · ")}</p>
              <p className="mt-2 text-sm">Record: {finding.recordSlug}</p>
              <p className="mt-1 text-sm text-muted-foreground">Source: {finding.citation}</p>
              <p className="mt-2 text-xs text-muted-foreground">Source capture: {finding.sourceId}</p>
            </EntryCard>
          ))}
          {findings.length === 0 && <p className="text-sm text-muted-foreground">No provenance findings match the current filter.</p>}
        </div>
      </Section>
    </>
  );
}
