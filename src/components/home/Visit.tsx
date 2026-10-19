import { formatHour as fmt, hours, useOpenStatus } from "../../lib/hours";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "../icons";
import { SceneImage } from "../ItemImage";

// Week starting Monday reads more naturally on a sign.
const ordered = [...hours.slice(1), hours[0]];

export function Visit() {
  const status = useOpenStatus();
  const today = status ? hours[status.dayIndex] : null;

  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-4 border-t border-ink/10 bg-bone-2/60">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:py-28">
        <div className="grain relative overflow-hidden rounded-t-full">
          <SceneImage name="scene-night" sizes="(min-width: 1024px) 400px, 92vw" className="aspect-[4/5] w-full" />
          <div aria-hidden="true" className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <p className="absolute inset-x-0 bottom-6 z-[3] text-center font-display text-2xl text-white">
            Look for the <em className="text-glow">lit door.</em>
          </p>
        </div>
        <div>
        <h2 id="visit-title" className="text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.035em]">
          Come by <em className="font-light text-ember">the kiln</em>
        </h2>

        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-10">
          <div>
            <PinIcon className="h-7 w-7 text-ember" />
            <h3 className="mt-4 text-lg font-semibold">Find us</h3>
            <address className="mt-2 text-lg not-italic leading-relaxed text-ink/80">
              41 Potters Row
              <br />
              Portland, OR 97214
            </address>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">
              Look for the brick chimney. Bike racks out front, and street parking on Alder.
            </p>
            <a
              href="https://maps.google.com/?q=41+Potters+Row+Portland+OR"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-bone"
            >
              Get directions
            </a>
          </div>

          <div>
            <ClockIcon className="h-7 w-7 text-ember" />
            <h3 className="mt-4 flex items-center gap-3 text-lg font-semibold">
              Hours
              {status && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.open ? "bg-sage text-white" : "bg-ink/10 text-ink/70"}`}>
                  {status.open ? "Open now" : "Closed now"}
                </span>
              )}
            </h3>
            <table className="mt-3 w-full max-w-xs text-[0.97rem]">
              <tbody>
                {ordered.map((h) => {
                  const isToday = h === today;
                  return (
                    <tr key={h.day} className={isToday ? "text-ink" : "text-ink/55"}>
                      <th scope="row" className={`py-1 pr-4 text-left font-normal ${isToday ? "font-semibold" : ""}`}>
                        {h.day}
                      </th>
                      <td className="py-1 text-right tabular-nums">
                        {fmt(h.open)} to {fmt(h.close)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-8 sm:col-span-2 sm:flex-row sm:items-center">
            <div className="sm:w-3/5">
              <MapSketch />
            </div>
            <div className="flex flex-col gap-3 text-[0.97rem]">
              <a href="tel:+15035550142" className="flex items-center gap-3 text-ink/80 transition-colors hover:text-ink">
                <PhoneIcon className="h-5 w-5 text-ember" />
                (503) 555-0142
              </a>
              <a href="mailto:hello@littlekiln.coffee" className="flex items-center gap-3 text-ink/80 transition-colors hover:text-ink">
                <MailIcon className="h-5 w-5 text-ember" />
                hello@littlekiln.coffee
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/** A hand-drawn street sketch: cheaper and calmer than an embedded map. */
function MapSketch() {
  return (
    <svg viewBox="0 0 400 240" className="w-full rounded-[1.25rem] bg-ink" role="img" aria-label="Map sketch showing Little Kiln on Potters Row, between Alder Street and the river">
      <g stroke="var(--color-bone)" strokeOpacity="0.14" strokeWidth="10" strokeLinecap="round">
        <path d="M-10 70H410M-10 160H410M90-10V250M210-10V250M320-10V250" />
      </g>
      <path d="M-10 214c70-20 120 12 200 0s150-34 230-12" fill="none" stroke="#9fbba3" strokeOpacity="0.5" strokeWidth="14" strokeLinecap="round" />
      <rect x="230" y="88" width="72" height="54" rx="8" fill="var(--color-sage)" fillOpacity="0.45" />
      <g fill="var(--color-bone)" fillOpacity="0.55" fontFamily="var(--font-sans)" fontSize="11">
        <text x="16" y="60">Potters Row</text>
        <text x="16" y="150">Alder St</text>
        <text x="240" y="119">Lone Fir</text>
        <text x="26" y="236">Willamette</text>
      </g>
      <circle className="pin-ring" cx="150" cy="70" r="12" fill="none" stroke="var(--color-ember)" strokeWidth="2" />
      <circle cx="150" cy="70" r="7" fill="var(--color-ember)" />
    </svg>
  );
}
