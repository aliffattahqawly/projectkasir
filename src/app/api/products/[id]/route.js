import {
  requireSupabaseAdmin,
  validateProduct,
} from "../../../../lib/products-api";

export async function PATCH(request, { params }) {
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

  const { id } = await params;
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return Response.json(
      { error: `Produk gagal diperbarui: ${error.message}` },
      { status: 500 }
    );
  }

  if (!data) {
    return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }

  return Response.json(data);
}

export async function DELETE(request, { params }) {
  const { supabase, errorResponse } = await requireSupabaseAdmin(request);
  if (errorResponse) return errorResponse;

  const { id } = await params;
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return Response.json(
      { error: `Produk gagal dihapus: ${error.message}` },
      { status: 500 }
    );
  }

  if (!data) {
    return Response.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }

  return Response.json({ success: true });
}
