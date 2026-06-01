import type { ImageLoaderProps } from "next/image";

export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("http")) {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    if (quality) url.searchParams.set("quality", String(quality));
    return url.toString();
  }
  return src;
}
