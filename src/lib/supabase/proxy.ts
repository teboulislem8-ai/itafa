import "server-only";
import { createClient } from "./server";
import { createAdminClient } from "./admin";

export async function getServerClient() {
  return createClient();
}

export function getAdminClient() {
  return createAdminClient();
}
