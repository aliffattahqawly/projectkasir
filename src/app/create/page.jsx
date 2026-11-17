"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { useRouter } from "next/navigation";
import ProductManagementForm from "../../components/layout/ProductManagementForm";

// =========================================
// KOMPONEN UTAMA: CreateProductPage (Halaman Tambah/Kelola Produk)
// =========================================
export default function CreateProductPage() {
  // Inisialisasi router Next.js untuk perpindahan halaman
  const router = useRouter();

  // Fungsi callback yang dipanggil setelah produk berhasil disimpan (baik tambah baru maupun update)
  function handleSaved({ editing }) {
    router.push(`/shop?product=${editing ? "updated" : "created"}`);
  }

  return (
    // =========================================
    // WRAPPER UTAMA HALAMAN TAMBAH PRODUK
    // =========================================
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Halaman Tambah Produk */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            KELOLA KATALOG
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Tambah Produk
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Isi informasi produk. Setelah berhasil disimpan, kamu akan kembali
            ke halaman shop.
          </p>
        </div>

        {/* Memuat Komponen Form Manajemen Produk dengan Callback onSaved */}
        <ProductManagementForm onSaved={handleSaved} />
        
      </div>
    </main>
  );
}