// ITA Design System — JS-side tokens
// Mirror of CSS variables in globals.css
// Use CSS vars in components where possible; use these for logic/JS-only contexts.

export const COLORS = {
  // Brand
  primary: "#3A4A28",
  primaryMid: "#5A6E3E",
  primaryPale: "#8A9E6A",
  primaryHover: "#4E6234",

  // Surfaces
  canvas: "#E8E1D4",
  card: "#F4EFE5",
  surface: "#FDFAF5",
  olive: "#3A4A28",
  soil: "#4E3526",
  sandLight: "#DAD2BF",
  sandMid: "#C4B49A",

  // Text
  textPrimary: "#18170F",
  textSecondary: "#4A4640",
  textMuted: "#888070",
  textInverse: "#EAE1D0",
  textInvMuted: "#9A9284",

  // Accents
  blue: "#1B5FA0",
  blueBg: "#EBF4FD",
  blueText: "#123E6A",
  green: "#1A6438",
  greenBg: "#E8F6EE",
  greenText: "#0E4228",
  amber: "#9E6010",
  amberBg: "#FDF4E3",
  amberText: "#6A3E0A",
  red: "#A02828",
  redBg: "#FDEAEA",
  redText: "#6A1A1A",

  // Borders
  border: "#C8BCA8",
  borderLight: "#DDD4C0",
  borderFocus: "#1B5FA0",

  // Legacy aliases — kept so existing imports don't break
  white: "#FDFAF5",
  accent: "#9E6010",
  neutral: {
    50: "#FDFAF5",
    100: "#F4EFE5",
    200: "#DDD4C0",
    300: "#C8BCA8",
    400: "#C4B49A",
    500: "#888070",
    600: "#4A4640",
    700: "#18170F",
    800: "#18170F",
    900: "#18170F",
  },
  alert: {
    amber: "#9E6010",
    red: "#A02828",
    green: "#1A6438",
    blue: "#1B5FA0",
  },
  bg: "#E8E1D4",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const FONTS = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  arabic: "var(--font-cairo)",
};

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}