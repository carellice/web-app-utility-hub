import vinext from "vinext";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import hostingConfig from "./.openai/hosting.json";
import { devdexMdxRaw } from "./build/devdex-mdx-raw-plugin.mjs";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;
const isNetlifyBuild = process.env.NETLIFY === "true" || process.env.NITRO_PRESET === "netlify";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const platformPlugin = isNetlifyBuild
    ? (await import("nitro/vite")).nitro()
    : (await import("@cloudflare/vite-plugin")).cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      });

  return {
    server: {
      headers: {
        "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        Expires: "0",
        Pragma: "no-cache",
      },
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      devdexMdxRaw(),
      { enforce: "pre", ...mdx({ providerImportSource: "@mdx-js/react" }) },
      vinext(),
      sites(),
      platformPlugin,
    ],
    resolve: {
      dedupe: ["react", "react-dom", "react-pdf", "pdfjs-dist"],
    },
  };
});
