import type { CommonsImage, Source } from "./types";

export interface ArtStyle {
  slug: string;
  name: string;
  nameDeva: string;
  origin: string;
  technique: string;
  dyes: string[];
  motifs: string[];
  description: string;
  image: CommonsImage;
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
    image: {
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Madhubani_painting.jpg/1280px-Madhubani_painting.jpg",
      "filePage": "https://commons.wikimedia.org/wiki/File:Madhubani_painting.jpg",
      "fileTitle": "Madhubani painting",
      "credit": "Mohitkiran (Wikimedia Commons contributor)",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "caption": "Madhubani painting photographed at the Crafts Museum, New Delhi: solid colour fill inside a heavy black outline, in the manner described here as Bharnī.",
      "motifs": [
        {
          "name": "Lotus / कमल",
          "meaning": "Fertility and the female principle; the ringed lotus is the core image of the marriage chamber."
        },
        {
          "name": "Sun / सूर्य",
          "meaning": "The witness, placed high in the frame, as the sun witnesses the Chhath offering."
        },
        {
          "name": "Dense border",
          "meaning": "No ground is left unpainted; the border seals the image and keeps the deity inside it."
        }
      ],
      "note": "The Commons file page records the object as a Madhubani painting and does not name a school. It is shown here as a representative example of the Bharnī register, an attribution made by this archive."
    },
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
    image: {
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Madhubani_painting_by_Bhuvana_Meenakshi.jpg/1280px-Madhubani_painting_by_Bhuvana_Meenakshi.jpg",
      "filePage": "https://commons.wikimedia.org/wiki/File:Madhubani_painting_by_Bhuvana_Meenakshi.jpg",
      "fileTitle": "Madhubani painting by Bhuvana Meenakshi",
      "credit": "Bhuvana Meenakshi (artist and uploader, own work)",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "caption": "Madhubani painting in which figure and ground are built from repeated fine line rather than flat fill — the linear approach described here as Kachnī.",
      "motifs": [
        {
          "name": "Hatched line",
          "meaning": "Tone is made by the density of stroke; volume is drawn, never filled."
        },
        {
          "name": "Fish / मछली",
          "meaning": "Abundance and the rivers of Mithila; a pair of fish is the standard auspicious sign."
        },
        {
          "name": "Bamboo / बाँस",
          "meaning": "The male principle and unbroken descent of the family line."
        }
      ],
      "note": "The file page names the artist but not a school; the Kachnī reading is this archive's, based on the linear technique visible in the work."
    },
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
    image: {
      "url": "https://upload.wikimedia.org/wikipedia/commons/6/67/Madhubani_Mahavidyas.jpg",
      "filePage": "https://commons.wikimedia.org/wiki/File:Madhubani_Mahavidyas.jpg",
      "fileTitle": "Madhubani Mahavidyas",
      "credit": "toyin adepoju (Wikimedia Commons contributor)",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "caption": "Mithila painting of the Ten Mahāvidyās with Śiva and Śakti and a serpent-coiled Śrī Yantra, painted in Nepal — a tāntrik subject as described on the file page.",
      "motifs": [
        {
          "name": "Śrī Yantra",
          "meaning": "A ritual diagram, not a decorative motif: its proportions are prescribed and treated as fixed."
        },
        {
          "name": "Ten Mahāvidyās",
          "meaning": "The ten wisdom goddesses of Śākta practice, ranked symmetrically around the central pair."
        },
        {
          "name": "Serpent",
          "meaning": "Coiled energy encircling the diagram; a boundary between the worshipper and the field of the yantra."
        }
      ]
    },
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
    image: {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/de/Madhubani_Fish_Motif_with_Stylized_Geometric_Scales_and_Red-Toned_Accents_from_Mithila_India.png",
      "filePage": "https://commons.wikimedia.org/wiki/File:Madhubani_Fish_Motif_with_Stylized_Geometric_Scales_and_Red-Toned_Accents_from_Mithila_India.png",
      "fileTitle": "Madhubani Fish Motif with Stylized Geometric Scales and Red-Toned Accents from Mithila India",
      "credit": "Art Projects MKCL KF (own work, Wikimedia Commons)",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "caption": "Madhubani fish motif built from ranked geometric marks and repeated scale patterning — the ordered, tattoo-derived mark-making that Godnā work is composed from.",
      "motifs": [
        {
          "name": "Ranked repeated mark",
          "meaning": "The tattoo vocabulary of the Dusādh women transferred to paper: form is accumulated from small repeated units."
        },
        {
          "name": "Fish / मछली",
          "meaning": "Fecundity and good fortune, and the emblem of the region's rivers."
        },
        {
          "name": "Concentric fill",
          "meaning": "Pattern rows follow the contour of the body rather than a drawn interior."
        }
      ],
      "note": "The file page describes the work as a Madhubani fish motif; it is used here to illustrate Godnā mark-making, an attribution made by this archive rather than stated on Commons."
    },
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
    image: {
      "url": "https://upload.wikimedia.org/wikipedia/commons/3/31/34545016_kohbar_auspicious_marriage_diagram_dh93.jpg",
      "filePage": "https://commons.wikimedia.org/wiki/File:34545016_kohbar_auspicious_marriage_diagram_dh93.jpg",
      "fileTitle": "34545016 kohbar auspicious marriage diagram dh93",
      "credit": "AxomiyaDangoriya (own work, Wikimedia Commons)",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "caption": "Lajjā Gaurī depicted within a kohbar Mithila painting — the auspicious marriage diagram, as identified on the file page.",
      "motifs": [
        {
          "name": "Ringed lotus / कमल",
          "meaning": "The female principle at the centre of the kohbar, joined by a stalk to the bamboo."
        },
        {
          "name": "Bamboo / बाँस",
          "meaning": "The male principle and the continuity of the line; bamboo grows in unbroken succession."
        },
        {
          "name": "Sun and moon",
          "meaning": "Painted at the top as witnesses to the marriage."
        },
        {
          "name": "Fish and parrots",
          "meaning": "Abundance and desire, filling the field around the central diagram."
        }
      ]
    },
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
