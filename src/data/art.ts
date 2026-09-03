import type { Source } from "./types";

export interface ArtStyle {
  slug: string;
  name: string;
  nameDeva: string;
  origin: string;
  technique: string;
  dyes: string[];
  motifs: string[];
  description: string;
  source: Source;
}

export interface Motif {
  name: string;
  nameDeva: string;
  meaning: string;
}

export const artStyles: ArtStyle[] = [
  {
    slug: "bharni",
    name: "Bharnī",
    nameDeva: "भरनी",
    origin: "Historically painted by Brahmin women; Jitwarpur and Ranti villages",
    technique:
      "Bold outline drawn first in black, then filled solid with flat colour. The fill — bharnā, 'to fill' — gives the style its name. Figures are large, frontal and devotional: Kṛṣṇa, Rāma, Durgā, Śiva–Pārvatī.",
    dyes: [
      "Lampblack from a soot lamp for outline",
      "Turmeric and palāś flower for yellow and orange",
      "Kusum flower and red sandalwood for red",
      "Indigo (nīl) for blue",
      "Bel-fruit gum as binder",
    ],
    motifs: ["Lotus", "Sun", "Fish"],
    description:
      "The colour-saturated register of Madhubani painting. Bharnī is what most people picture as Mithila art: a deity filling the frame, ringed by a dense decorative border, with no empty ground left unpainted.",
    source: {
      citation:
        "Jyotindra Jain, Ganga Devi: Tradition and Expression in Mithila Painting, Mapin, 1997.",
      status: "verified",
    },
  },
  {
    slug: "kachni",
    name: "Kachnī",
    nameDeva: "कचनी",
    origin: "Historically painted by Kāyastha women; Ranti village",
    technique:
      "Line alone. Fine monochrome hatching with a bamboo nib or a cloth-tipped twig builds tone; colour is minimal or absent. Volume comes from the density of the stroke, not from fill.",
    dyes: [
      "Lampblack or iron-gall black",
      "Occasional single accent of red ochre",
      "Rice paste sizing on handmade paper",
    ],
    motifs: ["Bamboo", "Fish", "Lotus"],
    description:
      "Kachnī reads as drawing rather than painting. Ganga Devi's mature work is the best-known example: narrative panels carried entirely by hatched line.",
    source: {
      citation:
        "Jyotindra Jain, Ganga Devi: Tradition and Expression in Mithila Painting, Mapin, 1997.",
      status: "verified",
    },
  },
  {
    slug: "tantrik",
    name: "Tāntrik",
    nameDeva: "तांत्रिक",
    origin: "Ritual painting associated with Śākta practice across Mithila",
    technique:
      "Geometric and diagrammatic: yantras, the ten Mahāvidyās, Kālī and Bhairavī rendered with symmetrical construction and prescribed colour. Composition follows ritual instruction rather than pictorial choice.",
    dyes: [
      "Vermilion (sindūr) for the goddess",
      "Lampblack for the ground and outline",
      "Turmeric yellow for the field",
    ],
    motifs: ["Lotus", "Sun"],
    description:
      "Made for use, not for display. A tāntrik painting on a wall or on paper is an object of worship, and the proportions of its diagram are treated as fixed.",
    source: {
      citation:
        "Mithila Painting: The Evolution of an Art Form, ed. David Szanton, Ethnic Arts Foundation.",
      status: "verified",
    },
  },
  {
    slug: "godna",
    name: "Godnā",
    nameDeva: "गोदना",
    origin:
      "Developed from tattoo patterns by Dusādh women, Jitwarpur, from the 1970s",
    technique:
      "Concentric rows of tiny repeated marks — the vocabulary of body tattooing transferred to paper. Figures of Rāhu, the Dusādh hero-deity Salhesh, animals and processions are built from ranked linear repetition.",
    dyes: [
      "Lampblack, traditionally the only pigment",
      "Later work adds ochre and indigo washes",
    ],
    motifs: ["Bamboo", "Sun", "Fish"],
    description:
      "Godnā is the youngest of the four registers and the one with the clearest social history: Dalit women who had been excluded from the painting trade brought their own tattoo idiom onto paper and made a distinct style of it.",
    source: {
      citation:
        "David Szanton and Malini Bakshi, Mithila Painting: The Evolution of an Art Form, 2007.",
      status: "verified",
    },
  },
  {
    slug: "kohbar",
    name: "Kohbar",
    nameDeva: "कोहबर",
    origin: "Painted on the wall of the nuptial chamber, throughout Mithila",
    technique:
      "Wall painting made for a wedding: a ring of lotuses joined by a stalk, bamboo, fish, parrots and the sun and moon, laid out to a set scheme by the women of the bride's house on a mud-plastered wall.",
    dyes: [
      "Rice paste white",
      "Lampblack",
      "Turmeric and vermilion",
      "Cow-dung and mud ground plaster",
    ],
    motifs: ["Lotus", "Bamboo", "Fish", "Sun"],
    description:
      "The original site of Mithila painting, and the one from which the paper tradition was drawn in the 1960s. The kohbar is not decoration: it is the diagram the marriage is meant to enter.",
    source: {
      citation:
        "William G. Archer, 'Maithil Painting', Marg, vol. 3 no. 3, 1949.",
      status: "verified",
    },
  },
];

export const motifs: Motif[] = [
  {
    name: "Lotus",
    nameDeva: "कमल",
    meaning:
      "The female principle and fertility; in the kohbar the ringed lotus with its stalk is the central image of the marriage chamber.",
  },
  {
    name: "Fish",
    nameDeva: "मछली",
    meaning:
      "Fecundity, abundance and good fortune — and the emblem of Mithila's rivers. A pair of fish is the standard auspicious sign at a wedding.",
  },
  {
    name: "Bamboo",
    nameDeva: "बाँस",
    meaning:
      "The male principle and the continuity of the family line; bamboo grows in unbroken succession, so it stands for descendants.",
  },
  {
    name: "Sun",
    nameDeva: "सूर्य",
    meaning:
      "The witness. The sun and moon painted at the top of a kohbar attest the marriage, as the sun attests the offerings at Chhath.",
  },
];
