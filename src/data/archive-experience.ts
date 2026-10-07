import { canonicalArchive } from "./archive-foundation";
import { getArchiveRecords, getArchiveAuthors } from "./archive-read";
import { getRelatedRecords, TYPE_LABELS, getArchiveStats } from "./archive-platform";
import type { ArchiveRecord, ArchiveRecordType } from "./types";

export interface ExploreJourney {
  slug: string; title: string; titleDeva: string; intro: string;
  recordTypes: ArchiveRecordType[]; slugs: string[];
}
export const EXPLORE_JOURNEYS: ExploreJourney[] = [
  { slug:"literature", title:"Literature", titleDeva:"साहित्य", intro:"Follow authors, works, forms and the documented literary record.", recordTypes:["literature-work","author"], slugs:["vidyapati","vidyapati-padavali","kirtilata","varna-ratnakara"] },
  { slug:"language", title:"Language", titleDeva:"भाषा", intro:"Move from everyday words to grammar, idiom and lexical research leads.", recordTypes:["dictionary-entry","proverb"], slugs:["gaam","osaar","khaenai","aankh-ke-dekhal"] },
  { slug:"culture", title:"Culture", titleDeva:"संस्कृति", intro:"Explore festivals, ritual traditions and the places where culture is practiced.", recordTypes:["heritage-entry","song"], slugs:["jitiya-jivitputrika","jur-sital","chaurchan","sohar-lalna-re"] },
  { slug:"art", title:"Art", titleDeva:"कला", intro:"Start with Mithila painting, ritual drawing, styles and motifs.", recordTypes:["art-entry","art-style"], slugs:["mithila-painting","aripan","kohbar"] },
  { slug:"music", title:"Music", titleDeva:"संगीत", intro:"Explore ritual, seasonal, life-cycle and devotional music without fabricating recordings or lyrics.", recordTypes:["music-entry","song"], slugs:["madhushravani-geet","vivah-geet-cycle","samdaun-research","nachari-research"] },
  { slug:"heritage", title:"Places", titleDeva:"धरोहर", intro:"Visit the archive geographically through heritage sites and cultural landscapes.", recordTypes:["heritage-entry"], slugs:["janaki-mandir","ganga-sagar","dhanushadham","rajnagar-palace"] },
];
export const LEARN_MODULES = [
  { slug:"what-is-mithila", title:"What is Mithila?", deva:"मिथिला की?", text:"An introductory orientation to the cultural region, its literary traditions, language, arts, music and heritage. This guide links outward to sourced archive records rather than replacing them." },
  { slug:"maithili", title:"What is Maithili?", deva:"मैथिली भाषा", text:"A living Indo-Aryan language with a substantial literary and oral record. Use the Language Lab to move from orientation into documented lexical material." },
  { slug:"vidyapati", title:"Meet Vidyapati", deva:"विद्यापति", text:"Start with the author record, then follow the explicitly asserted work relationships into Padāvalī and other works." },
  { slug:"literature", title:"Mithila's literature", deva:"मैथिली साहित्य", text:"Browse literature by form and period, including the Sahitya Akademi Maithili award corpus and catalogue leads." },
  { slug:"art", title:"Mithila art", deva:"मिथिला कला", text:"Learn the archive's documented art traditions and use the motif atlas to distinguish sourced description from editorial interpretation." },
  { slug:"music", title:"Folk music", deva:"लोक संगीत", text:"Explore ritual and seasonal repertoire, performers and institutional recording leads. Where a recording is not attached, the archive says so." },
  { slug:"heritage", title:"Heritage places", deva:"धरोहर स्थल", text:"Explore temples, ponds, archaeological and cultural landscapes with source-backed location information where available." },
];
export interface TimelineEvent { year:number; label:string; description:string; slug?:string; type?:ArchiveRecordType; status?:string; }
export const MITHILA_TIMELINE: TimelineEvent[] = [
  { year:1352, label:"Vidyāpati", description:"A commonly cited birth-year anchor; scholarship on Vidyāpati chronology remains contested, so this is an orientation date rather than a precise biographical claim.", slug:"vidyapati", type:"author" },
  { year:1400, label:"Kīrtilatā", description:"A canonical literary work associated with Vidyāpati in the archive's explicit relationship layer.", slug:"kirtilata", type:"literature-work" },
  { year:1324, label:"Varṇa Ratnākara", description:"A major early Maithili prose work associated with Jyotirīśvara and the Karṇāṭa court at Simraungadh.", slug:"varna-ratnakara", type:"literature-work" },
  { year:1881, label:"Grierson's Maithili study", description:"An Introduction to the Maithili Language anchors the archive's historical language-source layer.", status:"source milestone" },
  { year:1966, label:"Sahitya Akademi Maithili awards", description:"The award corpus begins in the archive with the 1966 Maithili award record.", status:"award corpus" },
  { year:2002, label:"Institutional folk-singing documentation", description:"Sahitya Akademi's Loka archive records Maithili folk-singing demonstration by Vindhyavasini Devi in its programme documentation.", status:"institutional archive" },
  { year:2008, label:"Ram Janaki Temple tentative-list submission", description:"UNESCO's Tentative List records the Ram Janaki Temple submission and coordinates.", slug:"janaki-mandir", type:"heritage-entry" },
  { year:2026, label:"Mithila Digital Archive expansion", description:"The archive enters its current research-expansion phase, preserving uncertainty and source provenance as first-class metadata.", status:"archive milestone" },
];
export interface AtlasPoint { slug:string; title:string; deva:string; lat:number; lon:number; region:string; source:string; sourceUrl:string; exact:boolean; }
export const CULTURAL_ATLAS_POINTS: AtlasPoint[] = [
  { slug:"janaki-mandir", title:"Janaki Mandir", deva:"जानकी मन्दिर", lat:26.73028, lon:85.92556, region:"Janakpur, Dhanusha, Nepal", source:"UNESCO Tentative List / Department of Archaeology", sourceUrl:"https://whc.unesco.org/en/tentativelists/5261", exact:true },
  { slug:"ram-mandir-janakpur", title:"Ram Mandir, Janakpur", deva:"राम मन्दिर", lat:26.72837, lon:85.92686, region:"Janakpur, Dhanusha, Nepal", source:"Open geographic reference; coordinate treated as a mapped location", sourceUrl:"https://mapcarta.com/28233390", exact:true },
  { slug:"dhanushadham", title:"Dhanushadham", deva:"धनुषाधाम", lat:26.84, lon:86.07, region:"Dhanusha, Nepal", source:"Open geographic reference; municipality coordinate", sourceUrl:"https://mapcarta.com/28233990", exact:false },
  { slug:"rajnagar-palace", title:"Rajnagar", deva:"राजनगर", lat:26.3851, lon:86.1551, region:"Madhubani, Bihar, India", source:"Open geographic reference; locality coordinate", sourceUrl:"https://mapcarta.com/37716836", exact:false },
];
export function titleFor(record:ArchiveRecord):string { const c=record.content as Record<string,unknown>; for(const key of ["title","name","headword","text","transliteration"]) if(typeof c[key]==="string" && c[key]) return c[key] as string; return record.slug; }
export function recordBySlug(slug:string){return canonicalArchive.records.find(r=>r.slug===slug);}
export function journeyRecords(j:ExploreJourney){return j.slugs.map(recordBySlug).filter((r):r is ArchiveRecord=>Boolean(r));}
export function relatedBySlug(slug:string){const r=recordBySlug(slug);return r?getRelatedRecords(r):[];}
export function graphNeighbors(r:ArchiveRecord){return getRelatedRecords(r).map(x=>({...x,title:titleFor(x.target),typeLabel:TYPE_LABELS[x.target.type]}));}
export function archiveEvidenceStats(){const records=getArchiveRecords();const counts={verified:0,"community-attested":0,"needs-review":0,disputed:0};for(const r of records)counts[r.verificationStatus]++;return {...getArchiveStats(),statuses:counts,people:getArchiveAuthors().length,literature:records.filter(r=>r.type==="literature-work").length,language:records.filter(r=>r.type==="dictionary-entry").length,music:records.filter(r=>r.type==="song"||r.type==="music-entry").length,art:records.filter(r=>r.type==="art-entry"||r.type==="art-style").length,heritage:records.filter(r=>r.type==="heritage-entry").length};}

export const ART_MOTIFS=[["Fish","माछ","Recurring visual motif; interpretation depends on tradition and source."],["Lotus","कमल","Recurring vegetal motif; meanings should be tied to documented context."],["Peacock","मोर","Recurring decorative and symbolic motif."],["Bamboo","बाँस","Material and visual motif with domestic and ritual presence."],["Sun","सूर्य","Common celestial motif; ritual meaning varies by context."],["Moon","चन्द्र","Common celestial motif; interpretation varies by tradition."],["Turtle","कछुआ","Recurring motif; no universal meaning asserted."],["Serpent","नाग","Recurring motif; meanings require source-level context."],["Tree of life","जीवन-वृक्ष","Descriptive label; no universal interpretation asserted."],["Geometry","ज्यामितीय रूप","Recurring decorative forms across styles."]] as const;

export function atlasPointRecords() {
  return CULTURAL_ATLAS_POINTS.map((point) => ({
    point,
    record: recordBySlug(point.slug),
  }));
}

export interface CorpusTimelineEvent extends TimelineEvent {
  sourceRecordId: string;
  precision: "year-extracted" | "orientation-only";
}

function firstExplicitYear(record: ArchiveRecord): number | undefined {
  const content = record.content as Record<string, unknown>;
  for (const field of ["year", "publicationYear", "awardYear", "era", "period", "lifespan"]) {
    const value = content[field];
    if (typeof value === "number" && Number.isInteger(value)) return value;
    if (typeof value === "string") {
      const match = value.match(/\\b(1[0-9]{3}|2[0-9]{3})\\b/);
      if (match) return Number(match[1]);
    }
  }
  return undefined;
}

export function getCorpusTimelineEvents(): CorpusTimelineEvent[] {
  return canonicalArchive.records
    .filter((record) => record.contentStatus === "published")
    .flatMap((record) => {
      const year = firstExplicitYear(record);
      if (year === undefined) return [];
      return [{
        year,
        label: titleFor(record),
        description: "Chronological anchor extracted from the record's structured date/period field; it is not an independent biographical or historical assertion.",
        slug: record.slug,
        type: record.type,
        sourceRecordId: record.id,
        precision: "year-extracted" as const,
      }];
    })
    .sort((a, b) => a.year - b.year || a.label.localeCompare(b.label));
}

export function provenanceCoverage(){const a=canonicalArchive.provenanceV2;return {assertions:a.length,locators:a.filter(x=>!!x.locator).length,claims:a.filter(x=>!!x.claimId).length,reviewers:a.filter(x=>!!x.checkedBy).length,checked:a.filter(x=>!!x.checkedAt).length};}
