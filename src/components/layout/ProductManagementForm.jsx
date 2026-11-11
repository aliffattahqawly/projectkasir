"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Pencil, RefreshCw, Trash2, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category_id: "",
  image: "",
  unit: "",
  status: "",
};

const unitOptions = ["kg", "g", "mg", "l", "ml", "cm", "m", "pcs", "pack", "box"];
const statusOptions = [
  { value: "available", label: "Ready" },
  { value: "unavailable", label: "Sold Out" },
];
const productImageBucket = "product-images";
const maxImageBytes = 5 * 1024 * 1024;

function getProductRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return null;
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function formatPriceInput(price) {
  const [whole, ...fractionParts] = String(price ?? "")
    .replace(/[^\d,]/g, "")
    .split(",");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return fractionParts.length
    ? `${groupedWhole},${fractionParts.join("")}`
    : groupedWhole;
}

function parsePriceInput(price) {
  const normalized = String(price)
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(normalized);
}

async function readApiResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getApiError(payload, fallback) {
  if (typeof payload === "string") return payload.slice(0, 500);

  const message = [payload?.error, payload?.message, payload?.detail, payload?.msg]
    .find((value) => typeof value === "string" && value.trim());

  if (message) return message;
  if (Array.isArray(payload?.errors)) {
    return payload.errors.map((error) => String(error)).join("; ");
  }

  return fallback;
}

async function getSessionHeaders() {
  if (!supabase) {
    throw new Error("Konfigurasi Supabase Auth belum tersedia.");
  }

  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (error || !accessToken) {
    throw new Error("Sesi login tidak tersedia. Silakan masuk kembali.");
  }

  return { Authorization: `Bearer ${accessToken}` };
}

export default function ProductManagementForm() {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const formSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setCategoriesLoading(true);
      setCategoriesError("");

      if (!supabase) {
        setCategoriesError("Konfigurasi Supabase belum tersedia.");
        setCategoriesLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name")
          .order("name");

        if (!active) return;

        if (error) {
          setCategoriesError("Kategori gagal dimuat dari Supabase.");
        } else {
          setCategories(data ?? []);
        }
      } catch {
        if (active) setCategoriesError("Kategori gagal dimuat dari Supabase.");
      } finally {
        if (active) setCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
          headers: await getSessionHeaders(),
          signal: controller.signal,
        });
        const payload = await readApiResponse(response);

        if (!response.ok) {
          throw new Error(getApiError(payload, "Daftar produk gagal dimuat."));
        }

        const rows = getProductRows(payload);
        if (!rows) {
          throw new Error("Format respons daftar produk tidak dikenali.");
        }

        const rowsWithImages = await Promise.all(
          rows.map(async (product) => {
            if (!product.image || /^https?:\/\//i.test(product.image)) {
              return { ...product, displayImage: product.image ?? "" };
            }

            if (!supabase) {
              return { ...product, displayImage: "" };
            }

            const storage = supabase.storage.from(productImageBucket);
            const { data, error } = await storage.createSignedUrl(product.image, 3600);
            return {
              ...product,
              displayImage:
                data?.signedUrl ??
                (error ? storage.getPublicUrl(product.image).data.publicUrl : ""),
            };
          })
        );

        if (active) setProducts(rowsWithImages);
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setProductsError(error.message || "Daftar produk gagal dimuat.");
        }
      } finally {
        if (active) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
      controller.abort();
    };
  }, [refreshKey]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError("");
    setSuccessMessage("");
  }

  function updatePrice(event) {
    const [whole, ...fractionParts] = event.target.value
      .replace(/[^\d,]/g, "")
      .split(",");
    const value = fractionParts.length
      ? `${whole},${fractionParts.join("")}`
      : whole;
    setForm((current) => ({ ...current, price: value }));
    setFormError("");
    setSuccessMessage("");
  }

  function handleImageSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Pilih file gambar dengan format yang didukung.");
      event.target.value = "";
      return;
    }

    if (file.size > maxImageBytes) {
      setFormError("Ukuran gambar maksimal 5 MiB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError("");
    setSuccessMessage("");
  }

  function startEditing(product) {
    const currentStatus = String(product.status ?? "")
      .toLowerCase()
      .replaceAll("_", " ");

    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price: Number.isFinite(Number(product.price))
        ? Number(product.price).toLocaleString("id-ID", {
            maximumFractionDigits: 20,
          })
        : "",
      quantity: String(product.quantity ?? ""),
      category_id: String(product.category_id ?? ""),
      image: product.image ?? "",
      unit: product.unit ?? "",
      status: statusOptions.some((option) => option.value === currentStatus)
        ? currentStatus
        : "",
    });
    setSelectedImage(null);
    setImagePreview(product.displayImage ?? product.image ?? "");
    setEditingId(product.id);
    setFormError("");
    setSuccessMessage("");
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEditing() {
    setForm(emptyForm);
    setSelectedImage(null);
    setImagePreview("");
    setEditingId(null);
    setFormError("");
    setSuccessMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(product) {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;

    setDeletingId(product.id);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        { method: "DELETE", headers: await getSessionHeaders() }
      );
      const payload = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(getApiError(payload, "Produk gagal dihapus."));
      }

      if (editingId === product.id) cancelEditing();
      setSuccessMessage("Produk berhasil dihapus.");
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setFormError(error.message || "Produk gagal dihapus.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const product = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: parsePriceInput(form.price),
      quantity: Number(form.quantity),
      category_id: Number(form.category_id),
      image: form.image.trim() || null,
      unit: form.unit.trim(),
      status: form.status.trim(),
    };

    if (!Number.isFinite(product.price) || product.price < 0) {
      setFormError("Harga harus berupa angka nol atau lebih.");
      return;
    }

    if (!Number.isInteger(product.quantity) || product.quantity < 0) {
      setFormError("Jumlah harus berupa bilangan bulat nol atau lebih.");
      return;
    }

    setIsSubmitting(true);
    let uploadedImagePath = "";

    try {
      if (selectedImage) {
        if (!supabase) {
          throw new Error("Konfigurasi Supabase Storage belum tersedia.");
        }

        const safeFileName = selectedImage.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filePath = `${crypto.randomUUID()}-${safeFileName}`;
        const { data, error } = await supabase.storage
          .from(productImageBucket)
          .upload(filePath, selectedImage, {
            contentType: selectedImage.type,
            upsert: false,
          });

        if (error) {
          throw new Error(`Upload gambar gagal: ${error.message}`);
        }

        uploadedImagePath = data.path;
        const { data: publicUrlData } = supabase.storage
          .from(productImageBucket)
          .getPublicUrl(data.path);
        product.image = publicUrlData.publicUrl;
      }

      const response = await fetch(
        editingId
          ? `/api/products/${encodeURIComponent(editingId)}`
          : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await getSessionHeaders()),
          },
          body: JSON.stringify(product),
        }
      );
      const payload = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          getApiError(
            payload,
            (editingId ? "Produk gagal diperbarui." : "Produk gagal ditambahkan.")
          )
        );
      }

      setForm(emptyForm);
      setEditingId(null);
      setSelectedImage(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccessMessage(
        editingId ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan."
      );
      setRefreshKey((current) => current + 1);
    } catch (error) {
      let message = error.message || "Produk gagal disimpan.";

      if (uploadedImagePath && supabase) {
        const { error: cleanupError } = await supabase.storage
          .from(productImageBucket)
          .remove([uploadedImagePath]);
        if (cleanupError) {
          message += " Gambar terunggah tetapi gagal dibersihkan; hubungi administrator Storage.";
        }
      }

      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <section
        ref={formSectionRef}
        className="scroll-mt-24 border-y border-blue-100 bg-white px-5 py-7 sm:px-8"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingId ? "Edit produk" : "Tambah produk"}
          </h2>
          {editingId && (
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100"
              type="button"
              aria-label="Batalkan edit"
              title="Batalkan edit"
              onClick={cancelEditing}
            >
              <X size={17} />
            </button>
          )}
        </div>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Nama produk
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              name="name"
              value={form.name}
              onChange={updateField}
              maxLength={160}
              required
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Kategori
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              name="category_id"
              value={form.category_id}
              onChange={updateField}
              required
              disabled={categoriesLoading || categories.length === 0}
            >
              <option value="">
                {categoriesLoading ? "Memuat kategori..." : "Pilih kategori"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Deskripsi
            <textarea
              className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              name="description"
              value={form.description}
              onChange={updateField}
              maxLength={2000}
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Harga
              <div className="flex items-center rounded-md border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="px-3 text-slate-500">Rp</span>
                <input
                  className="min-w-0 flex-1 rounded-r-md px-3 py-2.5 font-normal outline-none"
                  type="text"
                  inputMode="decimal"
                  aria-label="Harga dalam Rupiah"
                  value={formatPriceInput(form.price)}
                  onChange={updatePrice}
                  placeholder="Contoh: 21.211,50"
                  required
                />
              </div>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Jumlah
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={updateField}
                min="0"
                step="1"
                required
              />
            </label>
          </div>

          <div className="space-y-1.5 text-sm font-medium text-slate-700">
            <span className="block">Gambar produk</span>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm font-normal text-slate-600 hover:border-blue-500 hover:bg-blue-50">
              <ImagePlus size={18} />
              <span>Pilih gambar dari bucket product-images (maks. 5 MiB)</span>
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
            {imagePreview && (
              <div className="relative mt-2 h-28 w-28">
                <img
                  src={imagePreview}
                  alt="Pratinjau gambar produk"
                  className="h-full w-full rounded-md border border-slate-200 object-cover"
                />
                <button
                  className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow"
                  type="button"
                  aria-label="Hapus gambar pilihan"
                  title="Hapus gambar pilihan"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(form.image || "");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Satuan
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="unit"
                value={form.unit}
                onChange={updateField}
                required
              >
                <option value="">Pilih satuan</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Status
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="status"
                value={form.status}
                onChange={updateField}
                required
              >
                <option value="">Pilih status</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {categoriesError && (
            <p className="text-sm text-red-700 md:col-span-2" role="alert">
              {categoriesError}
            </p>
          )}
          {categories.length === 0 && !categoriesLoading && !categoriesError && (
            <p className="text-sm text-slate-600 md:col-span-2">
              Belum ada kategori. Produk belum dapat ditambahkan.
            </p>
          )}
          {formError && (
            <p className="text-sm text-red-700 md:col-span-2" role="alert">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-green-700 md:col-span-2" role="status">
              {successMessage}
            </p>
          )}

          <div className="md:col-span-2">
            <button
              className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={
                isSubmitting || categoriesLoading || categories.length === 0
              }
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingId
                  ? "Simpan perubahan"
                  : "Tambah produk"}
            </button>
          </div>
        </form>
      </section>

      <section aria-labelledby="product-list-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="product-list-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Daftar produk
          </h2>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            type="button"
            aria-label="Muat ulang produk"
            title="Muat ulang produk"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={productsLoading}
          >
            <RefreshCw size={16} className={productsLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {productsError && (
          <p className="mb-4 text-sm text-red-700" role="alert">
            {productsError}
          </p>
        )}

        {productsLoading ? (
          <p className="py-8 text-sm text-slate-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="py-8 text-sm text-slate-500">Belum ada produk.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => {
              const category = categories.find(
                (item) => String(item.id) === String(product.category_id)
              );
              const normalizedStatus = String(product.status ?? "")
                .toLowerCase()
                .replaceAll("_", " ");
              const isDeleting = deletingId === product.id;

              return (
                <article
                  key={product.id ?? `${product.name}-${index}`}
                  className="overflow-hidden rounded-md border border-slate-200 bg-white"
                >
                  <div className="h-44 bg-slate-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Gambar tidak tersedia
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {category?.name ?? product.category_id}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-sm bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {statusOptions.find(
                          (status) => status.value === normalizedStatus
                        )?.label ?? product.status}
                      </span>
                    </div>
                    <p className="font-semibold text-blue-700">
                      {formatPrice(product.price)}
                      <span className="ml-1 text-sm font-normal text-slate-500">
                        / {product.unit}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Stok: {product.quantity} {product.unit}
                    </p>
                    <div className="flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        type="button"
                        onClick={() => startEditing(product)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={isDeleting}
                      >
                        <Trash2 size={15} />
                        {isDeleting ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}