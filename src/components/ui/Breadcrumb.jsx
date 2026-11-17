"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import Link from "next/link";

// =========================================
// KOMPONEN UTAMA: Breadcrumb (Navigasi Jejak Halaman)
// =========================================
export default function Breadcrumb({ items = [] }) {
  return (
    // =========================================
    // WRAPPER UTAMA BREADCRUMB
    // =========================================
    <div className="mx-auto max-w-7xl px-5 pt-6">
      
      {/* Elemen Navigasi ARIA */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs"
      >
        {/* Tautan Beranda / Home */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-blue-500 transition hover:text-blue-700"
        >
          <span>⌂</span>
          <span>Home</span>
        </Link>

        {/* Melakukan Looping pada Array Items untuk Daftar Path / Jejak */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            
            {/* Karakter Pemisah / Separator */}
            <span className="text-blue-300">›</span>

            {/* Kondisi: Jika item memiliki URL dan bukan item terakhir, jadikan link aktif */}
            {item.href && index !== items.length - 1 ? (
              <Link
                href={item.href}
                className="text-blue-500 transition hover:text-blue-700"
              >
                {item.label}
              </Link>
            ) : (
              /* Jika item terakhir atau tidak ada href, tampilkan sebagai teks biasa */
              <span className="font-medium text-blue-800">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
      
    </div>
  );
}