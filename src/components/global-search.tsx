import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchArchive } from "@/data/archive-read";

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(
    () => searchArchive(query, { limit: 30 }),
    [query],
  );

  const groups = useMemo(() => {
    const grouped = new Map<string, typeof results>();

    for (const result of results) {
      const existing = grouped.get(result.typeLabel);
      if (existing) existing.push(result);
      else grouped.set(result.typeLabel, [result]);
    }

    return grouped;
  }, [results]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search in Devanagari or Latin — ओसार, Osaar, Bharnī, Chhath…"
      />

      <CommandList>
        {!query.trim() ? (
          <CommandEmpty>Search the Mithila Heritage Archive…</CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>
            Nothing in the archive matches “{query}”.
          </CommandEmpty>
        ) : (
          <>
            <div className="px-3 py-2 text-xs text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </div>

            {Array.from(groups.entries()).map(([label, hits]) => (
              <CommandGroup key={label} heading={label}>
                {hits.map((hit) => (
                  <CommandItem
                    key={hit.record.id}
                    value={hit.record.id}
                    onSelect={() => {
                      onOpenChange(false);
                      navigate({ to: hit.url });
                    }}
                  >
                    <div className="min-w-0">
                      <div className="truncate">
                        <span className="deva mr-2 text-base text-foreground">
                          {hit.title}
                        </span>
                      </div>

                      {hit.secondary && (
                        <div className="truncate font-sans text-xs text-muted-foreground">
                          {hit.secondary}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function SearchTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  const [mac, setMac] = useState(false);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search the archive"
      className={
        className ??
        "inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-1.5 font-sans text-xs text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
      }
    >
      <Search className="size-3.5" />
      <span className="hidden sm:inline">Search the archive</span>
      <kbd className="hidden rounded-sm border border-border px-1 py-0.5 text-[0.6rem] lg:inline">
        {mac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}
