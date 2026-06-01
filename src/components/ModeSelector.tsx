"use client";

import { useTranslations } from "next-intl";
import type { ChatMode } from "@/types/database";

interface ModeSelectorProps {
  value: ChatMode;
  onChange: (mode: ChatMode) => void;
}

const MODES: { value: ChatMode; labelKey: string }[] = [
  { value: "plant", labelKey: "chat.modePlant" },
  { value: "pest", labelKey: "chat.modePest" },
  { value: "soil", labelKey: "chat.modeSoil" },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const t = useTranslations();

  return (
    <div className="flex gap-2">
      {MODES.map(({ value: mode, labelKey }) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === mode
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
