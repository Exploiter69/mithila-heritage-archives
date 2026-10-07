#!/usr/bin/env bun

const DEFAULT_BASE_URL = "http://127.0.0.1:4173";
const BASE_URL = process.env.BASE_URL ?? DEFAULT_BASE_URL;
const MANAGE_APP_SERVER = process.env.BROWSER_AUDIT_MANAGE_SERVER !== "0" && BASE_URL === DEFAULT_BASE_URL;
const routes = [
  "/", "/about", "/literature", "/language", "/authors", "/proverbs",
  "/art", "/heritage", "/music", "/search", "/graph", "/sources", "/media", "/research",
];
const viewports = [
  { name: "desktop", width: 1366, height: 768, deviceScaleFactor: 1 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 1 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function isServerReady(url: string) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForUrl(url: string, timeoutMs = 30_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isServerReady(url)) return;
    await sleep(250);
  }
  throw new Error(
    "Timed out waiting for the application server at " + url + ". Set BASE_URL for an already-running server.",
  );
}

async function startAppServer() {
  if (!MANAGE_APP_SERVER || await isServerReady(new URL("/", BASE_URL).toString())) {
    return null;
  }

  const proc = Bun.spawn(
    ["bun", "run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"],
    {
      stdout: "ignore",
      stderr: "ignore",
      env: { ...process.env, HOST: "127.0.0.1", PORT: "4173" },
    },
  );

  try {
    await waitForUrl(new URL("/", BASE_URL).toString());
  } catch (error) {
    proc.kill();
    throw error;
  }

  return proc;
}

async function findChrome() {
  const proc = Bun.spawn(["sh", "-lc", "command -v google-chrome || command -v chromium || command -v chromium-browser"], {
    stdout: "pipe",
    stderr: "ignore",
  });
  const path = (await new Response(proc.stdout).text()).trim();
  if (!path) throw new Error("No Chromium/Chrome executable found on the CI runner.");
  return path;
}

async function waitForJson(url: string, timeoutMs = 15_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (error) {
      void error;
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

type CdpResponse = {
  id?: number;
  result?: { result?: { value?: unknown } };
  error?: unknown;
  method?: string;
  params?: unknown;
};

type AuditEvaluation = {
  href: string;
  title: string;
  lang: string;
  hasMain: boolean;
  hasSkipLink: boolean;
  badImages: string[];
  badButtons: string[];
  badLinks: string[];
  badInputs: string[];
  duplicateIds: string[];
  metrics: {
    lcp: number;
    cls: number;
    inp: number;
    ttfb: number;
    domContentLoaded: number;
    load: number;
    transferSize: number;
  };
  errors: string[];
};

type AuditResult = AuditEvaluation & {
  viewport: string;
  route: string;
  accessibility: { unnamedInteractive: number };
};

class Cdp {
  private ws: WebSocket;
  private nextId = 1;
  private pending = new Map<number, (value: CdpResponse) => void>();

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event) => {
      const message = JSON.parse(String(event.data)) as CdpResponse;
      if (message.id) this.pending.get(message.id)?.(message);
      if (message.id) this.pending.delete(message.id);
    };
  }

  async connect() {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("CDP websocket timeout")), 10_000);
      this.ws.addEventListener("open", () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      this.ws.addEventListener("error", () => {
        clearTimeout(timer);
        reject(new Error("CDP websocket error"));
      }, { once: true });
    });
  }

  command(method: string, params: Record<string, unknown> = {}) {
    const id = this.nextId++;
    return new Promise<CdpResponse>((resolve, reject) => {
      this.pending.set(id, resolve);
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`CDP timeout: ${method}`));
      }, 15_000);
    });
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  const appServer = await startAppServer();
  const chrome = await findChrome();
  const profile = `/tmp/mithila-chrome-${process.pid}`;
  const chromeProc = Bun.spawn([
    chrome,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--remote-debugging-port=9222",
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdout: "ignore", stderr: "ignore" });

  try {
    await waitForJson("http://127.0.0.1:9222/json/version");
    const target = await (await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" })).json();
    const cdp = new Cdp(target.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.command("Page.enable");
    await cdp.command("Runtime.enable");
    await cdp.command("Accessibility.enable");
    await cdp.command("Emulation.setDeviceMetricsOverride", {
      width: 1366, height: 768, deviceScaleFactor: 1, mobile: false,
    });

    await cdp.command("Page.addScriptToEvaluateOnNewDocument", {
      source: `(() => {
        window.__mithilaAudit = { errors: [], lcp: 0, cls: 0, inp: 0 };
        addEventListener("error", (event) => window.__mithilaAudit.errors.push(String(event.message || "error")));
        addEventListener("unhandledrejection", (event) => window.__mithilaAudit.errors.push(String(event.reason || "unhandledrejection")));
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) window.__mithilaAudit.lcp = Math.max(window.__mithilaAudit.lcp, entry.startTime || 0);
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch (error) { void error; }
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__mithilaAudit.cls += entry.value || 0;
          }).observe({ type: "layout-shift", buffered: true });
        } catch (error) { void error; }
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) window.__mithilaAudit.inp = Math.max(window.__mithilaAudit.inp, entry.duration || 0);
          }).observe({ type: "event", buffered: true, durationThreshold: 16 });
        } catch (error) {
          void error;
        }
      })();`,
    });

    const results: AuditResult[] = [];

    async function waitForPageReady(timeoutMs = 15_000) {
      const started = Date.now();
      while (Date.now() - started < timeoutMs) {
        const ready = await cdp.command("Runtime.evaluate", {
          expression: "document.readyState === 'complete' && Boolean(document.querySelector('main#main-content'))",
          returnByValue: true,
        });
        if (ready.result?.result?.value === true) {
          await sleep(250);
          return;
        }
        await sleep(100);
      }
      throw new Error("Timed out waiting for the rendered application shell.");
    }

    for (const viewport of viewports) {
      await cdp.command("Emulation.setDeviceMetricsOverride", viewport);
      for (const route of routes) {
        const url = new URL(route, BASE_URL).toString();
        await cdp.command("Page.navigate", { url });
        await waitForPageReady();

        const evaluation = await cdp.command("Runtime.evaluate", {
          expression: `(() => {
            const named = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") || el.innerText || "").trim();
            const badImages = [...document.images].filter((img) => !img.alt.trim()).map((img) => img.src);
            const badButtons = [...document.querySelectorAll("button,[role=button]")].filter((el) => !named(el)).map((el) => el.outerHTML.slice(0, 200));
            const badLinks = [...document.querySelectorAll("a[href],[role=link]")].filter((el) => !named(el)).map((el) => el.outerHTML.slice(0, 200));
            const badInputs = [...document.querySelectorAll("input,select,textarea")].filter((el) => {
              if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return false;
              const id = el.id;
              return !(el.closest("label") || (id && document.querySelector('label[for="' + CSS.escape(id) + '"]')));
            }).map((el) => el.outerHTML.slice(0, 200));
            const duplicateIds = [...new Set([...document.querySelectorAll("[id]")].map((el) => el.id))].filter((id) => document.querySelectorAll("#" + CSS.escape(id)).length > 1);
            const nav = performance.getEntriesByType("navigation")[0];
            return {
              href: location.href,
              title: document.title,
              lang: document.documentElement.lang,
              hasMain: Boolean(document.querySelector("main#main-content")),
              hasSkipLink: Boolean(document.querySelector('a[href="#main-content"]')),
              badImages, badButtons, badLinks, badInputs, duplicateIds,
              metrics: {
                lcp: window.__mithilaAudit?.lcp || 0,
                cls: window.__mithilaAudit?.cls || 0,
                inp: window.__mithilaAudit?.inp || 0,
                ttfb: nav?.responseStart || 0,
                domContentLoaded: nav?.domContentLoadedEventEnd || 0,
                load: nav?.loadEventEnd || 0,
                transferSize: performance.getEntriesByType("resource").reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
              },
              errors: window.__mithilaAudit?.errors || [],
            };
          })()`,
          returnByValue: true,
        });

        const evaluated = (evaluation.result?.result?.value ?? {}) as Partial<AuditEvaluation>;
        const unnamedInteractive =
          (evaluated.badButtons?.length ?? 0) +
          (evaluated.badLinks?.length ?? 0) +
          (evaluated.badInputs?.length ?? 0);

        const auditResult: AuditResult = {
          href: evaluated.href ?? url,
          title: evaluated.title ?? "",
          lang: evaluated.lang ?? "",
          hasMain: evaluated.hasMain ?? false,
          hasSkipLink: evaluated.hasSkipLink ?? false,
          badImages: evaluated.badImages ?? [],
          badButtons: evaluated.badButtons ?? [],
          badLinks: evaluated.badLinks ?? [],
          badInputs: evaluated.badInputs ?? [],
          duplicateIds: evaluated.duplicateIds ?? [],
          metrics: evaluated.metrics ?? {
            lcp: 0,
            cls: 0,
            inp: 0,
            ttfb: 0,
            domContentLoaded: 0,
            load: 0,
            transferSize: 0,
          },
          errors: evaluated.errors ?? [],
          viewport: viewport.name,
          route,
          accessibility: { unnamedInteractive },
        };
        results.push(auditResult);
      }
    }

    const failures = results.filter((item) =>
      item.lang !== "en" ||
      !item.hasMain ||
      !item.hasSkipLink ||
      item.badImages.length ||
      item.badButtons.length ||
      item.badLinks.length ||
      item.badInputs.length ||
      item.duplicateIds.length ||
      item.accessibility.unnamedInteractive > 0 ||
      item.errors.length ||
      item.metrics.lcp > 4000 ||
      item.metrics.cls > 0.25
    );

    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl: BASE_URL, results, failures }, null, 2));

    if (failures.length) {
      throw new Error(`Browser accessibility/performance audit found ${failures.length} failing route/viewport checks.`);
    }

    cdp.close();
  } finally {
    chromeProc.kill();
    if (appServer) appServer.kill();
  }
}

await main();
