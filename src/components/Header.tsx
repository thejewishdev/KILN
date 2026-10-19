import { BagIcon, KilnMark } from "./icons";
import { HOME, MENU } from "../lib/paths";

export type Page = "home" | "menu";

interface Props {
  page: Page;
  tone: "dark" | "light";
  count: number;
  onOpenCart: () => void;
}

const links: { page: Page; href: string; label: string }[] = [
  { page: "home", href: HOME, label: "Home" },
  { page: "menu", href: MENU, label: "Menu" },
];

export function Header({ page, tone, count, onOpenCart }: Props) {
  const dark = tone === "dark";
  return (
    <header
      className={`relative z-20 ${dark ? "text-bone" : "text-ink"}`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <a href={HOME} className="flex items-center gap-2.5" aria-label="Little Kiln home">
          <KilnMark className="h-8 w-8" />
          <span className="whitespace-nowrap font-display text-[1.45rem] font-semibold tracking-tight">Little Kiln</span>
        </a>

        <nav aria-label="Main" className="flex items-center gap-1 text-[0.95rem] font-medium">
          <div className={`hidden rounded-full p-1 sm:flex ${dark ? "bg-bone/8" : "bg-ink/6"}`}>
            {links.map((l) => {
              const current = l.page === page;
              return (
                <a
                  key={l.page}
                  href={l.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-full px-4 py-1.5 transition-colors ${
                    current ? (dark ? "bg-bone text-ink" : "bg-ink text-bone") : dark ? "hover:bg-bone/10" : "hover:bg-ink/8"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
          {page === "home" ? (
            <a href={MENU} className="rounded-full px-3 py-2 sm:hidden">
              Menu
            </a>
          ) : (
            <a href={HOME} className="rounded-full px-3 py-2 sm:hidden">
              Home
            </a>
          )}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Your order, ${count} ${count === 1 ? "item" : "items"}`}
            className={`relative ml-1 flex h-11 items-center gap-2 rounded-full pl-4 pr-4 transition-colors ${
              dark ? "bg-bone text-ink hover:bg-white" : "bg-ink text-bone hover:bg-ink-3"
            }`}
          >
            <BagIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Order</span>
            {count > 0 && (
              <span key={count} className="pop grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1.5 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
