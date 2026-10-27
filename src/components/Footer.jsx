
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

const footerLinks = {
  navigasi: [
    { name: "Beranda", href: "/" },
    { name: "Kategori", href: "#kategori" },
    { name: "Produk", href: "#produk" },
    { name: "Tentang Kami", href: "#tentang" },
  ],
  kategori: [
    { name: "Pangan", href: "/shop?category=pangan" },
    { name: "Papan", href: "/shop?category=papan" },
  ],
  bantuan: [
    { name: "Cara Belanja", href: "#cara-belanja" },
    { name: "Pembayaran", href: "#pembayaran" },
    { name: "Hubungi Kami", href: "#kontak" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-blue-950 text-white">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:pt-20">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-900/40">
                <ShoppingBag size={25} className="text-white" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Warung <span className="text-blue-400">Biru.</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-200/80">
              Tempat belanja kebutuhan pangan dan perlengkapan
              rumah dengan mudah, nyaman, dan harga bersahabat.
              Bersama Warung Biru, kebutuhanmu jadi lebih mudah.
            </p>

            {/* Social Media */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-900/60 text-blue-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <span className="text-sm font-bold">ig</span>
              </a>

              <a
                href="#facebook"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-900/60 text-blue-200 transition hover:border-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <span className="text-sm font-bold">f</span>
              </a>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-white">
              Navigasi
            </h3>

            <ul className="space-y-4">
              {footerLinks.navigasi.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-blue-200/75 transition hover:text-white"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-white">
              Kategori
            </h3>

            <ul className="space-y-4">
              {footerLinks.kategori.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-blue-200/75 transition hover:text-white"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-white">
              Bantuan
            </h3>

            <ul className="space-y-4">
              {footerLinks.bantuan.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-blue-200/75 transition hover:text-white"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-blue-400/20 bg-blue-900/50 p-5 sm:grid-cols-3 sm:p-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 text-blue-300">
              <MapPin size={19} />
            </div>
            <div>
              <p className="text-xs text-blue-300">Lokasi</p>
              <p className="mt-1 text-sm font-medium text-white">
                Lokasi Warung Biru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 text-blue-300">
              <Phone size={19} />
            </div>
            <div>
              <p className="text-xs text-blue-300">Telepon</p>
              <p className="mt-1 text-sm font-medium text-white">
                Nomor kontak belum diatur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 text-blue-300">
              <Mail size={19} />
            </div>
            <div>
              <p className="text-xs text-blue-300">Email</p>
              <p className="mt-1 text-sm font-medium text-white">
                Email belum diatur
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-blue-400/20 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-blue-200/60">
            © 2026 Warung Biru. All rights reserved.
          </p>

          <a
            href="#"
            className="text-xs font-semibold text-blue-300 transition hover:text-white"
          >
            Kembali ke atas ↑
          </a>
        </div>

      </div>
    </footer>
  );
}
