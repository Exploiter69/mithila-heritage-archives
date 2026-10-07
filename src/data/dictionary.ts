import type { Source } from "./types";

export type WordClass = "Noun" | "Verb" | "Adjective" | "Idiom / Proverb";

export interface DictionaryEntry {
  slug: string;
  headword: string; // Devanagari
  transliteration: string; // Latin
  phonetic: string;
  wordClass: WordClass;
  hindi: string;
  english: string;
  examples: { deva: string; translit: string; english: string }[];
  note?: string;
  source: Source;
}

export const dictionaryEntries: DictionaryEntry[] = [
  {
    slug: "osaar",
    headword: "ओसार",
    transliteration: "osaar",
    phonetic: "/oˈsaːr/ · o-SAAR",
    wordClass: "Noun",
    hindi: "बरामदा, ओसारा",
    english:
      "The covered verandah running along the front of a house, between the courtyard and the rooms; the household's working and receiving space.",
    examples: [
      {
        deva: "ओसार पर बैसि कऽ गप करू।",
        translit: "osaar par baisi ka gap karū.",
        english: "Sit on the verandah and talk.",
      },
      {
        deva: "बरखा मे सभ ओसार मे सुतैत छल।",
        translit: "barakhā me sabh osaar me sutait chhala.",
        english: "In the rains everyone slept on the verandah.",
      },
    ],
    note:
      "Also spelt ओसारा (osaarā). Distinct from आँगन (courtyard), which is open to the sky.",
    source: {
      citation: "Maithili–English Dictionary, Chairman: Ramanath Jha, Mithila Institute.",
      status: "verified",
    },
  },
  {
    slug: "gaam",
    headword: "गाम",
    transliteration: "gaam",
    phonetic: "/ɡaːm/ · GAAM",
    wordClass: "Noun",
    hindi: "गाँव",
    english: "Village; also, the home place a person belongs to, wherever they live.",
    examples: [
      {
        deva: "हमर गाम मधुबनी जिला मे अछि।",
        translit: "hamar gaam madhubanī jilā me achhi.",
        english: "My village is in Madhubani district.",
      },
      {
        deva: "छठ मे सभ गाम घुरैत अछि।",
        translit: "chhaṭh me sabh gaam ghurait achhi.",
        english: "At Chhath everyone returns to the village.",
      },
    ],
    source: {
      citation: "Grierson, An Introduction to the Maithili Language, 1881.",
      status: "verified",
    },
  },
  {
    slug: "sunar",
    headword: "सुन्नर",
    transliteration: "sunnar",
    phonetic: "/ˈsun.nər/ · SUN-nar",
    wordClass: "Adjective",
    hindi: "सुन्दर",
    english: "Beautiful, handsome, well made.",
    examples: [
      {
        deva: "कोहबरक चित्र बड़ सुन्नर बनल अछि।",
        translit: "kohbarak chitra baṛa sunnar banala achhi.",
        english: "The kohbar painting has come out very beautiful.",
      },
      {
        deva: "अहाँक साड़ी सुन्नर अछि।",
        translit: "ahā̃k sāṛī sunnar achhi.",
        english: "Your sari is beautiful.",
      },
    ],
    source: {
      citation: "Maithili–English Dictionary, Mithila Institute, Darbhanga.",
      status: "verified",
    },
  },
  {
    slug: "khaenai",
    headword: "खएनाइ",
    transliteration: "khaenai",
    phonetic: "/kʰəeˈnaːi/ · kha-e-NAI",
    wordClass: "Verb",
    hindi: "खाना",
    english:
      "To eat (verbal noun / infinitive of खा-). Maithili conjugates for the honorific status of both subject and addressee.",
    examples: [
      {
        deva: "अहाँ भात खएलहुँ?",
        translit: "ahā̃ bhāt khaelahũ?",
        english: "Did you (honorific) eat rice?",
      },
      {
        deva: "ओ किछु नहि खेलक।",
        translit: "o kichhu nahi khelak.",
        english: "He/she ate nothing.",
      },
    ],
    note:
      "The verb agrees with the person addressed as well as the subject — a feature Maithili shares with few other Indo-Aryan languages.",
    source: {
      citation:
        "Yadav, Ramawatar, A Reference Grammar of Maithili, Mouton de Gruyter, 1996.",
      status: "verified",
    },
  },
  {
    slug: "dubhaar",
    headword: "दूभर",
    transliteration: "dūbhar",
    phonetic: "/ˈduːbʱər/ · DOO-bhar",
    wordClass: "Adjective",
    hindi: "कठिन, दुष्कर",
    english: "Hard to bear; difficult, burdensome.",
    examples: [
      {
        deva: "एहि बरखा मे बाट चलब दूभर भऽ गेल।",
        translit: "ehi barakhā me bāṭ chalab dūbhar bha gela.",
        english: "In this rain walking the road has become hard.",
      },
    ],
    source: {
      citation: "Maithili–English Dictionary, Mithila Institute, Darbhanga.",
      status: "needs-review",
    },
  },
  {
    slug: "aankh-ke-dekhal",
    headword: "आँखिक देखल आ कानक सुनल",
    transliteration: "ā̃khik dekhal ā kānak sunal",
    phonetic: "/ãːkʰik ˈdekʰəl aː ˈkaːnək ˈsunəl/",
    wordClass: "Idiom / Proverb",
    hindi: "आँखों देखा और कानों सुना",
    english:
      "'What the eye has seen and what the ear has heard' — used to mark the difference between first-hand knowledge and hearsay.",
    examples: [
      {
        deva: "आँखिक देखल आ कानक सुनल मे बहुत अन्तर होइत अछि।",
        translit: "ā̃khik dekhal ā kānak sunal me bahut antar hoit achhi.",
        english: "There is a great difference between what is seen and what is heard.",
      },
    ],
    source: {
      citation: "Maithili lokokti collections; widely current.",
      status: "community",
    },
  },
  {
    slug: "jekra-nahi-aabai",
    headword: "जकरा नहि आबय, ओकरा आँगन टेढ़",
    transliteration: "jakarā nahi ābaya, okarā ā̃gan ṭeṛh",
    phonetic: "/ˈdʒəkəraː nəɦi ˈaːbəj ˈokəraː ˈãːɡən ʈeːɽʱ/",
    wordClass: "Idiom / Proverb",
    hindi: "नाच न जाने आँगन टेढ़ा",
    english:
      "'One who cannot do it finds the courtyard crooked' — the incompetent blame their conditions.",
    examples: [
      {
        deva: "काज नहि भेल तँ औजार दोष — जकरा नहि आबय, ओकरा आँगन टेढ़।",
        translit: "kāj nahi bhela ta̐ aujār dosh — jakarā nahi ābaya, okarā ā̃gan ṭeṛh.",
        english:
          "The work failed, so the tools are at fault — one who cannot do it finds the courtyard crooked.",
      },
    ],
    source: {
      citation: "Maithili lokokti collections; widely current across the region.",
      status: "community",
    },
  },
];

export const wordClasses: ("All" | WordClass)[] = [
  "All",
  "Noun",
  "Verb",
  "Adjective",
  "Idiom / Proverb",
];

/** Rotates daily over the lexicon, deterministically. */
export function wordOfTheDay(date = new Date()): DictionaryEntry {
  const day = Math.floor(date.getTime() / 86_400_000);
  const nouns = dictionaryEntries.filter((e) => e.wordClass !== "Idiom / Proverb");
  return nouns[day % nouns.length] ?? dictionaryEntries[0]!;
}


// Wave 3 seed: everyday Maithili vocabulary. Definitions are deliberately
// conservative; examples are editorial examples and are labelled as such.
const everydayMaithiliExpansion: DictionaryEntry[] = [
  ["ghar","घर","ghar","/ɡʱər/","Noun","घर","house; home"],
  ["aangan","आँगन","āṅgan","/aːŋɡən/","Noun","आँगन","courtyard"],
  ["duaar","दुआर","duār","/duːaːr/","Noun","द्वार, दरवाज़ा","doorway; entrance"],
  ["paani","पानि","pāni","/paːni/","Noun","पानी","water"],
  ["maati","माटि","māṭi","/maːʈi/","Noun","मिट्टी","earth; soil"],
  ["khet","खेत","khet","/kʰeːt/","Noun","खेत","cultivated field"],
  ["dhaan","धान","dhān","/dʱaːn/","Noun","धान","paddy; rice plant before milling"],
  ["pokhar","पोखरि","pokhari","/pokʰəri/","Noun","तालाब","pond; village pond"],
  ["gaachh","गाछ","gāchh","/ɡaːtʃʰ/","Noun","पेड़","tree"],
  ["phool","फूल","phūl","/pʰuːl/","Noun","फूल","flower"],
  ["paat","पात","pāt","/paːt/","Noun","पत्ता","leaf"],
  ["baat","बाट","bāṭ","/baːʈ/","Noun","रास्ता","path; road; way"],
  ["bhaat","भात","bhāt","/bʱaːt/","Noun","पका हुआ चावल","cooked rice"],
  ["dahi","दहि","dahi","/d̪əɦi/","Noun","दही","curd; yogurt"],
  ["doodh","दूध","dūdh","/duːdʱ/","Noun","दूध","milk"],
  ["maachh","माछ","māchh","/maːtʃʰ/","Noun","मछली","fish"],
  ["nena","नेना","nenā","/neːnaː/","Noun","बच्चा","child; little child"],
  ["maay","माए","māe","/maːeː/","Noun","माँ","mother"],
  ["baap","बाप","bāp","/baːp/","Noun","पिता","father"],
  ["baisak","बैसक","baisak","/bai̯sək/","Verb","बैठना","to sit; sit down"],
].map(([slug, headword, transliteration, phonetic, wordClass, hindi, english]) => ({
  slug,
  headword,
  transliteration,
  phonetic,
  wordClass: wordClass as WordClass,
  hindi,
  english,
  examples: [{
    deva: headword + " शब्दक उदाहरण एतय संपादकीय रूप सँ देल गेल अछि।",
    translit: transliteration + " sabdak udāharan etay sampādakīya rūp sã del gel achhi.",
    english: "Editorial example; pending corpus-level verification.",
  }],
  note: "Lexical seed from historical/reference-dictionary coverage; the example sentence is editorial and requires native-speaker/corpus review before being treated as attested usage.",
  source: {
    citation: "Grierson, An Introduction to the Maithili Language (1881); bibliographic coverage also indexed by the Digital Dictionaries of South Asia, University of Chicago.",
    url: "https://dsal.uchicago.edu/dictionaries/dictionaries.html",
    status: "needs-review",
    detail: "Lexeme retained as a research seed; exact sense, spelling and usage example require editorial verification against the underlying dictionary/corpus.",
  },
}));

dictionaryEntries.push(...everydayMaithiliExpansion);
