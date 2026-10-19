import { useRef } from "react";
import { menuById } from "../../data/menu";
import { formatPrice } from "../../lib/price";
import { ArrowIcon } from "../icons";
import { ItemImage } from "../ItemImage";

const picks = [
  { id: "burnt-honey-latte", note: "The one everyone orders" },
  { id: "kiln-chai", note: "Spices ground each morning" },
  { id: "croissant", note: "80 a day, gone by 11" },
  { id: "cold-brew", note: "Eighteen hours in the making" },
  { id: "matcha-latte", note: "Whisked by hand" },
  { id: "sourdough-toast", note: "An eleven-year-old starter" },
].map((p) => ({ ...p, item: menuById[p.id] }));

export function Signatures() {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="sig-title" className="py-20 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-ember">From the kiln today</p>
          <h2 id="sig-title" className="mt-3 text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.035em]">
            Start with <em className="font-light text-ember">these</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll back" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-bone">
            <ArrowIcon className="h-5 w-5 rotate-180" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll forward" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-bone">
            <ArrowIcon className="h-5 w-5" />
          </button>
          <a href="/menu/" className="ml-2 rounded-full bg-ink px-5 py-3 font-medium text-bone transition-colors hover:bg-ember">
            Full menu
          </a>
        </div>
      </div>

      <ul
        ref={rail}
        className="rail mt-12 flex gap-4 overflow-x-auto px-4 pb-4 sm:gap-6 sm:px-8 xl:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        style={{ scrollPaddingInline: "max(1rem, calc((100vw - 80rem) / 2 + 2rem))" }}
      >
        {picks.map(({ id, note, item }, i) => (
          <li key={id} className="w-[78vw] max-w-[22rem] shrink-0 sm:w-[22rem]">
            <a href={`/menu/#${id}`} className="group block">
              <div className="relative overflow-hidden rounded-[2rem]">
                <ItemImage
                  id={id}
                  variant="card"
                  sizes="(min-width: 640px) 352px, 78vw"
                  priority={i < 2}
                  transitionName
                  className="aspect-[4/5] w-full transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.06]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium">{note}</span>
                <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink py-2 pl-4 pr-2 text-sm font-medium text-bone transition-colors group-hover:bg-ember">
                  Make it yours
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
                <h3 className="text-[1.6rem] font-normal leading-tight tracking-tight">{item.name}</h3>
                <span className="shrink-0 font-medium tabular-nums">{formatPrice(item.price)}</span>
              </div>
              <p className="mt-1 px-1 leading-snug text-muted">{item.blurb}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
