import { choiceGroups, extras, type MenuItem } from "../data/menu";

export interface Selection {
  /** groupId -> choiceId */
  choices: Record<string, string>;
  /** extraId -> quantity */
  extras: Record<string, number>;
  note: string;
}

export const formatPrice = (cents: number) => `$${(Math.abs(cents) / 100).toFixed(2)}`;

/** "+$0.70", "−$0.50" or "Free". */
export const formatDelta = (cents: number) => (cents === 0 ? "Free" : `${cents > 0 ? "+" : "−"}${formatPrice(cents)}`);

export function defaultChoice(item: MenuItem, groupId: string): string {
  return item.defaults?.[groupId] ?? choiceGroups[groupId].defaultId;
}

export function initialSelection(item: MenuItem): Selection {
  const choices: Record<string, string> = {};
  for (const groupId of item.choices) choices[groupId] = defaultChoice(item, groupId);
  return { choices, extras: {}, note: "" };
}

/** A group with `showWhen` is offered only while the controlling group (if the item has it) matches. */
export function isGroupActive(item: MenuItem, selection: Selection, groupId: string): boolean {
  const rule = choiceGroups[groupId].showWhen;
  if (!rule || !item.choices.includes(rule.group)) return true;
  return rule.is.includes(selection.choices[rule.group]);
}

function choicePrice(groupId: string, choiceId: string): number {
  return choiceGroups[groupId].choices.find((c) => c.id === choiceId)?.price ?? 0;
}

export function unitPrice(item: MenuItem, selection: Selection): number {
  let total = item.price;
  for (const groupId of item.choices) {
    if (isGroupActive(item, selection, groupId)) total += choicePrice(groupId, selection.choices[groupId]);
  }
  for (const [id, qty] of Object.entries(selection.extras)) total += (extras[id]?.price ?? 0) * qty;
  return total;
}

/** Everything that differs from the default build, as short labels with their price effect. */
export function describeSelection(item: MenuItem, selection: Selection): { label: string; price: number }[] {
  const out: { label: string; price: number }[] = [];
  for (const groupId of item.choices) {
    if (!isGroupActive(item, selection, groupId)) continue;
    const chosen = selection.choices[groupId];
    if (chosen === defaultChoice(item, groupId) && groupId !== "ice") continue;
    if (groupId === "ice" && chosen === choiceGroups.ice.defaultId) {
      out.push({ label: "Regular ice", price: 0 });
      continue;
    }
    const choice = choiceGroups[groupId].choices.find((c) => c.id === chosen);
    if (!choice) continue;
    const label =
      groupId === "milk" && chosen !== "none"
        ? `${choice.label} milk`
        : groupId === "ice" && chosen === "light"
          ? "Light ice"
          : groupId === "sweetness"
            ? `${choice.label} sweet`
            : groupId === "steep" || groupId === "toast"
              ? `${choice.label} ${groupId}`
              : choice.label;
    out.push({ label, price: choice.price ?? 0 });
  }
  for (const [id, qty] of Object.entries(selection.extras)) {
    const extra = extras[id];
    if (!extra || qty <= 0) continue;
    const label = qty > 1 ? `${extra.label} ×${qty}` : extra.label;
    out.push({ label, price: extra.price * qty });
  }
  if (selection.note.trim()) out.push({ label: `“${selection.note.trim()}”`, price: 0 });
  return out;
}

/** Stable key so identical builds merge into one cart line. */
export function selectionKey(item: MenuItem, selection: Selection): string {
  const opts = item.choices
    .filter((g) => isGroupActive(item, selection, g))
    .map((g) => `${g}=${selection.choices[g]}`);
  const adds = Object.keys(selection.extras)
    .filter((k) => selection.extras[k] > 0)
    .sort()
    .map((k) => `${k}x${selection.extras[k]}`);
  return [item.id, ...opts, ...adds, selection.note.trim()].join("|");
}

export function customizationCount(item: MenuItem): number {
  return item.choices.length + item.extras.length;
}
