import { useEffect, useState } from "react";

// Index matches Date#getDay(): 0 = Sunday. Hours are 24h.
export const hours = [
  { day: "Sunday", open: 8, close: 15 },
  { day: "Monday", open: 7, close: 16 },
  { day: "Tuesday", open: 7, close: 16 },
  { day: "Wednesday", open: 7, close: 16 },
  { day: "Thursday", open: 7, close: 16 },
  { day: "Friday", open: 7, close: 18 },
  { day: "Saturday", open: 8, close: 18 },
];

export const formatHour = (h: number) => `${h % 12 || 12} ${h < 12 ? "am" : "pm"}`;

export interface OpenStatus {
  open: boolean;
  dayIndex: number;
  label: string;
}

export function statusAt(now: Date): OpenStatus {
  const dayIndex = now.getDay();
  const today = hours[dayIndex];
  const h = now.getHours() + now.getMinutes() / 60;
  if (h >= today.open && h < today.close) return { open: true, dayIndex, label: `Open until ${formatHour(today.close)}` };
  if (h < today.open) return { open: false, dayIndex, label: `Opens at ${formatHour(today.open)}` };
  const tomorrow = hours[(dayIndex + 1) % 7];
  return { open: false, dayIndex, label: `Opens tomorrow at ${formatHour(tomorrow.open)}` };
}

/** Null during prerender and hydration, so the HTML never disagrees with the client clock. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(statusAt(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}
