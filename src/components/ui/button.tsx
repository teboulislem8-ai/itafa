import type { ButtonHTMLAttributes, ReactNode } from "react";
import { COLORS } from "@/lib/utils/theme";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
  border: "none",
  fontFamily: "inherit",
  transition: "background .15s, opacity .15s",
};

const variants: Record<string, React.CSSProperties> = {
  primary: { background: COLORS.primary, color: COLORS.white },
  secondary: { background: COLORS.white, color: COLORS.primary, border: `1px solid ${COLORS.primary}` },
  ghost: { background: "transparent", color: COLORS.neutral[600] },
  danger: { background: COLORS.alert.red, color: COLORS.white },
};

const sizes: Record<string, React.CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: 13 },
  md: { padding: "10px 20px", fontSize: 14 },
  lg: { padding: "12px 24px", fontSize: 16 },
};

export function Button({ variant = "primary", size = "md", loading, children, style, disabled, ...rest }: ButtonProps) {
  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], opacity: disabled || loading ? 0.6 : 1, ...style }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "..." : children}
    </button>
  );
}
