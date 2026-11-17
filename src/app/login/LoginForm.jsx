"use client";

// =========================================
// IMPORT MODULE & LIBRARY EKSTERNAL
// =========================================
import Link from "next/link";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShoppingBag,
} from "lucide-react";

// =========================================
// DATA KONSTANTA: KEUNTUNGAN / PERKS
// =========================================
const perks = [
  "Lihat riwayat transaksi kapan saja",
  "Belanja kebutuhan harian lebih cepat",
  "Pantau produk favoritmu",
];

// =========================================
// KONSTANTA STYLE: KELAS CSS INPUT TAILWIND
// =========================================
const inputClass =
  "w-full rounded-xl border border-blue-100 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

// =========================================
// KOMPONEN UTAMA: LoginForm
// =========================================
export default function LoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  remember,
  onRememberChange,
  error,
  loading,
  onSubmit,
}) {
  return (
    // =========================================
    // WRAPPER UTAMA & BACKGROUND DEKORATIF
    // =========================================
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      
      {/* Latar belakang dengan efek gradasi dan pola grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#091540] to-[#2F39A9]"
      >
        {/* Lingkaran blur dekoratif latar belakang */}
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#4F5BFF]/40 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#2F39A9]/60 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#6C7BFF]/30 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      {/* =========================================
          CONTAINER UTAMA (GRID 2 KOLOM)
          ========================================= */}
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl shadow-blue-950/40 backdrop-blur-xl lg:grid-cols-2">
        
        {/* =========================================
            KOLOM KIRI: PANEL BRANDING & PERKS
            ========================================= */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-10 text-white lg:flex">
          {/* Aksen lingkaran dekoratif di panel kiri */}
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-sky-300/20" />

          {/* Bagian Header Teks Sambutan */}
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
              <ShoppingBag size={14} />
              WARUNG BIRU
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              Selamat datang kembali!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Masuk untuk melanjutkan belanja kebutuhan harianmu dengan lebih
              mudah dan cepat.
            </p>
          </div>

          {/* Bagian Daftar Keuntungan (Perks) */}
          <ul className="relative mt-10 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="shrink-0 text-sky-200" />
                <span className="text-white/90">{perk}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* =========================================
            KOLOM KANAN: AREA FORMULIR LOGIN
            ========================================= */}
        <section className="bg-white/95 p-6 sm:p-10">
          
          {/* Judul & Ikon Form */}
          <div className="mb-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <LogIn size={22} />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-blue-950">
              Masuk ke Akun
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan email dan kata sandi kamu.
            </p>
          </div>

          {/* =========================================
              FORMULIR LOGIN UTAMA
              ========================================= */}
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            
            {/* Input Field: Email */}
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
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="nama@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Input Field: Kata Sandi */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-blue-900"
                >
                  Kata Sandi
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Masukkan kata sandi"
                  className={`${inputClass} pr-12`}
                />
                {/* Tombol Toggle Sembunyikan/Tampilkan Password */}
                <button
                  type="button"
                  onClick={onTogglePassword}
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
            </div>

            {/* Checkbox: Ingat Saya */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => onRememberChange(event.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              Ingat saya
            </label>

            {/* Menampilkan Pesan Error jika terjadi kesalahan */}
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
              >
                {error}
              </p>
            )}

            {/* Tombol Submit / Tombol Masuk */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* =========================================
              NAVIGASI KE HALAMAN PENDAFTARAN
              ========================================= */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Daftar sekarang
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}