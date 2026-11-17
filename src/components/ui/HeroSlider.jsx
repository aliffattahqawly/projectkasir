"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

// =========================================
// DATA KONSTANTA: KONTEN SLIDE HERO
// =========================================
const slides = [
  {
    label: "SELAMAT DATANG DI WARUNG BIRU",
    title: "Belanja Kebutuhan Jadi Lebih Mudah",
    description:
      "Temukan berbagai kebutuhan pangan dan papan dengan mudah, praktis, dan nyaman.",
    button: "Belanja Sekarang",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800",
  },
  {
    label: "PILIHAN PRODUK TERBAIK",
    title: "Kebutuhan Harian Ada di Sini",
    description:
      "Berbagai pilihan produk untuk memenuhi kebutuhan sehari-hari kamu.",
    button: "Lihat Produk",
    image:
      "https://images.unsplash.com/photo-1543168256-418811576931?w=1800",
  },
  {
    label: "BELANJA LEBIH PRAKTIS",
    title: "Semua Kebutuhan dalam Satu Tempat",
    description:
      "Nikmati pengalaman belanja yang lebih mudah bersama Warung Biru.",
    button: "Mulai Belanja",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1800",
  },
];

// =========================================
// KOMPONEN UTAMA: HeroSlider (Carousel Banner Utama)
// =========================================
export default function HeroSlider() {
  // State untuk melacak indeks slide yang sedang aktif
  const [activeSlide, setActiveSlide] = useState(0);

  // Fungsi untuk berpindah ke slide berikutnya (melingkar kembali ke awal)
  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  // Fungsi untuk berpindah ke slide sebelumnya (melingkar ke akhir)
  const prevSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  // Effect untuk menjalankan auto-slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mengambil data objek slide yang sedang aktif saat ini
  const current = slides[activeSlide];

  return (
    // =========================================
    // WRAPPER UTAMA HERO SLIDER
    // =========================================
    <section className="relative h-[600px] w-full overflow-hidden sm:h-[680px] lg:h-[720px]">

      {/* Gambar Latar Belakang Slide Aktif */}
      <div
        key={current.image}
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('${current.image}')`,
        }}
      />

      {/* Lapisan Gradasi Putih (Overlay) agar teks terbaca jelas */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/10" />

      {/* =========================================
          KONTEN UTAMA HERO (TEKS & TOMBOL CTA)
          ========================================= */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pt-16 sm:px-10 lg:px-16">
        <div className="max-w-xl">
          
          {/* Badge Label Kecil */}
          <span className="inline-block rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold tracking-wider text-blue-600 shadow-sm backdrop-blur-xl">
            {current.label}
          </span>

          {/* Judul Utama Slide */}
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {current.title}
          </h1>

          {/* Deskripsi Slide */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            {current.description}
          </p>

          {/* Tombol Aksi (CTA) */}
          <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700">
            <ShoppingBag size={18} />
            {current.button}
          </button>

        </div>
      </div>

      {/* =========================================
          TOMBOL NAVIGASI KIRI & KANAN (PREV / NEXT)
          ========================================= */}
      <button
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute bottom-8 right-24 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/60 text-slate-700 shadow-md backdrop-blur-xl transition hover:bg-white"
      >
        <ArrowLeft size={18} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="absolute bottom-8 right-10 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/60 text-slate-700 shadow-md backdrop-blur-xl transition hover:bg-white"
      >
        <ArrowRight size={18} />
      </button>

      {/* =========================================
          INDIKATOR TITIK SLIDE (PAGINATION DOTS)
          ========================================= */}
      <div className="absolute bottom-12 left-6 z-20 flex items-center gap-2 sm:left-10 lg:left-16">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Pilih slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeSlide === index
                ? "w-8 bg-blue-600"
                : "w-2 bg-slate-400/60"
            }`}
          />
        ))}
      </div>

    </section>
  );
}