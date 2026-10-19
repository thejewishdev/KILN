import { menuById } from "../../data/menu";
import { describeSelection, formatDelta, formatPrice, unitPrice, type Selection } from "../../lib/price";
import { ArrowIcon } from "../icons";
import { ItemImage } from "../ItemImage";
import { MENU } from "../../lib/paths";

const item = menuById["burnt-honey-latte"];
const sample: Selection = {
  choices: { size: "large", temperature: "iced", ice: "light", milk: "oat", beans: "house" },
  extras: { vanilla: 2, "cold-foam": 1, "cinnamon-dust": 1 },
  note: "",
};
const lines = describeSelection(item, sample);
const total = unitPrice(item, sample);

const points = [
  { title: "Free where it should be", body: "Ice level, foam, cinnamon, decaf, room at the top. Never a charge." },
  { title: "Syrups by the pump", body: "Eight house-made syrups. Add one pump or four and watch the price move." },
  { title: "Bakery too", body: "Warmed, halved, with cultured butter, jam or a scoop of oat gelato." },
];

export function BuildTeaser() {
  return (
    <section aria-labelledby="build-title" className="bg-ink text-bone">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:py-28">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-glow">Every item is customizable</p>
          <h2 id="build-title" className="mt-4 text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.035em]">
            Your cup, <em className="font-light text-glow">your rules.</em>
          </h2>
          <ul className="mt-10 grid gap-7 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {points.map((p, i) => (
              <li key={p.title} className="border-t border-bone/15 pt-5">
                <span className="font-display text-sm italic text-bone/45">0{i + 1}</span>
                <h3 className="mt-1 font-sans text-lg font-semibold">{p.title}</h3>
                <p className="mt-1.5 leading-snug text-bone/60">{p.body}</p>
              </li>
            ))}
          </ul>
          <a
            href={`${MENU}#${item.id}`}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-bone py-4 pl-7 pr-5 font-semibold text-ink transition-colors hover:bg-white"
          >
            Build this one
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* A real receipt, priced by the same code the menu uses. */}
        <div className="relative mx-auto w-full max-w-md pb-6 pl-6 sm:pl-16">
          <div className="absolute -right-4 top-10 w-[72%] overflow-hidden rounded-[2rem] sm:-right-10">
            <ItemImage id={item.id} variant="card" sizes="(min-width: 1024px) 330px, 60vw" className="aspect-[4/5] w-full" />
          </div>
          <div className="relative w-full max-w-[21rem] -rotate-[3deg] transition-transform duration-500 hover:rotate-0">
          <div className="receipt bg-paper px-7 pb-12 pt-8 font-mono text-[0.85rem] text-ink shadow-2xl">
            <p className="text-center font-display text-2xl font-semibold not-italic tracking-tight">Little Kiln</p>
            <p className="mt-1 text-center text-xs uppercase tracking-[0.2em] text-muted">Pickup · Order #214</p>
            <div className="my-5 border-t border-dashed border-ink/30" />
            <div className="flex justify-between font-semibold">
              <span>Iced {item.name}</span>
              <span className="tabular-nums">{formatPrice(item.price)}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {lines
                .filter((l) => l.label !== "Iced")
                .map((l) => (
                  <li key={l.label} className="flex justify-between pl-3 text-ink/70">
                    <span>+ {l.label}</span>
                    <span className={`tabular-nums ${l.price === 0 ? "text-sage" : ""}`}>{formatDelta(l.price)}</span>
                  </li>
                ))}
            </ul>
            <div className="my-5 border-t border-dashed border-ink/30" />
            <div className="flex items-baseline justify-between">
              <span className="font-semibold uppercase tracking-[0.12em]">Total</span>
              <span className="font-display text-3xl font-semibold tabular-nums">{formatPrice(total)}</span>
            </div>
            <p className="mt-6 text-center text-xs text-muted">Thank you. The fire never goes out.</p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
