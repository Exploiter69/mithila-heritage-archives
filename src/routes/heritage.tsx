import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  EntryCard,
  FilterBar,
  MetaRow,
  PageHeader,
  Section,
  SourceNote,
} from "@/components/archive-ui";
import { heritage } from "@/data/heritage";

const TITLE = "Mithila Heritage — Sites & Festivals — Mithila Digital Archive";
const DESC =
  "Rajnagar Palace, Simraungadh, Kapileshwar Nath, Chhath, Sāmā Chakevā and Vivāh Pañcamī — the places and festivals of Mithila, with context and sources.";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HeritagePage,
});

const FILTERS = ["All", "Site", "Festival"];

function HeritagePage() {
  const [kind, setKind] = useState("All");
  const results = heritage.filter((h) => kind === "All" || h.kind === kind);

  return (
    <>
      <PageHeader
        eyebrow="Collection — धरोहर"
        title="Heritage"
        titleMai="मिथिलाक धरोहर"
        intro="Mithila's heritage is held in two forms: places that survive as ruin or living shrine, and festivals that are rebuilt from scratch every year. Both are listed here with the context that makes them legible."
      />

      <Section>
        <div className="mb-10 border-b border-border pb-8">
          <FilterBar
            label="Filter by kind"
            options={FILTERS}
            active={kind}
            onSelect={setKind}
          />
        </div>

        <ul className="space-y-6">
          {results.map((h) => (
            <li key={h.slug} id={h.slug} className="scroll-mt-24">
              <EntryCard>
                <div className="grid gap-6 md:grid-cols-[1fr_1.6fr]">
                  <div>
                    <span className="label-eyebrow text-terracotta">{h.kind}</span>
                    <h2 className="mt-2 text-2xl leading-tight tracking-tight text-foreground">
                      {h.name}
                    </h2>
                    <p className="deva mt-1 text-xl text-muted-foreground">{h.nameDeva}</p>
                    <MetaRow
                      items={[
                        ["Place", h.place],
                        ["Period", h.period],
                      ]}
                    />
                  </div>

                  <div>
                    <p className="text-lg leading-relaxed text-foreground/90">{h.summary}</p>
                    <ul className="mt-5 space-y-3">
                      {h.context.map((c) => (
                        <li
                          key={c}
                          className="border-l-2 border-gold pl-4 leading-relaxed text-muted-foreground"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                    <SourceNote source={h.source} />
                  </div>
                </div>
              </EntryCard>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
