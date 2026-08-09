/** Deterministic pseudo-random so SSR and client markup match. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export const decorPalette = [
  "var(--blush)",
  "var(--peach)",
  "var(--gold)",
  "var(--lavender)",
  "var(--sky)",
  "var(--coral)",
  "var(--mint)",
];

export function pickColor(i: number): string {
  return decorPalette[Math.abs(i) % decorPalette.length] as string;
}
