"use client";

import type { ReactElement } from "react";
import { WeatherIcon } from "@/lib/weather-icons";
import type { WeatherData } from "@/types/ai";

export function PeekStrip({
  type,
  weather,
}: {
  type: "weather" | "confidence";
  weather?: WeatherData | null;
}): ReactElement {
  return (
    <div className="ita-dp-peek">
      <div className="ita-dp-peek-icon">
        {type === "weather" ? (
          weather ? (
            <WeatherIcon code={weather.weather_code} size={18} />
          ) : (
            <WeatherIcon code={0} size={18} />
          )
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
        )}
      </div>
      <span className="ita-dp-peek-label">
        {type === "weather" ? "Météo" : "Confiance"}
      </span>
      <span className="ita-dp-peek-arrow">»</span>
    </div>
  );
}
