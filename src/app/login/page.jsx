"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { createClient as createSupabaseClient } from "../../utils/supabase/client";

// =========================================
// KOMPONEN UTAMA: LoginPage (Parent Component)
// =========================================
export default function LoginPage() {
  // Inisialisasi router Next.js untuk navigasi halaman
  const router = useRouter();

  // Inisialisasi Supabase client menggunakan useMemo agar instance stabil
  const supabase = useMemo(() => createSupabaseClient(), []);

  // =========================================
  // STATE MANAGEMENT FORM LOGIN
  // =========================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // FUNGSI HANDLER: SUBMIT FORM LOGIN
  // =========================================
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // Validasi 1: Memeriksa apakah email dan password kosong
    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    // Validasi 2: Memeriksa format penulisan email menggunakan regex
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    // Validasi 3: Memeriksa panjang minimal password
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    // Validasi 4: Memeriksa apakah klien Supabase tersedia
    if (!supabase) {
      setError("Konfigurasi Supabase belum tersedia.");
      setLoading(false);
      return;
    }

    // Proses Autentikasi dengan Supabase Auth
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      // Jika terjadi kesalahan pada autentikasi (misal: salah password)
      if (authError) {
        setError(authError.message);
        return;
      }

      // Jika berhasil login, alihkan ke halaman utama dan refresh data
      router.replace("/");
      router.refresh();
    } catch {
      // Tangani error jaringan / koneksi ke Supabase
      setError("Tidak dapat menghubungi Supabase Auth. Coba lagi.");
    } finally {
      // Matikan indikator loading di akhir proses
      setLoading(false);
    }
  }

  // =========================================
  // RENDER: MENERUSKAN STATE & HANDLER KE LoginForm
  // =========================================
  return (
    <LoginForm
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword((visible) => !visible)}
      remember={remember}
      onRememberChange={setRemember}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}