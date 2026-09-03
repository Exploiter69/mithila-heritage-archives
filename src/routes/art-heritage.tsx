import { createFileRoute } from "@tanstack/react-router";

import { EntryCard, MetaRow, PageHeader, Section, SourceNote } from "@/components/archive-ui";
import { art } from "@/data/archive";

const TITLE = "Mithila Art & Heritage — Mithila Digital Archive";
const DESC =
  "Mithila painting, aripan floor drawing, sikkī grass craft and the painted kohbar ghar — described with materials, region and documented sources.";

export const Route = createFileRoute("/art-heritage")({
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
  component: ArtPage,
});

function ArtPage() {
  return (
    <>
      <PageHeader
        eyebrow="Collection 06"
        title="Art & Heritage"
        titleMai="कला आ धरोहर"
        intro="Mithila's visual traditions are largely domestic in origin and largely made by women. They are described here as practices — materials, occasions, who makes them — rather than as a style."
      />

      <Section>
        <div className="mb-12 rounded-sm border border-gold/50 bg-gold-soft/30 p-6 md:p-8">
          <p className="label-eyebrow text-terracotta">Note on images</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            v0.1 carries no photographs. Mithila painting is a living tradition
            with living rights-holders, and the archive will not publish images
            until each can be reproduced with the artist's or collection's
            permission recorded alongside it.
          </p>
        </div>

        <ul className="space-y-6">
          {art.map((a) => (
            <li key={a.slug} id={a.slug}>
              <EntryCard>
                <div className="grid gap-6 md:grid-cols-[1fr_1.7fr]">
                  <div>
                    <h2 className="text-2xl leading-tight tracking-tight text-foreground">
                      {a.title}
                    </h2>
                    <MetaRow
                      items={[
                        ["Form", a.tradition],
                        ["Region", a.region],
                        ["Materials", a.materials],
                      ]}
                    />
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    <SourceNote source={a.source} />
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
