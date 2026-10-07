import type { Source } from "./types";

export type SongCategory = "सोहर" | "बटगमनी" | "छठी मईया" | "लोकगीत" | "संस्कार गीत" | "ऋतु गीत" | "देवगीत" | "कृषि गीत";

/**
 * A stream is an external YouTube video, embedded — never hosted here.
 * `channel` and `channelKind` describe the uploading channel exactly.
 */
export interface Stream {
  youtubeId: string;
  channel: string;
  channelKind: "Official artist channel" | "Label channel" | "Regional music channel";
  note: string;
}

export interface Song {
  slug: string;
  title: string;
  titleDeva: string;
  transliteration: string;
  performer: string;
  occasion: string;
  category: SongCategory;
  about: string;
  stream?: Stream;
  lyrics: { deva: string; translation: string }[];
  source: Source;
}

export const STREAM_ATTRIBUTION_TEXT =
  "All audio streams via official artist/label channels on YouTube. Rights remain with the original creators.";

export const songs: Song[] = [
  {
    slug: "bad-sukh-saar",
    title: "Bar sukh sār pāol tua tīre",
    titleDeva: "बड़ सुख सार पाओल तुअ तीरे",
    transliteration: "baṛa sukha sāra pāola tua tīre",
    performer: "Vidyāpati (composer); paramparik Maithili rendition",
    occasion: "Gaṅgā stuti — sung at the river, and at the end of a life",
    category: "लोकगीत",
    about:
      "Vidyāpati's Gaṅgā stuti, the best-known devotional lyric in Maithili: 'great happiness I have found at your bank.' It is sung at the river, at cremation grounds and at any gathering where the poet is invoked, and it remains the piece by which the fourteenth-century poet is known in ordinary speech.",
    stream: {
      youtubeId: "gx7Pq1iUCyM",
      channel: "T-Series Regional",
      channelKind: "Label channel",
      note: "The composition is fourteenth-century and has no single rights-holding performer; this is the label's own upload of a commercially released recording.",
    },
    lyrics: [
      {
        deva: "बड़ सुख सार पाओल तुअ तीरे ।",
        translation: "Great happiness, the essence of it, I have found at your bank.",
      },
      {
        deva: "छाड़इत निकट नयन बह नीरे ॥",
        translation: "Leaving your side, water runs from my eyes.",
      },
      {
        deva: "करजोरि विनमओ विमल तरंगे ।",
        translation: "With folded hands I bow to you, wave of clear water.",
      },
      {
        deva: "पुनि दरसन होए पुनमति गंगे ॥",
        translation: "Let me see you again, Gaṅgā, giver of merit.",
      },
    ],
    source: {
      citation:
        "Vidyāpati, padāvalī; text as printed in Maithili padāvalī collections (Grierson, 1882 onwards).",
      status: "verified",
      detail: "Sung variants differ slightly in line order and refrain.",
    },
  },
  {
    slug: "kaanch-hi-baans-ke-bahangiya",
    title: "Kāṃch hī bāṃs ke bahaṃgiyā",
    titleDeva: "काँच ही बाँस के बहंगिया",
    transliteration: "kāṃca hī bāṃsa ke bahaṃgiyā",
    performer: "Traditional Chhath geet",
    occasion: "Chhath — carrying the offering to the ghat",
    category: "छठी मईया",
    about:
      "The walking song of Chhath. The bahaṃgī is the green-bamboo yoke on which the offering baskets are carried to the water, and the song keeps the pace of that walk: the yoke bends, the carrier does not stop. It is the most widely sung Chhath song in the Maithili–Bhojpuri belt.",
    stream: {
      youtubeId: "Eyq7vfxu4iA",
      channel: "T-Series Bhakti Sagar",
      channelKind: "Label channel",
      note: "Traditional song with no single originating rights-holder; streamed from the label channel that published this commercial recording.",
    },
    lyrics: [
      {
        deva: "काँच ही बाँस के बहंगिया, बहंगी लचकत जाय ।",
        translation: "The yoke is of green bamboo — the yoke bends as it goes.",
      },
      {
        deva: "बहंगी लचकत जाय, होई ना बलम जी कहरिया ।",
        translation: "The yoke bends as it goes; come, my husband, be the bearer.",
      },
      {
        deva: "घाटे-घाटे दियरा बरे ला, सूरज देव अरघ लेबs ।",
        translation: "Lamps burn at every ghat; Sun God, accept the offering.",
      },
    ],
    source: {
      citation:
        "Traditional Chhath repertoire, Mithila and Bhojpur; text as commonly sung and as printed in Chhath geet collections.",
      status: "verified",
      detail: "Oral tradition; wording varies by district and household.",
    },
  },
  {
    slug: "sama-chakeva-lokgeet",
    title: "Sāmā Chakevā folk song",
    titleDeva: "सामा चकेवा लोकगीत",
    transliteration: "sāmā cakevā lokagīta",
    performer: "Traditional folk",
    occasion: "The seven nights of Sāmā Chakevā, Kārtik Saptamī to Pūrṇimā",
    category: "लोकगीत",
    about:
      "Sung only in this one week of the year, and only by women. The clay birds are set out in the courtyard, the sisters sing to Sāmā and against the slanderer Chugalā, and on Pūrṇimā the figures are broken and the songs stop until the next Kārtik.",
    stream: {
      youtubeId: "0T2eYoScArI",
      channel: "Maithili Ganga",
      channelKind: "Regional music channel",
      note: "Traditional repertoire; no official artist upload is available, so a credible Maithili regional music channel is used and labelled as such.",
    },
    lyrics: [
      {
        deva: "सामा चकेवा खेलब गे बहिना, भैया जीवथि हजार ।",
        translation: "We will play Sāmā Chakevā, sister — may our brothers live a thousand years.",
      },
      {
        deva: "चुगला के मुँह में आगि लगै छै, सामा के भेटै दुलार ।",
        translation: "Fire to the mouth of the slanderer; to Sāmā, only affection.",
      },
      {
        deva: "कार्तिक पूनम सामा बिदा, बहिना नयन भरल ।",
        translation: "On Kārtik full moon Sāmā departs, and the sisters' eyes are full.",
      },
    ],
    source: {
      citation:
        "Maithili folklore collections; observed practice in Madhubani, Darbhanga and Saptari districts.",
      status: "community",
      detail: "Oral tradition; lines are a common variant.",
    },
  },
  {
    slug: "sohar-lalna-re",
    title: "Sohar for a newborn",
    titleDeva: "सोहर — ललना रे",
    transliteration: "sohara — lalanā re",
    performer: "Sharda Sinha",
    occasion: "Sung on the sixth night after a birth, by the women of the household",
    category: "सोहर",
    about:
      "Sohar is the birth song of Mithila and Bhojpur. The newborn is addressed as Kṛṣṇa, and the women of the family sing in the courtyard through the night. Sharda Sinha's recordings carried the form to a national audience without altering its structure.",
    stream: {
      youtubeId: "3L2peMLWNwE",
      channel: "Sharda Sinha Official",
      channelKind: "Official artist channel",
      note: "Uploaded on the artist's own channel, from the Saregama release.",
    },
    lyrics: [
      {
        deva: "ललना रे, जनमल कान्ह कन्हैया हो ।",
        translation: "O little one — Kānha, Kanhaiyā, is born.",
      },
      {
        deva: "आँगन मे बाजय बधैया, सासु मंगल गाबथि हो ।",
        translation:
          "In the courtyard the congratulation-drum sounds; the mother-in-law sings the auspicious song.",
      },
      {
        deva: "ननदि दीप जरावथि, भउजी थार सजावथि हो ।",
        translation:
          "The husband's sister lights the lamp; the brother's wife arranges the platter.",
      },
    ],
    source: {
      citation: "Sharda Sinha, sohar repertoire; Saregama recordings.",
      status: "verified",
      detail: "Lyric lines are a common variant; wording differs by household.",
    },
  },
  {
    slug: "batgamani-vidai",
    title: "Baṭgamanī — song of the road",
    titleDeva: "बटगमनी — बाबा के अँगना छूटल",
    transliteration: "baṭagamanī — bābā ke aṅganā chūṭala",
    performer: "Traditional; Maithili wedding repertoire",
    occasion: "Sung while the bride's party walks the road, at vidāi",
    category: "बटगमनी",
    about:
      "Baṭgamanī means 'going by the road' — songs measured to a walking pace, sung when a party travels, above all when a daughter leaves her father's house. The tempo is slow and the lines are long enough to be sung while carrying a load.",
    stream: {
      youtubeId: "uU-7qB7s_Sg",
      channel: "Geet Bhajan",
      channelKind: "Regional music channel",
      note: "Traditional wedding repertoire with no official artist upload; a credible Maithili devotional-music channel is used and labelled as such.",
    },
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
        "Field-attested vidāi repertoire, Madhubani and Darbhanga districts.",
      status: "community",
      detail: "Oral tradition; no single authoritative text.",
    },
  },
];


const researchMusicExpansion: Song[] = [
  {slug:"madhushravani-geet",title:"Madhushravani song tradition",titleDeva:"मधुश्रावणी गीत",transliteration:"Madhushrāvaṇī gīt",performer:"Traditional women singers",occasion:"Madhushravani ritual cycle",category:"संस्कार गीत",about:"A research lead for the song repertoire performed around Madhushravani, a major women-centred ritual cycle of Mithila. The archive keeps this as a genre-level record until individual songs and performers can be linked to located recordings or printed collections.",lyrics:[],source:{citation:"IGNCA Janapada Sampada documentation on Mithila folk traditions.",url:"https://ignca.gov.in/janapada-sampada/",status:"verified"}},
  {slug:"vivah-geet-cycle",title:"Vivāh Geet cycle",titleDeva:"विवाह गीत",transliteration:"Vivāh gīt",performer:"Traditional women singers",occasion:"Maithili marriage cycle",category:"संस्कार गीत",about:"A broad family of wedding songs covering household rites, joking exchanges, blessing, procession and departure. District and family repertoires differ, so this record deliberately describes the corpus rather than inventing a single canonical lyric.",lyrics:[],source:{citation:"IGNCA classification of Maithili folksongs — life-cycle and marriage repertoire.",url:"https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf",status:"verified"}},
  {slug:"samdaun-research",title:"Samdāun repertoire",titleDeva:"समदाउन",transliteration:"Samdāun",performer:"Traditional wedding singers",occasion:"Bride's departure / separation",category:"संस्कार गीत",about:"A dedicated research record for the Samdāun repertoire. Individual texts, melodies and regional variants should be catalogued separately rather than collapsed into one supposedly definitive lyric.",lyrics:[],source:{citation:"IGNCA Maithili folksong classification and regional folklore documentation.",url:"https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf",status:"verified"}},
  {slug:"nachari-research",title:"Nacārī",titleDeva:"नचारी",transliteration:"Nacārī",performer:"Traditional devotional singers",occasion:"Śiva devotion and kīrtan performance",category:"देवगीत",about:"A devotional Maithili form associated with Śiva and the Vidyāpati performance tradition. The archive treats genre, text, performer and recording as separate research layers.",lyrics:[],source:{citation:"IGNCA Maithili folk-song classification; Vidyapati bibliographic tradition.",url:"https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf",status:"verified"}},
  {slug:"maheshvani-research",title:"Mahēśvāṇī",titleDeva:"महेशवाणी",transliteration:"Mahēśvāṇī",performer:"Traditional devotional singers",occasion:"Śiva devotional performance",category:"देवगीत",about:"A Maithili Śaiva song form linked to Vidyāpati's devotional corpus and later performance practice. This entry is a research lead for locating editions, performers and recordings.",lyrics:[],source:{citation:"Sahitya Akademi Vidyapati bibliography and Maithili devotional-song research.",url:"https://sahitya-akademi.gov.in/pdf/Vidyapati.pdf",status:"verified"}},
  {slug:"seasonal-song-cycle",title:"Seasonal song cycle",titleDeva:"ऋतु गीत",transliteration:"Ritu gīt",performer:"Traditional singers",occasion:"Seasonal and agricultural calendar",category:"ऋतु गीत",about:"A corpus-level record for songs tied to seasons, months, weather and agricultural rhythms. The archive keeps individual regional texts open for later accession with source and recording provenance.",lyrics:[],source:{citation:"IGNCA classification of Maithili folksongs — seasonal repertoire.",url:"https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf",status:"verified"}},
  {slug:"agricultural-song-research",title:"Agricultural song traditions",titleDeva:"कृषि गीत",transliteration:"Kr̥ṣi gīt",performer:"Traditional rural singers",occasion:"Agricultural work and seasonal cycle",category:"कृषि गीत",about:"A research category for songs connected with cultivation, weather, harvest and rural labour. Individual recordings should be linked to locality, performer and date when accessioned.",lyrics:[],source:{citation:"IGNCA folk-song classification and Mithila rural-life documentation.",url:"https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf",status:"verified"}},
  {slug:"life-cycle-song-cycle",title:"Life-cycle song corpus",titleDeva:"संस्कार गीत",transliteration:"Saṃskār gīt",performer:"Traditional singers",occasion:"Birth, initiation, marriage and other life-cycle rites",category:"संस्कार गीत",about:"A corpus-level entry for Maithili songs attached to major life transitions. Birth, marriage and other ritual repertoires should ultimately be split into individual song records with local and textual provenance.",lyrics:[],source:{citation:"IGNCA classification of Maithili folksongs — life-cycle repertoire.",url:"https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf",status:"verified"}}
];
songs.push(...researchMusicExpansion);


export const musicFilters: ("All" | SongCategory)[] = [
  "All",
  "सोहर",
  "बटगमनी",
  "छठी मईया",
  "लोकगीत",
  "संस्कार गीत",
  "ऋतु गीत",
  "देवगीत",
  "कृषि गीत",
];
