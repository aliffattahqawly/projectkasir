import {
  forwardGoApi,
  requireSupabaseUser,
  validateProduct,
} from "../../../lib/products-api";

export async function GET(request) {
  const authError = await requireSupabaseUser(request);
  if (authError) return authError;

  return forwardGoApi("/products", "GET");
}

export async function POST(request) {
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

  return forwardGoApi("/products", "POST", product);
}