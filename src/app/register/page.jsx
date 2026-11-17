"use client";

// =========================================
// IMPORT HOOK, LIBRARY & UTILS EKSTERNAL
// =========================================
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "./RegisterForm";
import { createClient as createSupabaseClient } from "../../utils/supabase/client";

// =========================================
// FUNGSI HELPER: MENGHITUNG KEKUATAN PASSWORD
// =========================================
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

// =========================================
// KOMPONEN UTAMA: RegisterPage (Parent Component)
// =========================================
export default function RegisterPage() {
  // Inisialisasi router Next.js untuk perpindahan halaman
  const router = useRouter();

  // Inisialisasi Supabase client dengan useMemo agar instance stabil
  const supabase = useMemo(() => createSupabaseClient(), []);

  // =========================================
  // STATE MANAGEMENT FORM REGISTRASI
  // =========================================
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Menghitung skor kekuatan password secara real-time
  const strength = getPasswordStrength(password);

  // =========================================
  // FUNGSI HANDLER: SUBMIT FORM PENDAFTARAN
  // =========================================
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi 1: Memeriksa apakah semua kolom terisi
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    // Validasi 2: Memeriksa panjang minimal nama lengkap
    if (fullName.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }

    // Validasi 3: Memeriksa format penulisan email dengan regex
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    // Validasi 4: Memeriksa panjang minimal password
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    // Validasi 5: Memeriksa kecocokan password dan konfirmasi password
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    // Validasi 6: Memeriksa persetujuan syarat & ketentuan
    if (!agree) {
      setError("Kamu harus menyetujui syarat dan ketentuan.");
      return;
    }

    setLoading(true);

    // Validasi 7: Memeriksa ketersediaan konfigurasi Supabase
    if (!supabase) {
      setError("Konfigurasi Supabase belum tersedia.");
      setLoading(false);
      return;
    }

    // Proses Pendaftaran Akun dengan Supabase Auth
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      // Jika terjadi kesalahan dari sisi Supabase Auth
      if (authError) {
        setError(authError.message);
        return;
      }

      // Jika verifikasi email diaktifkan, sesi belum dibuat secara otomatis
      if (!data.session) {
        setSuccess(
          "Pendaftaran berhasil! Cek email kamu untuk verifikasi sebelum masuk."
        );
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgree(false);
        return;
      }

      // Jika langsung otomatis masuk, arahkan ke halaman utama
      router.replace("/");
      router.refresh();
    } catch {
      // Tangani error jaringan / kendala koneksi
      setError("Tidak dapat menghubungi Supabase Auth. Coba lagi.");
    } finally {
      // Matikan indikator loading di akhir proses
      setLoading(false);
    }
  }

  // =========================================
  // RENDER: MENERUSKAN STATE & HANDLER KE RegisterForm
  // =========================================
  return (
    <RegisterForm
      fullName={fullName}
      setFullName={setFullName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirm={showConfirm}
      setShowConfirm={setShowConfirm}
      agree={agree}
      setAgree={setAgree}
      error={error}
      success={success}
      loading={loading}
      handleSubmit={handleSubmit}
      strength={strength}
    />
  );
}