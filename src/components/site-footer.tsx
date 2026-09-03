import { Link } from "@tanstack/react-router";

import { NAV, SECONDARY_NAV } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="deva text-xl text-terracotta">मिथिला डिजिटल आर्काइव</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A reference archive of Maithili language, letters and material
            culture. Every entry carries its source; entries resting on oral
            attestation say so plainly.
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

        <nav aria-label="Footer secondary">
          <p className="label-eyebrow text-muted-foreground">More</p>
          <ul className="mt-4 space-y-2">
            {SECONDARY_NAV.map((item) => (
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
          v0.1 — an open, non-commercial reference project. Texts quoted for
          study and attributed to their editions.
        </p>
      </div>
    </footer>
  );
}
