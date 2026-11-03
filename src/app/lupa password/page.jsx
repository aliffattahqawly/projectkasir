"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Receipt,
  Search,
  ShoppingBag,
  Wallet,
  XCircle,
} from "lucide-react";

// =========================================
// DATA RIWAYAT (contoh)
// =========================================

const orders = [
  {
    id: "TRX-0001",
    date: "2026-11-02T10:15:00",
    status: "Selesai",
    payment: "QRIS",
    items: [
      { name: "Beras Premium", qty: 1, price: 75000 },
      { name: "Minyak Goreng", qty: 2, price: 18000 },
      { name: "Telur", qty: 1, price: 28000 },
    ],
  },
  {
    id: "TRX-0002",
    date: "2026-11-01T16:40:00",
    status: "Selesai",
    payment: "Cash",
    items: [
      { name: "Mie Soto", qty: 5, price: 3500 },
      { name: "Teh", qty: 1, price: 9000 },
    ],
  },
  {
    id: "TRX-0003",
    date: "2026-10-30T09:05:00",
    status: "Diproses",
    payment: "QRIS",
    items: [
      { name: "Sunlight", qty: 2, price: 13000 },
      { name: "Kispray", qty: 1, price: 15000 },
    ],
  },
  {
    id: "TRX-0004",
    date: "2026-10-28T14:20:00",
    status: "Dibatalkan",
    payment: "Cash",
    items: [{ name: "Lakban", qty: 3, price: 10000 }],
  },
  {
    id: "TRX-0005",
    date: "2026-10-25T18:30:00",
    status: "Selesai",
    payment: "Cash",
    items: [
      { name: "Panadol", qty: 1, price: 10000 },
      { name: "Promag", qty: 1, price: 9000 },
      { name: "Paramex", qty: 2, price: 3000 },
    ],
  },
];

const tabs = ["Semua", "Selesai", "Diproses", "Dibatalkan"];

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const statusStyle = {
  Selesai: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600",
  },
  Diproses: {
    icon: Clock,
    className: "bg-amber-50 text-amber-600",
  },
  Dibatalkan: {
    icon: XCircle,
    className: "bg-red-50 text-red-500",
  },
};

const selectClass =
  "rounded-full border border-white bg-white/90 px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

// =========================================
// HELPER
// =========================================

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (iso) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const orderTotal = (order) =>
  order.items.reduce((sum, item) => sum + item.qty * item.price, 0);

// =========================================
// HALAMAN RIWAYAT
// =========================================

export default function RiwayatPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [month, setMonth] = useState("Semua");
  const [year, setYear] = useState("Semua");

  const years = useMemo(
    () =>
      [...new Set(orders.map((o) => new Date(o.date).getFullYear()))].sort(
        (a, b) => b - a
      ),
    []
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = new Date(order.date);

      const matchTab = activeTab === "Semua" || order.status === activeTab;
      const matchMonth = month === "Semua" || date.getMonth() === Number(month);
      const matchYear = year === "Semua" || date.getFullYear() === Number(year);

      const keyword = query.toLowerCase();
      const matchQuery =
        order.id.toLowerCase().includes(keyword) ||
        order.items.some((item) => item.name.toLowerCase().includes(keyword));

      return matchTab && matchMonth && matchYear && matchQuery;
    });
  }, [activeTab, month, year, query]);

  const completedOrders = orders.filter((o) => o.status === "Selesai");
  const totalSpent = completedOrders.reduce((sum, o) => sum + orderTotal(o), 0);

  const summary = [
    { icon: Receipt, label: "Total Transaksi", value: orders.length },
    {
      icon: CheckCircle2,
      label: "Transaksi Selesai",
      value: completedOrders.length,
    },
    { icon: Wallet, label: "Total Belanja", value: formatRupiah(totalSpent) },
  ];

  return (
    <main className="relative isolate min-h-screen pb-16 pt-28">
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

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Breadcrumb */}
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

        {/* Header */}
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

        {/* Ringkasan */}
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

        {/* Filter + Search */}
        <div className="mt-8 space-y-3">
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

          <div className="flex flex-col gap-3 sm:flex-row">
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

        {/* Daftar Transaksi */}
        {filteredOrders.length > 0 ? (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => {
              const { icon: StatusIcon, className } = statusStyle[order.status];
              const isOpen = openId === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-lg shadow-blue-950/20 backdrop-blur-xl"
                >
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
                      <span
                        className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:inline-flex ${className}`}
                      >
                        <StatusIcon size={13} />
                        {order.status}
                      </span>

                      <div className="text-right">
                        <p className="text-sm font-extrabold text-blue-600">
                          {formatRupiah(orderTotal(order))}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {order.items.length} produk
                        </p>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-blue-100 bg-blue-50/40 p-4 sm:p-5">
                      <span
                        className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold sm:hidden ${className}`}
                      >
                        <StatusIcon size={13} />
                        {order.status}
                      </span>

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
          <div className="mt-8 rounded-2xl border border-white bg-white/90 py-16 text-center shadow-lg backdrop-blur-xl">
            <Receipt size={40} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-blue-950">
              Transaksi tidak ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Coba ubah filter atau kata kunci pencarian.
            </p>
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