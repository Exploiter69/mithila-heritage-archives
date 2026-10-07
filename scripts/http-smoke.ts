const base = process.env.ARCHIVE_SMOKE_BASE_URL ?? "http://127.0.0.1:4173";
const manageServer =
  process.env.ARCHIVE_SMOKE_MANAGE_SERVER !== "0" &&
  base === "http://127.0.0.1:4173";

const publicRoutes = [
  "/", "/about", "/literature", "/language", "/authors", "/proverbs", "/art",
  "/heritage", "/music", "/search", "/graph", "/sources", "/media", "/research", "/explore", "/atlas", "/people", "/provenance", "/art-atlas", "/music-archive", "/timeline", "/learn", "/stats", "/sources-explorer", "/literature-portal", "/language-lab",
];

const apiRoutes = [
  "/api/archive",
  "/api/archive/literature-work",
  "/api/archive/dictionary-entry",
  "/api/records/literature-work/varna-ratnakara",
  "/api/search?q=Vidyapati",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function isServerReady(url: string): Promise<boolean> {
  try {
    return (await fetch(url)).ok;
  } catch (error) {
    void error;
    return false;
  }
}

async function waitForServer(url: string, timeoutMs = 30_000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isServerReady(url)) return;
    await sleep(250);
  }
  throw new Error(`Timed out waiting for HTTP server at ${url}`);
}

async function startServerIfNeeded(): Promise<ReturnType<typeof Bun.spawn> | null> {
  if (!manageServer || await isServerReady(base + "/")) return null;

  const proc = Bun.spawn(
    ["bun", "run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"],
    {
      stdout: "ignore",
      stderr: "ignore",
      env: { ...process.env, HOST: "127.0.0.1", PORT: "4173" },
      detached: true,
    },
  );

  try {
    await waitForServer(base + "/");
  } catch (error) {
    proc.kill();
    throw error;
  }

  return proc;
}

const server = await startServerIfNeeded();

async function stopServer(proc: ReturnType<typeof Bun.spawn> | null): Promise<void> {
  if (!proc) return;
  try {
    // The dev server is detached so Vite's child process has its own process group.
    // Kill the whole group to avoid leaking a listener into the next validation step.
    Bun.spawnSync(["kill", "-TERM", `-${proc.pid}`]);
  } catch {
    proc.kill("SIGTERM");
  }
  await Promise.race([proc.exited, sleep(2_000)]);
  if (!proc.killed) proc.kill("SIGKILL");
}

try {
  for (const path of [...publicRoutes, ...apiRoutes]) {
    const response = await fetch(base + path, { redirect: "follow" });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(path + " returned " + response.status + ": " + body.slice(0, 300));
    }
    const body = await response.text();
    if (!body.trim()) throw new Error(path + " returned an empty response");
    console.log(response.status, path);
  }

  const invalidRecord = await fetch(base + "/archive/not-a-type/not-a-record");
  if (invalidRecord.status !== 404) {
    throw new Error("invalid canonical record route should return 404, got " + invalidRecord.status);
  }

  for (const path of ["/api/archive/not-a-type", "/api/records/not-a-type/nope"]) {
    const response = await fetch(base + path);
    if (response.status !== 404) throw new Error(path + " should return 404, got " + response.status);
  }

  console.log(
    "HTTP runtime smoke passed:",
    publicRoutes.length + apiRoutes.length,
    "routes plus invalid-route checks",
  );
} finally {
  await stopServer(server);
}
