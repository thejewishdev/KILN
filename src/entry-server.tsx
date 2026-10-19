import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { HomePage } from "./components/home/HomePage";
import { MenuPage } from "./components/menu/MenuPage";

/** Used at build time only (scripts/prerender.mjs) to bake each page's HTML. */
export function render(page: "home" | "menu"): string {
  return renderToString(<StrictMode>{page === "home" ? <HomePage /> : <MenuPage />}</StrictMode>);
}
