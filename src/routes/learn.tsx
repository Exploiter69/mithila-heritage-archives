import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { LEARN_MODULES } from "@/data/archive-experience";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [{ title: "Learn Mithila — Mithila Digital Archive" }] }),
  component: LearnPage,
});

const destination: Record<string, "/language" | "/literature" | "/art" | "/music" | "/heritage" | "/archive/author/vidyapati" | "/explore"> = {
  maithili: "/language",
  literature: "/literature",
  art: "/art",
  music: "/music",
  heritage: "/heritage",
  vidyapati: "/archive/author/vidyapati",
  explore: "/explore",
};

function LearnPage() {
  return (
    <>
      <PageHeader eyebrow="Orientation" title="Learn Mithila" titleMai="मिथिला सीखू" intro="Start with a short orientation, then follow the archive's evidence-backed records for deeper reading." />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {LEARN_MODULES.map((module) => (
            <EntryCard key={module.slug}>
              <p className="label-eyebrow text-terracotta">{module.title}</p>
              <h2 className="deva mt-2 text-2xl">{module.deva}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{module.text}</p>
              <Link to={destination[module.slug] ?? "/explore"} className="mt-5 inline-block text-sm text-terracotta hover:underline">Continue →</Link>
            </EntryCard>
          ))}
        </div>
      </Section>
    </>
  );
}
