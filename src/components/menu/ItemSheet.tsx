import { useRef, useState, type KeyboardEvent } from "react";
import { choiceGroups, extras, extraSections, type ChoiceGroup, type MenuItem } from "../../data/menu";
import { cart } from "../../lib/cart";
import { describeSelection, formatDelta, formatPrice, initialSelection, isGroupActive, unitPrice, type Selection } from "../../lib/price";
import { CheckIcon, CloseIcon, CupIcon, MinusIcon, PlusIcon } from "../icons";
import { ItemImage } from "../ItemImage";
import { Sheet } from "../Sheet";

interface Props {
  item: MenuItem | null;
  open: boolean;
  /** Changes on every open so the build resets. */
  session: number;
  onClose: () => void;
  onAdded: (name: string, qty: number) => void;
}

export default function ItemSheet({ item, open, session, onClose, onAdded }: Props) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="item-title">
      {item && <Builder key={`${item.id}-${session}`} item={item} onClose={onClose} onAdded={onAdded} />}
    </Sheet>
  );
}

function Builder({ item, onClose, onAdded }: { item: MenuItem; onClose: () => void; onAdded: Props["onAdded"] }) {
  const [selection, setSelection] = useState<Selection>(() => initialSelection(item));
  const [qty, setQty] = useState(1);
  const total = unitPrice(item, selection) * qty;
  const changes = describeSelection(item, selection);

  const setChoice = (groupId: string, choiceId: string) =>
    setSelection((s) => ({ ...s, choices: { ...s.choices, [groupId]: choiceId } }));
  const setExtra = (id: string, next: (q: number) => number) =>
    setSelection((s) => {
      const max = extras[id].max ?? 1;
      return { ...s, extras: { ...s.extras, [id]: Math.max(0, Math.min(max, next(s.extras[id] ?? 0))) } };
    });

  return (
    <>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Studio shot */}
        <div className="relative">
          <ItemImage id={item.id} variant="wide" sizes="(min-width: 768px) 576px, 100vw" priority className="aspect-[16/10] w-full" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-paper/90 text-ink shadow-sm transition-transform hover:scale-105"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8">
          <h2 id="item-title" className="text-[2.4rem] font-normal leading-[0.98] tracking-tight sm:text-[2.6rem]">
            {item.name}
          </h2>
          <span className="mt-2 shrink-0 rounded-full bg-ink px-3 py-1 text-sm font-semibold tabular-nums text-bone">{formatPrice(item.price)}</span>
        </div>

        <div className="px-6 pt-3 sm:px-8">
          <p className="leading-relaxed text-ink/75">{item.description}</p>
          <details className="group mt-4 rounded-2xl bg-bone/70 px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
              Ingredients and sourcing
              <PlusIcon className="h-4 w-4 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">{item.sourcing.story}</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
              {item.sourcing.facts.map((f) => (
                <div key={f.label} className="contents">
                  <dt className="text-muted">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">{item.ingredients.join(", ")}.</p>
            {item.dietary && <p className="mt-1 text-sm font-medium text-ember-deep">{item.dietary}.</p>}
          </details>
        </div>

        <div className="px-6 pb-8 pt-7 sm:px-8">
          <h3 className="text-[1.75rem] font-normal tracking-tight">
            Make it <em className="text-ember">yours</em>
          </h3>

          <div className="mt-1">
            {item.choices.map((groupId) => {
              const group = choiceGroups[groupId];
              const active = isGroupActive(item, selection, groupId);
              const conditional = !!group.showWhen && item.choices.includes(group.showWhen.group);
              const picker = (
                <ChoicePicker group={group} value={selection.choices[groupId]} onChange={(id) => setChoice(groupId, id)} />
              );
              return conditional ? (
                <div key={groupId} className="reveal" data-open={active} inert={!active}>
                  <div>{picker}</div>
                </div>
              ) : (
                <div key={groupId}>{picker}</div>
              );
            })}

            {extraSections.map((section) => {
              const ids = item.extras.filter((id) => extras[id].section === section.id);
              if (!ids.length) return null;
              return (
                <section key={section.id} aria-labelledby={`sec-${section.id}`} className="pt-6">
                  <div className="mb-2.5 flex items-baseline justify-between">
                    <h4 id={`sec-${section.id}`} className="font-sans text-[0.95rem] font-semibold">
                      {section.label}
                    </h4>
                    {section.note && <span className={`text-xs font-medium ${section.id === "free" ? "text-sage" : "text-muted"}`}>{section.note}</span>}
                  </div>
                  <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/12 bg-paper">
                    {ids.map((id) => (
                      <ExtraRow key={id} id={id} qty={selection.extras[id] ?? 0} onChange={(next) => setExtra(id, next)} />
                    ))}
                  </ul>
                </section>
              );
            })}

            <label className="block pt-6">
              <span className="mb-2.5 flex items-baseline justify-between text-[0.95rem] font-semibold">
                Anything else?
                <span className="text-xs font-medium text-muted">{selection.note.length}/80</span>
              </span>
              <input
                type="text"
                maxLength={80}
                value={selection.note}
                onInput={(e) => {
                  const note = e.currentTarget.value;
                  setSelection((s) => ({ ...s, note }));
                }}
                placeholder="Name on the cup, allergies, extra napkins…"
                className="w-full rounded-2xl border border-ink/12 bg-paper px-4 py-3 placeholder:text-muted/70 focus:border-ink focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Order bar */}
      <div className="border-t border-ink/10 bg-paper px-6 pb-5 pt-3 sm:px-8">
        <div className="no-scrollbar -mx-1 flex min-h-7 gap-1.5 overflow-x-auto px-1 pb-3" aria-live="polite">
          {changes.length === 0 ? (
            <span className="py-1 text-sm text-muted">The way we make it. Tap anything above to change it.</span>
          ) : (
            changes.map((c) => (
              <span key={c.label} className="shrink-0 rounded-full bg-bone px-3 py-1 text-[0.8rem] font-medium">
                {c.label}
                {c.price !== 0 && <span className="ml-1 text-muted">{formatDelta(c.price)}</span>}
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-3">
          <Stepper
            value={qty}
            min={1}
            max={20}
            onChange={setQty}
            label="Quantity"
            className="h-14 bg-bone"
            buttonClass="h-14 w-12"
          />
          <button
            type="button"
            onClick={() => {
              cart.add(item, selection, qty);
              onAdded(item.name, qty);
            }}
            className="flex h-14 flex-1 items-center justify-between rounded-full bg-ember pl-6 pr-2 font-semibold text-white transition-colors hover:bg-ember-deep"
          >
            <span>Add to order</span>
            <span key={total} className="tick rounded-full bg-white/18 px-4 py-2 tabular-nums">
              {formatPrice(total)}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

const SIZE_SCALE: Record<string, number> = { small: 0.72, regular: 0.86, large: 1 };

/** A pick-one group built from buttons (role="radio"), with arrow-key movement like native radios. */
function ChoicePicker({ group, value, onChange }: { group: ChoiceGroup; value: string; onChange: (id: string) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const allFree = group.choices.every((c) => !c.price);
  const chosen = group.choices.find((c) => c.id === value);
  const cols = group.choices.length <= 3 ? "grid-cols-3" : group.choices.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3";

  const onKey = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + group.choices.length) % group.choices.length;
    onChange(group.choices[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="pt-6">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span id={`grp-${group.id}`} className="text-[0.95rem] font-semibold">
          {group.label}
        </span>
        {allFree && <span className="text-xs font-medium text-sage">Free</span>}
      </div>
      <div role="radiogroup" aria-labelledby={`grp-${group.id}`} className={`grid gap-2 ${cols}`}>
        {group.choices.map((c, i) => {
          const checked = c.id === value;
          return (
            <button
              key={c.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(c.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex min-h-12 flex-col items-center justify-center rounded-2xl border px-2 py-2.5 text-center transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
                checked ? "border-ink bg-ink text-bone" : "border-ink/12 bg-paper hover:border-ink/40"
              }`}
            >
              {group.id === "size" && (
                <CupIcon className="mb-1 h-7 w-7" style={{ transform: `scale(${SIZE_SCALE[c.id] ?? 1})`, transformOrigin: "50% 100%" }} />
              )}
              <span className="text-[0.92rem] font-medium leading-tight">{c.label}</span>
              {(group.id === "size" || c.price) && (
                <span className="mt-0.5 text-[0.72rem] leading-none opacity-65">
                  {group.id === "size" ? `${c.hint}${c.price ? ` · ${formatDelta(c.price)}` : ""}` : formatDelta(c.price ?? 0)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {chosen?.hint && group.id !== "size" && <p className="mt-2 text-sm text-muted">{chosen.hint}</p>}
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
  unit,
  className = "",
  buttonClass = "h-10 w-10",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
  unit?: string;
  className?: string;
  buttonClass?: string;
}) {
  return (
    <div className={`flex items-center rounded-full ${className}`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`grid place-items-center rounded-full transition-opacity disabled:opacity-25 ${buttonClass}`}
        aria-label={`One less${unit ? ` ${unit}` : ""}`}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="w-5 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`grid place-items-center rounded-full transition-opacity disabled:opacity-25 ${buttonClass}`}
        aria-label={`One more${unit ? ` ${unit}` : ""}`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function ExtraRow({ id, qty, onChange }: { id: string; qty: number; onChange: (next: (q: number) => number) => void }) {
  const extra = extras[id];
  const max = extra.max ?? 1;
  const free = extra.price === 0;
  const priceLabel = free ? "Free" : `+${formatPrice(extra.price)}${extra.unit ? ` / ${extra.unit}` : ""}`;
  const text = (
    <div className="min-w-0 flex-1 text-left">
      <p className="font-medium leading-tight">{extra.label}</p>
      <p className={`mt-0.5 text-sm leading-snug ${free ? "text-sage" : "text-muted"}`}>
        {priceLabel}
        {extra.hint && <span className="text-muted"> · {extra.hint}</span>}
      </p>
    </div>
  );

  if (max > 1) {
    return (
      <li className="flex items-center gap-3 px-4 py-3">
        {text}
        <Stepper
          value={qty}
          min={0}
          max={max}
          onChange={(n) => onChange(() => n)}
          label={`${extra.label}, ${extra.unit}s`}
          unit={`${extra.unit} of ${extra.label}`}
          className={`transition-colors ${qty > 0 ? "bg-ink text-bone" : "bg-bone"}`}
        />
      </li>
    );
  }

  const on = qty > 0;
  return (
    <li>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => onChange((q) => (q > 0 ? 0 : 1))}
        className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-bone/50 focus-visible:-outline-offset-2"
      >
        {text}
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-white transition-[background-color,border-color,transform] duration-200 ${
            on ? "scale-110 border-ember bg-ember" : "border-ink/20"
          }`}
        >
          <CheckIcon className={`h-4 w-4 transition-opacity ${on ? "opacity-100" : "opacity-0"}`} strokeWidth={2.4} />
        </span>
      </button>
    </li>
  );
}
