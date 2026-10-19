import { Elis2codeCredit } from "./Elis2code";
import { KilnMark } from "./icons";
import { HOME, MENU } from "../lib/paths";

export function Footer() {
  return (
    <footer className="bg-ink text-bone/55">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-8">
        <p className="font-display text-[clamp(3.5rem,14vw,11rem)] font-light leading-[0.85] tracking-[-0.05em] text-bone/90">
          Little <em className="text-glow">Kiln</em>
        </p>
        <div className="mt-10 flex flex-col gap-6 border-t border-bone/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-bone/80">
            <KilnMark className="h-6 w-6" />
            Roasted and baked at 41 Potters Row since 2019.
          </div>
          <nav aria-label="Footer" className="flex gap-6">
            <a href={HOME} className="transition-colors hover:text-bone">
              Home
            </a>
            <a href={MENU} className="transition-colors hover:text-bone">
              Menu
            </a>
            <a href="https://instagram.com" className="transition-colors hover:text-bone">
              Instagram
            </a>
            <a href="mailto:hello@littlekiln.coffee" className="transition-colors hover:text-bone">
              Wholesale
            </a>
          </nav>
        </div>
        <div className="mt-8 flex justify-center border-t border-bone/10 pt-6 sm:justify-end">
          <Elis2codeCredit />
        </div>
      </div>
    </footer>
  );
}
