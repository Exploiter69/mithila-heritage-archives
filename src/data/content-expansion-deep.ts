import type { Author, ArtEntry, MusicEntry } from "./archive";
import type { HeritageEntry } from "./heritage";
import { sahityaAkademiMaithiliAwards } from "./content-expansion-literature";

/**
 * Deep content expansion wave.
 *
 * These records deliberately distinguish bibliographic indexing from full
 * scholarship. Where the consulted source does not establish a biographical
 * field, the record says so instead of guessing.
 */

export const awardRecipientAuthors: Author[] = Array.from(
  new Map(sahityaAkademiMaithiliAwards.map((award) => [award.author, award])).values(),
).map((award) => ({
  slug: `award-recipient-${award.author.toLocaleLowerCase().replace(/[’‘']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  name: award.author,
  nameMai: award.author,
  lifespan: `Recipient of the Sahitya Akademi Award in Maithili (${award.awardYear}); lifespan not established by the award register.`,
  place: "Not established in the consulted award register.",
  role: "Maithili author / Sahitya Akademi Award recipient",
  bio: `The Sahitya Akademi register lists ${award.author} as the author of ${award.title}, which received the Maithili award in ${award.awardYear}. This record intentionally does not infer dates, birthplace or a longer biography from the award listing alone.`,
  works: [award.title],
  source: award.source,
}));

export const catalogueLiterature: Array<{
  slug: string;
  title: string;
  titleMai: string;
  author: string;
  period: string;
  form: "कथा" | "शास्त्रीय";
  language: "Maithili";
  summary: string;
  source: { citation: string; status: "verified"; url: string };
}> = [
  ["maithili-lokgeet-sanchayan","Maithili Lokgeet (Sanchayan)","मैथिली लोकगीत (संचयन)","Anima Singh","Modern scholarly collection","Folk epic","A 432-page Sahitya Akademi collection of Maithili folk songs, useful as a bibliographic anchor for life-cycle, seasonal and ritual song research."],
  ["mithilak-lokkatha-sanchay","Mithilak Lokkatha Sanchay","मिथिलाक लोककथा संचय","Yoganand Jha","Modern scholarly collection","Folk epic","A 409-page collection/catalogue entry for Maithili folk tales, providing a primary bibliographic lead for oral narrative research."],
  ["maithili-lokokti-sanchay","Maithili Lokokti Sanchay","मैथिली लोकोक्ति संचय","Kamalkant Jha","Modern scholarly collection","Essay","A 352-page collection of Maithili proverbs, a core reference lead for the archive's proverb and idiom corpus."],
  ["maithili-lokgatha-swarup","Maithili Lokgatha: Svarup Vivechan Evam Prastuti","मैथिली लोकगाथा : स्वरूप विवेचन एवं प्रस्तुति","Mahendra Narayan Ram","2007","Essay","A Sahitya Akademi seminar volume focused on the form, interpretation and presentation of Maithili folk epics."],
  ["maithili-lok-sahitya","Maithili Lok Sahitya","मैथिली लोक साहित्य","Chandranath Mishra Amar","2006","Essay","A Sahitya Akademi seminar volume devoted to Maithili folk literature as a research field."],
  ["maithili-katha-dhara","Maithili Katha Dhara","मैथिली कथा धारा","Kamakhya Devi","1998 / reprint 2009","Prose","A collection connected with Maithili fiction around the freedom movement; the catalogue records the edition and translation history."],
  ["maithili-katha-sangrah","Maithili Katha Sangrah","मैथिली कथा संग्रह","Jaydharī Singh, editor","Reprint 2009","Prose","A Sahitya Akademi anthology of Maithili stories, useful as a bibliographic entry point to twentieth-century prose."],
  ["maithili-upanyasak-vikas","Maithili Upanyasak Vikas","मैथिली उपन्यासक विकास","Ashok Avichal, editor","2016","Essay","Proceedings on the development of the Maithili novel, providing a period-and-genre research index."],
  ["maithili-kathak-vikas","Maithili Kathak Vikas","मैथिली कथाक विकास","Vasukinath Jha, editor","2009 reprint","Essay","Proceedings on the development of Maithili short fiction and narrative writing."],
  ["maithili-kavyak-vikas","Maithili Kavyak Vikas","मैथिली काव्यक विकास","Sureshwar Jha, editor","2009 reprint","Essay","Proceedings on the development of Maithili poetry."],
  ["maithili-gadyak-vikas","Maithili Gadyak Vikas","मैथिली गद्यक विकास","Mohan Bhardwaj, editor","1996","Essay","Proceedings on the development of Maithili prose."],
  ["maithili-natakak-vikas","Maithili Natakak Vikas","मैथिली नाटकक विकास","Devkant Jha and Dinesh Kumar, editors","2006","Essay","Proceedings on the development of Maithili drama."],
  ["maithili-patr-patrika","Maithili Patr-Patrika","मैथिली पत्र-पत्रिका","Mohan Bhardwaj, editor","2007","Essay","Proceedings focused on Maithili journals and periodicals, a key lead for the archive's serials collection."],
  ["maithili-prabandh-kavyak-udbhav","Maithili Prabandh-Kavyak Udbhav O Vikas","मैथिली प्रबंध-काव्यक उद्भव ओ विकास","Veena Thakur, editor","2017","Essay","Proceedings on the emergence and development of Maithili narrative/long-form poetry."],
  ["maithilime-mahila-lekhan","Maithilime Mahila Lekhan: Beesam Shatabdi","मैथिलीमे महिला लेखन : बीसम शताब्दी","Neerja Renu, chief editor","2004","Essay","Anthology documenting twentieth-century Maithili women's writing, an important corrective to a male-only literary canon."],
  ["maithili-dalit-lokgatha-o-sanskriti","Maithili Dalit Lokgatha O Sanskriti","मैथिली दलित लोकगाथा ओ संस्कृति","Shiv Prasad Yadav, editor","2015","Essay","Proceedings on Dalit folk epics and culture in Maithili, providing a dedicated research lead for marginalized oral traditions."],
  ["mithila-bhasha-ramayan","Mithila Bhasha Ramayan","मिथिला भाषा रामायण","Kavi Chandra; Baldev Mishra and Ramanath Jha, editors","Reprint 2010","Folk epic","A 436-page Maithili Ramayana edition listed by Sahitya Akademi."],
  ["dina-bhadri-lokgatha","Dinabhadri Lokgatha","दीनाभद्री लोकगाथा","Mahendra Narayan Ram and Phulo Paswan, editors","2007","Folk epic","A Sahitya Akademi publication documenting the Dinabhadri folk epic."],
  ["salhes-lokgatha","Salhes Lokgatha","सलहेस लोकगाथा","Mahendra Narayan Ram and Phulo Paswan, editors","2007","Folk epic","A Sahitya Akademi publication documenting the Salhes folk-epic tradition."],
  ["sati-bihula","Sati Bihula","सती बिहुला","Buchru Paswan, editor","2013","Folk epic","A Sahitya Akademi publication of the Sati Bihula folk-epic tradition."]
].map((row) => {
  const [slug, title, titleMai, author, period, form, summary] = row as [string, string, string, string, string, string, string];
  return {
  slug,title,titleMai,author,period,
  titleDeva: titleMai,
  transliteration: title,
  authorDeva: "",
  authorBio: "Bibliographic editor/author information as listed in the Sahitya Akademi catalogue; a full biographical profile is a separate editorial task.",
  era: period,
  form: form === "Prose" ? "कथा" as const : form === "Folk epic" ? "कथा" as const : "शास्त्रीय" as const,
  snippet: summary,
  body: [],
  note: "Bibliographic catalogue record. The archive does not invent plot summaries, quotations or interpretation without consulting the edition.",
  language: "Maithili" as const,
  summary,
  source: {
    citation: `Sahitya Akademi, Maithili Catalogue — ${title}.`,
    status: "verified" as const,
    url: "https://www.sahitya-akademi.gov.in/publications/maithili-catalogue_h.jsp",
  },
  };
});

export const folkCultureExpansion: HeritageEntry[] = [
  ["madhushravani","Madhushravani","मधुश्रावणी","Festival","Mithila, Bihar and Nepal Tarai","Śrāvaṇa / newly married women","A women-centred summer ritual associated with newly married couples and a sustained repertoire of Maithili songs.","IGNCA documentation describes Madhusravani as a major occasion for newly married couples, with rituals and songs performed by women and friends of the bride.","https://ignca.gov.in/janapada-sampada/"],
  ["sohar-sanskar","Sohar / birth-song tradition","सोहर","Festival","Mithila","Birth and sixth-day rites","A life-cycle song tradition associated with childbirth and the early days after birth.","IGNCA's classification of Maithili folksongs places Sahara/Sohar songs within life-cycle repertoire and notes their use at birth, initiation and marriage.","https://ignca.gov.in/classification-of-maithili-"],
  ["vivah-geet","Vivah Geet","विवाह गीत","Festival","Mithila","Marriage cycle","A broad family of women's wedding songs covering household rites, negotiations, departure and blessing.","IGNCA classifies marriage songs as a major life-cycle group of Maithili folksongs; individual repertoires vary by district and household.","https://ignca.gov.in/classification-of-maithili-"],
  ["samdaun-tradition","Samdaun","समदाउन","Festival","Mithila","Wedding departure / separation","A Maithili wedding-song tradition associated with emotional separation and the bride's departure.","The IGNCA folksong classification identifies life-cycle and marriage repertoire as a major field; exact song labels and performance contexts vary regionally.","https://ignca.gov.in/classification-of-maithili-"],
  ["batgamani-tradition","Batgamani","बटगमनी","Festival","Mithila","Wedding / journey repertoire","A Maithili song tradition associated with travel and wedding contexts, especially the emotional register of movement and departure.","The archive treats Batgamani as a distinct research category while retaining regional variation until corpus comparison is completed.","https://ignca.gov.in/classification-of-maithili-"],
  ["nachari-tradition","Nachari","नचारी","Festival","Mithila","Devotional / performance tradition","A devotional song form associated with Shiva and the wider Maithili kirtaniya performance tradition.","Maithili musical transmission includes devotional and life-cycle repertoires; the archive retains Nachari as a separate genre for future performer and recording documentation.","https://ignca.gov.in/classification-of-maithili-"],
  ["seasonal-folk-songs","Seasonal folk-song cycle","ऋतु गीत","Festival","Mithila","Across the agricultural year","Songs linked to seasons, weather, agriculture, longing and changing village life.","IGNCA documentation describes seasonal songs as a major Maithili folk-song field in which months and seasonal states are represented.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["life-cycle-song-cycle","Life-cycle song cycle","संस्कार गीत","Festival","Mithila","Birth, initiation, marriage and death","A broad oral repertoire that maps song onto major life-cycle transitions.","IGNCA classifies Maithili folksongs into life-cycle groups including birth, initiation and marriage, with women central to transmission.","https://ignca.gov.in/classification-of-maithili-"],
  ["agricultural-song-cycle","Agricultural song traditions","कृषि गीत","Festival","Mithila","Agricultural seasons","Songs connected to agrarian work, seasonal change and rural social life.","Grierson's rural-life lexicography and IGNCA folklore work together provide a research path for agricultural vocabulary and song traditions; individual song attribution remains to be documented.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["women-song-tradition","Women's folk-song transmission","महिला लोकगीत परंपरा","Festival","Mithila","Across ritual calendar","Women's collective singing is a major transmission mechanism for Maithili ritual and life-cycle knowledge.","IGNCA notes the central role of women in the performance and transmission of Maithili folksongs and in Madhusravani ritual.","https://ignca.gov.in/janapada-sampada/"],
  ["madhubani-folk-tales","Mithila folk-tale tradition","मिथिलाक लोककथा","Festival","Mithila","Oral tradition","A broad oral narrative field represented in Sahitya Akademi collections and contemporary cultural documentation.","Sahitya Akademi's Maithili catalogue includes Mithilak Lokkatha Sanchay, providing a bibliographic anchor for systematic folk-tale collection.","https://www.sahitya-akademi.gov.in/publications/maithili-catalogue_h.jsp"],
  ["folk-epic-tradition","Maithili folk-epic tradition","मैथिली लोकगाथा","Festival","Mithila and Nepal Tarai","Oral tradition","A large narrative tradition including community-specific heroic, devotional and social epics.","Sahitya Akademi lists dedicated publications on Maithili folk epics and their form, including Salhes, Dinabhadri and general folk-epic studies.","https://www.sahitya-akademi.gov.in/publications/maithili-catalogue_h.jsp"],
  ["ritual-floor-art","Ritual floor painting / Aripan","अरिपन","Festival","Mithila","Festivals, marriage and household rites","Geometric and ritual floor designs made with rice paste and associated with auspicious household occasions.","Government handicrafts documentation describes aripan as a traditional floor painting made during festivals, marriages and births.","https://handicrafts.nic.in/pdf/THCI-Book.pdf"],
  ["kohbar-ritual","Kohbar marriage-chamber tradition","कोहबर","Festival","Mithila","Marriage","The decorated marriage chamber and its associated painting and song repertoire.","IGNCA's Mithila painting study describes the kohbar as a sanctified marriage space decorated with mythological, floral and animal imagery.","https://ignca.gov.in/PDF_data/Mithila_Paintings.pdf"],
  ["foodways-makhana","Makhana foodway","मखाना","Festival","Mithila","Ritual and household foodways","Foxnut is an important Mithila foodway and appears in contemporary festival and household descriptions, especially around Kojagara.","The archive records Makhana as a foodway research topic; specific historical claims about ritual antiquity require culinary and ethnographic sources.","https://ntb.gov.np/en/janakpur"],
].map((row) => {
  const [slug, name, nameDeva, kind, place, period, summary, context, url] = row as [string, string, string, string, string, string, string, string, string];
  return {
  slug,name,nameDeva,kind: kind as "Festival" | "Site",place,period,summary,context:[context],
  source:{citation:"Institutional or catalogue documentation consulted for Mithila cultural research.",url,status:"verified" as const},
  };
});

export const artExpansion: ArtEntry[] = [
  ["mithila-painting-tradition","Mithila Painting","Mithila painting","Madhubani and wider Mithila; adjoining Nepal Tarai","Mud walls, floors, handmade paper, cloth, canvas","A women-led folk painting tradition using natural and modern pigments, with themes from mythology, nature, ritual and village life.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Mithila_painting/MithilaPaintingWebPage.html"],
  ["bharni-style","Bharni","Mithila painting","Madhubani district","Flat fills with strong outlines; traditionally natural pigments, now also commercial colors","A filled-colour register of Mithila painting. Government handicrafts documentation distinguishes Bharni from line-dominant Kachni and Godhana.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["kachni-style","Kachni","Mithila painting","Madhubani district","Fine line, hatching and stippling","A line-oriented register in which form is built through dense strokes rather than broad solid fills.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["godhana-style","Godhana / Godna","Mithila painting","Madhubani; Jitwarpur and related craft communities","Tattoo-derived repeated marks, line drawing, natural and modern pigments","A Mithila register derived from tattoo-like patterning and concentric/repeated marks; the Government handicrafts portal identifies Godhana as one of the principal Madhubani styles.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["kohbar-painting","Kohbar painting","Mithila painting","Mithila marriage households","Mud/wall painting, paper and contemporary surfaces; floral and animal motifs","Painting associated with the marriage chamber and auspicious wedding imagery.","https://ignca.gov.in/PDF_data/Mithila_Paintings.pdf"],
  ["aripan-art","Aripan","Mithila ritual art","Mithila","Rice paste on prepared floor surfaces","Geometric ritual floor designs made for festivals, marriages, births and other auspicious occasions.","https://handicrafts.nic.in/pdf/THCI-Book.pdf"],
  ["natural-pigment-practice","Natural pigment practice","Mithila painting","Mithila","Turmeric, indigo, soot/charcoal and plant-derived pigments","Traditional Mithila painting uses locally available natural pigments and binders, although contemporary practice also uses commercial colours.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Mithila_painting/MithilaPaintingWebPage.html"],
  ["women-painters","Women painters and transmission","Mithila painting","Mithila villages and urban craft centres","Wall, paper, cloth and canvas","Women have historically been central to the transmission of Mithila painting, with the craft moving from domestic walls and floors into paper, cloth and wider markets.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["sita-devi","Sita Devi and modern Mithila painting","Artist history","Madhubani / Jitwarpur tradition","Mithila painting","The Government handicrafts portal identifies Sita Devi among artists who helped popularize Madhubani painting internationally.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["ganga-devi","Ganga Devi and modern Mithila painting","Artist history","Mithila painting","Mithila painting on paper and other modern surfaces","The Government handicrafts portal identifies Ganga Devi among artists who helped popularize Madhubani painting internationally.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["jitwarpur-cluster","Jitwarpur painting cluster","Regional craft","Jitwarpur, Madhubani","Mithila / Godhana painting","Government handicrafts records identify Jitwarpur artisans and the area as a significant centre for Madhubani/Godhana painting.","https://handicrafts.nic.in/cmsUpload/20180104172827SKMList2018.pdf"],
  ["ranti-cluster","Ranti painting cluster","Regional craft","Ranti, Madhubani","Mithila folk painting","Ranti appears in the established geography of Madhubani painting research; the archive keeps village-level school attribution open to further source checking.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
  ["mithila-art-nepal-tarai","Mithila art in Nepal Tarai","Regional variation","Nepal Tarai / Madhesh","Walls, paper and contemporary craft surfaces","Nepal Tourism Board describes Mithila painting as practiced in both Nepal and India, with women decorating homes during festivals and auspicious ceremonies.","https://ntb.gov.np/en/mithila-art"],
  ["contemporary-mithila-social-themes","Contemporary social-theme painting","Contemporary practice","Mithila and Madhubani","Paper, canvas and commercial craft surfaces","The Government handicrafts portal notes contemporary Madhubani artists using the form to address social issues alongside traditional themes.","https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Miscellaneous/Folk_Painting/Madhubani_Painting/Madhubani_Paintingwebpage.html"],
].map((row) => {
  const [slug, title, tradition, region, materials, description, url] = row as [string, string, string, string, string, string, string];
  return {
  slug,title,tradition,region,materials,description,
  source:{citation:"Office of the Development Commissioner (Handicrafts), Government of India; and Nepal Tourism Board where noted.",url,status:"verified" as const},
  };
});

export const musicExpansion: MusicEntry[] = [
  ["folk-sohar","Sohar","सोहर","Life-cycle song","Birth and sixth-day rites","Maithili birth-song repertoire associated with childbirth and early life-cycle observances.","https://ignca.gov.in/classification-of-maithili-"],
  ["sanskar-geet","Sanskar Geet","संस्कार गीत","Life-cycle repertoire","Birth, initiation, marriage and other rites","Umbrella category for songs attached to major life-cycle transitions.","https://ignca.gov.in/classification-of-maithili-"],
  ["vivah-geet","Vivah Geet","विवाह गीत","Marriage songs","Marriage cycle","Large family of women's wedding songs performed at different household stages of marriage.","https://ignca.gov.in/classification-of-maithili-"],
  ["folk-batgamani","Batgamani","बटगमनी","Folk song","Journey / wedding contexts","A distinct Maithili research category associated with movement, journey and wedding repertoire.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["folk-samdaun","Samdaun","समदाउन","Folk song","Wedding departure / separation","A wedding-associated song tradition focused on separation and emotional departure.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["nachari","Nachari","नचारी","Devotional song","Shaiva devotion","Devotional repertoire associated with Shiva and the Maithili kirtaniya tradition.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["mahesvani","Mahesvani","महेशवाणी","Devotional song","Shaiva devotion","A devotional category associated with Mahesh/Shiva in Maithili musical practice.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["seasonal-geet","Ritu Geet","ऋतु गीत","Seasonal song","Agricultural and seasonal cycle","Songs representing months, seasons, weather, longing and changing rural life.","https://ignca.gov.in/PDF_data/Classification_Structure_Maithili_FolkSongs.pdf"],
  ["chhath-geet","Chhath Geet","छठ गीत","Ritual song","Chhath","Songs performed around Chhath observance and its river/pond offerings.","https://ntb.gov.np/chhat-parva"],
  ["madhushravani-geet","Madhushravani Geet","मधुश्रावणी गीत","Ritual song","Madhushravani","Women-led song repertoire associated with the Madhusravani ritual for newly married couples.","https://ignca.gov.in/janapada-sampada/"],
  ["folk-epic-singing","Folk-epic singing","लोकगाथा गायन","Folk epic","Community performance","Performance of long-form Maithili folk narratives and epics, requiring performer-level documentation and recording provenance.","https://www.sahitya-akademi.gov.in/publications/maithili-catalogue_h.jsp"],
  ["women-folk-song","Women's folk-song repertoire","महिला लोकगीत","Folk song","Ritual and life-cycle","A broad performance ecology in which women are major singers and transmitters of Maithili ritual knowledge.","https://ignca.gov.in/janapada-sampada/"],
].map((row) => {
  const [slug, title, titleMai, genre, occasion, description, url] = row as [string, string, string, string, string, string, string];
  return {
  slug,title,titleMai,genre,occasion,description,
  source:{citation:"IGNCA classification and documentation of Maithili folksongs; Nepal Tourism Board for Chhath.",url,status:"verified" as const},
  };
}) as MusicEntry[];

export const institutionalMusicExpansion: MusicEntry[] = [
  {
    slug: "mithila-vaibhav-audio-archive",
    title: "Mithila Vaibhav — IGNCA audio archive leads",
    titleMai: "मिथिला-वैभव — इन्दिरा गाँधी राष्ट्रीय कला केन्द्र श्रव्य अभिलेख",
    genre: "Archive / folk repertoire",
    occasion: "Mithila folk-song documentation",
    description: "An institutional IGNCA audio-archive page lists recordings/leads including Hari Kirtan, Samdaun, Tirhut, Chaitabara, Sohar, Udasi and Kirtan under Mithila Vaibhav.",
    performers: ["Group of women in Mithila (archive descriptor; individual names not supplied on the page)"],
    recordingLeads: [
      { title: "Hari Kirtan", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
      { title: "Samdaun", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
      { title: "Tirhut", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
      { title: "Chaitabara", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
      { title: "Sohar 1 and Sohar 2", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
      { title: "Udasi", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
      { title: "Kirtan", source: { citation: "IGNCA CoIL-Net audio archive, Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" } },
    ],
    source: { citation: "Indira Gandhi National Centre for the Arts, CoIL-Net Audio Recordings — Mithila Vaibhav.", url: "https://ignca.gov.in/coilnet/aud_0001.htm", status: "verified" },
  },
  {
    slug: "vindhyavasini-devi-maithili-folk-singing",
    title: "Vindhyavasini Devi — Maithili folk-singing demonstration",
    titleMai: "विन्ध्यवासिनी देवी — मैथिली लोकगायन प्रदर्शन",
    genre: "Folk singing",
    occasion: "Institutional performance and demonstration",
    description: "Sahitya Akademi's Loka activity archive records Vindhyavasini Devi rendering and demonstrating folk-singing styles in Bhojpuri, Maithili and Magaler languages at Allahabad in February 2002.",
    performers: ["Vindhyavasini Devi"],
    recordingLeads: [],
    source: { citation: "Sahitya Akademi, Loka folk-culture activity archive.", url: "https://sahitya-akademi.gov.in/literaray-activities/loka.jsp", status: "verified" },
  },
]);

export const musicExpansionCombined: MusicEntry[] = [...musicExpansion, ...institutionalMusicExpansion];

export const heritageExpansion: HeritageEntry[] = [
  ["janaki-mandir","Janaki Mandir","जानकी मन्दिर","Site","Janakpurdham, Dhanusha, Nepal","19th–20th century temple complex","A major Mithila pilgrimage landmark dedicated to Sita/Janaki, combining local and Mughal-influenced architectural forms.","Nepal Tourism Board records the temple as a three-storey, sixty-room complex and a major pilgrimage site; the exact construction date varies across official NTB pages and is retained as an editorial discrepancy rather than silently resolved.","https://ntb.gov.np/janaki-mandir--janakpur--dhanusha"],
  ["ganga-sagar","Ganga Sagar","गङ्गासागर","Site","Janakpurdham, Dhanusha, Nepal","Historic sacred pond","A major sacred pond in Janakpur and part of the city's dense pond landscape.","Nepal Tourism Board identifies Ganga Sagar among Janakpur's most sacred ponds and a site used for ritual bathing.","https://ntb.gov.np/ponds-of-janakpur"],
  ["dhanusha-sagar","Dhanusha Sagar","धनुषासागर","Site","Janakpurdham, Dhanusha, Nepal","Historic sacred pond","A major sacred pond associated with Janakpur's ritual landscape.","Nepal Tourism Board identifies Dhanusha Sagar among the most sacred ponds in the Janakpur area.","https://ntb.gov.np/ponds-of-janakpur"],
  ["dhanushadham","Dhanushadham","धनुषाधाम","Site","Dhanusha district, Nepal","Pilgrimage landscape","A pilgrimage site northeast of Janakpur associated in the Ramayana tradition with a fragment of Shiva's bow.","Nepal Tourism Board describes Dhanushadham as a major pilgrimage destination and records the traditional association with a fossilized bow fragment.","https://trade.ntb.gov.np/tourist-destination/pilgrimage-sites-2/"],
  ["ram-mandir-janakpur","Ram Mandir, Janakpur","राम मन्दिर","Site","Janakpurdham, Dhanusha, Nepal","18th century","A pagoda-style temple in Janakpur, architecturally distinct from the Mughal-influenced Janaki Mandir.","Nepal Tourism Board records Ram Mandir as a pagoda-style temple associated with Amar Singh Thapa and part of Janakpur's pilgrimage landscape.","https://trade.ntb.gov.np/tourist-destination/pilgrimage-sites-2/"],
  ["jaleshwar-mahadev","Jaleshwar Mahadev","जलेश्वर महादेव","Site","Jaleshwar, Mahottari, Nepal","Living temple","A Shaiva shrine whose lingam is described by Nepal Tourism Board as remaining immersed in water, with ponds on either side.","Nepal Tourism Board records Jaleshwar Mahadev as a major pilgrimage site south of Janakpur and notes the annual Shivaratri fair.","https://ntb.gov.np/en/madhesh-province"],
  ["shyama-mai-temple","Shyama Mai Temple","श्यामा माई मन्दिर","Site","Darbhanga, Bihar","Modern Darbhanga Raj-era temple","A Kali temple commissioned by Maharaja Rameshwar Singh and now an important spiritual and cultural landmark of Darbhanga.","Bihar Tourism identifies the temple as a major Shakti site associated with the Darbhanga Raj and regional Tantric traditions.","https://tourism.bihar.gov.in/en/destinations/darbhanga/ahilya-sthaan"],
  ["janakpur-pond-landscape","Janakpur sacred-pond landscape","जनकपुर पोखर परिदृश्य","Site","Janakpurdham, Nepal","Historic cultural landscape","A dense network of sacred ponds forms a defining part of Janakpur's built and ritual landscape.","Nepal Tourism Board documents dozens of ancient ponds in Janakpur and highlights Ganga Sagar, Parshuram Kunda and Dhanusha Sagar.","https://ntb.gov.np/ponds-of-janakpur"],
  ["mithila-nepal-tarai-cultural-landscape","Mithila Nepal-Tarai cultural landscape","नेपाल तराइ मिथिला सांस्कृतिक परिदृश्य","Site","Madhesh Province, Nepal","Living cultural landscape","The southern plains of Nepal form the northern part of the wider historical Mithila cultural region, with Maithili widely used in the area.","Nepal Tourism Board describes Madhesh as the northern part of ancient Mithila and highlights Maithili, ponds, temples, painting and festivals as part of its cultural landscape.","https://ntb.gov.np/en/madhesh-province"],
  ["janakpur-mithila-art-centres","Janakpur Mithila art centres","जनकपुर मिथिला कला केन्द्र","Site","Janakpurdham, Nepal","Contemporary cultural infrastructure","Contemporary cultural spaces in Janakpur connect living Mithila painting practice with tourism, craft and local heritage.","Nepal Tourism Board highlights Mithila art centres and living painting practice as part of Janakpur's cultural offer.","https://ntb.gov.np/en/janakpur-and-vivah-panchami"],
].map((row) => {
  const [slug, name, nameDeva, kind, place, period, summary, context, url] = row as [string, string, string, string, string, string, string, string, string];
  return {
  slug,name,nameDeva,kind: kind as "Site" | "Festival",place,period,summary,context:[context],
  source:{citation:"Nepal Tourism Board or Bihar Tourism institutional heritage documentation.",url,status:"verified" as const},
  };
});
