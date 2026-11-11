import {
  forwardGoApi,
  requireSupabaseUser,
  validateProduct,
} from "../../../../lib/products-api";

export async function PATCH(request, { params }) {
  const authError = await requireSupabaseUser(request);
  if (authError) return authError;

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
  return forwardGoApi(`/products/${encodeURIComponent(id)}`, "PATCH", product);
}

export async function DELETE(_request, { params }) {
  const authError = await requireSupabaseUser(_request);
  if (authError) return authError;

  const { id } = await params;
  return forwardGoApi(`/products/${encodeURIComponent(id)}`, "DELETE");
}