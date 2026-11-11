"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../ui/Footer";
import Navbar from "../ui/Navbar";
import { supabase } from "../../lib/supabase";

export default function AuthFrame({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState(
    supabase ? "checking" : "signed-out"
  );
  const isLoginPage = pathname === "/login";

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
  }, []);

  useEffect(() => {
    if (authState === "signed-out" && !isLoginPage) {
      router.replace("/login");
    } else if (authState === "signed-in" && isLoginPage) {
      router.replace("/");
    }
  }, [authState, isLoginPage, router]);

  if (isLoginPage) {
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