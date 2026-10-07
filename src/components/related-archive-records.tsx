import { Link } from "@tanstack/react-router";
import { getRelatedRecords } from "@/data/archive-platform";
import type { ArchiveRecord } from "@/data/types";
import { archiveRecordTitle } from "./archive-record-page";

export function RelatedArchiveRecords({ record }: { record: ArchiveRecord }) {
  const related = getRelatedRecords(record);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-normal tracking-tight text-foreground">
        Related records
      </h2>
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {related.map(({ relation, target }) => (
          <li key={relation.id}>
            <Link
              to="/archive/$type/$slug"
              params={{ type: target.type, slug: target.slug }}
              className="block rounded-sm border border-border bg-secondary/40 p-4 transition-colors hover:border-gold"
            >
              <p className="label-eyebrow text-terracotta">{relation.predicate}</p>
              <p className="mt-1 text-lg text-foreground">{archiveRecordTitle(target)}</p>
              {relation.note && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{relation.note}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
