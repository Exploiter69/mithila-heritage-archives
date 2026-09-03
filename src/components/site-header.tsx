import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/literature", label: "Literature" },
  { to: "/authors", label: "Authors" },
  { to: "/language", label: "Language" },
  { to: "/dictionary", label: "Dictionary" },
  { to: "/proverbs", label: "Proverbs" },
  { to: "/art-heritage", label: "Art & Heritage" },
  { to: "/music", label: "Music" },
  { to: "/about", label: "About & Sources" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link to="/" className="group flex items-baseline gap-2.5" onClick={() => setOpen(false)}>
          <span className="deva text-lg leading-none text-terracotta">मि</span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.95rem] font-medium tracking-tight text-foreground">
              Mithila Digital Archive
            </span>
            <span className="label-eyebrow mt-1 text-muted-foreground">
              मिथिला · मैथिली
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-x-5 gap-y-1 lg:flex" aria-label="Primary">
          {NAV.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-sans text-[0.8rem] text-muted-foreground transition-colors hover:text-terracotta"
              activeProps={{ className: "text-terracotta" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-9 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-card lg:hidden"
          aria-label="Primary mobile"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2 md:px-8">
            {NAV.map((item) => (
              <li key={item.to} className="border-b border-border/60 last:border-0">
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-sans text-sm text-muted-foreground"
                  activeProps={{ className: "text-terracotta" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
