import type { Source } from "./types";

export interface AwardLiteratureRecord {
  slug: string;
  title: string;
  titleDeva: string;
  transliteration: string;
  author: string;
  authorDeva: string;
  authorBio: string;
  era: string;
  form: "कविता" | "कथा" | "शास्त्रीय";
  snippet: string;
  body: { deva: string; translit?: string; translation: string }[];
  note: string;
  awardYear: number;
  awardCategory: string;
  source: Source;
}

/**
 * Bibliographic expansion seeded from Sahitya Akademi's official Maithili
 * award register. These entries deliberately record recognition metadata only;
 * no plot, biography, quotation, or literary interpretation is invented until
 * an editor consults the work itself.
 */
export const sahityaAkademiMaithiliAwards: AwardLiteratureRecord[] = [
  ["1966","Mithila-Baibhav","Yashodhar Jha","Philosophical treatise"],
  ["1968","Patrahin Nagna Gachh","‘Yatri’ (Vaidyanath Mishra)","Poetry"],
  ["1969","Du Patra","Upendranth Jha","Novel"],
  ["1970","Radha Viraha","Kashikant Mishra ‘Madhup’","Epic poetry"],
  ["1971","Payasvini","Surenda Jha ‘Suman’","Poetry"],
  ["1973","Naika Banijara","Braj Kishore Verma ‘Manipadma’","Novel"],
  ["1975","Kichhu Dekhal Kichhu Sunal","Girindramohan Mishra","Reminiscences"],
  ["1976","Sitayana","Vaidyanath Mallik ‘Vidhu’","Epic"],
  ["1977","Avahatta: Udbhava O Vikas","*Rajeshwar Jha","Literary criticism"],
  ["1978","Baji Uthal Murali","Upendra Thakur ‘Mohan’","Poetry"],
  ["1979","Krishna-charit","Tantranath Jha","Poetry"],
  ["1980","Ee Bataha Sansar","Sudhanshu Shekhar Chaudhary","Novel"],
  ["1981","Agastyayaini","Markandeya Pravasi","Epic"],
  ["1982","Marichika","Lily Ray","Novel"],
  ["1983","Maithili Patrakaritaka Ithihas","Chandranath Mishra ‘Amar’","Treatise"],
  ["1984","Suryamukhi","Arsi Prasad Singh","Poetry"],
  ["1985","Jeevan Yatra","*Hari Mohan Jha","Autobiography"],
  ["1986","Natik Patrak Uttar","Subhadra Jha","Belles-lettres"],
  ["1987","Atita","Umanath Jha","Short stories"],
  ["1988","Mantraputra","Mayanand Mishra","Novel"],
  ["1989","Parasar","*Kanchinath Jha ‘Kiran’","Epic"],
  ["1990","Prabhasak Katha","Prabhas Kumar Choudhuri","Short stories"],
  ["1991","Pasijhaita Pathar","Ramdeo Jha","Play"],
  ["1992","Vividha","Bhimanath Jha","Essays"],
  ["1993","Samak Pauti","Govinda Jha","Short stories"],
  ["1994","Uchitavakta","Gangesh Gunjan","Short stories"],
  ["1995","Kavita Kusumanjali","Jayamanta Mishra","Poetry"],
  ["1996","Aai Kaalhi Parsoo","Raj Mohan Jha","Short stories"],
  ["1997","Dhwast Hoet Shanti Stoop","Keerti Narayan Mishra","Poetry"],
  ["1998","Takait Achhi Chirai","Jeeva Kant","Poetry"],
  ["1999","Gananayak","Saketanand","Short stories"],
  ["2000","Katek Raas Baat","Ramanand Renu","Poetry"],
  ["2001","Pratijna Pandav","Babuajee Jha ‘Ajnat’","Epic"],
  ["2002","Sahasmukhi Chowk Par","Somdev","Poems"],
  ["2003","Ritambhara","Niraja Renu (Khamakhy A Devi)","Short stories"],
  ["2004","Shakuntala","Chandrabhanu Singh","Epic"],
  ["2005","Chanan Ghan Gachchiya","Vivekanand Thakur","Poetry"],
  ["2006","Kaath","Bibhuti Anand","Short stories"],
  ["2007","Sarokar","Pradip Bihari","Short stories"],
  ["2008","Katek Daaripar","Mantreshwar Jha","Memoirs"],
  ["2009","Ganga-Putra","Man Mohan Jha","Short Stories"],
  ["2010","Bhamati","Usha Kiran Khan","Novel"],
  ["2011","Apaksha","Uday Chandra Jha ‘Vinod’","Poetry"],
  ["2012","Kist-Kist Jeewan","Shefalika Verma","Autobiography"],
  ["2013","Sangharsh Aa Sehanta","Sureshwar Jha","Memoirs"],
  ["2014","Uchat","Asha Mishra","Novel"],
  ["2015","Khissa","Man Mohan Jha","Short Stories"],
  ["2016","Barki Kaki at Hotmail Dot Corn","Shyam Darihare","Short Stories"],
  ["2017","Jahalk Diary","Udaya Narayana Singh ‘Nachiketa’","Poetry"],
  ["2018","Parineeta","Bina Thakur","Short Stories"],
  ["2019","Jingik Oriaon Karait","Kumar Manish Arvind","Poetry"],
  ["2020","Gachh Roosal Achhi","Kamalkant Jha","Short Stories"],
  ["2021","Pangu","Jagdish Prasad Mandal","Novel"],
  ["2022","Pen-Drive Me Prithvi","Ajit Azad","Poetry"],
  ["2023","Bodha Sanketan","Basukinath Jha","Essays"],
  ["2024","Prabandh Sangrah","Mahendra Malangia","Essays"],
  ["2025","Dhatri Paat San Gaam","Mahendra","Memoir"],
].map((row) => {
  const [year, title, author, category] = row as [string, string, string, string];
  const slug = title.toLocaleLowerCase()
    .replace(/[’‘']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const form =
    category.toLocaleLowerCase().includes("poetry") ||
    category.toLocaleLowerCase().includes("poems")
      ? "कविता"
      : category.toLocaleLowerCase().includes("novel") ||
          category.toLocaleLowerCase().includes("stories") ||
          category.toLocaleLowerCase().includes("memoir") ||
          category.toLocaleLowerCase().includes("autobiography")
        ? "कथा"
        : "शास्त्रीय";
  return {
    slug: `sahitya-akademi-${year}-${slug}`,
    title,
    titleDeva: title,
    transliteration: title,
    author,
    authorDeva: author,
    authorBio: `Maithili author of the Sahitya Akademi Award-winning work listed for ${year}.`,
    era: String(year),
    form,
    snippet: `Sahitya Akademi Award for Maithili, ${year}: ${category}.`,
    body: [],
    note: `Bibliographic recognition record only. The archive has not supplied a plot summary, quotation, or interpretive claim without consulting the work. Award category: ${category}.`,
    awardYear: Number(year),
    awardCategory: category,
    source: {
      citation: `Sahitya Akademi Awards — Maithili, ${year}: ${title} — ${author}.`,
      url: "https://www.sahitya-akademi.gov.in/awards/akademi%20samman_suchi.jsp",
      status: "verified",
    },
  } satisfies AwardLiteratureRecord;
});

export const awardLiteratureByYear = [...sahityaAkademiMaithiliAwards].sort(
  (a, b) => a.awardYear - b.awardYear,
);


export const yuvaPuraskarMaithiliAwards: AwardLiteratureRecord[] = [
  ["2011","Hathat Parivartan","Anand Kumar Jha","Play"],
  ["2012","Etbe Taa Naih","Arunabh Saurabh","Poetry"],
  ["2013","Ankura Rahal Sangharsh","Dilip Kumar Jha 'Lootan'","Poetry"],
  ["2014","Visdanti Varmal Kalak Rati","Praveen Kashyap","Poetry"],
  ["2015","Pratiwadi Ham","Narayan Jha","Poetry"],
  ["2016","Je Kahi Nahi Saklahun","Deep Narayan 'Vidyarthi'","Poetry"],
  ["2017","Dhartis Akash Dhari","Chandan Kumar Jha","Poetry"],
  ["2018","Varnit Rasa","Umesh Paswan","Poetry"],
  ["2019","Raag-Upraag","Amit Pathak","Poetry"],
  ["2020","Gassa","Sonu Kuma Jha","Short Stories"],
  ["2021","Anshu Bani Pasari Jaeb","Amit Mishra","Poetry"],
  ["2022","Khurchanbhaik Kachhmachchhi","Navkrishna Aihik","Satire"],
  ["2023","Kahbak Achhi Hamra","Sanskriti Mishra","Poetry"],
  ["2024","Nadi Ghati Sabhyata","Rinki Jha Rishika","Poetry"],
  ["2025","Banaras Aa Hum","Neha Jha Mani","Poetry"],
].map((row) => {
  const [year, title, author, category] = row as [string, string, string, string];
  const slug = title.toLocaleLowerCase()
    .replace(/[’‘']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const form = category.toLocaleLowerCase().includes("poetry")
    ? "कविता" as const
    : category.toLocaleLowerCase().includes("stories") || category.toLocaleLowerCase().includes("play")
      ? "कथा" as const
      : "शास्त्रीय" as const;
  return {
    slug: "sahitya-akademi-yuva-" + year + "-" + slug,
    title,
    titleDeva: title,
    transliteration: title,
    author,
    authorDeva: author,
    authorBio: "Maithili Yuva Puraskar recipient listed in the Sahitya Akademi register; a full biographical profile is a separate editorial task.",
    era: String(year),
    form,
    snippet: "Sahitya Akademi Yuva Puraskar for Maithili, " + year + ": " + category + ".",
    body: [],
    note: "Bibliographic recognition record only. The archive has not supplied a plot summary, quotation, or interpretation without consulting the work.",
    awardYear: Number(year),
    awardCategory: category,
    source: {
      citation: "Sahitya Akademi Yuva Puraskar — Maithili, " + year + ": " + title + " — " + author + ".",
      url: "https://sahitya-akademi.gov.in/awards/yuva_samman_suchi.jsp",
      status: "verified",
    },
  } satisfies AwardLiteratureRecord;
});
