"use client";

// =========================================
// IMPORT HOOK, LIBRARY & UTILS EKSTERNAL
// =========================================
import { useEffect, useMemo, useState } from "react";
import ShopView from "./ShopView";
import { useCart } from "../../components/cart/CartProvider";
import { createClient as createSupabaseClient } from "../../utils/supabase/client";

// =========================================
// FUNGSI HELPER: FORMAT HARGA KE RUPIAH
// =========================================
const formatRupiah = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

// =========================================
// KOMPONEN UTAMA: ShopPage (Parent Container)
// =========================================
export default function ShopPage() {
  // Inisialisasi Supabase client dengan useMemo agar instance tetap stabil
  const supabase = useMemo(() => createSupabaseClient(), []);
  const { cartCount, addToCart: addCartItem } = useCart();

  // =========================================
  // STATE DATA KATALOG PRODUK & KATEGORI
  // =========================================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  useEffect(() => {
    const productAction = new URLSearchParams(window.location.search).get(
      "product"
    );
    const messages = {
      created: "Produk berhasil ditambahkan.",
      updated: "Produk berhasil diperbarui.",
    };
    const message = messages[productAction];

    if (!message) return;

    setSuccessNotice(message);
    window.history.replaceState(window.history.state, "", "/shop");

    const timeout = window.setTimeout(() => setSuccessNotice(""), 4000);
    return () => window.clearTimeout(timeout);
  }, []);

  // =========================================
  // EFFECT: MENGAMBIL DATA PRODUK & KATEGORI DARI SUPABASE
  // =========================================
  useEffect(() => {
    // Flag untuk mencegah update state jika komponen sudah unmount
    let active = true;

    async function loadCatalog() {
      // Validasi ketersediaan klien Supabase
      if (!supabase) {
        setProductsError("Konfigurasi Supabase belum tersedia.");
        setProductsLoading(false);
        return;
      }

      setProductsLoading(true);
      setProductsError("");

      // Mengambil data produk dan kategori secara bersamaan (paralel)
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("categories").select("id, name").order("name"),
      ]);

      // Hentikan eksekusi jika komponen sudah tidak aktif
      if (!active) return;

      // Tangani jika terjadi error saat mengambil produk
      if (productsResult.error) {
        setProductsError(`Produk gagal dimuat: ${productsResult.error.message}`);
        setProducts([]);
      } else {
        // Memetakan ID kategori ke nama kategori menggunakan Map untuk pencarian cepat
        const categoryNames = new Map(
          (categoriesResult.data ?? []).map((category) => [
            String(category.id),
            category.name,
          ])
        );
        setCategories(categoriesResult.data ?? []);

        // Normalisasi data produk (memastikan stok angka & nama kategori terpasang)
        setProducts(
          (productsResult.data ?? []).map((product) => ({
            ...product,
            stock: Number(product.stock ?? product.quantity ?? 0),
            category:
              categoryNames.get(String(product.category_id)) ??
              product.category ??
              product.category_name ??
              "Produk",
          }))
        );
      }

      setProductsLoading(false);
    }

    // Jalankan fungsi loadCatalog dan tangkap error tak terduga
    loadCatalog().catch((error) => {
      if (!active) return;
      setProductsError(error.message || "Produk gagal dimuat dari Supabase.");
      setProductsLoading(false);
    });

    // Cleanup function saat komponen di-unmount
    return () => {
      active = false;
    };
  }, [supabase]);

  // =========================================
  // STATE FILTER, PENCARIAN & TAMPILAN UI
  // =========================================
  const [category, setCategory] = useState("Semua");
  const [availability, setAvailability] = useState("Semua");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  // State untuk membuka/menutup drawer filter di layar mobile
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // =========================================
  // STATE KERANJANG BELANJA & NOTIFIKASI
  // =========================================
  const [notice, setNotice] = useState("");

  // =========================================
  // MEMOIZED DATA: FILTER DAN SORTING PRODUK
  // =========================================
  const filteredProducts = useMemo(() => {
    // Tahap 1: Filter berdasarkan kategori, kata kunci pencarian, dan ketersediaan stok
    let result = products.filter((product) => {
      const matchCategory =
        category === "Semua" || product.category === category;

      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const isAvailable = product.stock > 0;

      const matchAvailability =
        availability === "Semua" ||
        (availability === "Tersedia" && isAvailable) ||
        (availability === "Sold Out" && !isAvailable);

      return matchCategory && matchSearch && matchAvailability;
    });

    // Tahap 2: Urutkan produk berdasarkan harga (terendah ke tertinggi)
    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    // Tahap 3: Urutkan produk berdasarkan harga (tertinggi ke terendah)
    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, category, availability, sort, search]);

  // =========================================
  // LOGIKA KERANJANG BELANJA (CART)
  // =========================================

  // Fungsi untuk menambahkan produk ke keranjang belanja
  function addToCart(product) {
    if (!addCartItem(product)) {
      setNotice("Jumlah maksimal untuk satu produk adalah 99.");
      return;
    }

    // Tampilkan pesan notifikasi singkat dan sembunyikan otomatis setelah 2.5 detik
    setNotice(`${product.name} berhasil ditambahkan!`);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  // =========================================
  // FUNGSI HELPER: RESET SEMUA FILTER
  // =========================================
  function resetFilter() {
    setCategory("Semua");
    setAvailability("Semua");
    setSort("default");
    setSearch("");
  }

  // =========================================
  // RENDER: MENERUSKAN PROPS KE ShopView
  // =========================================
  return (
    <ShopView
      category={category}
      setCategory={setCategory}
      availability={availability}
      setAvailability={setAvailability}
      sort={sort}
      setSort={setSort}
      search={search}
      setSearch={setSearch}
      showMobileFilter={showMobileFilter}
      setShowMobileFilter={setShowMobileFilter}
      notice={notice}
      successNotice={successNotice}
      categories={categories}
      productsLoading={productsLoading}
      productsError={productsError}
      filteredProducts={filteredProducts}
      cartCount={cartCount}
      addToCart={addToCart}
      resetFilter={resetFilter}
      formatRupiah={formatRupiah}
    />
  );
}
