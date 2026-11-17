"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Loader2,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
// import { supabase } from "../../lib/supabase";
import { createClient } from "../../utils/supabase/client";
import { useCart } from "../cart/CartProvider";

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
  const supabase = useMemo(() => createClient(), []);
  const { cartCount } = useCart();
  const userDisplayName =
    user?.user_metadata?.full_name?.trim() || user?.email || "Pengguna";

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
      if (!supabase) return;

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Gagal logout:", error.message);
        return;
      }

      setMenuOpen(false);
      router.replace("/");
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
            <Link
              href="/cart"
              aria-label={`Keranjang belanja, ${cartCount} barang`}
              title="Keranjang belanja"
              data-cart-target
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
                {cartCount}
              </span>
            </Link>

            {/* Account status and actions */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label={`Keluar dari akun ${userDisplayName}`}
                title={`Masuk sebagai ${userDisplayName}`}
                className="flex h-9 items-center gap-2 rounded-full bg-red-700 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:px-4 sm:text-sm"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                aria-label="Masuk ke akun"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
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
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
