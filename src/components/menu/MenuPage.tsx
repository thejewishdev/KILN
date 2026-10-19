import { Suspense, useCallback, useEffect, useState } from "react";
import { categories, menu, menuById, type Category, type MenuItem } from "../../data/menu";
import { lazyWithReload } from "../../lib/lazy";
import { CheckIcon } from "../icons";
import { SceneImage } from "../ItemImage";
import { Shell, whenIdle } from "../Shell";
import { MenuCard } from "./MenuCard";

const { Component: ItemSheet, preload: loadItemSheet } = lazyWithReload(() => import("./ItemSheet"));

export function MenuPage() {
  const [active, setActive] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);
  const [current, setCurrent] = useState<Category>("coffee");

  const openItem = useCallback((item: MenuItem) => {
    setActive(item);
    setSession((n) => n + 1);
    setOpen(true);
    history.replaceState(null, "", `#${item.id}`);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    history.replaceState(null, "", location.pathname);
  }, []);

  const preload = useCallback(() => void loadItemSheet().catch(() => {}), []);

  useEffect(() => {
    whenIdle(preload);
    // Deep links from Home (/menu/#kiln-chai) open that item straight away.
    const fromHash = menuById[decodeURIComponent(location.hash.slice(1))];
    if (fromHash) openItem(fromHash);
  }, [openItem, preload]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onAdded = useCallback(
    (name: string, qty: number) => {
      close();
      setToast({ text: qty > 1 ? `${qty} × ${name} added` : `${name} added`, id: Date.now() });
    },
    [close],
  );

  // Scroll-spy for the sticky category bar.
  useEffect(() => {
    const sections = categories.map((c) => document.getElementById(`section-${c.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id.replace("section-", "") as Category);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  let index = 0;

  return (
    <Shell page="menu" tone="light" hideFloatingCart={open}>
      <section className="mx-auto grid max-w-7xl items-end gap-8 px-4 pb-10 pt-4 sm:px-8 sm:pt-8 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <p className="rise text-sm font-medium uppercase tracking-[0.16em] text-ember">Order ahead · pickup in about 10 min</p>
          <h1 className="rise mt-3 text-[clamp(3.6rem,13vw,9.5rem)] font-normal leading-[0.86] tracking-[-0.04em]" style={{ ["--d" as string]: 80 }}>
            The <em className="font-light text-ember">menu</em>
          </h1>
          <p className="rise mt-6 max-w-[44ch] text-lg leading-snug text-muted" style={{ ["--d" as string]: 160 }}>
            Everything here can be changed. Ice, foam and decaf are always free, syrups go by the pump, and the price updates as you
            build.
          </p>
        </div>
        <div className="rise relative hidden lg:block" style={{ ["--d" as string]: 200 }}>
          <div aria-hidden="true" className="absolute -inset-2.5 rounded-t-full border border-ember/40" />
          <div className="grain relative w-64 overflow-hidden rounded-t-full xl:w-72">
            <SceneImage name="scene-interior" sizes="288px" className="aspect-[4/5] w-full" />
          </div>
        </div>
      </section>

      <nav aria-label="Menu sections" className="sticky top-0 z-30 border-y border-ink/8 bg-bone/95">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-8">
          {categories.map((c) => {
            const isCurrent = c.id === current;
            return (
              <a
                key={c.id}
                href={`#section-${c.id}`}
                aria-current={isCurrent ? "true" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-colors ${
                  isCurrent ? "bg-ink text-bone" : "bg-ink/6 hover:bg-ink/12"
                }`}
              >
                {c.label}
                <span className={`text-xs tabular-nums ${isCurrent ? "text-bone/60" : "text-muted"}`}>{menu.filter((m) => m.category === c.id).length}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 pb-28 sm:px-8">
        {categories.map((c, ci) => (
          <section key={c.id} id={`section-${c.id}`} aria-labelledby={`title-${c.id}`} className={`pt-12 sm:pt-16 ${ci > 0 ? "cv-auto" : ""}`}>
            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <h2 id={`title-${c.id}`} className="text-[clamp(2.6rem,6vw,4.25rem)] font-normal leading-none tracking-[-0.03em]">
                {c.label}
              </h2>
              <p className="max-w-[46ch] text-muted sm:text-right">{c.intro}</p>
            </div>
            {c.id === "bakery" && (
              <div className="grain relative mb-8 overflow-hidden rounded-[1.75rem]">
                <SceneImage name="scene-bakery" sizes="(min-width: 1280px) 1216px, 100vw" className="aspect-[16/9] w-full sm:aspect-[21/8]" />
                <div aria-hidden="true" className="absolute inset-0 z-[2] bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
                <p className="absolute bottom-5 left-5 z-[3] max-w-[24ch] font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.05] text-white sm:bottom-8 sm:left-8">
                  Out of the old firing chamber at <em className="text-glow">7 am</em>. Gone when it's gone.
                </p>
              </div>
            )}
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
              {menu
                .filter((m) => m.category === c.id)
                .map((item) => (
                  <MenuCard key={item.id} item={item} index={index++} onOpen={openItem} onIntent={preload} />
                ))}
            </ul>
          </section>
        ))}
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        {toast && (
          <p key={toast.id} className="rise flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-3 pr-5 text-sm font-medium text-bone shadow-lg">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ember">
              <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.6} />
            </span>
            {toast.text}
          </p>
        )}
      </div>

      {session > 0 && (
        <Suspense fallback={null}>
          <ItemSheet item={active} open={open} session={session} onClose={close} onAdded={onAdded} />
        </Suspense>
      )}
    </Shell>
  );
}
