import { ExternalLink } from "lucide-react";

import type { CommonsImage } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Displays a Wikimedia Commons image with its mandatory attribution badge:
 * subject, contributor credit, licence (linked to the deed and the file page)
 * and — where relevant — a motif / symbolism breakdown.
 */
export function CommonsImageFigure({
  image,
  subject,
  className,
  showMotifs = true,
}: {
  image: CommonsImage;
  subject: string;
  className?: string;
  showMotifs?: boolean;
}) {
  return (
    <figure className={cn("overflow-hidden rounded-sm border border-border bg-secondary/40", className)}>
      <img
        src={image.url}
        alt={`${subject} — ${image.caption}`}
        loading="lazy"
        decoding="async"
        className="aspect-4/3 w-full object-cover"
      />

      <figcaption className="space-y-3 p-4">
        <p className="label-eyebrow text-terracotta">{subject}</p>
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">{image.caption}</p>

        {showMotifs && image.motifs && image.motifs.length > 0 && (
          <div className="border-t border-border pt-3">
            <p className="label-eyebrow text-muted-foreground">Motifs & symbolism</p>
            <ul className="mt-2 space-y-2">
              {image.motifs.map((m) => (
                <li key={m.name} className="border-l-2 border-gold pl-3">
                  <p className="font-sans text-sm text-foreground/90">{m.name}</p>
                  <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                    {m.meaning}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <p className="label-eyebrow text-muted-foreground">Image credit</p>
          <dl className="mt-2 space-y-1 font-sans text-xs leading-relaxed text-muted-foreground">
            <div className="flex gap-2">
              <dt className="shrink-0 text-foreground/70">File</dt>
              <dd className="min-w-0">
                <a
                  href={image.filePage}
                  target="_blank"
                  rel="noopener noreferrer license"
                  className="inline-flex items-center gap-1 underline decoration-gold underline-offset-2 transition-colors hover:text-terracotta"
                >
                  {image.fileTitle}
                  <ExternalLink className="size-3 shrink-0" />
                </a>{" "}
                — Wikimedia Commons
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-foreground/70">Credit</dt>
              <dd>{image.credit}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-foreground/70">Licence</dt>
              <dd>
                <a
                  href={image.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer license"
                  className="inline-flex items-center gap-1 underline decoration-gold underline-offset-2 transition-colors hover:text-terracotta"
                >
                  {image.license}
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              </dd>
            </div>
          </dl>
          {image.note && (
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground italic">
              {image.note}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
