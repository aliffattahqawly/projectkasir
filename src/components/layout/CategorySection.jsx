"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { ArrowRight, ShoppingBasket, House } from "lucide-react";

// =========================================
// DATA KONSTANTA: GAMBAR DEFAULT KATEGORI
// =========================================
const categoryImages = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000",
];

// =========================================
// KOMPONEN UTAMA: CategorySection (Presentational Component)
// =========================================
export default function CategorySection({ categories = [], hasError = false }) {
  // Melakukan pemetaan (mapping) data kategori dari props menjadi objek kartu yang siap dirender
  const categoryCards = categories.map((category, index) => {
    const name = category.name ?? category.title ?? `Kategori ${index + 1}`;
    const identifier = category.slug ?? category.id ?? name;
    // Pengecekan regex untuk menentukan apakah kategori berkaitan dengan makanan/pangan
    const isFood = /pangan|makan|food/i.test(`${identifier} ${name}`);

    return {
      id: identifier,
      name,
      subtitle: category.subtitle ?? name,
      description:
        category.description ?? `Temukan berbagai produk ${name.toLowerCase()} pilihan.`,
      image:
        category.image_url ?? category.image ?? categoryImages[index % categoryImages.length],
      icon: isFood ? ShoppingBasket : House,
      button: `Jelajahi ${name}`,
    };
  });

  return (
    // =========================================
    // WRAPPER UTAMA SECTION KATEGORI
    // =========================================
    <section
      id="kategori"
      className="relative w-full overflow-hidden bg-blue-50 px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl">

        {/* =========================================
            HEADER SECTION (JUDUL & DESKRIPSI)
            ========================================= */}
        <div className="mb-10 text-center">
          {/* Badge Label Atas */}
          <span className="inline-block rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold tracking-wider text-blue-600 shadow-sm">
            KATEGORI WARUNG BIRU
          </span>

          {/* Judul Utama */}
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
            Temukan Kebutuhanmu
          </h2>

          {/* Deskripsi Singkat */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Pilih kategori produk sesuai kebutuhanmu.
            Belanja lebih mudah bersama Warung Biru.
          </p>

          {/* Garis Aksen Dekoratif Bawah Judul */}
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* =========================================
            GRID KARTU KATEGORI
            ========================================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categoryCards.length === 0 ? (
            /* Tampilan Jika Data Kategori Kosong / Gagal Dimuat */
            <p className="col-span-full py-8 text-center text-sm text-slate-600">
              {hasError ? "Kategori gagal dimuat." : "Belum ada kategori tersedia."}
            </p>
          ) : (
            /* Mapping Kartu Kategori */
            categoryCards.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.id}
                  className="
                    group relative min-h-[350px] overflow-hidden
                    rounded-[2rem] border border-blue-200/70
                    bg-blue-100 shadow-lg shadow-blue-900/5
                    transition duration-500
                    hover:-translate-y-1 hover:shadow-xl
                    hover:shadow-blue-900/10
                    sm:min-h-[400px]
                  "
                >
                  {/* Gambar Latar Belakang Kartu */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                      absolute inset-0 h-full w-full
                      object-cover transition duration-700
                      group-hover:scale-105
                    "
                  />

                  {/* Lapisan Gradasi Warna (Overlay) di atas Gambar */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-r
                      from-blue-950/85
                      via-blue-900/55
                      to-blue-900/10
                    "
                  />

                  {/* Konten Di Dalam Kartu */}
                  <div
                    className="
                      relative z-10 flex min-h-[350px]
                      max-w-lg flex-col items-start justify-center
                      p-7 text-white sm:min-h-[400px] sm:p-10
                    "
                  >
                    {/* Kotak Ikon Kategori */}
                    <div
                      className="
                        mb-5 flex h-14 w-14 items-center
                        justify-center rounded-2xl
                        border border-white/30
                        bg-blue-500/40 text-white
                        shadow-lg shadow-blue-950/20
                        backdrop-blur-xl
                      "
                    >
                      <Icon size={25} />
                    </div>

                    {/* Subtitle / Label Kecil */}
                    <span
                      className="
                        text-xs font-semibold uppercase
                        tracking-[0.2em] text-blue-200
                      "
                    >
                      {category.subtitle}
                    </span>

                    {/* Nama Kategori Utama */}
                    <h3
                      className="
                        mt-3 text-4xl font-bold tracking-tight
                        sm:text-5xl
                      "
                    >
                      {category.name}
                    </h3>

                    {/* Deskripsi Kategori */}
                    <p
                      className="
                        mt-4 max-w-sm text-sm leading-7
                        text-white/85
                      "
                    >
                      {category.description}
                    </p>

                    {/* Tombol Aksi / Navigasi ke Halaman Shop */}
                    <a
                      href={`/shop?category=${category.id}`}
                      className="
                        mt-7 inline-flex items-center gap-3
                        rounded-full bg-blue-600 px-6 py-3
                        text-sm font-semibold text-white
                        shadow-lg shadow-blue-950/20
                        transition duration-300
                        hover:bg-white hover:text-blue-700
                        hover:shadow-xl
                      "
                    >
                      {category.button}

                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}