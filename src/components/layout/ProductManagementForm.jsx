"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { useEffect, useMemo, useRef, useState } from "react";
import ProductManagementView from "./ProductManagementView";
import { createClient as createSupabaseClient } from "../../utils/supabase/client";

// =========================================
// KONSTANTA DATA KOSONG & OPSI FORM
// =========================================
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

// =========================================
// FUNGSI HELPER & PARSING DATA
// =========================================

// Ekstraksi baris produk dari berbagai format respons API
function getProductRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return null;
}

// Memformat angka menjadi format mata uang Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

// Memformat input harga secara real-time dengan pemisah ribuan titik (.)
function formatPriceInput(price) {
  const [whole, ...fractionParts] = String(price ?? "")
    .replace(/[^\d,]/g, "")
    .split(",");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return fractionParts.length
    ? `${groupedWhole},${fractionParts.join("")}`
    : groupedWhole;
}

// Mengubah string harga berformat lokal menjadi tipe number standar
function parsePriceInput(price) {
  const normalized = String(price)
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(normalized);
}

// Membaca respons API dalam bentuk teks atau JSON
async function readApiResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Menghasilkan pesan error API yang informatif
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

// Mengambil token autentikasi sesi dari Supabase untuk header request
async function getSessionHeaders(supabase) {
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

// =========================================
// KOMPONEN UTAMA: ProductManagementForm (Container Component)
// =========================================
export default function ProductManagementForm({ onSaved }) {
  // Inisialisasi Supabase client dengan useMemo
  const supabase = useMemo(() => createSupabaseClient(), []);

  // =========================================
  // STATE MANAGEMENT FORM & KATALOG
  // =========================================
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

  // Refs untuk elemen DOM
  const formSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cleanup URL object preview gambar saat komponen unmount
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // =========================================
  // EFFECT: MENGAMBIL DATA KATEGORI DARI SUPABASE
  // =========================================
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
  }, [supabase]);

  // =========================================
  // EFFECT: MENGAMBIL DAFTAR PRODUK & URL SIGNED GAMBAR
  // =========================================
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
          headers: await getSessionHeaders(supabase),
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

        // Membuat signed URL untuk setiap gambar produk di Storage
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
  }, [refreshKey, supabase]);

  // =========================================
  // FUNGSI HANDLER FORM & INPUT
  // =========================================

  // Mengubah nilai field teks biasa
  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError("");
    setSuccessMessage("");
  }

  // Mengubah dan memformat input harga
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

  // Menangani pemilihan file gambar dari perangkat
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

  // Memulai mode edit produk
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

  // Membatalkan mode edit dan mereset form
  function cancelEditing() {
    setForm(emptyForm);
    setSelectedImage(null);
    setImagePreview("");
    setEditingId(null);
    setFormError("");
    setSuccessMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Menghapus data produk berdasarkan ID
  async function handleDelete(product) {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;

    setDeletingId(product.id);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        { method: "DELETE", headers: await getSessionHeaders(supabase) }
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

  // =========================================
  // FUNGSI SUBMIT FORM (TAMBAH / UPDATE PRODUK)
  // =========================================
  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");
    const wasEditing = Boolean(editingId);

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

    // Validasi nilai numerik
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
      // Proses upload gambar baru ke Supabase Storage jika ada
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

      // Kirim request POST (Tambah) atau PATCH (Update) ke API backend
      const response = await fetch(
        editingId
          ? `/api/products/${encodeURIComponent(editingId)}`
          : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await getSessionHeaders(supabase)),
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

      // Reset form setelah berhasil
      setForm(emptyForm);
      setEditingId(null);
      setSelectedImage(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccessMessage(
        editingId ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan."
      );
      setRefreshKey((current) => current + 1);
      onSaved?.({ editing: wasEditing });
    } catch (error) {
      let message = error.message || "Produk gagal disimpan.";

      // Rollback file upload jika proses penyimpanan ke DB gagal
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

  // =========================================
  // RENDER: MENERUSKAN PROPS KE ProductManagementView
  // =========================================
  return (
    <ProductManagementView
      form={form}
      categories={categories}
      categoriesLoading={categoriesLoading}
      categoriesError={categoriesError}
      products={products}
      productsLoading={productsLoading}
      productsError={productsError}
      formError={formError}
      successMessage={successMessage}
      isSubmitting={isSubmitting}
      imagePreview={imagePreview}
      setImagePreview={setImagePreview}
      setSelectedImage={setSelectedImage}
      setRefreshKey={setRefreshKey}
      editingId={editingId}
      deletingId={deletingId}
      formSectionRef={formSectionRef}
      fileInputRef={fileInputRef}
      unitOptions={unitOptions}
      statusOptions={statusOptions}
      updateField={updateField}
      updatePrice={updatePrice}
      handleImageSelect={handleImageSelect}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      handleDelete={handleDelete}
      handleSubmit={handleSubmit}
      formatPrice={formatPrice}
      formatPriceInput={formatPriceInput}
    />
  );
}
