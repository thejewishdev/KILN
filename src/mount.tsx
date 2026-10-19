import { StrictMode, type ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";

/** Hydrates the prerendered HTML in production; renders from scratch in dev. */
export function mount(app: ReactNode) {
  const root = document.getElementById("root")!;
  const tree = <StrictMode>{app}</StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
}
