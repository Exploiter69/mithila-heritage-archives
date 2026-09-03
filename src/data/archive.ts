/**
 * Seed content for the Mithila Digital Archive.
 * Every record carries an explicit `source` field so attribution stays visible
 * everywhere the record is rendered.
 */

export type Source = {
  citation: string;
  detail?: string;
  status: "verified" | "community" | "needs-review";
};

export type LiteratureWork = {
  slug: string;
  title: string;
  titleMai: string;
  author: string;
  period: string;
  form: "Padāvalī" | "Drama" | "Narrative verse" | "Folk epic" | "Prose" | "Essay";
  language: "Maithili" | "Maithili / Sanskrit" | "Avahaṭṭha";
  summary: string;
  excerpt?: { text: string; translation: string };
  source: Source;
};

export type Author = {
  slug: string;
  name: string;
  nameMai: string;
  lifespan: string;
  place: string;
  role: string;
  bio: string;
  works: string[];
  source: Source;
};

export type DictionaryEntry = {
  headword: string;
  transliteration: string;
  pos: "n." | "v." | "adj." | "adv." | "part.";
  gloss: string;
  usage: string;
  usageGloss: string;
  register: "everyday" | "literary" | "ritual" | "agrarian";
  source: Source;
};

export type Proverb = {
  text: string;
  transliteration: string;
  literal: string;
  meaning: string;
  theme: "agriculture" | "kinship" | "prudence" | "speech" | "fortune";
  source: Source;
};

export type ArtEntry = {
  slug: string;
  title: string;
  tradition: string;
  region: string;
  materials: string;
  description: string;
  source: Source;
};

export type MusicEntry = {
  slug: string;
  title: string;
  titleMai: string;
  genre: string;
  occasion: string;
  description: string;
  source: Source;
};

export const literature: LiteratureWork[] = [
  {
    slug: "vidyapati-padavali",
    title: "Padāvalī",
    titleMai: "पदावली",
    author: "Vidyāpati Ṭhākur",
    period: "c. 1380–1440 CE",
    form: "Padāvalī",
    language: "Maithili",
    summary:
      "A corpus of several hundred short lyrics on Rādhā and Kṛṣṇa, on Śiva as a householder, and on the seasons. The songs fixed Maithili as a literary language and travelled far beyond Mithila into Bengal, Assam and Odisha, where they were copied, imitated and sung for centuries.",
    excerpt: {
      text: "सरस बसन्त समय भल पाओलि, दछिन पवन बहु धीरे।",
      translation:
        "The sweet season of spring has come at a good hour; the southern wind moves slowly.",
    },
    source: {
      citation:
        "Vidyapati, Padavali — comparative readings across the Grierson (1882) and Nagendranath Gupta (1909) recensions.",
      detail:
        "Line numbering varies between recensions; the excerpt follows the Grierson text.",
      status: "verified",
    },
  },
  {
    slug: "kirtilata",
    title: "Kīrtilatā",
    titleMai: "कीर्तिलता",
    author: "Vidyāpati Ṭhākur",
    period: "c. 1402 CE",
    form: "Narrative verse",
    language: "Avahaṭṭha",
    summary:
      "A panegyric narrative written in Avahaṭṭha, the late Apabhraṃśa register that precedes literary Maithili. It follows the princes Kīrtisiṃha and Vīrasiṃha to Jaunpur and contains one of the earliest vivid urban descriptions in an eastern Indo-Aryan text.",
    source: {
      citation: "Kīrtilatā, ed. Babua Misra, Bihar Rashtrabhasha Parishad.",
      status: "verified",
    },
  },
  {
    slug: "varna-ratnakara",
    title: "Varṇa Ratnākara",
    titleMai: "वर्ण रत्नाकर",
    author: "Jyotirīśvara Ṭhākur",
    period: "c. 1324 CE",
    form: "Prose",
    language: "Maithili",
    summary:
      "Widely described as the earliest surviving prose work in any modern eastern Indo-Aryan language. It is organised as a set of descriptive catalogues — of cities, seasons, courts, cremation grounds — and is invaluable as a record of fourteenth-century vocabulary and material life.",
    source: {
      citation:
        "Varṇa Ratnākara, ed. S. K. Chatterji and Babua Misra, Asiatic Society of Bengal, 1940.",
      detail: "Based on a Nepalese palm-leaf manuscript.",
      status: "verified",
    },
  },
  {
    slug: "gorakh-vijay",
    title: "Gorakṣa Vijaya",
    titleMai: "गोरक्ष विजय",
    author: "Vidyāpati (attributed)",
    period: "15th century CE",
    form: "Drama",
    language: "Maithili / Sanskrit",
    summary:
      "A kīrtaniyā drama on the Nāth legend of Gorakhnāth rescuing his guru Matsyendranāth. Prose and stage directions appear in Sanskrit and Prakrit while the songs are in Maithili — the characteristic bilingual structure of the Mithila stage.",
    source: {
      citation: "Gorakṣa Vijaya, ed. Harimohan Mishra.",
      detail: "Attribution to Vidyāpati is accepted by most editors but not unanimous.",
      status: "needs-review",
    },
  },
  {
    slug: "chanda-jhas-ramayana",
    title: "Mithilā-bhāṣā Rāmāyaṇa",
    titleMai: "मिथिला भाषा रामायण",
    author: "Chandā Jhā",
    period: "1881–1891 CE",
    form: "Narrative verse",
    language: "Maithili",
    summary:
      "A full Maithili Rāmāyaṇa in verse, undertaken as a deliberate act of language-building in the late nineteenth century. It became the standard household recitation text and a reference point for modern Maithili prosody.",
    source: {
      citation: "Chandā Jhā, Mithilā-bhāṣā Rāmāyaṇa; modern edition, Maithili Akademi, Patna.",
      status: "verified",
    },
  },
  {
    slug: "nagphans",
    title: "Nāgphāns",
    titleMai: "नागफाँस",
    author: "Lalit (Lalit Kumar Jha)",
    period: "1965 CE",
    form: "Prose",
    language: "Maithili",
    summary:
      "A modern Maithili novel of village life and social obligation, representative of the post-independence turn toward realist prose and away from devotional and courtly registers.",
    source: {
      citation: "Lalit, Nāgphāns (1965).",
      detail: "Entry compiled from published bibliographies; text not yet consulted directly.",
      status: "needs-review",
    },
  },
];

export const authors: Author[] = [
  {
    slug: "vidyapati",
    name: "Vidyāpati Ṭhākur",
    nameMai: "विद्यापति ठाकुर",
    lifespan: "c. 1352 – c. 1448",
    place: "Bisapī, Madhubani",
    role: "Poet, court scholar",
    bio: "Court poet under the Oinwar rulers of Mithila and the single most consequential figure in Maithili letters. He wrote Sanskrit treatises for patrons and Maithili songs for everyone else, and it is the songs that endured — carried into Bengal and Assam by singers who called the language Brajabuli.",
    works: ["Padāvalī", "Kīrtilatā", "Puruṣaparīkṣā", "Likhanāvalī"],
    source: {
      citation: "G. A. Grierson, An Introduction to the Maithili Language (1881–82); Maithili Akademi biographical files.",
      detail: "Birth and death years are reconstructed from patron chronology and remain approximate.",
      status: "verified",
    },
  },
  {
    slug: "jyotirishvara",
    name: "Jyotirīśvara Ṭhākur",
    nameMai: "ज्योतिरीश्वर ठाकुर",
    lifespan: "c. 1290 – c. 1350",
    place: "Mithila (Oinwar court)",
    role: "Prose writer, dramatist",
    bio: "Author of the Varṇa Ratnākara and the Sanskrit farce Dhūrtasamāgama. His descriptive catalogues preserve a lexicon of trades, textiles, foods and instruments that would otherwise be entirely lost.",
    works: ["Varṇa Ratnākara", "Dhūrtasamāgama"],
    source: {
      citation: "S. K. Chatterji, introduction to Varṇa Ratnākara (1940).",
      status: "verified",
    },
  },
  {
    slug: "chanda-jha",
    name: "Chandā Jhā",
    nameMai: "चन्दा झा",
    lifespan: "1831 – 1907",
    place: "Pinjarkot, Darbhanga",
    role: "Poet, translator",
    bio: "The pivotal nineteenth-century figure who argued, in practice rather than manifesto, that Maithili could carry epic weight. His Rāmāyaṇa and his editions of older poets shaped what the next generation thought the language was for.",
    works: ["Mithilā-bhāṣā Rāmāyaṇa", "Mahēśvāṇī saṅgraha"],
    source: {
      citation: "Maithili Akademi, Patna — author dossiers.",
      status: "verified",
    },
  },
  {
    slug: "yatri-nagarjun",
    name: "Baidyanath Mishra 'Yātrī' / Nāgārjun",
    nameMai: "यात्री / नागार्जुन",
    lifespan: "1911 – 1998",
    place: "Tarauni, Darbhanga",
    role: "Poet, novelist",
    bio: "Wrote in Maithili as 'Yātrī' and in Hindi as 'Nāgārjun', moving between the two without treating either as secondary. His Maithili poetry brought political anger and colloquial speech rhythm into a tradition that had leaned devotional.",
    works: ["Patrahīn Nagna Gāch", "Chitrā", "Balacanamā (Hindi)"],
    source: {
      citation: "Sahitya Akademi author record; Patrahīn Nagna Gāch (Sahitya Akademi Award, Maithili, 1969).",
      status: "verified",
    },
  },
  {
    slug: "lili-ray",
    name: "Lilī Rāy",
    nameMai: "लिली रे",
    lifespan: "1933 – 2016",
    place: "Darbhanga",
    role: "Novelist",
    bio: "One of the first women to establish a sustained career in Maithili fiction, writing domestic interiors and the constrained choices of women in landholding families with unusual directness.",
    works: ["Marīcikā", "Balchandā"],
    source: {
      citation: "Sahitya Akademi Maithili bibliography.",
      detail: "Dates cross-checked against a single published obituary; further verification pending.",
      status: "needs-review",
    },
  },
];

export const dictionary: DictionaryEntry[] = [
  {
    headword: "गाम",
    transliteration: "gām",
    pos: "n.",
    gloss: "village; one's ancestral settlement",
    usage: "हमर गाम मधुबनी जिलामे अछि।",
    usageGloss: "My village is in Madhubani district.",
    register: "everyday",
    source: { citation: "Maithili–English Dictionary, Maithili Akademi.", status: "verified" },
  },
  {
    headword: "अरिपन",
    transliteration: "aripan",
    pos: "n.",
    gloss: "ritual floor drawing made with rice paste",
    usage: "आँगनमे अरिपन देल गेल।",
    usageGloss: "An aripan was laid out in the courtyard.",
    register: "ritual",
    source: {
      citation: "Field vocabulary, Madhubani; corroborated in Mithila Painting literature.",
      status: "community",
    },
  },
  {
    headword: "पाहुन",
    transliteration: "pāhun",
    pos: "n.",
    gloss: "guest; also, a son-in-law",
    usage: "पाहुन आबि गेलाह।",
    usageGloss: "The guest (son-in-law) has arrived.",
    register: "everyday",
    source: { citation: "Grierson, Maithili Chrestomathy (1882).", status: "verified" },
  },
  {
    headword: "कोसी",
    transliteration: "Kosī",
    pos: "n.",
    gloss: "the Kosi river; by extension, its flood",
    usage: "कोसी हर साल बाट बदलैत अछि।",
    usageGloss: "The Kosi changes its course every year.",
    register: "agrarian",
    source: { citation: "Regional usage note; hydrological sense attested in local reportage.", status: "community" },
  },
  {
    headword: "बिहान",
    transliteration: "bihān",
    pos: "n.",
    gloss: "morning; tomorrow",
    usage: "बिहान भेने चलब।",
    usageGloss: "We will leave when morning comes.",
    register: "everyday",
    source: { citation: "Maithili–Hindi Kosh, Bihar Rashtrabhasha Parishad.", status: "verified" },
  },
  {
    headword: "नैहर",
    transliteration: "naihar",
    pos: "n.",
    gloss: "a married woman's natal home",
    usage: "बहिन नैहर एलीह।",
    usageGloss: "Sister has come to her natal home.",
    register: "everyday",
    source: { citation: "Maithili–English Dictionary, Maithili Akademi.", status: "verified" },
  },
  {
    headword: "सोहर",
    transliteration: "sohar",
    pos: "n.",
    gloss: "song sung at the birth of a child",
    usage: "बेटा भेलनि, सोहर गाओल गेल।",
    usageGloss: "A son was born; a sohar was sung.",
    register: "ritual",
    source: { citation: "Folk-song collections, Maithili Akademi.", status: "verified" },
  },
  {
    headword: "खेत",
    transliteration: "khet",
    pos: "n.",
    gloss: "field under cultivation",
    usage: "खेतमे पानि लागि गेल।",
    usageGloss: "Water has reached the field.",
    register: "agrarian",
    source: { citation: "Common usage; attested in Varṇa Ratnākara word-lists.", status: "verified" },
  },
  {
    headword: "मधुर",
    transliteration: "madhur",
    pos: "adj.",
    gloss: "sweet; melodious",
    usage: "मधुर बोल बाजू।",
    usageGloss: "Speak sweet words.",
    register: "literary",
    source: { citation: "Vidyāpati, Padāvalī — recurrent epithet.", status: "verified" },
  },
  {
    headword: "जाइत",
    transliteration: "jāit",
    pos: "v.",
    gloss: "going (imperfective participle of जाएब, to go)",
    usage: "हम बजारक दिस जाइत छी।",
    usageGloss: "I am going towards the market.",
    register: "everyday",
    source: { citation: "Maithili grammar notes, Yadav (1996).", status: "verified" },
  },
  {
    headword: "पोखरि",
    transliteration: "pokhari",
    pos: "n.",
    gloss: "tank, excavated pond",
    usage: "गामक पोखरि सुखा गेल।",
    usageGloss: "The village tank has dried up.",
    register: "agrarian",
    source: { citation: "Field vocabulary, Darbhanga.", status: "community" },
  },
  {
    headword: "कनैत",
    transliteration: "kanait",
    pos: "v.",
    gloss: "weeping (imperfective participle)",
    usage: "बच्चा कनैत रहय।",
    usageGloss: "The child kept weeping.",
    register: "everyday",
    source: { citation: "Maithili–Hindi Kosh.", status: "verified" },
  },
];

export const proverbs: Proverb[] = [
  {
    text: "आमक गाछ आमे फड़त",
    transliteration: "āmak gāch āme faṛat",
    literal: "A mango tree will bear only mangoes.",
    meaning: "People act according to their nature and upbringing; expect nothing else.",
    theme: "prudence",
    source: { citation: "Maithili Lokokti Kosh, Maithili Akademi.", status: "verified" },
  },
  {
    text: "जकर लाठी तकर भैंस",
    transliteration: "jakar lāṭhī takar bhaĩs",
    literal: "Whoever holds the stick owns the buffalo.",
    meaning: "Possession follows power, not right. Used bitterly, about land disputes.",
    theme: "fortune",
    source: { citation: "Widely attested across Maithili and neighbouring speech areas.", status: "community" },
  },
  {
    text: "बिनु बरखा खेत सुन",
    transliteration: "binu barakhā khet sun",
    literal: "Without rain the field is empty.",
    meaning: "Effort without the necessary conditions yields nothing.",
    theme: "agriculture",
    source: { citation: "Collected in Madhubani district; variant forms recorded.", status: "community" },
  },
  {
    text: "बेसी बाजनिहार कम करैत अछि",
    transliteration: "besī bājanihār kam karait achi",
    literal: "The one who talks most does least.",
    meaning: "A caution against loud promising.",
    theme: "speech",
    source: { citation: "Maithili Lokokti Kosh.", status: "verified" },
  },
  {
    text: "नैहरक मीठ, ससुरारिक तीत",
    transliteration: "naiharak mīṭh, sasurārik tīt",
    literal: "Sweet at the natal home, bitter at the in-laws'.",
    meaning: "On the changed standing of a married woman between two households.",
    theme: "kinship",
    source: { citation: "Folk-speech collection; recorded in women's song commentary.", status: "community" },
  },
  {
    text: "कोसी के भरोस घर नहि बनाउ",
    transliteration: "kosī ke bharos ghar nahi banāu",
    literal: "Do not build a house trusting the Kosi.",
    meaning: "Do not stake permanence on something known to move.",
    theme: "prudence",
    source: {
      citation: "Recorded in flood-plain districts; not yet located in a printed collection.",
      status: "needs-review",
    },
  },
];

export const art: ArtEntry[] = [
  {
    slug: "mithila-painting",
    title: "Mithila (Madhubani) painting",
    tradition: "Wall and paper painting",
    region: "Madhubani, Darbhanga",
    materials: "Rice paste, lampblack, ochre, indigo, turmeric; handmade paper since the 1960s",
    description:
      "Originally painted on the interior walls of the kohbar ghar — the nuptial chamber — by women of the household, with a fixed iconographic vocabulary of lotus, bamboo, fish and parrot standing for fertility and union. After the 1966–67 drought, paper became a commercial medium and named artists emerged, shifting a domestic ritual practice into a signed studio tradition without displacing it.",
    source: {
      citation:
        "All India Handicrafts Board records of the 1966–67 paper initiative; Mithila Art Institute documentation, Madhubani.",
      status: "verified",
    },
  },
  {
    slug: "aripan",
    title: "Aripan",
    tradition: "Ritual floor drawing",
    region: "Across Mithila",
    materials: "Rice-flour paste (pithār) applied by fingertip",
    description:
      "Geometric and lotus-based diagrams drawn on swept earth or floor at thresholds and courtyards for specific rites — marriage, upanayana, Tusārī, Madhusrāvaṇī. Each occasion has its own permitted design; the form is impermanent by intention and redrawn each time.",
    source: {
      citation: "Ritual manuals in circulation in Mithila households; ethnographic notes, Madhubani.",
      status: "community",
    },
  },
  {
    slug: "sikki-grass",
    title: "Sikkī grass craft",
    tradition: "Coiled basketry",
    region: "Northern Mithila, Nepal Tarai border districts",
    materials: "Sikkī grass, natural and aniline dyes, munj core",
    description:
      "Coiled and stitched golden grass forms — pauti boxes, dolls, ceremonial containers — traditionally part of a bride's belongings. The craft is women-held and taught within families; dye palettes shifted markedly with market access in the late twentieth century.",
    source: {
      citation: "Craft cluster surveys, Bihar; Upendra Maharathi Shilp Anusandhan Sansthan collections.",
      status: "verified",
    },
  },
  {
    slug: "kohbar-ghar",
    title: "Kohbar ghar",
    tradition: "Painted architecture",
    region: "Village households across Mithila",
    materials: "Mud wall, cow-dung ground, mineral and vegetable pigment",
    description:
      "The room in which a newly married couple spends its first nights, and the surface on which the household's most elaborate painting is made. The central kohbar motif — a ringed lotus with a bamboo stalk — is read as a conjugal diagram rather than decoration.",
    source: {
      citation: "Documented in Mithila painting scholarship; iconographic reading follows household informants.",
      status: "community",
    },
  },
];

export const music: MusicEntry[] = [
  {
    slug: "sohar",
    title: "Sohar",
    titleMai: "सोहर",
    genre: "Life-cycle song",
    occasion: "Birth of a child",
    description:
      "Sung by women of the household and neighbourhood in the days following a birth. The text mixes congratulation, teasing of the new mother's in-laws, and invocation of Ṣaṣṭhī. Melodies are short and cyclical, carried without instruments or with a simple ḍholak.",
    source: { citation: "Maithili folk-song collections, Maithili Akademi; field recordings, Darbhanga.", status: "verified" },
  },
  {
    slug: "samdaun",
    title: "Samdāun",
    titleMai: "समदाउन",
    genre: "Farewell song",
    occasion: "A bride's departure from her natal home",
    description:
      "Among the most emotionally weighted forms in the repertoire, sung at the moment of vidāi. The register is plainly sorrowful; several texts address the departing daughter directly and are answered by her.",
    source: { citation: "Folk-song anthologies; commentary from women singers, Madhubani.", status: "community" },
  },
  {
    slug: "nachari-mahesvani",
    title: "Nacārī and Mahēśvāṇī",
    titleMai: "नचारी आ महेश्वाणी",
    genre: "Devotional song",
    occasion: "Śiva worship, especially Śivarātri",
    description:
      "Two linked Śaiva forms strongly associated with Vidyāpati, who is remembered in Mithila less as a love poet than as Śiva's own devotee. Nacārī is plaintive and petitioning; Mahēśvāṇī narrates Śiva's household life with Gaurī.",
    source: { citation: "Vidyāpati Padāvalī, Śaiva section; performance practice notes.", status: "verified" },
  },
  {
    slug: "jhijhiya",
    title: "Jhijhiyā",
    titleMai: "झिझिया",
    genre: "Dance song",
    occasion: "Dasharā / Vijayadaśamī nights",
    description:
      "Performed by women balancing perforated earthen pots with lamps inside, moving in a circle. The songs are apotropaic in origin, addressed against witchcraft, and the perforation count of the pot is itself part of the display of skill.",
    source: { citation: "Ethnographic accounts of Mithila festival performance.", status: "community" },
  },
  {
    slug: "batgamani",
    title: "Baṭgamanī",
    titleMai: "बटगमनी",
    genre: "Travelling song",
    occasion: "Sung on the road, and at wedding processions",
    description:
      "Songs shaped by walking pace, sung on journeys between villages. The form survives mainly inside wedding ritual now that the journeys themselves are made by road.",
    source: {
      citation: "Noted in regional folk-song surveys; limited recorded material located.",
      status: "needs-review",
    },
  },
];

export const sources = [
  {
    name: "Maithili Akademi, Patna",
    kind: "Institution",
    note: "Dictionaries, folk-song and proverb collections, author dossiers. Primary reference for lexical and biographical entries here.",
  },
  {
    name: "G. A. Grierson, An Introduction to the Maithili Language (1881–82)",
    kind: "Printed work",
    note: "Grammar and chrestomathy. Historically important and still cited; its transcription conventions differ from present practice.",
  },
  {
    name: "Varṇa Ratnākara, ed. S. K. Chatterji & Babua Misra (Asiatic Society, 1940)",
    kind: "Critical edition",
    note: "The standard edition of the earliest Maithili prose text.",
  },
  {
    name: "Sahitya Akademi — Maithili bibliography",
    kind: "Institution",
    note: "Modern author records, award citations and publication data.",
  },
  {
    name: "Field vocabulary and household informants",
    kind: "Oral",
    note: "Entries marked 'community' rest on oral attestation rather than a printed citation. They are published here as such, not as settled fact.",
  },
];
