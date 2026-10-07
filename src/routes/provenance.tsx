import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { canonicalArchive } from "@/data/archive-foundation";

export const Route=createFileRoute("/provenance")({
  head:()=>({meta:[{title:"Claim & Provenance Audit — Mithila Digital Archive"},{name:"description",content:"Inspect claim-level provenance coverage, locators and editorial review gaps in the Mithila archive."}]}),
  component:ProvenancePage,
});

function ProvenancePage(){
  const assertions=canonicalArchive.provenanceV2;
  const withLocator=assertions.filter(a=>Boolean(a.locator)).length;
  const withClaim=assertions.filter(a=>Boolean(a.claimId)).length;
  const withReview=assertions.filter(a=>Boolean(a.checkedAt||a.checkedBy)).length;
  const gaps=[
    ["Claim scope",assertions.length-withClaim],
    ["Locator/page/section",assertions.length-withLocator],
    ["Reviewer/check date",assertions.length-withReview],
    ["Editorial note",assertions.filter(a=>!a.editorialNote).length],
  ];
  return <><PageHeader eyebrow="Scholarly evidence" title="Claim & Provenance Audit" titleMai="प्रमाण आकलन" intro="This page makes evidence coverage measurable. Missing claim scopes, locators and review metadata are displayed as editorial work still to do; the archive never invents them."/><Section><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{gaps.map(([label,count])=><EntryCard key={label}><p className="label-eyebrow text-muted-foreground">{label}</p><p className="mt-2 text-3xl">{count}</p><p className="mt-1 text-xs text-muted-foreground">assertions without this field</p></EntryCard>)}</div><div className="mt-8 rounded-sm border border-border p-6"><h2 className="text-xl">Coverage</h2><p className="mt-2 text-sm text-muted-foreground">{assertions.length} provenance assertions are linked to normalized bibliographic sources.</p><div className="mt-5 grid gap-3 md:grid-cols-3"><div><p className="text-xs text-muted-foreground">Claim-scoped</p><p className="text-2xl">{withClaim}</p></div><div><p className="text-xs text-muted-foreground">Located</p><p className="text-2xl">{withLocator}</p></div><div><p className="text-xs text-muted-foreground">Reviewed</p><p className="text-2xl">{withReview}</p></div></div></div><div className="mt-8 space-y-3">{assertions.slice(0,120).map(a=><EntryCard key={a.id}><p className="label-eyebrow text-terracotta">{a.verificationStatus} · {a.evidenceRole}</p><p className="mt-2 text-sm">Record: {a.recordId}</p><p className="mt-1 text-sm text-muted-foreground">Source: {a.bibliographicSourceId}</p><p className="mt-3 text-xs text-muted-foreground">{a.claimId?"Claim "+a.claimId:"No claim ID"} · {a.locator?"Locator "+a.locator:"No locator"} · {a.checkedAt?"Checked "+a.checkedAt:"Not reviewed"}</p></EntryCard>)}</div></Section></>;
}
