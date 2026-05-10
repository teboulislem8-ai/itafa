import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number | string;
}

export function Card({ children, style, padding = 20 }: CardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
