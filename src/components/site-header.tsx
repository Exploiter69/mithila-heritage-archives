import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { GlobalSearch, SearchTrigger } from "@/components/global-search";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const NAV = [
  { to: "/literature", label: "Literature", deva: "साहित्य" },
  { to: "/music", label: "Music", deva: "संगीत" },
  { to: "/art", label: "Art", deva: "कला" },
  { to: "/heritage", label: "Heritage", deva: "धरोहर" },
  { to: "/language", label: "Language", deva: "भाषा" },
] as const;

export const SECONDARY_NAV = [
  { to: "/authors", label: "Authors" },
  { to: "/proverbs", label: "Proverbs" },
  { to: "/about", label: "About & Sources" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

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
        </div>
      </div>

      <GlobalSearch open={search} onOpenChange={setSearch} />
    </header>
  );
}
