// Bakes the server-rendered HTML of each page into dist/, so the first paint needs no JavaScript.
import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const { render } = await import(`${root}dist-server/entry-server.js`);

for (const [page, file] of [
  ["home", "dist/index.html"],
  ["menu", "dist/menu/index.html"],
]) {
  const path = root + file;
  const html = await readFile(path, "utf8");
  if (!html.includes('<div id="root"></div>')) throw new Error(`No empty #root in ${file}`);
  await writeFile(path, html.replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`));
  console.log(`prerendered ${file}`);
}

await rm(root + "dist-server", { recursive: true, force: true });
