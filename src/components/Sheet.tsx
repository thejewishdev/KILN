import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

const EXIT_MS = 420;
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Side drawer on desktop, bottom sheet on phones. A plain fixed panel in a portal, animated by toggling a
 * data attribute one frame after mount, so it behaves the same in every browser. It traps focus, closes on
 * Escape or a backdrop click, locks page scroll and makes the page behind it inert.
 */
export function Sheet({ open, onClose, labelledBy, children }: Props) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Two frames: the first paints the closed state, the second starts the transition.
      let id = requestAnimationFrame(() => (id = requestAnimationFrame(() => setShown(true))));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    document.documentElement.classList.add("sheet-open");
    panel.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root?.removeAttribute("inert");
      document.documentElement.classList.remove("sheet-open");
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className="sheet-layer" data-shown={shown}>
      <div className="sheet-backdrop" onClick={() => onCloseRef.current()} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} className="sheet-panel">
        <SheetBoundary onClose={() => onCloseRef.current()}>{children}</SheetBoundary>
      </div>
    </div>,
    document.body,
  );
}

/** If anything inside the sheet throws, show a way out instead of a blank panel. */
class SheetBoundary extends Component<{ onClose: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[sheet]", error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="grid h-full place-content-center justify-items-center gap-4 p-8 text-center">
        <p className="font-display text-3xl">Something went sideways.</p>
        <p className="max-w-[30ch] text-muted">Your order is safe. Close this and try again.</p>
        <button type="button" onClick={this.props.onClose} className="rounded-full bg-ink px-6 py-3 font-medium text-bone">
          Close
        </button>
      </div>
    );
  }
}
