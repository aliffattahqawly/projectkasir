"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../ui/Footer";
import Navbar from "../ui/Navbar";
import { createClient as createSupabaseClient } from "../../utils/supabase/client";

export default function AuthFrame({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = useMemo(() => createSupabaseClient(), []);

  const [authState, setAuthState] = useState(
    supabase ? "checking" : "signed-out"
  );

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  // Memeriksa dan memantau status autentikasi
  useEffect(() => {
    let active = true;

    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setAuthState(session ? "signed-in" : "signed-out");
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (active) {
        setAuthState(
          !error && data.session ? "signed-in" : "signed-out"
        );
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Mengatur akses halaman
  useEffect(() => {
    const publicPages = ["/", "/login", "/register"];

    const isPublicPage = publicPages.includes(pathname);

    if (authState === "signed-out" && !isPublicPage) {
      router.replace("/login");
    } else if (authState === "signed-in" && isAuthPage) {
      router.replace("/");
    }
  }, [authState, isAuthPage, pathname, router]);

  // Halaman login dan register
  if (isAuthPage) {
    return authState === "signed-in" ? null : children;
  }

  // Memeriksa session
  if (authState === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Memeriksa sesi...
      </main>
    );
  }

  // Pengguna belum login tetapi membuka halaman beranda
  if (authState === "signed-out" && pathname === "/") {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  // Pengguna belum login dan membuka halaman privat
  if (authState === "signed-out") {
    return null;
  }

  // Pengguna sudah login
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
