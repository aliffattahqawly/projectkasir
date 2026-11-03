
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// ==========================================
// DATA PRODUK
// ==========================================

const products = [
  {
    id: 1,
    name: "Beras Premium",
    category: "Pangan",
    price: 75000,
    stock: 25,
    image: "/images/beras.jpg",
  },
  {
    id: 2,
    name: "Minyak Goreng",
    category: "Pangan",
    price: 18000,
    stock: 30,
    image: "/images/minyak.jpg",
  },
  {
    id: 3,
    name: "Telur Ayam",
    category: "Pangan",
    price: 28000,
    stock: 20,
    image: "/images/telur.jpg",
  },
  {
    id: 4,
    name: "Gula Pasir",
    category: "Pangan",
    price: 17000,
    stock: 0,
    image: "/images/gula.jpg",
  },
  {
    id: 5,
    name: "Semen Bangunan",
    category: "Papan",
    price: 65000,
    stock: 15,
    image: "/images/semen.jpg",
  },
  {
    id: 6,
    name: "Cat Tembok",
    category: "Papan",
    price: 95000,
    stock: 12,
    image: "/images/cat.jpg",
  },
  {
    id: 7,
    name: "Paku Bangunan",
    category: "Papan",
    price: 12000,
    stock: 40,
    image: "/images/paku.jpg",
  },
  {
    id: 8,
    name: "Keramik Lantai",
    category: "Papan",
    price: 85000,
    stock: 0,
    image: "/images/keramik.jpg",
  },
];

// FORMAT RUPIAH
const formatRupiah = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

// ==========================================
// SHOP PAGE
// ==========================================

export default function ShopPage() {
  // FILTER STATE
  const [category, setCategory] = useState("Semua");
  const [availability, setAvailability] = useState("Semua");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  // MOBILE FILTER
  const [showMobileFilter, setShowMobileFilter] =
    useState(false);

  // CART STATE
  const [cart, setCart] = useState([]);

  // NOTIFICATION
  const [notice, setNotice] = useState("");

  // ==========================================
  // FILTER DAN SORTING PRODUK
  // ==========================================

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchCategory =
        category === "Semua" ||
        product.category === category;

      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const isAvailable = product.stock > 0;

      const matchAvailability =
        availability === "Semua" ||
        (availability === "Tersedia" && isAvailable) ||
        (availability === "Sold Out" && !isAvailable);

      return (
        matchCategory &&
        matchSearch &&
        matchAvailability
      );
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [category, availability, sort, search]);

  // ==========================================
  // CART
  // ==========================================

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function addToCart(product) {
    if (product.stock <= 0) return;

    const currentItem = cart.find(
      (item) => item.id === product.id
    );

    if (
      currentItem &&
      currentItem.quantity >= product.stock
    ) {
      setNotice("Jumlah produk sudah mencapai batas stok");
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setNotice(`${product.name} berhasil ditambahkan!`);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  // ==========================================
  // RESET FILTER
  // ==========================================

  function resetFilter() {
    setCategory("Semua");
    setAvailability("Semua");
    setSort("default");
    setSearch("");
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="relative isolate min-h-screen pt-15">

      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#091540] to-[#2F39A9]"
      >
        {/* glow kiri atas */}
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#4F5BFF]/40 blur-[120px]" />

        {/* glow kanan tengah */}
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#2F39A9]/60 blur-[140px]" />

        {/* glow bawah */}
        <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#6C7BFF]/30 blur-[130px]" />

        {/* grid halus */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>


      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-5 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 text-blue-200 hover:text-white"
          >
            <span>⌂</span>
            <span>Home</span>
          </Link>

          <span className="text-blue-300">›</span>

          <span className="text-blue-200">Belanja</span>

          <span className="text-blue-300">›</span>

          <span className="font-semibold text-white">Semua Produk</span>
        </nav>
      </div>

      {/* KATALOG */}
      <section id="produk" className="mx-auto max-w-7xl px-5 py-8">
        {/* JUDUL KATALOG */}
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
            OUR COLLECTION
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white">
            Temukan Produk Pilihan
          </h1>

          <p className="mt-2 text-sm text-blue-100/80">
            Berbagai kebutuhan pangan dan papan tersedia
            untuk memenuhi kebutuhanmu.
          </p>
        </div>

        {/* ================================== */}
        {/* LAYOUT SIDEBAR + PRODUK */}
        {/* ================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">

          {/* ================================== */}
          {/* FILTER SIDEBAR */}
          {/* ================================== */}

          <aside className="h-fit">

            {/* TOMBOL FILTER MOBILE */}

            <button
              onClick={() =>
                setShowMobileFilter(!showMobileFilter)
              }
              aria-expanded={showMobileFilter}
              className="mb-4 flex w-full items-center justify-between rounded-xl border border-white bg-white/80 p-4 text-sm font-bold text-blue-900 shadow-md backdrop-blur-xl transition hover:bg-white lg:hidden"
            >

              <span className="flex items-center gap-2">
                <span className="text-lg">☷</span>
                Filter Produk
              </span>

              <span className="text-blue-600">
                {showMobileFilter
                  ? "Tutup ▲"
                  : "Tampilkan ▼"}
              </span>

            </button>

            {/* ISI FILTER */}

            <div
              className={`
                rounded-2xl border border-white/80
                bg-white/65 p-5
                shadow-lg shadow-blue-100/40
                backdrop-blur-xl
                ${
                  showMobileFilter
                    ? "block"
                    : "hidden"
                }
                lg:sticky lg:top-24 lg:block
              `}
            >

              <div className="mb-5 flex items-center justify-between">

                <h2 className="text-lg font-bold text-blue-950">
                  Filter Produk
                </h2>

                <span className="text-xl text-blue-600">
                  ☷
                </span>

              </div>

              {/* KATEGORI */}

              <div className="border-b border-blue-100 pb-5">

                <h3 className="mb-4 text-sm font-bold text-blue-900">
                  Kategori
                </h3>

                <div className="space-y-3">

                  {["Semua", "Pangan", "Papan"].map(
                    (item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                      >

                        <input
                          type="radio"
                          name="category"
                          checked={category === item}
                          onChange={() => setCategory(item)}
                          className="h-4 w-4 accent-blue-600"
                        />

                        {item}

                      </label>
                    )
                  )}

                </div>

              </div>

              {/* KETERSEDIAAN */}

              <div className="mt-5 border-b border-blue-100 pb-5">

                <h3 className="mb-4 text-sm font-bold text-blue-900">
                  Ketersediaan
                </h3>

                <div className="space-y-3">

                  {[
                    "Semua",
                    "Tersedia",
                    "Sold Out",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                    >

                      <input
                        type="radio"
                        name="availability"
                        checked={availability === item}
                        onChange={() =>
                          setAvailability(item)
                        }
                        className="h-4 w-4 accent-blue-600"
                      />

                      {item}

                    </label>
                  ))}

                </div>

              </div>

              {/* SORTING HARGA */}

              <div className="mt-5">

                <h3 className="mb-4 text-sm font-bold text-blue-900">
                  Urutkan Harga
                </h3>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="w-full rounded-xl border border-blue-100 bg-white/80 px-3 py-3 text-sm text-slate-600 outline-none focus:border-blue-400"
                >

                  <option value="default">
                    Default
                  </option>

                  <option value="low">
                    Harga Termurah
                  </option>

                  <option value="high">
                    Harga Termahal
                  </option>

                </select>

              </div>

              {/* RESET FILTER */}

              <button
                onClick={resetFilter}
                className="mt-6 w-full rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Reset Filter
              </button>

            </div>

          </aside>

          {/* ================================== */}
          {/* AREA PRODUK */}
          {/* ================================== */}

          <div>

            {/* SEARCH DAN JUMLAH PRODUK */}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-blue-500">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Cari produk yang kamu butuhkan..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-white bg-white/75 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none backdrop-blur-xl placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div className="flex shrink-0 items-center justify-center rounded-xl border border-white bg-white/75 px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-xl">
                {filteredProducts.length} Produk
              </div>

            </div>

            {/* GRID PRODUK */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {filteredProducts.map((product) => (

                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[22px] border border-white/90 bg-white/65 p-3 shadow-[0_8px_30px_rgba(59,130,246,0.09)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_15px_35px_rgba(59,130,246,0.17)]"
                >

                  {/* GAMBAR PRODUK */}

                  <div className="relative h-52 overflow-hidden rounded-[17px] bg-gradient-to-br from-blue-50 to-white">

                    <img
                      src={product.image}
                      alt={product.name}
                      className={`h-full w-full object-contain p-4 transition duration-500 group-hover:scale-110 ${
                        product.stock === 0
                          ? "opacity-40 grayscale"
                          : ""
                      }`}
                    />

                    {/* BADGE KATEGORI */}

                    <span className="absolute left-3 top-3 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-blue-600 shadow-sm backdrop-blur">
                      ✦ {product.category}
                    </span>

                    {/* SOLD OUT */}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                        <span className="rounded-lg bg-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg">
                          SOLD OUT
                        </span>
                      </div>
                    )}

                  </div>

                  {/* DETAIL PRODUK */}

                  <div className="px-2 pb-2 pt-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[11px] text-slate-400">
                        {product.category === "Pangan"
                          ? "Kebutuhan Pangan"
                          : "Kebutuhan Papan"}
                      </span>

                      <span
                        className={`text-[10px] font-semibold ${
                          product.stock > 0
                            ? "text-teal-500"
                            : "text-red-500"
                        }`}
                      >
                        ●{" "}
                        {product.stock > 0
                          ? "Tersedia"
                          : "Habis"}
                      </span>

                    </div>

                    <h3 className="mt-2 text-base font-bold text-blue-950">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Stok: {product.stock} tersedia
                    </p>

                    {/* HARGA DAN TOMBOL */}

                    <div className="mt-4 flex items-center justify-between gap-2">

                      <p className="text-base font-extrabold text-blue-600">
                        {formatRupiah(product.price)}
                      </p>

                      <button
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={product.stock === 0}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-xl font-bold text-white shadow-md shadow-blue-200 transition hover:scale-110 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
                      >
                        +
                      </button>

                    </div>

                    {/* TOMBOL TAMBAH */}

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      disabled={product.stock === 0}
                      className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
                    >
                      {product.stock > 0
                        ? "+ Tambah ke Keranjang"
                        : "Produk Habis"}
                    </button>

                  </div>

                </article>

              ))}

            </div>

            {/* PRODUK TIDAK DITEMUKAN */}

            {filteredProducts.length === 0 && (

              <div className="rounded-2xl border border-white bg-white/70 py-20 text-center shadow-lg backdrop-blur-xl">

                <div className="text-5xl">
                  🔍
                </div>

                <h3 className="mt-4 text-lg font-bold text-blue-950">
                  Produk tidak ditemukan
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Coba ubah kata kunci atau filter pencarian.
                </p>

                <button
                  onClick={resetFilter}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Reset Filter
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* ================================== */}
      {/* BANNER BAWAH */}
      {/* ================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-12">

        <div className="flex flex-col items-center justify-between gap-5 rounded-[25px] border border-white bg-gradient-to-r from-blue-100/80 to-sky-200/80 px-8 py-8 shadow-lg shadow-blue-100/50 backdrop-blur-xl md:flex-row">

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">
              WARUNG BIRU
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-blue-950">
              Belanja Kebutuhan Jadi Lebih Mudah
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Produk pilihan dengan kualitas terbaik
              untuk kebutuhan sehari-hari.
            </p>

          </div>

          <a
            href="#produk"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-md transition hover:bg-blue-600 hover:text-white"
          >
            Jelajahi Semua Produk →
          </a>

        </div>

      </section>

      {/* ================================== */}
      {/* NOTIFIKASI */}
      {/* ================================== */}

      {notice && (

        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 max-w-[calc(100%-3rem)] rounded-xl border border-white bg-white/95 px-5 py-4 text-sm font-semibold text-blue-700 shadow-xl backdrop-blur-xl"
        >
          ✓ {notice}
        </div>

      )}

    </main>
  );
}
