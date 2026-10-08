import type { Source } from "./types";

export type SongCategory = "सोहर" | "बटगमनी" | "छठी मईया" | "लोकगीत" | "संस्कार गीत" | "ऋतु गीत" | "देवगीत" | "कृषि गीत" | "पर्व गीत" | "लोकगाथा" | "प्रेमगीत";

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

export type RecordingStatus = "verified-live" | "needs-recheck" | "no-recording-located";

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

const expandedMusicCorpus: Song[] = [
  {
    slug: "sahara-life-cycle-song",
    title: "Sahara — birth and life-cycle songs",
    titleDeva: "सहारा — जन्म आ संस्कार गीत",
    transliteration: "Sahārā",
    performer: "Traditional women singers",
    occasion: "Birth, initiation, tonsure and marriage rites",
    category: "सोहर",
    recordingStatus: "no-recording-located",
    about: "IGNCA's classification places Sahara songs within Maithili life-cycle repertoire. This catalogue record describes the documented form rather than asserting one canonical text; local variants and performance contexts should be accessioned separately.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "lullaby-lori-tradition",
    title: "Lullaby tradition",
    titleDeva: "लोरी / निन्नी गीत",
    transliteration: "Lōrī",
    performer: "Traditional household singers",
    occasion: "Infancy and sleep",
    category: "सोहर",
    recordingStatus: "no-recording-located",
    about: "Maithili lullabies form part of the life-cycle repertoire described by IGNCA. The archive records the tradition as a corpus lead because wording and melody vary by household and locality.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "suhag-wedding-song",
    title: "Suhāg wedding songs",
    titleDeva: "सुहाग गीत",
    transliteration: "Suhāg gīt",
    performer: "Traditional wedding singers",
    occasion: "Maithili marriage rites",
    category: "संस्कार गीत",
    recordingStatus: "no-recording-located",
    about: "Suhāg songs are identified in IGNCA's description of Maithili marriage repertoire. Individual ritual-stage songs should be catalogued with their own textual and recording evidence.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "mundan-sanskar-song",
    title: "Mundan ceremony songs",
    titleDeva: "मुण्डन संस्कार गीत",
    transliteration: "Muṇḍan saṃskār gīt",
    performer: "Traditional singers",
    occasion: "Tonsure ceremony",
    category: "संस्कार गीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA documents Sahara and related life-cycle songs as being used at Mundan as well as other rites. This is a corpus record awaiting accession of locality-specific texts and recordings.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "barahmasa-seasonal",
    title: "Bārahmāsā",
    titleDeva: "बारहमासा",
    transliteration: "Bārahmāsā",
    performer: "Traditional singers",
    occasion: "Seasonal cycle and separation",
    category: "ऋतु गीत",
    recordingStatus: "no-recording-located",
    about: "Bārahmāsā songs organize emotion and observation through the twelve-month cycle. IGNCA places them within the annual-calendar and seasonal repertoire of Maithili folksong.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "chahomasa-seasonal",
    title: "Chahomāsā",
    titleDeva: "चहोमासा",
    transliteration: "Chahomāsā",
    performer: "Traditional singers",
    occasion: "Seasonal and separation repertoire",
    category: "ऋतु गीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA identifies Chahomāsā as a seasonal form alongside Bārahmāsā and Chanmasa. This record preserves the category without inventing a definitive text.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "chanmasa-seasonal",
    title: "Chanmāsā",
    titleDeva: "चनमासा",
    transliteration: "Chanmāsā",
    performer: "Traditional singers",
    occasion: "Seasonal and separation repertoire",
    category: "ऋतु गीत",
    recordingStatus: "no-recording-located",
    about: "Chanmāsā is included in IGNCA's classification of annual-calendar songs. The archive treats it as a documented form awaiting more granular accession.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "prati-morning-song",
    title: "Prāti morning songs",
    titleDeva: "प्राती",
    transliteration: "Prātī",
    performer: "Traditional devotional singers",
    occasion: "Morning devotional singing",
    category: "देवगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA describes Prāti as reverential morning songs and notes varieties including Bhairavi, Jajamanti and Vihaga. These are catalogued here as a form, not as a single fixed composition.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "bhairavi-prati",
    title: "Bhairavī Prāti",
    titleDeva: "भैरवी प्राती",
    transliteration: "Bhairavī Prātī",
    performer: "Traditional devotional singers",
    occasion: "Morning devotional repertoire",
    category: "देवगीत",
    recordingStatus: "no-recording-located",
    about: "A documented Prāti variety named in IGNCA's Maithili folksong classification. The archive keeps melody and textual variants open for later evidence-backed accession.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "gosaunik-geet",
    title: "Gosaunik-gīt",
    titleDeva: "गोसाउनिक गीत",
    transliteration: "Gosāunik-gīt",
    performer: "Traditional household singers",
    occasion: "Family-deity worship",
    category: "देवगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA groups Gosaunik-gīt with songs dedicated to family deities. The archive preserves the form as a research record pending individual recordings and localized textual evidence.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "bhagabati-geet",
    title: "Bhagabatī-gīt",
    titleDeva: "भगवती गीत",
    transliteration: "Bhagabatī-gīt",
    performer: "Traditional devotional singers",
    occasion: "Family and goddess worship",
    category: "देवगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA identifies Bhagabatī-gīt among Maithili devotional forms associated with family deities. Individual regional variants should be preserved as separate accessions.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "iirahut-love-song",
    title: "Iīrahut love songs",
    titleDeva: "ईराहुत",
    transliteration: "Iīrahut",
    performer: "Traditional singers",
    occasion: "Love, separation and union",
    category: "प्रेमगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA describes Iīrahut as songs of love and beauty covering separation and union, sung at ritual occasions and in leisure. This record deliberately avoids assigning a single author or definitive lyric.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "gwalari-song",
    title: "Gwalārī",
    titleDeva: "ग्वालरी",
    transliteration: "Gwalārī",
    performer: "Traditional singers",
    occasion: "Krishna and Gopi repertoire",
    category: "प्रेमगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA includes Gwalārī among the Iīrahut-related songs describing the Gopis and Krishna. This is a genre-level catalogue record awaiting specific textual and audio accessions.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "raasa-maithili-song",
    title: "Rāsa songs",
    titleDeva: "रास गीत",
    transliteration: "Rāsa",
    performer: "Traditional singers",
    occasion: "Krishna devotional and love repertoire",
    category: "प्रेमगीत",
    recordingStatus: "no-recording-located",
    about: "Rāsa is identified by IGNCA within the Maithili love-and-beauty song grouping, centered on Krishna's līlā with the Gopis.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "maana-song",
    title: "Māna",
    titleDeva: "मान गीत",
    transliteration: "Māna",
    performer: "Traditional singers",
    occasion: "Love lyric and dramatic exchange",
    category: "प्रेमगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA describes Māna as a dramatic lyric representing the annoyance of a beloved and an appeal for reconciliation. It belongs to the broader Iīrahut grouping.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "katha-gatha-folk-narrative",
    title: "Katha-gāthā",
    titleDeva: "कथा-गाथा",
    transliteration: "Kathā-gāthā",
    performer: "Traditional narrative singers",
    occasion: "Historical and mythical storytelling",
    category: "लोकगाथा",
    recordingStatus: "no-recording-located",
    about: "IGNCA describes Katha-gāthā as lyrics that narrate the deeds and incidents of historical and mythical characters through performance and storytelling.",
    lyrics: [],
    source: { citation: "Kailash K. Mishra, Classification and Structure of Maithili Folksongs, IGNCA.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "jat-jatin-song-cycle",
    title: "Jat-Jatin song cycle",
    titleDeva: "जट-जटिन गीत",
    transliteration: "Jaṭ-Jaṭin",
    performer: "Traditional folk performers",
    occasion: "Monsoon performance and separation narrative",
    category: "लोकगाथा",
    recordingStatus: "needs-recheck",
    about: "Jat-Jatin is a documented Mithila folk performance tradition combining song, dialogue and dance. This record remains corpus-level because individual versions differ and external recordings require re-checking before being marked live.",
    lyrics: [],
    source: { citation: "Documented Mithila folk tradition; current recording lead requires editorial verification.", url: "https://www.youtube.com/watch?v=NHX1F42NCN8", status: "community", detail: "External recording lead located; not treated as an archival master." },
  },
  {
    slug: "salhesh-gatha",
    title: "Salhesh gāthā",
    titleDeva: "सलहेस गाथा",
    transliteration: "Salhesh gāthā",
    performer: "Traditional narrative performers",
    occasion: "Folk-epic and shrine performance",
    category: "लोकगाथा",
    recordingStatus: "no-recording-located",
    about: "Salhesh gāthā is a documented Mithila oral-epic tradition associated with Raja Salhesh and the Dusadh community. The archive records the tradition without collapsing its community-specific performance contexts into a single text.",
    lyrics: [],
    source: { citation: "Folkartopedia, Raja Salhesh oral tradition documentation.", url: "https://www.folkartopedia.com/oral-traditions/folklores/folklore-raja-salhesh-mithila-sk/", status: "community" },
  },
  {
    slug: "bhagait-gahbar-song",
    title: "Bhagait / Gahbar song tradition",
    titleDeva: "भगैत / गहबर गीत",
    transliteration: "Bhagait / Gahbar gīt",
    performer: "Traditional Bhagat singers",
    occasion: "Devotional narrative performance",
    category: "लोकगाथा",
    recordingStatus: "needs-recheck",
    about: "Bhagait is a living devotional and narrative singing tradition in Mithila. The archive treats it as a community-rooted tradition and keeps recording leads separate from the cultural record.",
    lyrics: [],
    source: { citation: "Sahitya Akademi, Maithili publications bibliography; Bhagait-Gahbar Geet collection.", url: "https://www.sahitya-akademi.gov.in/publications/maithali.pdf", status: "verified", detail: "A current recording lead should be reviewed before being marked as a verified stream." },
  },
  {
    slug: "phagua-holi-song",
    title: "Phagua / Holi songs",
    titleDeva: "फगुआ गीत",
    transliteration: "Phagua",
    performer: "Traditional singers",
    occasion: "Holi and spring",
    category: "पर्व गीत",
    recordingStatus: "no-recording-located",
    about: "Phagua belongs to the seasonal and festival repertoire of Mithila. The archive keeps it as a collection-level record until specific regional versions are accessioned with source and recording provenance.",
    lyrics: [],
    source: { citation: "Maithili folk-song classification and cultural documentation.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "madhushravani-festival-songs",
    title: "Madhushrāvaṇī festival songs",
    titleDeva: "मधुश्रावणी गीत",
    transliteration: "Madhushrāvaṇī gīt",
    performer: "Traditional women singers",
    occasion: "Madhushrāvaṇī ritual cycle",
    category: "पर्व गीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA documents Madhushrāvaṇī as a women-centred Mithila ritual with several associated folksongs. The archive records the festival repertoire without inventing a single canonical song.",
    lyrics: [],
    source: { citation: "IGNCA Janapada Sampada documentation of Mithila folksongs and Madhushrāvaṇī.", url: "https://ignca.gov.in/janapada-sampada/", status: "verified" },
  },
  {
    slug: "sama-chakeva-song-cycle",
    title: "Sāmā-Chakevā song cycle",
    titleDeva: "सामा-चकेवा गीत",
    transliteration: "Sāmā-Chakevā",
    performer: "Traditional women singers",
    occasion: "Kārtik festival cycle",
    category: "पर्व गीत",
    recordingStatus: "needs-recheck",
    about: "A corpus-level record for the wider Sāmā-Chakevā repertoire. The existing archive already contains one representative song; this record makes room for regional and ritual-stage variants without treating them as duplicates.",
    lyrics: [],
    source: { citation: "Mithila festival and folksong documentation; see the archive's existing Sāmā-Chakevā record for a representative accession.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "chhath-song-cycle",
    title: "Chhath song cycle",
    titleDeva: "छठ गीत परम्परा",
    transliteration: "Chhaṭh gīt",
    performer: "Traditional singers",
    occasion: "Chhath / Sūrya worship",
    category: "पर्व गीत",
    recordingStatus: "verified-live",
    about: "A corpus-level record for the wider Chhath repertoire. The archive already contains a representative song; this record distinguishes the broader tradition from any one commercial recording.",
    lyrics: [],
    source: { citation: "Mithila folk-song classification; Chhath is part of the annual ritual and festival repertoire.", url: "https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf", status: "verified" },
  },
  {
    slug: "vidyapati-padavali-performance",
    title: "Vidyāpati Padāvalī performance tradition",
    titleDeva: "विद्यापति पदावली गायन",
    transliteration: "Vidyāpati Padāvalī",
    performer: "Traditional and devotional singers",
    occasion: "Devotional, seasonal and cultural performance",
    category: "देवगीत",
    recordingStatus: "no-recording-located",
    about: "IGNCA documents the continuing oral circulation of Vidyāpati songs and notes that a complete contemporary authorial manuscript of the Padāvalī is not available. This record therefore points to a performance tradition rather than claiming a fixed master text.",
    lyrics: [],
    source: { citation: "IGNCA, Vidyapati: Bengal ke Bhajan / Maithili song transmission.", url: "https://ignca.gov.in/coilnet/vp011.htm", status: "verified" },
  },
  {
    slug: "maithili-audio-archive-samdaun",
    title: "Samdāun — documented audio tradition",
    titleDeva: "समदाउन — ध्वनि अभिलेख परम्परा",
    transliteration: "Samdāun audio tradition",
    performer: "Traditional wedding singers",
    occasion: "Bride's departure",
    category: "संस्कार गीत",
    recordingStatus: "verified-live",
    about: "IGNCA's public audio catalogue includes a Samdāun recording described as the song sung when a daughter leaves for her in-laws' home. The archive treats the institutional catalogue as an audio-recording lead, not as a rights transfer.",
    lyrics: [],
    source: { citation: "IGNCA Audio Recordings, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" },
  },
  {
    slug: "maithili-audio-archive-sohar",
    title: "Sohar — documented audio tradition",
    titleDeva: "सोहर — ध्वनि अभिलेख परम्परा",
    transliteration: "Sohar audio tradition",
    performer: "Traditional singers",
    occasion: "Birth celebration",
    category: "सोहर",
    recordingStatus: "verified-live",
    about: "IGNCA's public audio catalogue lists two Sohar recordings within its Mithila Vaibhav collection. This record points to the institutional catalogue rather than inventing a performer or modern stream.",
    lyrics: [],
    source: { citation: "IGNCA Audio Recordings, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" },
  },
];

songs.push(...expandedMusicCorpus);


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
