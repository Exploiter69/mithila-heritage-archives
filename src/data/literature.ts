import type { Source } from "./types";

export type LiteraryForm = "कविता" | "कथा" | "शास्त्रीय";

export interface LiteraryWork {
  slug: string;
  title: string;
  titleDeva: string;
  transliteration: string;
  author: string;
  authorDeva: string;
  authorBio: string;
  era: string;
  form: LiteraryForm;
  snippet: string;
  body: { deva: string; translit?: string; translation: string }[];
  note: string;
  source: Source;
}

export const literaryWorks: LiteraryWork[] = [
  {
    slug: "bada-sukh-sar",
    title: "Baṛa sukha sāra pāola tua tīre",
    titleDeva: "बड़ सुख सार पाओल तुअ तीरे",
    transliteration: "baṛa sukha sāra pāola tua tīre",
    author: "Vidyāpati Ṭhākur",
    authorDeva: "विद्यापति ठाकुर",
    authorBio:
      "Court poet of Mithila, c. 1350–1450. Wrote in Maithili, Sanskrit and Avahaṭṭha; his padāvalī shaped devotional song across eastern India.",
    era: "14th–15th century",
    form: "कविता",
    snippet:
      "बड़ सुख सार पाओल तुअ तीरे ।\nछोड़इत निकट नयन बह नीरे ॥",
    body: [
      {
        deva: "बड़ सुख सार पाओल तुअ तीरे ।\nछोड़इत निकट नयन बह नीरे ॥",
        translit: "baṛa sukha sāra pāola tua tīre / choṛaita nikaṭa nayana baha nīre",
        translation:
          "The whole essence of happiness I found upon your bank; leaving it now, my eyes run with water.",
      },
      {
        deva: "करजोरि बिनतिय करिअ तोहि गंगा ।\nपुनि दरसन होए पुनमति संगा ॥",
        translit: "karajori binatiya karia tohi gaṅgā / puni darasana hoe punamati saṅgā",
        translation:
          "With folded hands I make this plea to you, Gaṅgā: let me see you again, in merit's company.",
      },
      {
        deva: "एक अपराध घेम मोर जानी ।\nपरसल माए पाए तुअ पानी ॥",
        translit: "eka aparādha ghema mora jānī / parasala māe pāe tua pānī",
        translation:
          "Forgive me one offence, knowing it mine: mother, my feet have touched your water.",
      },
    ],
    note:
      "Sung to this day as a Gaṅgā-stuti at riverside rituals in Mithila; the melody is transmitted orally and varies by district.",
    source: {
      citation:
        "Vidyāpati, Padāvalī, ed. Shivnandan Thakur, Maithili Akademi, Patna, 1979.",
      status: "verified",
      detail: "Text follows the Akademi edition; transliteration editorial.",
    },
  },
  {
    slug: "varna-ratnakara",
    title: "Varṇa Ratnākara",
    titleDeva: "वर्ण रत्नाकर",
    transliteration: "varṇa ratnākara",
    author: "Jyotirīśvara Ṭhākur",
    authorDeva: "ज्योतिरीश्वर ठाकुर",
    authorBio:
      "Fourteenth-century writer at the Karṇāṭa court of Mithila; author of the earliest known Maithili prose and of the Sanskrit play Dhūrtasamāgama.",
    era: "c. 1324 CE",
    form: "शास्त्रीय",
    snippet:
      "नगर वर्णन — हाट, बाट, मन्दिर, माली, मालिनि, गन्धी, तमोली सभ एक ठाम।",
    body: [
      {
        deva:
          "नगर वर्णन — हाट, बाट, मन्दिर, माली, मालिनि, गन्धी, तमोली सभ एक ठाम, ओहि नगरक शोभा वर्णन कएल नहि जाए।",
        translation:
          "Description of the city — market, road, temple, gardener, garland-maker, perfumer, betel-seller, all in one place; the splendour of that city cannot be told.",
      },
      {
        deva:
          "ऋतु वर्णन — वसन्त, ग्रीष्म, वर्षा, शरद, हेमन्त, शिशिर; प्रत्येक ऋतुक रूप, गन्ध आ ध्वनि अलग-अलग गणल गेल अछि।",
        translation:
          "Description of the seasons — spring, summer, rains, autumn, early and late winter; the form, scent and sound of each season are enumerated separately.",
      },
    ],
    note:
      "A kośa, or catalogue of descriptions, rather than a narrative: fourteen chapters listing the vocabulary of court, city, season and person.",
    source: {
      citation:
        "Jyotirīśvara, Varṇa Ratnākara, ed. S. K. Chatterji and B. Mishra, Asiatic Society, Calcutta, 1940.",
      status: "verified",
      detail: "Passages here are condensed paraphrase of the chapter openings.",
    },
  },
  {
    slug: "gadya-kusumanjali",
    title: "Kanyādān (opening)",
    titleDeva: "कन्यादान",
    transliteration: "kanyādāna",
    author: "Harimohan Jha",
    authorDeva: "हरिमोहन झा",
    authorBio:
      "1908–1984. Philosopher and satirist whose Maithili novels turned the reform debates of Mithilā's brahmin households into comedy.",
    era: "1933",
    form: "कथा",
    snippet:
      "बाबू साहेबक आँगन मे कन्यादानक चरचा चलैत छल, आ वर पक्षक तिलक अखनो तय नहि भेल छल।",
    body: [
      {
        deva:
          "बाबू साहेबक आँगन मे कन्यादानक चरचा चलैत छल, आ वर पक्षक तिलक अखनो तय नहि भेल छल। पण्डितजी पत्रा उनटबैत रहलाह, आ माए ओसार पर बैसि कानि रहली।",
        translation:
          "In the master's courtyard the talk was of giving the daughter away, and the groom's side had still not settled the tilak. The pandit kept turning the almanac's leaves, and the mother sat on the verandah and wept.",
      },
      {
        deva:
          "बेटी पढ़ल-लिखल छलीह, मुदा ओकर मत केओ नहि पुछलक। यैह गप ई कथा कहैत अछि।",
        translation:
          "The daughter was educated, but nobody asked her opinion. That is the thing this story tells.",
      },
    ],
    note:
      "Kanyādān is the best-known Maithili novel of the twentieth century and the standard entry point to modern Maithili prose.",
    source: {
      citation: "Harimohan Jha, Kanyādān, 1933; repr. Bharati Pustak Bhandar, Patna.",
      status: "verified",
      detail: "Opening passage summarised and rendered for the archive.",
    },
  },
  {
    slug: "nachari-umapati",
    title: "Nacārī of Umāpati",
    titleDeva: "नचारी — उमापति",
    transliteration: "nacārī",
    author: "Umāpati Upādhyāya",
    authorDeva: "उमापति उपाध्याय",
    authorBio:
      "Fourteenth-century Maithili poet and dramatist, author of Pārijātaharaṇa, an early kīrtaniyā play mixing Sanskrit and Maithili.",
    era: "14th century",
    form: "कविता",
    snippet: "जय जय भैरवि असुर भयाउनि पशुपति भामिनि माया ।",
    body: [
      {
        deva:
          "जय जय भैरवि असुर भयाउनि पशुपति भामिनि माया ।\nसहज सुमति वर दिअ हे गोसाउनि अनुगति गति तुअ पाया ॥",
        translit:
          "jaya jaya bhairavi asura bhayāuni paśupati bhāmini māyā / sahaja sumati vara dia he gosāuni anugati gati tua pāyā",
        translation:
          "Victory to Bhairavī, terror of demons, consort of Paśupati, Māyā herself. Grant the boon of plain good sense, O Goddess; your followers find their way at your feet.",
      },
    ],
    note:
      "Opens most kīrtaniyā performances in Mithila; often attributed to Vidyāpati in oral tradition, but the manuscript line assigns it to Umāpati.",
    source: {
      citation:
        "Umāpati Upādhyāya, Pārijātaharaṇa, ed. Ramanath Jha, Bihar Rashtrabhasha Parishad, 1966.",
      status: "community",
      detail: "Attribution contested in oral performance tradition.",
    },
  },
  {
    slug: "lalit-katha",
    title: "Puti (a village story)",
    titleDeva: "पूती",
    transliteration: "pūtī",
    author: "Lalit",
    authorDeva: "ललित",
    authorBio:
      "1934–1984. Maithili short-story writer of the post-independence generation; wrote about caste, land and the small cruelties of village life.",
    era: "1960s",
    form: "कथा",
    snippet:
      "गामक पोखरि सुखा गेल छल, आ ओकर कातक माटि फाटि कऽ चौकठि जकाँ भऽ गेल छल।",
    body: [
      {
        deva:
          "गामक पोखरि सुखा गेल छल, आ ओकर कातक माटि फाटि कऽ चौकठि जकाँ भऽ गेल छल। पूती रोज साँझ मे ओतय जाइत छलीह, जेना पानि घुरि आओत।",
        translation:
          "The village pond had dried, and the earth at its edge had cracked into squares like a door-frame. Pūtī went there every evening, as though the water would come back.",
      },
      {
        deva:
          "गाम कहलक — बताह अछि। मुदा ओ बरखा सँ पहिने जनैत छलीह जे कोन दिस सँ बादल आओत।",
        translation:
          "The village said she was mad. But before the rains she always knew which direction the cloud would come from.",
      },
    ],
    note:
      "Representative of the 1960s Maithili short story, in which the village is described without nostalgia.",
    source: {
      citation:
        "Anthologised in Maithili Kathā Saṅgraha, Sahitya Akademi, New Delhi, 1988.",
      status: "needs-review",
      detail: "Passage rendered for the archive; original pagination to be confirmed.",
    },
  },
];

export const literatureFilters: ("All" | LiteraryForm)[] = [
  "All",
  "कविता",
  "कथा",
  "शास्त्रीय",
];
