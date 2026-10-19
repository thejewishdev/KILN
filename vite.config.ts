import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// "/" locally; the GitHub Pages workflow sets BASE_PATH=/<repo>/ because the site is served from a sub-folder.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const base = env.BASE_PATH ?? "/";

export default defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    // The code is written against React's API; Preact runs it with a ~4 KB runtime instead of ~60 KB.
    // Delete these aliases to run on React itself.
    alias: [
      { find: /^react-dom\/client$/, replacement: "preact/compat/client" },
      { find: /^react-dom\/server$/, replacement: "preact/compat/server" },
      { find: /^react-dom$/, replacement: "preact/compat" },
      { find: /^react\/jsx-runtime$/, replacement: "preact/jsx-runtime" },
      { find: /^react\/jsx-dev-runtime$/, replacement: "preact/jsx-dev-runtime" },
      { find: /^react$/, replacement: "preact/compat" },
    ],
  },
  // Pre-bundle everything up front. Otherwise Vite discovers deps used only by lazy chunks (the sheets) mid-session,
  // re-optimizes, and the already-open page gets 504 "Outdated Optimize Dep" and goes blank.
  optimizeDeps: {
    include: ["preact", "preact/compat", "preact/compat/client", "preact/hooks", "preact/jsx-runtime", "preact/jsx-dev-runtime"],
  },
  ...(isSsrBuild && { ssr: { noExternal: ["preact", "preact-render-to-string"] } }),
  build: isSsrBuild
    ? { outDir: "dist-server" }
    : // Two real pages: each ships only what it needs, and they share the runtime chunk.
      { rollupOptions: { input: { home: "index.html", menu: "menu/index.html" } } },
}));
