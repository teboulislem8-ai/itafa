export const COLORS = {
  primary: "#1B6B3A",
  primaryHover: "#155d31",
  primaryLight: "#f0fdf4",
  accent: "#FF4500",
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  alert: {
    amber: "#f59e0b",
    red: "#ef4444",
    green: "#10b981",
    blue: "#3b82f6",
  },
  bg: "#f9fafb",
  white: "#ffffff",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
