import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { getArchiveAuthors, getArchiveRecords } from "@/data/archive-read";
import { archiveRecordTitle } from "@/components/archive-record-page";

export const Route = createFileRoute("/people")({
  head: () => ({ meta: [{ title: "People of Mithila — Mithila Digital Archive" }] }),
  component: PeoplePage,
});

function PeoplePage() {
  const [q, setQ] = useState("");
  const people = getArchiveAuthors();
  const records = getArchiveRecords();
  const results = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase();
    return people.filter((person) =>
      [person.name, person.nameMai, person.role, person.place, person.bio, person.works.join(" ")]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [q, people]);

  return (
    <>
      <PageHeader
        eyebrow="People"
        title="People of Mithila"
        titleMai="मिथिलाक लोक"
        intro="Writers and cultural figures represented in the current canonical archive. The directory deliberately avoids unnecessary sensitive personal information."
      />
      <Section>
        <input aria-label="Search people" value={q} onChange={(event) => setQ(event.currentTarget.value)} placeholder="Search names, roles, places…" className="mb-6 w-full rounded-sm border border-input bg-background px-3 py-2" />
        <div className="grid gap-5 md:grid-cols-2">
          {results.map((person) => {
            const workRecords = person.works
              .map((workName) => {
                const normalized = workName.normalize("NFKC").toLocaleLowerCase().trim();
                return records.find((record) => {
                  if (record.type !== "literature-work") return false;
                  const content = record.content as Record<string, unknown>;
                  return [content['title'], content['title']Deva, content['title']Mai, content['transliteration'], record.slug.replaceAll("-", " ")]
                    .filter((value): value is string => typeof value === "string")
                    .some((value) => value.normalize("NFKC").toLocaleLowerCase().trim() === normalized);
                });
              })
              .filter((record): record is NonNullable<typeof record> => Boolean(record));
            return (
              <EntryCard key={person.slug}>
                <Link to="/archive/$type/$slug" params={{ type: "author", slug: person.slug }} className="text-xl hover:text-terracotta">{person.name}</Link>
                <p className="deva text-terracotta">{person.nameMai}</p>
                <p className="mt-2 text-sm text-muted-foreground">{person.role} · {person.place}</p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{person.bio}</p>
                <p className="label-eyebrow mt-5 text-muted-foreground">Documented works</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {workRecords.map((record) => (
                    <Link key={record.id} to="/archive/$type/$slug" params={{ type: record.type, slug: record.slug }} className="rounded-sm border border-border px-3 py-1.5 text-sm hover:border-gold">{archiveRecordTitle(record)}</Link>
                  ))}
                  {workRecords.length === 0 && <span className="text-sm text-muted-foreground">No canonical work endpoint currently matched.</span>}
                </div>
              </EntryCard>
            );
          })}
        </div>
        {results.length === 0 && <p className="text-sm text-muted-foreground">No people match the current search.</p>}
      </Section>
    </>
  );
}
