import type { ReactElement } from "react";

function Svg({ children, ...rest }: { children: ReactElement[]; [key: string]: unknown }): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {children}
    </svg>
  ) as unknown as ReactElement;
}

function sun(): ReactElement[] {
  return [
    <circle key="c" cx="12" cy="12" r="4" />,
    <path key="r1" d="M12 2v2" />,
    <path key="r2" d="M12 20v2" />,
    <path key="r3" d="m4.93 4.93 1.41 1.41" />,
    <path key="r4" d="m17.66 17.66 1.41 1.41" />,
    <path key="r5" d="M2 12h2" />,
    <path key="r6" d="M20 12h2" />,
    <path key="r7" d="m6.34 17.66-1.41 1.41" />,
    <path key="r8" d="m19.07 4.93-1.41 1.41" />,
  ];
}

function cloud(): ReactElement[] {
  return [<path key="cloud" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07a4 4 0 0 1 .5 7.93" />];
}

function cloudSun(): ReactElement[] {
  return [
    <path key="cs1" d="M12 2v2" />,
    <path key="cs2" d="m4.93 4.93 1.41 1.41" />,
    <path key="cs3" d="M2 12h2" />,
    <path key="cs4" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07" />,
    <path key="cs5" d="M18 10.07a4 4 0 0 1 .5 7.93" />,
  ];
}

function drizzle(): ReactElement[] {
  return [
    <path key="d1" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07a4 4 0 0 1 .5 7.93" />,
    <line key="d2" x1="9" y1="15" x2="9" y2="17" />,
    <line key="d3" x1="12" y1="15" x2="12" y2="17" />,
    <line key="d4" x1="15" y1="15" x2="15" y2="17" />,
  ];
}

function rain(): ReactElement[] {
  return [
    <path key="r1" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07a4 4 0 0 1 .5 7.93" />,
    <line key="r2" x1="8" y1="15" x2="6" y2="20" />,
    <line key="r3" x1="12" y1="15" x2="10" y2="20" />,
    <line key="r4" x1="16" y1="15" x2="14" y2="20" />,
  ];
}

function snow(): ReactElement[] {
  return [
    <path key="s1" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07a4 4 0 0 1 .5 7.93" />,
    <circle key="s2" cx="8" cy="16" r="1" fill="currentColor" stroke="none" />,
    <circle key="s3" cx="12" cy="17" r="1" fill="currentColor" stroke="none" />,
    <circle key="s4" cx="16" cy="16" r="1" fill="currentColor" stroke="none" />,
  ];
}

function thunderstorm(): ReactElement[] {
  return [
    <path key="t1" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07a4 4 0 0 1 .5 7.93" />,
    <polyline key="t2" points="13 13 11 17 13 17 10 21" />,
  ];
}

function fog(): ReactElement[] {
  return [
    <line key="f1" x1="3" y1="15" x2="21" y2="15" />,
    <line key="f2" x1="5" y1="18" x2="19" y2="18" />,
    <line key="f3" x1="7" y1="21" x2="17" y2="21" />,
  ];
}

function hail(): ReactElement[] {
  return [
    <path key="h1" d="M6 19a5 5 0 0 1-.5-9.97A7 7 0 0 1 18 10.07a4 4 0 0 1 .5 7.93" />,
    <circle key="h2" cx="9" cy="16" r="1" fill="currentColor" stroke="none" />,
    <circle key="h3" cx="13" cy="15" r="1" fill="currentColor" stroke="none" />,
    <circle key="h4" cx="16" cy="17" r="1" fill="currentColor" stroke="none" />,
  ];
}

const ICONS: Record<string, () => ReactElement[]> = {
  sun,
  cloud,
  "cloud-sun": cloudSun,
  drizzle,
  rain,
  snow,
  thunderstorm,
  fog,
  hail,
};

function wmoIcon(code: number): string {
  if (code === 0) return "sun";
  if (code <= 3) return "cloud-sun";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 86) return "rain";
  if (code <= 99) return "thunderstorm";
  return "cloud";
}

export function WeatherIcon({ code, size = 11 }: { code: number; size?: number }): ReactElement {
  const name = wmoIcon(code);
  const children = (ICONS[name] ?? cloud)();
  return (
    <Svg width={size} height={size}>
      {children}
    </Svg>
  );
}
