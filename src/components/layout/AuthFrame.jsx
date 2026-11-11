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
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    let active = true;

    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthState(session ? "signed-in" : "signed-out");
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (active) {
        setAuthState(!error && data.session ? "signed-in" : "signed-out");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (authState === "signed-out" && !isAuthPage) {
      router.replace("/login");
    } else if (authState === "signed-in" && isAuthPage) {
      router.replace("/");
    }
  }, [authState, isAuthPage, router]);

  if (isAuthPage) {
    return authState === "signed-in" ? null : children;
  }

  if (authState !== "signed-in") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Memeriksa sesi...
      </main>
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}