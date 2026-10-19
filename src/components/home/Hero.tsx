import type { ReactNode } from "react";
import { menuById } from "../../data/menu";
import { useOpenStatus } from "../../lib/hours";
import { formatPrice } from "../../lib/price";
import { ArrowIcon, KilnMark } from "../icons";
import { ItemImage } from "../ItemImage";
import { PourIllustration } from "./PourIllustration";
import { MENU } from "../../lib/paths";

const croissant = menuById["croissant"];
const BADGE = "Fired slow ✺ Since 2019 ✺ Potters Row ✺ ";

export function Hero({ header }: { header: ReactNode }) {
  const status = useOpenStatus();

  return (
    <section className="grain relative isolate overflow-hidden bg-ink text-bone">
      <div
        aria-hidden="true"
        className="glow pointer-events-none absolute -right-[25%] top-[5%] -z-10 aspect-square w-[110vw] max-w-[1200px] rounded-full bg-[radial-gradient(circle,rgb(226_85_45/0.38),rgb(226_85_45/0.1)_40%,transparent_66%)] lg:-right-[10%] lg:w-[75vw]"
      />
      <div className="relative z-10">{header}</div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-4 sm:px-8 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-24">
        <div>
          <p className="rise flex h-8 items-center gap-2.5 text-sm font-medium text-bone/70">
            <span className={`h-2 w-2 rounded-full ${status ? (status.open ? "bg-[#7bd389] shadow-[0_0_12px_#7bd389]" : "bg-bone/40") : "bg-transparent"}`} />
            {status ? `${status.open ? "Open now" : "Closed"} · ${status.label}` : " "}
          </p>
          <h1
            className="rise mt-4 text-[clamp(3.8rem,12vw,9.75rem)] font-normal leading-[0.84] tracking-[-0.045em]"
            style={{ ["--d" as string]: 80 }}
          >
            Coffee,
            <br />
            <em className="pr-[0.06em] font-light text-glow">fired</em> slow.
          </h1>
          <p className="rise mt-8 max-w-[38ch] text-lg leading-relaxed text-bone/70 sm:text-xl" style={{ ["--d" as string]: 200 }}>
            A roastery and bake house inside a 1920s pottery kiln on Potters Row. Roasted twice a week, baked before sunrise, built
            exactly the way you like it.
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: 300 }}>
            <a
              href={MENU}
              className="group inline-flex items-center gap-3 rounded-full bg-ember py-4 pl-7 pr-5 text-[1.05rem] font-semibold text-white shadow-[0_18px_40px_-14px_rgb(226_85_45/0.8)] transition-colors hover:bg-glow"
            >
              Order ahead
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                <ArrowIcon className="h-4 w-4" />
              </span>
            </a>
            <a href="#visit" className="rounded-full px-6 py-4 text-[1.05rem] font-medium text-bone/85 ring-1 ring-bone/25 transition-colors hover:bg-bone/8 hover:text-bone">
              Find the kiln
            </a>
          </div>
        </div>

        {/* The kiln mouth: an arched window onto the bar. */}
        <div className="rise relative mx-auto w-full max-w-[19rem] sm:max-w-[26rem] lg:mr-4" style={{ ["--d" as string]: 150 }}>
          <div aria-hidden="true" className="absolute -inset-3 rounded-t-full border border-bone/20 sm:-inset-4" />
          <div aria-hidden="true" className="absolute -inset-7 hidden rounded-t-full border border-bone/8 sm:-inset-9 sm:block" />
          <div className="grain relative overflow-hidden rounded-t-full shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9)] ring-1 ring-bone/15">
            <PourIllustration className="block aspect-[3/4] w-full" />
          </div>

          {/* rotating badge */}
          <div className="absolute -left-8 top-[6%] h-28 w-28 sm:-left-14 sm:h-36 sm:w-36">
            <svg viewBox="0 0 120 120" aria-hidden="true" className="spin h-full w-full text-white">
              <defs>
                <path id="badge-ring" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
              </defs>
              <circle cx="60" cy="60" r="59" fill="var(--color-ember)" />
              <text fontSize="11" fontWeight="600" fill="currentColor" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
                <textPath href="#badge-ring" textLength="280" lengthAdjust="spacing">
                  {BADGE}
                </textPath>
              </text>
            </svg>
            <KilnMark className="absolute inset-0 m-auto h-9 w-9 text-white [&>path:last-child]:fill-ink" />
          </div>

          {/* floating pastry card */}
          <a
            href={`${MENU}#${croissant.id}`}
            className="float absolute -bottom-12 -right-3 flex items-center gap-3 rounded-[1.25rem] bg-bone p-2 pr-5 text-ink shadow-[0_24px_50px_-18px_rgb(0_0_0/0.7)] sm:-right-10"
          >
            <ItemImage id={croissant.id} variant="card" sizes="56px" className="h-16 w-14 rounded-xl" />
            <span className="leading-tight">
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ember">Out of the oven</span>
              <span className="mt-0.5 block font-display text-lg">{croissant.name}</span>
              <span className="block text-xs text-muted">{formatPrice(croissant.price)} · 80 a day</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
