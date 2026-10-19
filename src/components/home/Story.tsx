import { SceneImage } from "../ItemImage";

const stats = [
  { value: "72", unit: "hrs", label: "to laminate one croissant" },
  { value: "18", unit: "hrs", label: "of cold steeping per batch" },
  { value: "4", unit: "hives", label: "on the roof, for our honey" },
  { value: "2×", unit: "week", label: "fresh roasts, Tuesday & Friday" },
];

export function Story() {
  return (
    <section aria-labelledby="story-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:py-32">
      <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        {/* collage */}
        <div className="relative mx-auto w-full max-w-md pb-16 pr-10 sm:pb-20 sm:pr-16 lg:max-w-none">
          <div className="grain relative overflow-hidden rounded-t-full">
            <SceneImage name="scene-roaster" sizes="(min-width: 1024px) 420px, 80vw" className="aspect-[3/4] w-full" />
          </div>
          <div className="grain absolute bottom-0 right-0 w-[52%] overflow-hidden rounded-[1.75rem] border-[6px] border-bone shadow-[0_30px_60px_-24px_rgb(0_0_0/0.55)]">
            <SceneImage name="scene-beans" sizes="(min-width: 1024px) 260px, 45vw" className="aspect-square w-full" />
          </div>
          <p className="absolute left-4 top-6 rounded-full bg-bone/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
            Roast day · Friday 6 am
          </p>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-ember">The kiln</p>
          <h2 id="story-title" className="mt-4 text-[clamp(2.4rem,5vw,4.25rem)] font-normal leading-[1] tracking-[-0.03em]">
            We moved into a 1920s pottery kiln and <em className="text-ember">never let the fire go out.</em>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
            The old firing chamber is our bakery now. The roaster sits where the clay used to dry. Everything is made a few steps from
            where you order it, slowly and in small batches, the way the potters worked.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-ink/10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end gap-3 bg-bone p-5 sm:p-6">
                <dt className="text-[0.92rem] leading-snug text-muted">{s.label}</dt>
                <dd className="font-display text-[clamp(2.6rem,5vw,4rem)] font-light leading-none tracking-[-0.04em]">
                  {s.value}
                  <span className="ml-1.5 font-sans text-sm font-medium tracking-normal text-ember">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
