import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { artStyles } from "@/data/art";
import { dictionaryEntries } from "@/data/dictionary";
import { heritage } from "@/data/heritage";
import { literaryWorks } from "@/data/literature";
import { songs } from "@/data/music";

type Hit = {
  group: string;
  label: string;
  deva: string;
  keywords: string;
  to: string;
  hash: string;
};

const INDEX: Hit[] = [
  ...literaryWorks.map((w) => ({
    group: "Literature",
    label: `${w.transliteration} — ${w.author}`,
    deva: w.titleDeva,
    keywords: `${w.title} ${w.author} ${w.authorDeva} ${w.era} ${w.form}`,
    to: "/literature",
    hash: w.slug,
  })),
  ...songs.map((s) => ({
    group: "Music",
    label: `${s.transliteration} — ${s.performer}`,
    deva: s.titleDeva,
    keywords: `${s.title} ${s.performer} ${s.category} ${s.occasion}`,
    to: "/music",
    hash: s.slug,
  })),
  ...artStyles.map((a) => ({
    group: "Art",
    label: `${a.name} — Madhubani style`,
    deva: a.nameDeva,
    keywords: `${a.origin} ${a.motifs.join(" ")}`,
    to: "/art",
    hash: a.slug,
  })),
  ...heritage.map((h) => ({
    group: "Heritage",
    label: `${h.name} — ${h.kind}`,
    deva: h.nameDeva,
    keywords: `${h.place} ${h.period}`,
    to: "/heritage",
    hash: h.slug,
  })),
  ...dictionaryEntries.map((d) => ({
    group: "Dictionary",
    label: `${d.transliteration} — ${d.english.slice(0, 60)}`,
    deva: d.headword,
    keywords: `${d.hindi} ${d.english} ${d.wordClass}`,
    to: "/language",
    hash: d.slug,
  })),
];

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();

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

  const groups = Array.from(new Set(INDEX.map((i) => i.group)));

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput placeholder="Search in Devanagari or Latin — ओसार, Osaar, Bharnī, Chhath…" />
      <CommandList>
        <CommandEmpty>Nothing in v0.1 matches that yet.</CommandEmpty>
        {groups.map((g) => (
          <CommandGroup key={g} heading={g}>
            {INDEX.filter((i) => i.group === g).map((hit) => (
              <CommandItem
                key={`${hit.to}${hit.hash}`}
                value={`${hit.deva} ${hit.label} ${hit.keywords}`}
                onSelect={() => {
                  onOpenChange(false);
                  navigate({ to: hit.to, hash: hit.hash });
                }}
              >
                <span className="deva mr-2 text-base text-foreground">{hit.deva}</span>
                <span className="font-sans text-xs text-muted-foreground">{hit.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
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
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

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
