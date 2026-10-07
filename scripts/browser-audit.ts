#!/usr/bin/env bun

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const routes = [
  "/", "/about", "/literature", "/language", "/authors", "/proverbs",
  "/art", "/heritage", "/music", "/search", "/graph", "/sources", "/media", "/research",
];
const viewports = [
  { name: "desktop", width: 1366, height: 768, deviceScaleFactor: 1 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 1 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    } catch {}
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

type CdpResponse = { id?: number; result?: any; error?: any; method?: string; params?: any };

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
        } catch {}
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__mithilaAudit.cls += entry.value || 0;
          }).observe({ type: "layout-shift", buffered: true });
        } catch {}
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) window.__mithilaAudit.inp = Math.max(window.__mithilaAudit.inp, entry.duration || 0);
          }).observe({ type: "event", buffered: true, durationThreshold: 16 });
        } catch {}
      })();`,
    });

    const results: any[] = [];

    for (const viewport of viewports) {
      await cdp.command("Emulation.setDeviceMetricsOverride", viewport);
      for (const route of routes) {
        const url = new URL(route, BASE_URL).toString();
        await cdp.command("Page.navigate", { url });
        await sleep(1800);

        const evaluation = await cdp.command("Runtime.evaluate", {
          expression: `(() => {
            const named = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") || el.innerText || "").trim();
            const badImages = [...document.images].filter((img) => !img.alt.trim()).map((img) => img.src);
            const badButtons = [...document.querySelectorAll("button,[role=button]")].filter((el) => !named(el)).map((el) => el.outerHTML.slice(0, 200));
            const badInputs = [...document.querySelectorAll("input,select,textarea")].filter((el) => {
              if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return false;
              const id = el.id;
              return !(id && document.querySelector('label[for="' + CSS.escape(id) + '"]'));
            }).map((el) => el.outerHTML.slice(0, 200));
            const duplicateIds = [...new Set([...document.querySelectorAll("[id]")].map((el) => el.id))].filter((id) => document.querySelectorAll("#" + CSS.escape(id)).length > 1);
            const nav = performance.getEntriesByType("navigation")[0];
            return {
              href: location.href,
              title: document.title,
              lang: document.documentElement.lang,
              hasMain: Boolean(document.querySelector("main#main-content")),
              hasSkipLink: Boolean(document.querySelector('a[href="#main-content"]')),
              badImages, badButtons, badInputs, duplicateIds,
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

        const ax = await cdp.command("Accessibility.getFullAXTree");
        const axNodes = ax.result?.nodes ?? [];
        const unnamedInteractive = axNodes.filter((node: any) =>
          ["button", "link", "textbox", "combobox", "checkbox", "radio"].includes(node.role?.value) &&
          !(node.name?.value || "").trim()
        ).length;

        results.push({
          viewport: viewport.name,
          route,
          ...(evaluation.result?.result?.value ?? {}),
          accessibility: { unnamedInteractive },
        });
      }
    }

    const failures = results.filter((item) =>
      item.lang !== "en" ||
      !item.hasMain ||
      !item.hasSkipLink ||
      item.badImages.length ||
      item.badButtons.length ||
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
  }
}

await main();
