import { useMemo, useSyncExternalStore } from "react";
import type { MenuItem } from "../data/menu";
import { describeSelection, selectionKey, unitPrice, type Selection } from "./price";

export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  summary: string[];
  unitPrice: number;
  qty: number;
}

/**
 * A tiny external store shared by both pages. It lives in localStorage so the order survives the
 * Home -> Menu navigation, and syncs across tabs through the `storage` event.
 */
const STORAGE_KEY = "little-kiln:cart:v2";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage full: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) {
    // Storage is read after hydration (never during render), then subscribers are told about it.
    loaded = true;
    window.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY) return;
      lines = read();
      listeners.forEach((l) => l());
    });
    const stored = read();
    if (stored.length) {
      lines = stored;
      listeners.forEach((l) => l());
    }
  }
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => lines;
// The prerendered HTML always shows an empty cart; the real one appears right after hydration.
const getServerSnapshot = () => EMPTY;

export const cart = {
  add(item: MenuItem, selection: Selection, qty = 1) {
    const key = selectionKey(item, selection);
    const existing = lines.find((l) => l.key === key);
    if (existing) {
      commit(lines.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l)));
      return;
    }
    commit([
      ...lines,
      {
        key,
        itemId: item.id,
        name: item.name,
        summary: describeSelection(item, selection).map((d) => d.label),
        unitPrice: unitPrice(item, selection),
        qty,
      },
    ]);
  },
  setQty(key: string, qty: number) {
    commit(qty <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, qty } : l)));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(
    () => ({
      lines: current,
      count: current.reduce((n, l) => n + l.qty, 0),
      total: current.reduce((n, l) => n + l.qty * l.unitPrice, 0),
    }),
    [current],
  );
}
