const words = [
  "Roasted every Tuesday & Friday",
  "Croissants out of the oven at 7",
  "Honey from our own rooftop hives",
  "Free extra ice, always",
  "Syrups made in-house",
  "Order ahead, skip the line",
];

/** One CSS transform loop over two copies of the strip. Pauses on hover. */
export function Marquee() {
  const strip = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {words.map((w) => (
        <li key={w} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-[clamp(1.5rem,3.2vw,2.4rem)] italic">{w}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-ink" aria-hidden="true">
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-wrap overflow-hidden border-y-2 border-ink bg-honey py-4 text-ink">
      <div className="marquee flex w-max">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
