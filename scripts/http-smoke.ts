const base = process.env.ARCHIVE_SMOKE_BASE_URL ?? "http://127.0.0.1:4173";

const publicRoutes = [
  "/", "/literature", "/language", "/authors", "/proverbs", "/art",
  "/heritage", "/music", "/search", "/graph", "/sources", "/media", "/research",
];

const apiRoutes = [
  "/api/archive",
  "/api/archive/literature-work",
  "/api/archive/dictionary-entry",
  "/api/records/literature-work/varna-ratnakara",
  "/api/search?q=Vidyapati",
];

for (const path of [...publicRoutes, ...apiRoutes]) {
  const response = await fetch(base + path, { redirect: "manual" });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(path + " returned " + response.status + ": " + body.slice(0, 300));
  }
  const body = await response.text();
  if (!body.trim()) throw new Error(path + " returned an empty response");
  console.log(response.status, path);
}

const notFound = await fetch(base + "/archive/not-a-type/not-a-record");
if (notFound.status !== 404) {
  throw new Error("invalid canonical record route should return 404, got " + notFound.status);
}

console.log("HTTP runtime smoke passed:", publicRoutes.length + apiRoutes.length, "routes");
