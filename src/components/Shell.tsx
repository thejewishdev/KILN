import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useCart } from "../lib/cart";
import { lazyWithReload } from "../lib/lazy";
import { formatPrice } from "../lib/price";
import { Footer } from "./Footer";
import { Header, type Page } from "./Header";
import { BagIcon } from "./icons";

const { Component: CartSheet, preload: loadCartSheet } = lazyWithReload(() => import("./CartSheet"));

/** Runs `fn` when the main thread is idle, so optional chunks never compete with first paint. */
export function whenIdle(fn: () => void) {
  if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: 3000 });
  else setTimeout(fn, 1200);
}

interface Props {
  page: Page;
  tone: "dark" | "light";
  /** Header sits inside the hero on Home, so the page renders it itself. */
  renderHeader?: (header: ReactNode) => ReactNode;
  hideFloatingCart?: boolean;
  children: ReactNode;
}

export function Shell({ page, tone, renderHeader, hideFloatingCart = false, children }: Props) {
  const { count, total } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartMounted, setCartMounted] = useState(false);

  useEffect(() => whenIdle(() => void loadCartSheet().catch(() => {})), []);

  const openCart = () => {
    setCartMounted(true);
    setCartOpen(true);
  };

  const header = <Header page={page} tone={tone} count={count} onOpenCart={openCart} />;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-bone focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {renderHeader ? renderHeader(header) : header}
      <main id="main">{children}</main>
      <Footer />

      {count > 0 && !cartOpen && !hideFloatingCart && (
        <button
          type="button"
          onClick={openCart}
          className="rise fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-full bg-ink py-3 pl-5 pr-3 text-bone shadow-[0_18px_40px_-12px_rgb(22_16_12/0.6)] transition-colors hover:bg-ink-3 sm:inset-x-auto sm:right-8 sm:bottom-6"
        >
          <span className="flex items-center gap-2.5 font-medium">
            <BagIcon className="h-5 w-5" />
            View order · {count}
          </span>
          <span key={total} className="tick rounded-full bg-ember px-3.5 py-1.5 font-semibold tabular-nums text-white">
            {formatPrice(total)}
          </span>
        </button>
      )}

      {cartMounted && (
        <Suspense fallback={null}>
          <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} page={page} />
        </Suspense>
      )}
    </>
  );
}
