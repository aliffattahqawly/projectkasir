import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  Heart,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";

// =========================================
// DATA
// =========================================

const stats = [
  { value: "5+", label: "Tahun Melayani" },
  { value: "500+", label: "Pelanggan Setia" },
  { value: "100+", label: "Pilihan Produk" },
  { value: "4.9", label: "Rating Pelanggan" },
];

const values = [
  {
    icon: BadgeCheck,
    title: "Kualitas Terjamin",
    desc: "Setiap produk kami pilih dengan teliti supaya kamu selalu mendapat barang yang segar dan layak pakai.",
  },
  {
    icon: Heart,
    title: "Harga Bersahabat",
    desc: "Kami menjaga harga tetap terjangkau tanpa mengorbankan kualitas, cocok untuk kebutuhan harian keluarga.",
  },
  {
    icon: Truck,
    title: "Layanan Cepat",
    desc: "Pesanan diproses dengan cepat dan rapi, sehingga kamu tidak perlu menunggu lama.",
  },
  {
    icon: Users,
    title: "Ramah & Terpercaya",
    desc: "Kami melayani dengan sepenuh hati, karena pelanggan adalah bagian dari keluarga kami.",
  },
];

const contacts = [
  {
    icon: MapPin,
    label: "Alamat",
    value: "Jl. Contoh No. 123, Bekasi, Jawa Barat",
  },
  {
    icon: Phone,
    label: "Telepon / WhatsApp",
    value: "0812-3456-7890",
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Setiap hari, 07.00 - 21.00 WIB",
  },
];

// =========================================
// HALAMAN TENTANG KAMI
// =========================================

export default function TentangPage() {
  return (
    <main className="relative isolate min-h-screen pb-16 pt-28">
      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#091540] to-[#2F39A9]"
      >
        {/* glow kiri atas */}
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#4F5BFF]/40 blur-[120px]" />

        {/* glow kanan tengah */}
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#2F39A9]/60 blur-[140px]" />

        {/* glow bawah */}
        <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-[#6C7BFF]/30 blur-[130px]" />

        {/* grid halus */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div
            className="
              relative overflow-hidden rounded-3xl
              bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700
              px-6 py-12 text-white sm:px-12 sm:py-16
              shadow-xl shadow-blue-600/20
            "
          >
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-sky-300/20" />
            <div className="absolute left-1/3 top-1/2 h-24 w-24 rounded-full bg-indigo-300/10" />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                <ShoppingBag size={14} />
                Tentang Kami
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Belanja kebutuhan harian jadi lebih mudah dan dekat.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                Kami hadir untuk memenuhi kebutuhan sehari-hari keluargamu,
                mulai dari bahan pokok, minuman, camilan, sampai perlengkapan
                kebersihan, dengan harga yang jujur dan pelayanan yang ramah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="mt-8 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/80 bg-white/90 p-5 text-center shadow-lg shadow-blue-950/20 backdrop-blur-xl"
            >
              <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Cerita Kami */}
      <section className="mt-12 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
          <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-white/10 text-white/50 backdrop-blur">
            {/* Ganti dengan foto toko: <img src="/images/toko.jpg" ... /> */}
            <ShoppingBag size={56} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Cerita Kami</h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-100/85">
              Berawal dari toko kecil yang melayani tetangga sekitar, kami
              tumbuh karena kepercayaan pelanggan. Kami percaya belanja
              kebutuhan harian seharusnya sederhana: barangnya lengkap, harganya
              jelas, dan pelayanannya menyenangkan.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100/85">
              Kini kami terus berkembang dengan menghadirkan pilihan produk yang
              lebih beragam dan pengalaman belanja yang lebih praktis, tanpa
              meninggalkan sentuhan ramah khas warung langganan.
            </p>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="mt-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-white">
            Kenapa Memilih Kami
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-blue-100/80">
            Komitmen kami untuk setiap pelanggan yang berbelanja.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="
                  rounded-2xl border border-white/80 bg-white/90 p-5
                  shadow-lg shadow-blue-950/20 backdrop-blur-xl
                  transition hover:-translate-y-1 hover:bg-white
                "
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="mt-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-blue-950/20 backdrop-blur-xl sm:p-10">
          <h2 className="text-2xl font-bold text-slate-800">Hubungi Kami</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ada pertanyaan atau pesanan khusus? Kami siap membantu.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="
              mt-8 inline-flex items-center gap-2
              rounded-full bg-blue-600 px-6 py-2.5
              text-sm font-medium text-white
              transition hover:bg-blue-700
            "
          >
            <ShoppingBag size={16} />
            Mulai Belanja
          </Link>
        </div>
      </section>
    </main>
  );
}