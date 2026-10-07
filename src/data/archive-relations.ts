import type { ArchiveRecord, RecordRelation, RelationPredicate, SourceRecord } from "./types";
import { sahityaAkademiMaithiliAwards } from "./content-expansion-literature";
import { awardRecipientAuthors } from "./content-expansion-deep";

type RelationSpec = {
  from: string;
  to: string;
  predicate: RelationPredicate;
  note?: string;
};

const RELATION_SPECS: RelationSpec[] = [
  { from: "vidyapati", to: "vidyapati-padavali", predicate: "has-work", note: "The author record explicitly lists Padāvalī among Vidyāpati's works." },
  { from: "vidyapati", to: "kirtilata", predicate: "has-work", note: "The author record explicitly lists Kīrtilatā among Vidyāpati's works." },
  { from: "vidyapati", to: "gorakh-vijay", predicate: "has-work", note: "The work record attributes Gorakṣa Vijaya to Vidyāpati, while marking the attribution needs-review." },
  { from: "jyotirishvara", to: "varna-ratnakara", predicate: "has-work", note: "The author record explicitly lists Varṇa Ratnākara among Jyotirīśvara's works." },
  { from: "chanda-jha", to: "chanda-jhas-ramayana", predicate: "has-work", note: "The author record explicitly lists Mithilā-bhāṣā Rāmāyaṇa among Chandā Jhā's works." },
  { from: "varna-ratnakara", to: "simraungadh", predicate: "about", note: "The heritage record explicitly identifies the Karṇāṭa court at Simraungadh as the setting associated with Varṇa Ratnākara." },
  { from: "bad-sukh-sar", to: "vidyapati-padavali", predicate: "part-of", note: "The song record identifies the composition as a Vidyāpati padāvalī lyric." },
  { from: "sohar-lalna-re", to: "sohar", predicate: "example-of", note: "The song is explicitly categorized as sohar and describes the sohar birth-song tradition." },
  { from: "sama-chakeva-lokgeet", to: "sama-chakeva", predicate: "associated-with", note: "The song record explicitly places the repertoire in the Sāmā Chakevā festival." },
  { from: "kaanch-hi-baans-ke-bahangiya", to: "chhath", predicate: "associated-with", note: "The song record explicitly identifies the repertoire as a Chhath song." },
  { from: "batgamani-vidai", to: "vivah-panchami", predicate: "associated-with", note: "The song record identifies baṭgamanī as Maithili wedding repertoire; the heritage record identifies the same repertoire at Vivāh Pañcamī." },
  { from: "kohbar-ghar", to: "kohbar", predicate: "related-to", note: "The kohbar ghar record explicitly describes the kohbar painting as the household's nuptial-wall practice." },
  { from: "aripan", to: "mithila-painting", predicate: "related-to", note: "Both records explicitly describe Mithila visual/ritual drawing traditions, while remaining distinct practices." },
];

const AWARD_RELATION_SPECS: RelationSpec[] = sahityaAkademiMaithiliAwards.map((award) => {
  const author = awardRecipientAuthors.find((entry) => entry.name === award.author);
  return {
    from: author?.slug ?? "",
    to: award.slug,
    predicate: "has-work" as const,
    note: `The Sahitya Akademi award register links ${award.author} with ${award.title} as the Maithili award recipient work for ${award.awardYear}.`,
  };
});

export function buildArchiveRelations(
  records: ArchiveRecord[],
  sources: SourceRecord[],
): RecordRelation[] {
  const bySlug = new Map(records.map((record) => [record.slug, record]));
  const sourceIds = new Map(sources.map((source) => [source.id, source]));

  return [...RELATION_SPECS, ...AWARD_RELATION_SPECS].flatMap((spec) => {
    const from = bySlug.get(spec.from);
    const to = bySlug.get(spec.to);
    if (!from || !to || from.id === to.id) return [];

    const ids = [...from.sourceIds, ...to.sourceIds].filter(
      (id, index, all) => all.indexOf(id) === index && sourceIds.has(id),
    );

    return [{
      id: `relation:${spec.from}:${spec.predicate}:${spec.to}`,
      fromRecordId: from.id,
      toRecordId: to.id,
      predicate: spec.predicate,
      sourceIds: ids,
      ...(spec.note ? { note: spec.note } : {}),
    }];
  });
}
