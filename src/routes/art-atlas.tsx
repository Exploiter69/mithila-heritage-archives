import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, EntryCard } from "@/components/archive-ui";
import { CommonsImageFigure } from "@/components/commons-image";
import { getArchiveArtMotifs, getArchiveContent } from "@/data/archive-read";
import type { ArtStyle } from "@/data/art";

export const Route = createFileRoute("/art-atlas")({
  head: () => ({ meta: [{ title: "Mithila Art Atlas — Mithila Digital Archive" }] }),
  component: ArtAtlasPage,
});

function ArtAtlasPage() {
  const styles = getArchiveContent<ArtStyle>("art-style");
  const motifs = getArchiveArtMotifs();
  return (
    <>
      <PageHeader eyebrow="Visual culture" title="Mithila Art Atlas" titleMai="मिथिला कला एटलस" intro="Browse documented traditions, materials, techniques and a small motif index. Image attribution is preserved from Wikimedia Commons records; motif meanings are presented as source-aware archive metadata rather than universal interpretations." />
      <Section>
        <h2 className="text-2xl">Traditions & styles</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {styles.map((style) => (
            <EntryCard key={style.slug}>
              <p className="label-eyebrow text-terracotta">{style.origin}</p>
              <h3 className="mt-2 text-xl"><Link to="/archive/$type/$slug" params={{ type: "art-style", slug: style.slug }} className="hover:text-terracotta">{style.name}</Link></h3>
              <p className="deva text-muted-foreground">{style.nameDeva}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{style.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="label-eyebrow text-muted-foreground">Technique</dt><dd className="mt-1">{style.technique}</dd></div>
                <div><dt className="label-eyebrow text-muted-foreground">Materials</dt><dd className="mt-1">{style.dyes.join(", ")}</dd></div>
              </dl>
              {style.image && <div className="mt-5"><CommonsImageFigure image={style.image} subject={style.nameDeva || style.name} loading="lazy" /></div>}
              <div className="mt-4 flex flex-wrap gap-2">{style.motifs.map((motif) => <span key={motif} className="rounded-full border border-border px-2.5 py-1 text-xs">{motif}</span>)}</div>
            </EntryCard>
          ))}
        </div>
        <h2 className="mt-12 text-2xl">Motif index</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {motifs.map((motif) => <EntryCard key={motif.name}><h3 className="deva text-xl">{motif.nameDeva}</h3><p className="mt-1 text-sm">{motif.name}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{motif.meaning}</p></EntryCard>)}
        </div>
      </Section>
    </>
  );
}
