import { Link } from "@tanstack/react-router";
import { EntryCard } from "@/components/archive-ui";
import type { ArchiveRecord } from "@/data/types";
import { titleFor } from "@/data/archive-experience";
export function RecordLinkCard({record,eyebrow,note}:{record:ArchiveRecord;eyebrow?:string;note?:string}){return <EntryCard className="h-full">{eyebrow&&<p className="label-eyebrow text-terracotta">{eyebrow}</p>}<Link to="/archive/$type/$slug" params={{type:record.type,slug:record.slug}} className="mt-2 block text-xl text-foreground hover:text-terracotta">{titleFor(record)}</Link>{note&&<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>}</EntryCard>}
