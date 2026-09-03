import type { Source } from "./types";

export type SongCategory = "सोहर" | "बटगमनी" | "छठी मईया" | "लोकगीत";

export interface Song {
  slug: string;
  title: string;
  titleDeva: string;
  transliteration: string;
  performer: string;
  occasion: string;
  category: SongCategory;
  duration: number; // seconds, for player UI
  about: string;
  lyrics: { deva: string; translation: string }[];
  source: Source;
}

export const songs: Song[] = [
  {
    slug: "kekara-kekara-piyari",
    title: "Sohar for a newborn son",
    titleDeva: "ललना रे, जनमल कान्ह कन्हैया",
    transliteration: "lalanā re, janamala kānha kanhaiyā",
    performer: "Sharda Sinha",
    occasion: "Sung on the sixth night after a birth, by women of the household",
    category: "सोहर",
    duration: 268,
    about:
      "Sohar is the birth song of Mithila and Bhojpur. The newborn is addressed as Kṛṣṇa, and the women of the family sing in the courtyard through the night. Sharda Sinha's recordings from the 1980s carried the form to a national audience without altering its structure.",
    lyrics: [
      {
        deva: "ललना रे, जनमल कान्ह कन्हैया हो ।",
        translation: "O little one — Kānha, Kanhaiyā, is born.",
      },
      {
        deva: "आँगन मे बाजय बधैया, सासु मंगल गाबथि हो ।",
        translation: "In the courtyard the congratulation-drum sounds; the mother-in-law sings the auspicious song.",
      },
      {
        deva: "ननदि दीप जरावथि, भउजी थार सजावथि हो ।",
        translation: "The husband's sister lights the lamp; the brother's wife arranges the platter.",
      },
    ],
    source: {
      citation: "Sharda Sinha, Maithili sohar repertoire; HMV/Saregama recordings, 1980s.",
      status: "verified",
      detail: "Lyric lines are a common variant; wording differs by household.",
    },
  },
  {
    slug: "batgamani-vidai",
    title: "Baṭgamanī — song of the road",
    titleDeva: "बटगमनी — बाबा के अँगना छूटल",
    transliteration: "baṭagamanī — bābā ke aṅganā chūṭala",
    performer: "Traditional; recorded by Sharda Sinha",
    occasion: "Sung while the bride's party walks the road, at vidāi",
    category: "बटगमनी",
    duration: 224,
    about:
      "Baṭgamanī literally means 'going by the road' — songs measured to a walking pace, sung when a party travels, above all when a daughter leaves her father's house. The tempo is slow and the lines are long enough to be sung while carrying a load.",
    lyrics: [
      {
        deva: "बाबा के अँगना छूटल, सखी सभ छूटलि हो ।",
        translation: "Father's courtyard is left behind, and all my friends are left behind.",
      },
      {
        deva: "बाट लम्बा अछि, आ साँझ ढलि गेल हो ।",
        translation: "The road is long, and the evening has already come down.",
      },
      {
        deva: "माए कहलनि — बेटी, घुरि कऽ जुनि तकिहऽ हो ।",
        translation: "Mother said: daughter, do not turn and look back.",
      },
    ],
    source: {
      citation:
        "Field-attested vidāi repertoire, Madhubani and Darbhanga districts; cf. Sharda Sinha, Bihula.",
      status: "community",
      detail: "Oral tradition; no single authoritative text.",
    },
  },
  {
    slug: "chhathi-maiya-kelva",
    title: "Kelvā je phare ghavad se",
    titleDeva: "केलवा जे फरे घवद से",
    transliteration: "kelavā je phare ghavada se",
    performer: "Sharda Sinha",
    occasion: "Chhath — the evening arghya at the ghat",
    category: "छठी मईया",
    duration: 312,
    about:
      "The best-known Chhath song of the last forty years. The banana bunch of the offering, the ghat, and the sun addressed as a person are the fixed images; the song is sung on the walk to the water and while standing in it.",
    lyrics: [
      {
        deva: "केलवा जे फरे घवद से, ओह पर सुगा मेड़राय ।",
        translation: "The banana ripens in a heavy bunch, and above it the parrot circles.",
      },
      {
        deva: "उ जे खबले सुगनी के ठोर, सुगा गिरे मुरझाय ।",
        translation: "It pecked the fruit meant for the offering; the parrot falls, wilting.",
      },
      {
        deva: "छठी मईया, अरघ के बेर भेल, सूरज देव उगथि हो ।",
        translation: "Chhaṭhī Maiyā, the hour of the offering has come; the Sun God rises.",
      },
    ],
    source: {
      citation: "Sharda Sinha, Chhath songs; Saregama, widely re-issued.",
      status: "verified",
      detail: "Language is Maithili–Bhojpuri border register, as sung.",
    },
  },
  {
    slug: "samdaun-lokgeet",
    title: "Samdāun — parting song",
    titleDeva: "समदाउन",
    transliteration: "samadāuna",
    performer: "Traditional; women's ensemble",
    occasion: "Sung at any leave-taking, most often at the end of a wedding",
    category: "लोकगीत",
    duration: 196,
    about:
      "Samdāun is the grammar of departure in Maithili song: it can be sung to a departing daughter, to a guest, or to a deity at the end of a festival, when the image is taken to the water.",
    lyrics: [
      {
        deva: "जाइत छी हम, अपन गाम छोड़ि कऽ हो ।",
        translation: "I am going, leaving my own village behind.",
      },
      {
        deva: "आम्रक गाछ, पोखरिक घाट, सभ सँ बिदा हो ।",
        translation: "Mango tree, steps of the pond — farewell to all of it.",
      },
    ],
    source: {
      citation:
        "Grierson, Maithili Chrestomathy, 1882, and later district collections.",
      status: "community",
    },
  },
  {
    slug: "jhijhiya-lokgeet",
    title: "Jhijhiyā — lamp-pot dance song",
    titleDeva: "झिझिया",
    transliteration: "jhijhiyā",
    performer: "Traditional; Madhubani and Darbhanga troupes",
    occasion: "Daśahrā nights, danced with a perforated pot of burning lamps on the head",
    category: "लोकगीत",
    duration: 241,
    about:
      "Jhijhiyā is danced by women carrying earthen pots pierced with holes, a lamp burning inside. The songs are addressed against witchcraft and for the protection of the village, and the step is set by the drum rather than by the lyric.",
    lyrics: [
      {
        deva: "झिझिया नाचय, माथ पर दीप जरय ।",
        translation: "Jhijhiyā is danced; on the head the lamp burns.",
      },
      {
        deva: "गामक रखवारि, डाइन भागय दूर ।",
        translation: "Guard of the village — let the witch flee far away.",
      },
    ],
    source: {
      citation:
        "Documented in Bihar folk-performance surveys, Sangeet Natak Akademi, 1970s–1990s.",
      status: "community",
    },
  },
];

export const musicFilters: ("All" | SongCategory)[] = [
  "All",
  "सोहर",
  "बटगमनी",
  "छठी मईया",
  "लोकगीत",
];
