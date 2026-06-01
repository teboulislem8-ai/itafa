import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enrichContext } from "@/lib/ai/pipeline";
import { WILAYA_COORDS } from "@/data/wilaya-coords";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("wilaya_code")
    .eq("id", user.id)
    .single();

  let lat: number | undefined;
  let lon: number | undefined;
  let location: string | undefined;

  if (profile?.wilaya_code) {
    const { data: wilaya } = await supabase
      .from("wilayas")
      .select("latitude, longitude, name_fr, name_en")
      .eq("code", profile.wilaya_code)
      .single();

    if (wilaya) {
      lat = wilaya.latitude;
      lon = wilaya.longitude;
      location = `${wilaya.name_fr}, Algérie`;
    } else {
      const coords = WILAYA_COORDS[profile.wilaya_code];
      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
        location = `${coords.nameFr}, Algérie`;
      }
    }
  }

  const context = await enrichContext(lat, lon);

  return NextResponse.json({
    weather: context.weather ?? null,
    location: location ?? null,
  });
}
