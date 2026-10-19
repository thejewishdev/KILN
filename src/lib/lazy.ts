import { lazy, type ComponentType } from "react";

const FLAG = "little-kiln:chunk-reload";

/**
 * React.lazy that survives a stale chunk. If the import fails (a new deploy replaced the file, or the dev server
 * re-optimized its deps), reload the page once instead of leaving a blank screen.
 */
export function lazyWithReload<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  const guarded = () =>
    load()
      .then((mod) => {
        sessionStorage.removeItem(FLAG);
        return mod;
      })
      .catch((err) => {
        if (!sessionStorage.getItem(FLAG)) {
          sessionStorage.setItem(FLAG, "1");
          location.reload();
          return new Promise<never>(() => {});
        }
        throw err;
      });
  return { Component: lazy(guarded), preload: guarded };
}
