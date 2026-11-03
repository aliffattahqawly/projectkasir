
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

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

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[activeSlide];

  return (
    <section className="relative h-[600px] w-full overflow-hidden sm:h-[680px] lg:h-[720px]">

      {/* Background Image */}
      <div
        key={current.image}
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('${current.image}')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/10" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pt-16 sm:px-10 lg:px-16">

        <div className="max-w-xl">

          <span className="inline-block rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold tracking-wider text-blue-600 shadow-sm backdrop-blur-xl">
            {current.label}
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {current.title}
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            {current.description}
          </p>

          <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700">
            <ShoppingBag size={18} />
            {current.button}
          </button>

        </div>
      </div>

      {/* Navigation */}
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

      {/* Indicators */}
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
