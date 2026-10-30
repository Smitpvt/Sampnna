import Image from "next/image";
import Link from "next/link";
import type { FeaturedPlate } from "@/services/featured";

/** Share of the circle's diameter that every plate fills, leaving an even margin around it. */
const PLATE_FILL = 0.88;

/**
 * Clip the photo to its own plate outline (a hair inside, so none of the
 * file's surround shows), then scale and centre it so the plate's widest
 * span is PLATE_FILL of the circle — the same size for every dish.
 */
function plateStyle([cx, cy, rx, ry]: [number, number, number, number]): React.CSSProperties {
  const scale = PLATE_FILL / ((2 * Math.max(rx, ry)) / 100);
  return {
    clipPath: `ellipse(${(rx * 0.995).toFixed(2)}% ${(ry * 0.995).toFixed(2)}% at ${cx}% ${cy}%)`,
    transform: `scale(${scale.toFixed(4)}) translate(${(50 - cx).toFixed(2)}%, ${(50 - cy).toFixed(2)}%)`,
  };
}

/** Seconds the row rests on each arrangement, and seconds it takes to glide one plate on. */
const HOLD = 2;
const MOVE = 1.6;

/**
 * Keyframes for the hold-then-glide loop: rest at step k, ease to step k + 1,
 * rest again… After n steps the track sits exactly one full set along, which
 * looks identical to the start (the plates repeat), so the loop restarts with
 * no visible jump. `--step` is one plate plus one gap.
 */
function stepKeyframes(name: string, n: number) {
  const cycle = HOLD + MOVE;
  const pct = (t: number) => ((t / (n * cycle)) * 100).toFixed(3);
  const at = (k: number) => `transform: translate3d(calc(var(--step) * ${-k}), 0, 0);`;
  const frames = Array.from(
    { length: n },
    (_, k) => `${pct(k * cycle)}%, ${pct(k * cycle + HOLD)}% { ${at(k)} animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1); }`,
  );
  return `@keyframes ${name} { ${frames.join(" ")} 100% { ${at(n)} } }`;
}

/**
 * Section C — a full-width row of large round plates under a centred heading,
 * with one link to the menu, sized to fit one screen on desktop. The row rests
 * for two seconds, glides one plate to the left, rests again, and loops
 * forever. Pure CSS — no client JavaScript, nothing reacts to hover. With
 * reduced motion it stands still and scrolls by hand instead.
 */
export function FeaturedDishes({ plates }: { plates: FeaturedPlate[] }) {
  const n = plates.length;
  // Enough repeats that the screen is always full of plates, even at the last step.
  const copies = 1 + Math.ceil(7 / n);

  return (
    <section
      aria-labelledby="featured-title"
      className="relative bg-turquoise-deep py-14 text-ivory md:py-16 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pb-10 lg:pt-[calc(4.5rem+1.25rem)]"
    >
      <style>{stepKeyframes("plate-step", n)}</style>

      <div className="shell text-center">
        <p className="eyebrow text-sand/80">A taste of Sampann</p>
        <h2 id="featured-title" className="mt-3 text-headline">
          A Taste Around the <em className="text-sand">Table</em>
        </h2>
      </div>

      {/* Vertical padding leaves room for the plates' shadows, so nothing is clipped into a band. */}
      {/* Top padding leaves room for the plates' shadows, so nothing is clipped into a band; the
          names below each plate take the room the bottom padding used to. */}
      <div className="mt-6 overflow-hidden pb-3 pt-6 md:mt-8 lg:mt-6 motion-reduce:no-scrollbar motion-reduce:overflow-x-auto">
        <ul
          aria-label="Dishes from the Sampann kitchen"
          className="flex w-max items-start [--gap:1.25rem] [--plate:min(62vw,17rem)] [--step:calc(var(--plate)+var(--gap))] sm:[--gap:2rem] sm:[--plate:min(38vw,20rem)] lg:[--gap:2.5rem] lg:[--plate:min(23vw,calc(100svh-22.5rem),27rem)] motion-reduce:animate-none"
          style={{ animation: `plate-step ${n * (HOLD + MOVE)}s linear infinite` }}
        >
          {Array.from({ length: copies }, (_, copy) =>
            plates.map((plate) => (
              // Photo and name share one list item, so they always travel — and loop — together.
              <li
                key={`${copy}-${plate.src}`}
                aria-hidden={copy > 0 || undefined}
                className="mr-[var(--gap)] w-[var(--plate)] shrink-0 motion-reduce:[&[aria-hidden]]:hidden"
              >
                <div className="aspect-square rounded-full shadow-[0_10px_22px_-14px_rgb(0_0_0/0.55)]">
                  {/* The clip lives on its own square so the shadow above isn't clipped; clip-path keeps the
                      circle exact even while the track is moving (border-radius + overflow alone can leak a
                      hairline of the image's square corners in some browsers during transforms). */}
                  <div className="relative size-full overflow-hidden rounded-full bg-ivory/[0.08] [clip-path:circle(50%)]">
                    <Image
                      src={plate.src}
                      alt={copy > 0 ? "" : plate.alt}
                      fill
                      sizes="(min-width: 1024px) 27rem, (min-width: 640px) 20rem, 17rem"
                      draggable={false}
                      className="object-cover"
                      style={plateStyle(plate.plate)}
                    />
                  </div>
                </div>
                <p className="mx-auto mt-3 line-clamp-2 max-w-[90%] text-center text-[0.95rem] font-medium leading-snug tracking-[0.01em] text-ivory/90 md:mt-4">
                  {plate.name}
                </p>
              </li>
            )),
          )}
        </ul>
      </div>

      <div className="mt-6 text-center md:mt-8 lg:mt-6">
        <Link href="/menu" className="btn btn-light">
          Explore full menu
        </Link>
      </div>
    </section>
  );
}
