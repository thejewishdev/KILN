import { useEffect, useState } from "react";
import { menuById } from "../data/menu";
import { cart, useCart } from "../lib/cart";
import { formatPrice } from "../lib/price";
import type { Page } from "./Header";
import { ArrowIcon, CloseIcon, KilnMark, MinusIcon, PlusIcon } from "./icons";
import { itemSrc } from "./ItemImage";
import tones from "../data/tones.json";
import { Sheet } from "./Sheet";
import { MENU } from "../lib/paths";

interface Props {
  open: boolean;
  onClose: () => void;
  page: Page;
}

interface Placed {
  number: number;
  readyAt: string;
}

export default function CartSheet({ open, onClose, page }: Props) {
  const { lines, count, total } = useCart();
  const [placed, setPlaced] = useState<Placed | null>(null);

  // Reset the confirmation when the sheet reopens, not on close, so it doesn't flicker mid-exit.
  useEffect(() => {
    if (open) setPlaced(null);
  }, [open]);

  const place = () => {
    const ready = new Date(Date.now() + 10 * 60_000);
    setPlaced({
      number: 100 + Math.floor(Math.random() * 900),
      readyAt: ready.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    });
    cart.clear();
  };

  return (
    <Sheet open={open} onClose={onClose} labelledBy="cart-title">
      <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
        <h2 id="cart-title" className="text-[2rem] font-medium leading-none tracking-tight">
          Your order
          {count > 0 && !placed && <span className="ml-2 align-top font-sans text-sm font-medium text-muted">{count}</span>}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink/6 transition-colors hover:bg-ink/12"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 sm:px-8">
        {placed ? (
          <div className="grid h-full place-content-center justify-items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-ink text-bone">
              <KilnMark className="h-12 w-12" />
            </div>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-muted">Order #{placed.number}</p>
            <p className="mt-2 font-display text-4xl font-medium tracking-tight">It's in the kiln.</p>
            <p className="mt-3 max-w-[30ch] text-muted">
              Ready on the pickup shelf around <strong className="text-ink">{placed.readyAt}</strong>. Pay at the counter.
            </p>
          </div>
        ) : lines.length === 0 ? (
          <div className="grid h-full place-content-center justify-items-center text-center">
            <p className="font-display text-4xl font-medium tracking-tight">Nothing here yet</p>
            <p className="mt-3 max-w-[30ch] text-muted">Pick something from the menu, make it yours, and it will show up here for pickup.</p>
            <a
              href={MENU}
              onClick={page === "menu" ? (e) => (e.preventDefault(), onClose()) : undefined}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-bone transition-colors hover:bg-ember"
            >
              Browse the menu <ArrowIcon className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <ul className="space-y-3">
            {lines.map((line) => {
              const item = menuById[line.itemId];
              return (
                <li key={line.key} className="flex gap-4 rounded-3xl bg-bone/70 p-3 pr-4">
                  {item && (
                    <img
                      src={itemSrc(item.id, "card", 480)}
                      alt=""
                      width={80}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="h-24 w-20 shrink-0 rounded-2xl object-cover"
                      style={{ backgroundColor: tones[item.id as keyof typeof tones] }}
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-lg font-medium leading-tight">{line.name}</p>
                      <span className="font-medium tabular-nums">{formatPrice(line.unitPrice * line.qty)}</span>
                    </div>
                    <p className="mt-1 text-sm leading-snug text-muted">{line.summary.length ? line.summary.join(" · ") : "As it comes"}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-xs text-muted tabular-nums">{formatPrice(line.unitPrice)} each</span>
                      <div className="flex items-center rounded-full bg-paper" role="group" aria-label={`${line.name} quantity`}>
                        <button
                          type="button"
                          onClick={() => cart.setQty(line.key, line.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-ink/8"
                          aria-label={line.qty === 1 ? `Remove ${line.name}` : `One less ${line.name}`}
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => cart.setQty(line.key, line.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-ink/8"
                          aria-label={`One more ${line.name}`}
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!placed && lines.length > 0 && (
        <div className="border-t border-ink/10 px-6 pb-6 pt-4 sm:px-8">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">Pickup at 41 Potters Row · pay at the counter</span>
            <span key={total} className="tick font-display text-3xl font-medium tabular-nums">
              {formatPrice(total)}
            </span>
          </div>
          <button
            type="button"
            onClick={place}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ember py-4 text-[1.05rem] font-semibold text-white transition-colors hover:bg-ember-deep"
          >
            Place pickup order <ArrowIcon className="h-4.5 w-4.5" />
          </button>
        </div>
      )}
      </div>
    </Sheet>
  );
}
