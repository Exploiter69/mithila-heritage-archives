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
].map((row) => {
  const [slug, headword, transliteration, phonetic, wordClass, hindi, english] = row as [string, string, string, string, string, string, string];
  return {
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
  };
});

dictionaryEntries.push(...everydayMaithiliExpansion);


const expandedWordClassCorpus: DictionaryEntry[] = [
  ["ghar-dwaar","घर-दुआर","ghar-duār","/ɡʱər duːaːr/","Noun","घर-द्वार","household and dwelling; the home and its entrance"],
  ["aangan","आँगन","āṅgan","/aːŋɡən/","Noun","आँगन","courtyard; open domestic space"],
  ["osaar","ओसार","osaar","/oˈsaːr/","Noun","बरामदा","covered verandah or raised household frontage"],
  ["pokhar","पोखरि","pokhari","/poˈkʰəri/","Noun","तालाब","pond or village tank"],
  ["maachh","माछ","māchh","/maːtʃʰ/","Noun","मछली","fish"],
  ["dhaan","धान","dhān","/dʱaːn/","Noun","धान","paddy; rice plant"],
  ["gachh","गाछ","gāchh","/ɡaːtʃʰ/","Noun","पेड़","tree"],
  ["pahun","पाहुन","pāhun","/paːɦun/","Noun","अतिथि; दामाद","guest; in some kinship contexts son-in-law"],
  ["naihar","नैहर","naihar","/nɛːɦər/","Noun","मायका","a married woman's natal home"],
  ["madhur","मधुर","madhur","/məˈdʱur/","Adjective","मधुर","sweet; melodious; pleasant in speech or sound"],
  ["sunnar","सुन्नर","sunnar","/ˈsunnər/","Adjective","सुन्दर","beautiful; handsome; well made"],
  ["nik","निक","nik","/nik/","Adjective","अच्छा; बढ़िया","good; fine; agreeable"],
  ["bar-adj","बड़","baṛ","/bəɽ/","Adjective","बड़ा","big; great; important"],
  ["chhot","छोट","chhoṭ","/tʃʰoːʈ/","Adjective","छोटा","small; young; minor"],
  ["puran","पुरान","purān","/puˈraːn/","Adjective","पुराना","old; earlier"],
  ["nav","नव","nav","/nəv/","Adjective","नया","new; fresh"],
  ["jaeb","जायब","jāeb","/dʒaːeb/","Verb","जाना","to go"],
  ["aeb","एब","aeb","/eːb/","Verb","आना","to come"],
  ["dekhb","देखब","dekhb","/deːkʰəb/","Verb","देखना","to see; look at"],
  ["sunb","सुनब","sunb","/sunəb/","Verb","सुनना","to hear; listen"],
  ["bolb","बोलब","bolb","/boːləb/","Verb","बोलना","to speak; say"],
  ["khaeb","खायब","khaeb","/kʰaːeb/","Verb","खाना","to eat"],
  ["peeb","पीयब","peeb","/piːjəb/","Verb","पीना","to drink"],
  ["baithb","बैसब","baithb","/bɛːsəb/","Verb","बैठना","to sit"],
  ["uthb","उठब","uṭhb","/uʈʰəb/","Verb","उठना","to rise; get up"],
  ["karb","करब","karb","/kərəb/","Verb","करना","to do; make"],
  ["rahib","रहब","rahib","/rəhəb/","Verb","रहना","to stay; remain"],
  ["aankhik-dekhal","आँखिक देखल आ कानक सुनल","ā̃khik dekhal ā kānak sunal","/ãːkʰik dekʰəl/","Idiom / Proverb","आँखों देखा और कानों सुना","what one has seen and heard personally; a marker of first-hand knowledge"],
  ["jekra-nahi-aabai","जकरा नहि आबय, ओकरा आँगन टेढ़","jakarā nahi ābaya, okarā ā̃gan ṭeṛh","/dʒəkəraː nəhiː aːbəj/","Idiom / Proverb","नाच न जाने आँगन टेढ़ा","someone blames circumstances for their own lack of ability"],
  ["aam-gachh","आमक गाछ आमे फड़त","āmak gāchh āme faṛat","/aːmək ɡaːtʃʰ/","Idiom / Proverb","आम का पेड़ आम ही फलता है","people or things tend to produce according to their nature"],
  ["jaka-lathi","जकर लाठी तकर भैंस","jakar lāṭhī takar bhaĩs","/dʒəkər laːʈʰiː/","Idiom / Proverb","जिसकी लाठी उसकी भैंस","power can determine possession in an unjust dispute"],
  ["bin-barkha","बिनु बरखा खेत सुन","binu barkhā khet sun","/binuː bərkʰaː/","Idiom / Proverb","बिना वर्षा खेत सूना","necessary conditions are essential for useful work"],
  ["besi-bajanihar","बेसी बाजनिहार कम करैत अछि","besī bājanihār kam karait achhi","/beːsiː baːdʒənihaːr/","Idiom / Proverb","बहुत बोलने वाला कम करता है","a warning against excessive talk and little action"],
].map((row) => {
  const [slug,headword,transliteration,phonetic,wordClass,hindi,english] = row as [string,string,string,string,string,string,string];
  return ({
  slug,headword,transliteration,phonetic,wordClass: wordClass as WordClass,hindi,english,
  examples:[{deva: headword + " — उदाहरणक प्रयोग संपादकीय रूप सँ देल गेल अछि।",translit: transliteration + " — udāharanak prayog sampādakīya rūp sã del gel achhi.",english:"Editorial usage example; not a verbatim corpus quotation."}],
  note:"Expanded lexical corpus entry; usage sentence is editorial and should be replaced or supplemented with a located attestation during corpus verification.",
  source:{citation:"Maithili reference-dictionary and grammar research seed; see Digital Dictionaries of South Asia and Grierson.",url:"https://dsal.uchicago.edu/dictionaries/dictionaries.html",status:"needs-review" as const}
});
});

dictionaryEntries.push(...expandedWordClassCorpus);
