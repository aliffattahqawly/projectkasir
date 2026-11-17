import {
  requireSupabaseAdmin,
  validateProduct,
} from "../../../lib/products-api";

export async function GET(request) {
  const { supabase, errorResponse } = await requireSupabaseAdmin(request);
  if (errorResponse) return errorResponse;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return Response.json(
      { error: `Daftar produk gagal dimuat: ${error.message}` },
      { status: 500 }
    );
  }

  return Response.json(data ?? []);
}

export async function POST(request) {
  const { supabase, errorResponse } = await requireSupabaseAdmin(request);
  if (errorResponse) return errorResponse;

  let product;

  try {
    product = await request.json();
  } catch {
    return Response.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  const validationError = validateProduct(product);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select("*")
    .single();

  if (error) {
    return Response.json(
      { error: `Produk gagal ditambahkan: ${error.message}` },
      { status: 500 }
    );
  }

  return Response.json(data, { status: 201 });
}
