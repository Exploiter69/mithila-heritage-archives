import { Link } from "@tanstack/react-router";

import { NAV, SECONDARY_NAV } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <p className="deva text-xl text-terracotta">मिथिला डिजिटल आर्काइव</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            An evidence-oriented archive of Maithili language, literature, art,
            music, heritage, people, places and sources.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            The catalogue is actively researched. Counts describe the current
            published dataset, not the entirety of Mithila's heritage.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="label-eyebrow text-muted-foreground">Collections</p>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="font-sans text-sm text-foreground/80 transition-colors hover:text-terracotta"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer research">
          <p className="label-eyebrow text-muted-foreground">Research</p>
          <ul className="mt-4 space-y-2">
            {([
              ["/research", "Research"],
              ["/search", "Search"],
              ["/sources", "Sources"],
              ["/graph", "Graph"],
              ["/media", "Media"],
              ["/atlas", "Cultural Atlas"],
              ["/explore", "Explore Mithila"],
              ["/provenance", "Provenance"],
              ["/sources-explorer", "Source Explorer"],
              ["/stats", "Archive status"],
            ] as const).map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="font-sans text-sm text-foreground/80 transition-colors hover:text-terracotta">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer secondary">
          <p className="label-eyebrow text-muted-foreground">More</p>
          <ul className="mt-4 space-y-2">
            {([...SECONDARY_NAV, { to: "/people", label: "People" }, { to: "/timeline", label: "Timeline" }, { to: "/learn", label: "Learn Mithila" }] as const).map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="font-sans text-sm text-foreground/80 transition-colors hover:text-terracotta"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 font-sans text-xs text-muted-foreground md:px-8">
          An open, non-commercial research archive. Texts quoted for study remain
          attributed to their editions and sources.
        </p>
      </div>
    </footer>
  );
}
