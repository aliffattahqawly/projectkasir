import { createClient } from "@supabase/supabase-js";

export async function requireSupabaseUser(request) {
  const accessToken = /^Bearer\s+(.+)$/i.exec(
    request.headers.get("authorization") ?? ""
  )?.[1];

  if (!accessToken) {
    return Response.json({ error: "Login diperlukan." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return Response.json(
      { error: "Konfigurasi Supabase Auth belum tersedia di server." },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return Response.json(
        { error: "Sesi login tidak valid atau sudah berakhir. Silakan login kembali." },
        { status: 401 }
      );
    }
  } catch {
    return Response.json(
      { error: "Sesi login tidak dapat diverifikasi. Coba lagi." },
      { status: 503 }
    );
  }

  return null;
}

export function validateProduct(product) {
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return "Body harus berupa objek JSON.";
  }

  const stringLimits = {
    name: 160,
    description: 2000,
    unit: 40,
  };

  for (const [field, maxLength] of Object.entries(stringLimits)) {
    if (typeof product[field] !== "string" || !product[field].trim()) {
      return `${field} wajib diisi.`;
    }

    if (product[field].trim().length > maxLength) {
      return `${field} maksimal ${maxLength} karakter.`;
    }
  }

  if (
    (product.image !== null && typeof product.image !== "string") ||
    (typeof product.image === "string" && product.image.length > 2048)
  ) {
    return "image harus berupa URL/path string atau null.";
  }

  if (!Number.isFinite(product.price) || product.price < 0) {
    return "price harus berupa angka nol atau lebih.";
  }

  if (!Number.isFinite(product.quantity) || product.quantity < 0) {
    return "quantity harus berupa angka nol atau lebih.";
  }

  if (!["available", "unavailable"].includes(product.status)) {
    return "status harus available atau unavailable.";
  }

  if (!Number.isInteger(product.category_id)) {
    return "category_id harus berupa ID kategori angka yang valid.";
  }

  return null;
}

export async function forwardGoApi(path, method, body) {
  const apiUrl = process.env.GO_API_URL?.replace(/\/+$/, "");
  const apiToken =
    process.env.GO_ADMIN_API_TOKEN || process.env.ADMIN_API_TOKEN;

  if (!apiUrl || !apiToken) {
    return Response.json(
      {
        error:
          "GO_API_URL dan GO_ADMIN_API_TOKEN harus dikonfigurasi di server.",
      },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(`${apiUrl}/api/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });

    const responseBody = await upstream.text();
    return new Response(responseBody || null, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { error: "Tidak dapat terhubung ke Go API." },
      { status: 502 }
    );
  }
}