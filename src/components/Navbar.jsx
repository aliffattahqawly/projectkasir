
"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Kategori", href: "#kategori" },
  { name: "Produk", href: "#produk" },
  { name: "Tentang Kami", href: "#tentang" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className="
          relative mx-auto max-w-6xl
          rounded-full border border-white/70
          bg-white/60
          px-3 py-2
          shadow-[0_8px_30px_rgba(15,50,90,0.08)]
          backdrop-blur-xl
          backdrop-saturate-150
          sm:px-4 sm:py-2
        "
      >
        <div className="flex h-10 items-center justify-between sm:h-11">

          {/* Menu Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`
                  rounded-full px-4 py-2
                  text-[13px] font-medium
                  transition-all duration-200
                  ${
                    index === 0
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                      : "text-slate-600 hover:bg-white/80 hover:text-blue-600"
                  }
                `}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <button
              aria-label="Cari produk"
              className="
                hidden h-9 w-9 items-center justify-center
                rounded-full bg-white/60 text-slate-600
                transition hover:bg-white hover:text-blue-600
                sm:flex
              "
            >
              <Search size={17} />
            </button>

            {/* Cart */}
            <button
              aria-label="Keranjang belanja"
              className="
                relative flex h-9 w-9 items-center justify-center
                rounded-full bg-white/60 text-slate-600
                transition hover:bg-white hover:text-blue-600
              "
            >
              <ShoppingCart size={17} />

              <span
                className="
                  absolute -right-0.5 -top-0.5
                  flex h-4 min-w-4 items-center justify-center
                  rounded-full bg-blue-600 px-1
                  text-[9px] font-bold text-white
                "
              >
                0
              </span>
            </button>

            {/* Account */}
            <button
              aria-label="Akun pengguna"
              className="
                hidden h-9 w-9 items-center justify-center
                rounded-full bg-blue-600 text-white
                shadow-sm shadow-blue-600/20
                transition hover:bg-blue-700 sm:flex
              "
            >
              <UserRound size={17} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-blue-600 text-white
                transition hover:bg-blue-700 md:hidden
              "
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="
              absolute left-0 right-0 top-full mt-3
              rounded-2xl border border-white/70
              bg-white/75 p-3
              shadow-[0_12px_35px_rgba(15,50,90,0.10)]
              backdrop-blur-2xl
              md:hidden
            "
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    rounded-xl px-4 py-2.5
                    text-sm font-medium transition
                    ${
                      index === 0
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-white/80 hover:text-blue-600"
                    }
                  `}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
