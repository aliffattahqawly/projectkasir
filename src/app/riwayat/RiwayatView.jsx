"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import Link from "next/link";
import { ChevronDown, Search, ShoppingBag } from "lucide-react";

// =========================================
// KOMPONEN UTAMA: RiwayatView (Presentational Component)
// =========================================
export default function RiwayatView(viewProps) {
  // Destrukturisasi semua props dan fungsi helper yang dikirim dari parent component (RiwayatPage)
  const {
    activeTab,
    setActiveTab,
    query,
    setQuery,
    openId,
    setOpenId,
    month,
    setMonth,
    year,
    setYear,
    years,
    filteredOrders,
    summary,
    tabs,
    monthNames,
    statusStyle,
    selectClass,
    formatRupiah,
    formatDate,
    orderTotal,
  } = viewProps;

  return (
    // =========================================
    // WRAPPER UTAMA & BACKGROUND DEKORATIF
    // =========================================
    <main className="relative isolate min-h-screen pb-16 pt-28">
      
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

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* =========================================
            BREADCRUMB NAVIGASI
            ========================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 text-blue-200 hover:text-white"
          >
            <span>⌂</span>
            <span>Home</span>
          </Link>
          <span className="text-blue-300">›</span>
          <span className="font-semibold text-white">Riwayat</span>
        </nav>

        {/* =========================================
            HEADER HALAMAN
            ========================================= */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
            TRANSACTION HISTORY
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            Riwayat Transaksi
          </h1>
          <p className="mt-2 text-sm text-blue-100/80">
            Lihat semua pesanan dan pembelian yang pernah kamu lakukan.
          </p>
        </div>

        {/* =========================================
            KARTU RINGKASAN (SUMMARY CARDS)
            ========================================= */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {summary.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-lg shadow-blue-950/20 backdrop-blur-xl"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-bold text-blue-950">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            BAGIAN FILTER STATUS & PENCARIAN
            ========================================= */}
        <div className="mt-8 space-y-3">
          
          {/* Tombol Tab Filter Status */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-white text-blue-700 shadow-md"
                    : "bg-white/10 text-blue-100 hover:bg-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Bulan, Tahun, dan Input Pencarian */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Dropdown Filter Bulan */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Pilih bulan"
              className={selectClass}
            >
              <option value="Semua">Semua Bulan</option>
              {monthNames.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>

            {/* Dropdown Filter Tahun */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="Pilih tahun"
              className={selectClass}
            >
              <option value="Semua">Semua Tahun</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Input Kotak Pencarian */}
            <div className="relative w-full sm:flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari ID atau nama produk..."
                className="w-full rounded-full border border-white bg-white/90 py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* =========================================
            DAFTAR TRANSAKSI (LIST / AKORDEON)
            ========================================= */}
        {filteredOrders.length > 0 ? (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => {
              // Mengambil ikon dan kelas gaya berdasarkan status pesanan
              const { icon: StatusIcon, className } = statusStyle[order.status];
              const isOpen = openId === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-lg shadow-blue-950/20 backdrop-blur-xl"
                >
                  {/* Tombol Header Kartu Transaksi (Untuk Buka/Tutup Detail) */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : order.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:flex">
                        <ShoppingBag size={20} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-blue-950">
                          {order.id}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {formatDate(order.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                      {/* Badge Status Pesanan (Tampil di layar besar) */}
                      <span
                        className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:inline-flex ${className}`}
                      >
                        <StatusIcon size={13} />
                        {order.status}
                      </span>

                      {/* Total Harga & Jumlah Produk */}
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-blue-600">
                          {formatRupiah(orderTotal(order))}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {order.items.length} produk
                        </p>
                      </div>

                      {/* Ikon Panah Dropdown */}
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Bagian Detail Pesanan (Muncul Jika Akordeon Dibuka) */}
                  {isOpen && (
                    <div className="border-t border-blue-100 bg-blue-50/40 p-4 sm:p-5">
                      {/* Badge Status (Khusus Tampilan Layar HP/Mobile) */}
                      <span
                        className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:hidden ${className}`}
                      >
                        <StatusIcon size={13} />
                        {order.status}
                      </span>

                      {/* Daftar Item Barang dalam Transaksi */}
                      <ul className="divide-y divide-blue-100">
                        {order.items.map((item) => (
                          <li
                            key={item.name}
                            className="flex items-center justify-between gap-3 py-2.5 text-sm"
                          >
                            <div>
                              <p className="font-medium text-slate-700">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {item.qty} x {formatRupiah(item.price)}
                              </p>
                            </div>
                            <p className="font-semibold text-slate-700">
                              {formatRupiah(item.qty * item.price)}
                            </p>
                          </li>
                        ))}
                      </ul>

                      {/* Informasi Metode Pembayaran & Total Akhir */}
                      <div className="mt-3 flex items-center justify-between border-t border-blue-100 pt-3 text-sm">
                        <span className="text-slate-500">
                          Pembayaran:{" "}
                          <b className="text-slate-700">{order.payment}</b>
                        </span>
                        <span className="font-extrabold text-blue-600">
                          Total {formatRupiah(orderTotal(order))}
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          /* =========================================
              TAMPILAN KETIKA DATA TIDAK DITEMUKAN
              ========================================= */
          <div className="mt-8 rounded-2xl border border-white bg-white/90 py-16 text-center shadow-lg backdrop-blur-xl">
            <Receipt size={40} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-blue-950">
              Transaksi tidak ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Coba ubah filter atau kata kunci pencarian.
            </p>
            {/* Tombol untuk mereset seluruh filter */}
            <button
              onClick={() => {
                setActiveTab("Semua");
                setMonth("Semua");
                setYear("Semua");
                setQuery("");
              }}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </main>
  );
}