import type { ReactNode } from "react";

import type { Source } from "@/data/archive";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  titleMai,
  intro,
}: {
  eyebrow: string;
  title: string;
  titleMai?: string;
  intro: string;
}) {
  return (
    <header className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="label-eyebrow text-terracotta">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] font-normal tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {titleMai && (
          <p className="deva mt-3 text-2xl text-muted-foreground">{titleMai}</p>
        )}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </div>
    </header>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16", className)}>
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        {eyebrow && <p className="label-eyebrow text-terracotta">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl font-normal tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

const STATUS_LABEL: Record<Source["status"], string> = {
  verified: "Printed source",
  community: "Oral / community attested",
  "needs-review": "Needs review",
};

export function SourceNote({ source }: { source: Source }) {
  return (
    <div className="mt-5 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-eyebrow text-muted-foreground">Source</span>
        <span
          className={cn(
            "font-sans text-[0.65rem] tracking-wide uppercase rounded-sm px-1.5 py-0.5",
            source.status === "verified" && "bg-gold-soft text-accent-foreground",
            source.status === "community" && "bg-terracotta-soft text-foreground",
            source.status === "needs-review" &&
              "border border-terracotta text-terracotta",
          )}
        >
          {STATUS_LABEL[source.status]}
        </span>
      </div>
      <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
        {source.citation}
      </p>
      {source.detail && (
        <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground/80 italic">
          {source.detail}
        </p>
      )}
    </div>
  );
}

export function EntryCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-sm border border-border bg-card p-6 transition-colors duration-300 hover:border-gold",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function MetaRow({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
      {items.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="label-eyebrow pt-0.5 text-muted-foreground">{k}</dt>
          <dd className="font-sans text-sm text-foreground/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FilterBar({
  options,
  active,
  onSelect,
  label,
}: {
  options: string[];
  active: string;
  onSelect: (v: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          aria-pressed={active === opt}
          className={cn(
            "rounded-sm border px-3 py-1.5 font-sans text-xs transition-colors",
            active === opt
              ? "border-terracotta bg-terracotta text-primary-foreground"
              : "border-border text-muted-foreground hover:border-gold hover:text-foreground",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  id,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  id: string;
  label: string;
}) {
  return (
    <div className="w-full max-w-sm">
      <label htmlFor={id} className="label-eyebrow text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-input bg-card px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:ring-1 focus:ring-ring focus:outline-none"
      />
    </div>
  );
}
