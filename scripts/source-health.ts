import { canonicalArchive } from "../src/data/archive-foundation";

const timeoutMs = 8_000;
const strict = process.argv.includes("--strict");

const urls = [...new Set(
  canonicalArchive.sources
    .map((source) => source.url)
    .filter((url): url is string => typeof url === "string" && /^https?:\/\//i.test(url)),
)].sort();

async function check(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    let response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    return {
      url,
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      ms: Date.now() - started,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      finalUrl: url,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (let index = 0; index < urls.length; index += 6) {
  results.push(...await Promise.all(urls.slice(index, index + 6).map(check)));
}

const failures = results.filter((result) => !result.ok);

console.log("# Source health report");
console.log("");
console.log(`- URLs checked: ${results.length}`);
console.log(`- Reachable: ${results.length - failures.length}`);
console.log(`- Failed: ${failures.length}`);
console.log("");
console.log("| URL | Status | Time | Final URL |");
console.log("| --- | ---: | ---: | --- |");
for (const result of results) {
  console.log(`| ${result.url.replaceAll("|", "%7C")} | ${result.status || result.error || "error"} | ${result.ms} ms | ${result.finalUrl.replaceAll("|", "%7C")} |`);
}

if (strict && failures.length > 0) process.exit(1);
