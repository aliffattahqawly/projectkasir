"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
  User,
  UserPlus,
} from "lucide-react";
import { createClient as createSupabaseClient } from "../../utils/supabase/client";

// =========================================
// DATA
// =========================================

const perks = [
  "Daftar gratis, tanpa biaya apa pun",
  "Simpan riwayat transaksi dengan aman",
  "Belanja kebutuhan harian jadi lebih cepat",
];

const inputClass =
  "w-full rounded-xl border border-blue-100 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

// Menghitung kekuatan kata sandi (0 - 4)
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"];
const strengthColors = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-sky-500",
  "bg-emerald-500",
];

// =========================================
// HALAMAN REGISTER
// =========================================

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseClient(), []);
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

  const strength = getPasswordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (fullName.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agree) {
      setError("Kamu harus menyetujui syarat dan ketentuan.");
      return;
    }

    setLoading(true);

    if (!supabase) {
      setError("Konfigurasi Supabase belum tersedia.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Jika verifikasi email aktif, session belum dibuat
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

      router.replace("/");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi Supabase Auth. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-4 pb-16 pt-28 sm:px-6">
      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#091540] to-[#2F39A9]"
      >
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#4F5BFF]/40 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#2F39A9]/60 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#6C7BFF]/30 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl shadow-blue-950/40 backdrop-blur-xl lg:grid-cols-2">
        {/* Panel kiri */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-10 text-white lg:flex">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-sky-300/20" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
              <ShoppingBag size={14} />
              WARUNG BIRU
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight">
              Bergabung bersama kami!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Buat akun baru dan mulai belanja kebutuhan harianmu dengan lebih
              mudah dan cepat.
            </p>
          </div>

          <ul className="relative mt-10 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="shrink-0 text-sky-200" />
                <span className="text-white/90">{perk}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <section className="bg-white/95 p-6 sm:p-10">
          <div className="mb-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <UserPlus size={22} />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-blue-950">
              Buat Akun Baru
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Isi data di bawah untuk mendaftar.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Nama lengkap */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-xs font-semibold text-blue-900"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap kamu"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-blue-900"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-blue-900"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Indikator kekuatan kata sandi */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition ${
                          i < strength ? strengthColors[strength] : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Kekuatan: {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-semibold text-blue-900"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={
                    showConfirm
                      ? "Sembunyikan konfirmasi kata sandi"
                      : "Tampilkan konfirmasi kata sandi"
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Kata sandi belum cocok.
                </p>
              )}
            </div>

            {/* Syarat & ketentuan */}
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-blue-600"
              />
              <span>
                Saya menyetujui{" "}
                <Link
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  syarat dan ketentuan
                </Link>{" "}
                yang berlaku.
              </span>
            </label>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
              >
                {error}
              </p>
            )}

            {/* Sukses */}
            {success && (
              <p
                role="status"
                className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700"
              >
                {success}
              </p>
            )}

            {/* Tombol */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Masuk di sini
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}