import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ARCHIVE_LOCALES, type ArchiveLocale } from "@/data/research-infrastructure";

import { GlobalSearch, SearchTrigger } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const NAV = [
  { to: "/literature", label: "Literature", deva: "साहित्य" },
  { to: "/music", label: "Music", deva: "संगीत" },
  { to: "/art", label: "Art", deva: "कला" },
  { to: "/heritage", label: "Heritage", deva: "धरोहर" },
  { to: "/language", label: "Language", deva: "भाषा" },
  { to: "/atlas", label: "Atlas", deva: "मानचित्र" },
  { to: "/explore", label: "Explore", deva: "देखू" },
] as const;

export const SECONDARY_NAV = [
  { to: "/authors", label: "Authors" },
  { to: "/proverbs", label: "Proverbs" },
  { to: "/about", label: "About & Sources" },
  { to: "/people", label: "People" },
  { to: "/timeline", label: "Timeline" },
  { to: "/learn", label: "Learn Mithila" },
  { to: "/stats", label: "Archive status" },
  { to: "/literature-portal", label: "Literature portal" },
  { to: "/language-lab", label: "Language Lab" },
  { to: "/art-atlas", label: "Art Atlas" },
  { to: "/music-archive", label: "Music Archive" },
  { to: "/graph", label: "Knowledge Graph" },
  { to: "/provenance", label: "Provenance" },
  { to: "/sources-explorer", label: "Source Explorer" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [locale, setLocale] = useState<ArchiveLocale>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem("mithila-archive-locale") as ArchiveLocale | null;
    const next = stored && ARCHIVE_LOCALES.includes(stored) ? stored : "en";
    setLocale(next);
    document.documentElement.lang = next;
  }, []);
  function changeLocale(next: ArchiveLocale) {
    setLocale(next);
    window.localStorage.setItem("mithila-archive-locale", next);
    document.documentElement.lang = next;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-baseline gap-2.5">
          <span className="deva text-lg leading-none text-terracotta">मि</span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.95rem] font-medium tracking-tight text-foreground">
              Mithila Digital Archive
            </span>
            <span className="deva mt-1 text-xs leading-none text-muted-foreground">
              मिथिला डिजिटल आर्काइव
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-sans text-[0.8rem] text-muted-foreground transition-colors hover:text-terracotta"
              activeProps={{ className: "text-terracotta" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="archive-locale">Interface language</label>
          <select id="archive-locale" value={locale} onChange={(event) => changeLocale(event.target.value as ArchiveLocale)} className="hidden h-8 rounded-sm border border-border bg-background px-2 text-xs text-muted-foreground sm:block" aria-label="Interface language">
            <option value="mai">मैथिली</option><option value="hi">हिन्दी</option><option value="en">English</option>
          </select>
          <ThemeToggle />
          <SearchTrigger onClick={() => setSearch(true)} />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-background p-0">
              <SheetTitle className="border-b border-border px-6 py-5 text-left text-base font-normal">
                <span className="deva text-terracotta">मिथिला डिजिटल आर्काइव</span>
              </SheetTitle>
              <nav aria-label="Primary mobile" className="px-6 py-4">
                <ul>
                  <li className="border-b border-border/70">
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="block py-3.5 font-sans text-base text-foreground"
                      activeProps={{ className: "text-terracotta" }}
                      activeOptions={{ exact: true }}
                    >
                      Home
                    </Link>
                  </li>
                  {NAV.map((item) => (
                    <li key={item.to} className="border-b border-border/70">
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline justify-between py-3.5 font-sans text-base text-foreground"
                        activeProps={{ className: "text-terracotta" }}
                      >
                        {item.label}
                        <span className="deva text-sm text-muted-foreground">{item.deva}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="label-eyebrow mt-7 text-muted-foreground">Also in the archive</p>
                <ul className="mt-2">
                  {SECONDARY_NAV.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="block py-2.5 font-sans text-sm text-muted-foreground"
                        activeProps={{ className: "text-terracotta" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="hidden items-center gap-3 xl:flex"><Link to="/research" className="font-sans text-[0.8rem] text-muted-foreground transition-colors hover:text-terracotta">Research</Link><Link to="/graph" className="font-sans text-[0.8rem] text-muted-foreground transition-colors hover:text-terracotta">Graph</Link></div>
        </div>
      </div>

      <GlobalSearch open={search} onOpenChange={setSearch} />
    </header>
  );
}
