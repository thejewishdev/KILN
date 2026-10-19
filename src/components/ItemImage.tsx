import type { CSSProperties } from "react";
import tones from "../data/tones.json";

type Tone = keyof typeof tones;

const VARIANTS = {
  card: { widths: [480, 960], ratio: 5 / 4 },
  wide: { widths: [720, 1280], ratio: 10 / 16 },
} as const;

export const itemSrc = (id: string, variant: keyof typeof VARIANTS, w: number) => `/images/menu/${id}-${variant}-${w}.webp`;

interface ItemProps {
  id: string;
  variant: keyof typeof VARIANTS;
  /** How wide the image renders, so the browser fetches the smallest file that is still sharp. */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Shared name for cross-page view transitions. Must be unique on the page. */
  transitionName?: boolean;
  style?: CSSProperties;
}

/**
 * A menu photo. Width and height are set so nothing shifts while it loads, and the photo's average
 * color fills the box until the pixels arrive.
 */
export function ItemImage({ id, variant, sizes, className = "", priority = false, transitionName = false, style }: ItemProps) {
  const { widths, ratio } = VARIANTS[variant];
  const big = widths[widths.length - 1];
  return (
    <img
      src={itemSrc(id, variant, big)}
      srcSet={widths.map((w) => `${itemSrc(id, variant, w)} ${w}w`).join(", ")}
      sizes={sizes}
      width={big}
      height={Math.round(big * ratio)}
      alt=""
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`object-cover ${className}`}
      style={{ backgroundColor: tones[id as Tone], ...(transitionName ? { viewTransitionName: `item-${id}` } : null), ...style }}
    />
  );
}

const SCENES = {
  "scene-roaster": { widths: [560, 1000], ratio: 4 / 3, alt: "Our roaster watching a batch in the drum roaster" },
  "scene-beans": { widths: [480, 900], ratio: 1, alt: "Freshly roasted beans pouring out of the roaster into the cooling tray" },
  "scene-interior": { widths: [560, 1000], ratio: 5 / 4, alt: "Brick wall, framed prints and a green velvet bench inside the café" },
  "scene-bakery": { widths: [800, 1600], ratio: 9 / 16, alt: "Shelves of fresh bread and pastries behind the bakery counter" },
  "scene-night": { widths: [560, 1000], ratio: 5 / 4, alt: "The café doorway lit up at night" },
} as const;

export type Scene = keyof typeof SCENES;

export function SceneImage({
  name,
  sizes,
  className = "",
  priority = false,
}: {
  name: Scene;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const { widths, ratio, alt } = SCENES[name];
  const big = widths[widths.length - 1];
  return (
    <img
      src={`/images/${name}-${big}.webp`}
      srcSet={widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      width={big}
      height={Math.round(big * ratio)}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`object-cover ${className}`}
      style={{ backgroundColor: tones[name] }}
    />
  );
}
