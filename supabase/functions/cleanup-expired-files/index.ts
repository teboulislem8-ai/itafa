const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

interface CleanupResult {
  deleted: number;
  errors: string[];
}

async function cleanupExpiredFiles(): Promise<CleanupResult> {
  const result: CleanupResult = { deleted: 0, errors: [] };

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/uploaded_files?expires_at=lt.now&select=id,storage_path`,
    {
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (!response.ok) {
    result.errors.push(`Failed to fetch expired files: ${response.status}`);
    return result;
  }

  const files: Array<{ id: string; storage_path: string }> = await response.json();

  for (const file of files) {
    const deleteStorageResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${file.storage_path}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );

    if (!deleteStorageResponse.ok) {
      result.errors.push(`Failed to delete storage object ${file.storage_path}: ${deleteStorageResponse.status}`);
    }

    const deleteDbResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/uploaded_files?id=eq.${file.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );

    if (!deleteDbResponse.ok) {
      result.errors.push(`Failed to delete record ${file.id}: ${deleteDbResponse.status}`);
    } else {
      result.deleted++;
    }
  }

  return result;
}

Deno.serve(async () => {
  try {
    const result = await cleanupExpiredFiles();
    return new Response(JSON.stringify(result), {
      status: result.errors.length > 0 ? 207 : 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
