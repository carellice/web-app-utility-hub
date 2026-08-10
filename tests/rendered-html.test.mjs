import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Web App Utility Hub", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Web App Utility Hub<\/title>/i);
  assert.match(html, /Le mie app locali/);
  assert.match(html, /Easy Crypt/);
  assert.match(html, /Estrai audio da video/);
  assert.match(html, /PIDIEFFE/);
  assert.match(html, /Scrubb/);
  assert.match(html, /Slideshower/);
  assert.match(html, /DevDex/);
  assert.match(html, /MutuoStep/);
  assert.match(html, /\?app=easy-crypt/);
  assert.match(html, /\?app=slideshower/);
  assert.match(html, /\?app=devdex/);
  assert.match(html, /\?app=mutuostep/);
  assert.match(html, /Un solo server locale/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("renders every integrated utility route from the same server", async () => {
  for (const application of [
    "easy-crypt",
    "extract-audio",
    "pidieffe",
    "scrubb",
    "slideshower",
    "devdex",
    "mutuostep",
  ]) {
    const response = await render(`/?app=${application}`);
    assert.equal(response.status, 200, application);
    assert.match(await response.text(), /Tutte le utility/, application);
  }
});

test("defers standalone utilities until the browser has mounted", async () => {
  for (const application of [
    "easy-crypt",
    "extract-audio",
    "pidieffe",
    "scrubb",
    "slideshower",
    "devdex",
    "mutuostep",
  ]) {
    const response = await render(`/?app=${application}`);
    const html = await response.text();

    // Le app integrate possono dipendere da lingua, storage e altre API del
    // browser. L'HTML iniziale deve quindi essere uguale su server e client.
    assert.match(html, /Caricamento utility/iu, application);
  }
});

test("uses original app icons and no starter preview", async () => {
  const [hub, layout, css, mutuostep, mutuostepAdapter] = await Promise.all([
    readFile(new URL("../app/utility-hub.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/mutuostep/app.js", import.meta.url), "utf8"),
    readFile(new URL("../app/integrated/mutuostep.tsx", import.meta.url), "utf8"),
  ]);

  for (const icon of [
    "easy-crypt.svg",
    "extract-audio.png",
    "pidieffe.png",
    "scrubb.png",
    "slideshower.png",
    "devdex.png",
  ]) {
    await access(new URL(`../public/app-icons/${icon}`, import.meta.url));
    assert.match(hub, new RegExp(icon.replace(".", "\\.")));
  }

  assert.match(hub, /integratedApplications/);
  assert.match(hub, /lazyWithCacheRecovery\(\(\) => import/);
  assert.match(hub, /lazyWithCacheRecovery/);
  assert.match(hub, /hasMounted/);
  assert.match(hub, /Tutte le utility/);
  assert.match(hub, /Torna a tutte le utility/);
  assert.match(hub, /Sette applicazioni disponibili/);
  assert.match(hub, /mutuostep\/icons\/icon-512\.png/);
  assert.match(layout, /title: "Web App Utility Hub"/);
  assert.match(css, /\.application-card/);
  assert.match(css, /\.back-to-hub__label/);
  assert.match(css, /\.mutuostep-frame/);
  assert.match(mutuostepAdapter, /\/mutuostep\/index\.html\?embedded=1/);
  assert.match(mutuostep, /isEmbeddedInUtilityHub/);
  await access(new URL("../public/mutuostep/icons/icon-512.png", import.meta.url));
  await assert.rejects(access(new URL("../../mutuostep", import.meta.url)));
  await assert.rejects(access(new URL("../app/_sites-preview", projectRoot)));
});

test("keeps standalone styles and the PDF worker available to integrated apps", async () => {
  const [hubCss, pidieffeCss, scrubbCss, pdfWorker] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/pidieffe-fe/src/index.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/scrubb-fe/src/index.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/pidieffe-fe/src/lib/pdfWorker.ts", import.meta.url), "utf8"),
  ]);

  assert.match(hubCss, /body:has\(\.dashboard\)/);
  assert.match(pidieffeCss, /@source "\.\/"/);
  assert.match(scrubbCss, /@source "\.\/"/);
  assert.match(pdfWorker, /\/workers\/pdf\.worker\.min\.mjs/);
  await access(new URL("../public/workers/pdf.worker.min.mjs", import.meta.url));
});

test("prevents stale bundles and preserves the Easy Crypt loading theme", async () => {
  const [hub, css, viteConfig, worker, headersFile, slideshower] = await Promise.all([
    readFile(new URL("../app/utility-hub.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/_headers", import.meta.url), "utf8"),
    readFile(new URL("../apps/slideshower/src/main.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(hub, /window\.location\.reload/);
  assert.match(hub, /sessionStorage/);
  assert.match(hub, /HUB_REVISION/);
  assert.match(hub, /getRegistrations/);
  assert.match(hub, /caches\.keys/);
  assert.match(css, /\.integrated-easy-crypt \.application-loader/);
  assert.match(viteConfig, /Cache-Control.*no-store/);
  assert.match(worker, /Cache-Control.*no-store/);
  assert.match(headersFile, /Cache-Control: no-store/);
  assert.match(slideshower, /window\.__reactUtilityHubIntegrated/);
});
