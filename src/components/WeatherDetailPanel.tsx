"use client";

import type { WeatherData } from "@/types/ai";
import { WeatherIcon } from "@/lib/weather-icons";

function wmoDescription(code: number): string {
  if (code === 0) return "Ciel dégagé";
  if (code <= 2) return "Partiellement nuageux";
  if (code === 3) return "Nuageux";
  if (code <= 48) return "Brume / Brouillard";
  if (code <= 57) return "Bruine";
  if (code <= 67) return "Pluie";
  if (code <= 77) return "Neige";
  if (code <= 86) return "Averses";
  if (code <= 99) return "Orage";
  return "—";
}

export function WeatherDetailPanel({
  weather,
  location,
}: {
  weather: WeatherData;
  location: string | null;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Température", value: `${weather.temperature}°C` },
    { label: "Ressenti", value: `${weather.feels_like}°C` },
    { label: "Max", value: `${weather.temp_max}°C` },
    { label: "Min", value: `${weather.temp_min}°C` },
    { label: "Humidité", value: `${weather.humidity}%` },
    { label: "Vent", value: `${weather.wind_speed} km/h` },
    { label: "Précipitations", value: `${weather.precipitation} mm` },
    { label: "Évapotranspiration", value: `${weather.evapotranspiration} mm` },
  ];

  return (
    <div className="ita-detail-panel">
      <div className="ita-dp-hdr">
        <WeatherIcon code={weather.weather_code} size={16} />
        <div>
          <div className="ita-dp-title">Météo</div>
          <div className="ita-dp-sub">{location ?? "—"} — {wmoDescription(weather.weather_code)}</div>
        </div>
      </div>
      <div className="ita-dp-grid">
        {rows.map((r) => (
          <div key={r.label} className="ita-dp-item">
            <span className="ita-dp-label">{r.label}</span>
            <span className="ita-dp-value">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
