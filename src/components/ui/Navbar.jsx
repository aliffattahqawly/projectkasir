"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogIn,
  LogOut,
  Loader2,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
// import { supabase } from "../lib/supabase";
import { supabase } from "../../lib/supabase";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Produk", href: "/shop" },
  { name: "Tentang Kami", href: "/tenta" },
  { name: "riwayat transaksi", href: "/riwayat" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Pantau status login
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      setMenuOpen(false);
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className="
          relative mx-auto max-w-7xl
          rounded-full border border-white/70
          bg-white/60 px-3 py-2
          shadow-[0_8px_30px_rgba(15,50,90,0.08)]
          backdrop-blur-xl backdrop-saturate-150
          sm:px-4 sm:py-2
        "
      >
        <div className="flex h-10 items-center justify-between sm:h-11">
          {/* Menu Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  rounded-full px-4 py-2
                  text-[20px] font-medium
                  transition-all duration-200
                  ${
                    isActive(link.href)
                      ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                      : "text-slate-600 hover:bg-white/80 hover:text-blue-600"
                  }
                `}
              >
                {link.name}
              </Link>
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

            {/* Account / Logout (desktop) */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Keluar dari akun"
                title="Keluar"
                className="
                  hidden h-9 items-center justify-center gap-2
                  rounded-full bg-red-50 px-4
                  text-sm font-semibold text-red-600
                  ring-1 ring-red-100
                  transition hover:bg-red-100 hover:text-red-700
                  disabled:cursor-not-allowed disabled:opacity-70
                  sm:flex
                "
              >
                {loggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                aria-label="Masuk ke akun"
                className="
                  hidden h-9 w-9 items-center justify-center
                  rounded-full bg-blue-600 text-white
                  shadow-sm shadow-blue-600/20
                  transition hover:bg-blue-700
                  sm:flex
                "
              >
                <UserRound size={17} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-blue-600 text-white
                transition hover:bg-blue-700
                md:hidden
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
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    rounded-xl px-4 py-2.5
                    text-sm font-medium transition
                    ${
                      isActive(link.href)
                        ? "bg-red-50 text-red-700"
                        : "text-slate-600 hover:bg-white/80 hover:text-blue-600"
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}

              {/* Masuk / Keluar (mobile) */}
              <div className="my-1 h-px bg-slate-200/70" />

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex items-center gap-2 rounded-xl px-4 py-2.5
                    text-left text-sm font-semibold text-red-600
                    transition hover:bg-red-50
                    disabled:cursor-not-allowed disabled:opacity-70
                  "
                >
                  {loggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  Keluar
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-2 rounded-xl px-4 py-2.5
                    text-sm font-semibold text-blue-600
                    transition hover:bg-blue-50
                  "
                >
                  <LogIn size={16} />
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}