import type { Source } from "./types";

export type HeritageKind = "Site" | "Festival";

export interface HeritageEntry {
  slug: string;
  name: string;
  nameDeva: string;
  kind: HeritageKind;
  place: string;
  period: string;
  summary: string;
  context: string[];
  source: Source;
}

export const heritage: HeritageEntry[] = [
  {
    slug: "rajnagar-palace",
    name: "Rajnagar Palace",
    nameDeva: "राजनगर राजमहल",
    kind: "Site",
    place: "Rajnagar, Madhubani district, Bihar",
    period: "Built 1882–1929; ruined by the 1934 earthquake",
    summary:
      "The palace complex of the Darbhanga Raj at Rajnagar, built by Maharaja Rameshwar Singh, now standing as an extensive ruin of marble temples, courts and gateways.",
    context: [
      "Rameshwar Singh developed Rajnagar as a ritual capital rather than an administrative one: the complex is organised around temples — Kālī, Girijā, Kāmākhyā — rather than around a durbar hall.",
      "The Bihar–Nepal earthquake of 15 January 1934 destroyed most of the structures within minutes. The estate never rebuilt, and the site was left as it fell.",
      "What survives is unusually legible: carved marble, spans of arcade, and temple plinths standing in open field, largely unrestored and unfenced.",
    ],
    source: {
      citation:
        "Bihar State Gazetteer, Darbhanga; and Report on the Bihar Earthquake of 1934, Geological Survey of India.",
      status: "verified",
    },
  },
  {
    slug: "simraungadh",
    name: "Simraungadh",
    nameDeva: "सिमरौनगढ़",
    kind: "Site",
    place: "Bara district, Nepal, on the Indo-Nepal border near Raxaul",
    period: "Founded 1097 CE by Nānyadeva; sacked 1324–26 CE",
    summary:
      "Capital of the Karṇāṭa dynasty, which ruled Mithila for over two centuries and under whose court Maithili first appears as a written language.",
    context: [
      "Nānyadeva established the city in 1097; his line ruled both sides of the present border, and the Karṇāṭa court is the setting for Jyotirīśvara's Varṇa Ratnākara.",
      "Ghiyāsuddīn Tughlaq's campaign of 1324–26 ended the dynasty; the last ruler Harisiṃhadeva withdrew to the Nepal hills, carrying the Taleju cult with him.",
      "The site today is a large field of earthworks, tanks and scattered brick, only partly excavated, straddling farmland in Bara district.",
    ],
    source: {
      citation:
        "R. K. Choudhary, History of Muslim Rule in Tirhut; Department of Archaeology, Nepal, site reports.",
      status: "verified",
    },
  },
  {
    slug: "kapileshwar-nath",
    name: "Kapileshwar Nath",
    nameDeva: "कपिलेश्वर नाथ",
    kind: "Site",
    place: "Kapileshwar, west of Darbhanga town",
    period: "Living temple; associated in tradition with the sage Kapila",
    summary:
      "One of the principal Śiva temples of the Darbhanga plain, the focus of a large Śivarātri fair and of Śrāvaṇ month water-offerings.",
    context: [
      "The liṅga is a svayambhū shrine in local reckoning, and the temple is counted among the older Śaiva sites of Mithila alongside Ugnā Mahādev and Bābā Bāidyanāth further south.",
      "Through Śrāvaṇ, kāṃvariyās carry Ganges water on foot to the shrine; the routes into Kapileshwar are a fixed part of the district's ritual calendar.",
      "The surrounding grove and tank are managed by the temple trust; the annual Śivarātri melā draws crowds from across Darbhanga and Madhubani.",
    ],
    source: {
      citation: "District Gazetteer of Darbhanga; temple trust records.",
      status: "community",
      detail: "Foundation date is traditional rather than documented.",
    },
  },
  {
    slug: "chhath",
    name: "Chhath",
    nameDeva: "छठ",
    kind: "Festival",
    place: "Across Mithila; at river ghats, ponds and field tanks",
    period: "Kārtik Śukla Ṣaṣṭhī, four days, October–November",
    summary:
      "The four-day sun festival: nahāy-khāy, kharnā, the evening arghya to the setting sun and the morning arghya to the rising sun.",
    context: [
      "The vratī fasts without water for roughly thirty-six hours and stands in the water to make the offering — a rite performed without a priest, which is unusual in the region's ritual life.",
      "The offering basket is fixed: ṭhekuā, sugarcane, banana, coconut and seasonal fruit, carried to the ghat in a bamboo soop and daura.",
      "Uniquely, the setting sun is worshipped before the rising one; the songs sung at the ghat are the Chhaṭhī Maiyā repertoire, popularised nationally by Sharda Sinha.",
    ],
    source: {
      citation:
        "Ethnographic accounts in Bihar folk-religion surveys; widely documented practice.",
      status: "verified",
    },
  },
  {
    slug: "sama-chakeva",
    name: "Sāmā Chakevā",
    nameDeva: "सामा चकेवा",
    kind: "Festival",
    place: "Village courtyards across Mithila and the Nepal Tarai",
    period: "Kārtik Śukla Saptamī to Pūrṇimā, seven nights",
    summary:
      "A sisters' festival of clay birds: girls model Sāmā, Chakevā, Chugalā and the flock, sing to them for a week, and break them at the end.",
    context: [
      "The story is of Sāmā, daughter of Kṛṣṇa, slandered by the courtier Chugalā and cursed to the form of a bird, and of her brother Chakevā, who wins her release.",
      "The figures are made from pond clay and painted; the songs, sung only by women and only in this week, mock Chugalā and bless the brothers.",
      "On Kārtik Pūrṇimā the figures are broken and immersed and the sisters feed their brothers — a rite of sibling obligation with no priestly component at all.",
    ],
    source: {
      citation:
        "Documented in Maithili folklore collections; observed practice in Madhubani and Saptari districts.",
      status: "verified",
    },
  },
  {
    slug: "vivah-panchami",
    name: "Vivāh Pañcamī",
    nameDeva: "विवाह पंचमी",
    kind: "Festival",
    place: "Janakpurdham, Dhanusha district, Nepal",
    period: "Mārgaśīrṣa Śukla Pañcamī, November–December",
    summary:
      "The annual re-enactment of the marriage of Rāma and Sītā at Janakpur, the traditional capital of Videha and the seat of King Janaka.",
    context: [
      "Janakpurdham identifies itself as Mithilā's ritual centre; the Janakī Mandir, built in 1910, is the focus of a week of processions, tilak and the marriage rite itself.",
      "Barāt parties travel from Ayodhya to Janakpur for the occasion, and the exchange between the two towns is treated as an affinal relationship between places.",
      "Maithili wedding song — samdāun, baṭgamanī and the kohbar repertoire — is performed publicly during the week, making it the largest annual display of the region's wedding music.",
    ],
    source: {
      citation:
        "Janaki Mandir trust accounts; Nepal Tourism Board and district records.",
      status: "verified",
    },
  },
];
