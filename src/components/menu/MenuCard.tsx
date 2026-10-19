import { memo } from "react";
import type { MenuItem } from "../../data/menu";
import { formatPrice } from "../../lib/price";
import { PlusIcon } from "../icons";
import { ItemImage } from "../ItemImage";

interface Props {
  item: MenuItem;
  index: number;
  onOpen: (item: MenuItem) => void;
  onIntent: () => void;
}

function tag(item: MenuItem): string | null {
  if (item.signature) return "Signature";
  if (item.id === "cold-brew") return "Always iced";
  if (item.choices.includes("temperature")) return "Hot or iced";
  return null;
}

export const MenuCard = memo(function MenuCard({ item, index, onOpen, onIntent }: Props) {
  const label = tag(item);
  return (
    <li id={item.id} className="scroll-mt-36">
      <button
        type="button"
        onClick={() => onOpen(item)}
        onPointerEnter={onIntent}
        onFocus={onIntent}
        aria-haspopup="dialog"
        className="group block w-full text-left"
      >
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem]">
          <ItemImage
            id={item.id}
            variant="card"
            sizes="(min-width: 1280px) 290px, (min-width: 768px) 30vw, 46vw"
            priority={index < 4}
            transitionName
            className="aspect-[4/5] w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
          />
          {label && (
            <span className="absolute left-3 top-3 z-[3] rounded-full bg-white/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-ink">
              {label}
            </span>
          )}
          <span className="absolute bottom-3 right-3 z-[3] flex h-11 items-center rounded-full bg-paper px-3.5 text-sm font-semibold text-ink shadow-[0_8px_20px_-6px_rgb(0_0_0/0.45)] transition-colors duration-300 group-hover:bg-ember group-hover:text-white">
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 group-hover:mr-1.5 group-hover:max-w-24">
              Customize
            </span>
            <PlusIcon className="h-4.5 w-4.5" strokeWidth={2.2} />
          </span>
        </div>
        <div className="mt-3.5 flex items-baseline justify-between gap-3 px-1">
          <h3 className="text-[1.2rem] font-normal leading-tight tracking-tight sm:text-[1.4rem]">{item.name}</h3>
          <span className="shrink-0 text-[0.95rem] font-medium tabular-nums">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-1 line-clamp-2 px-1 text-[0.9rem] leading-snug text-muted">{item.blurb}</p>
      </button>
    </li>
  );
});
