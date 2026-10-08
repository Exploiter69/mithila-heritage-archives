import { mkdirSync, writeFileSync } from "node:fs";
import { canonicalArchive } from "../src/data/archive-foundation";
import { getArchiveRecordPath } from "../src/data/archive-read";

const siteUrl = (process.env.VITE_SITE_URL ?? "").replace(/\/$/, "");

if (!siteUrl) {
  console.warn("VITE_SITE_URL is not set; skipping sitemap generation.");
  process.exit(0);
}

const staticPaths = [
  "/",
  "/explore",
  "/atlas",
  "/graph",
  "/art-atlas",
  "/music-archive",
  "/timeline",
  "/learn",
  "/stats",
  "/people",
  "/provenance",
  "/sources-explorer",
  "/literature-portal",
  "/language-lab",
  "/research",
  "/search",
  "/literature",
  "/language",
  "/authors",
  "/proverbs",
  "/art",
  "/heritage",
  "/music",
  "/about",
];

const urls = new Set(staticPaths.map((path) => `${siteUrl}${path}`));

for (const record of canonicalArchive.records) {
  if (record.contentStatus === "published") {
    urls.add(`${siteUrl}${getArchiveRecordPath(record)}`);
  }
}

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

const body = [...urls]
  .sort()
  .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
  .join("\n");

mkdirSync("public", { recursive: true });
writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  "utf8",
);

console.log(`Sitemap generated: ${urls.size} URLs`);
