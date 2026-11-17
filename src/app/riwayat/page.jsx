"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { useMemo, useState } from "react";
import RiwayatView from "./RiwayatView";
import {
  CheckCircle2,
  Clock,
  Receipt,
  Wallet,
  XCircle,
} from "lucide-react";

// =========================================
// DATA KONSTANTA: DATA RIWAYAT TRANSAKSI (CONTOH)
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

// =========================================
// DATA KONSTANTA: FILTER TABS & BULAN
// =========================================
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

// =========================================
// KONSTANTA STYLE: STATUS WARNA & IKON
// =========================================
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
// FUNGSI HELPER: FORMATTING & KALKULASI
// =========================================

// Mengubah angka menjadi format mata uang Rupiah
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

// Mengubah format tanggal ISO string menjadi format baca Indonesia
const formatDate = (iso) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

// Menghitung total harga dalam satu pesanan (qty * price)
const orderTotal = (order) =>
  order.items.reduce((sum, item) => sum + item.qty * item.price, 0);

// =========================================
// KOMPONEN UTAMA: RiwayatPage (Parent Container)
// =========================================
export default function RiwayatPage() {
  // State management untuk filter, pencarian, dan dropdown akordeon detail
  const [activeTab, setActiveTab] = useState("Semua");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [month, setMonth] = useState("Semua");
  const [year, setYear] = useState("Semua");

  // Mendapatkan daftar tahun yang unik dari data pesanan secara otomatis
  const years = useMemo(
    () =>
      [...new Set(orders.map((o) => new Date(o.date).getFullYear()))].sort(
        (a, b) => b - a
      ),
    []
  );

  // Memfilter daftar pesanan berdasarkan tab status, bulan, tahun, dan kata kunci pencarian
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

  // Kalkulasi data ringkasan statistik transaksi
  const completedOrders = orders.filter((o) => o.status === "Selesai");
  const totalSpent = completedOrders.reduce((sum, o) => sum + orderTotal(o), 0);

  // Data array untuk kartu ringkasan (summary cards)
  const summary = [
    { icon: Receipt, label: "Total Transaksi", value: orders.length },
    {
      icon: CheckCircle2,
      label: "Transaksi Selesai",
      value: completedOrders.length,
    },
    { icon: Wallet, label: "Total Belanja", value: formatRupiah(totalSpent) },
  ];

  // =========================================
  // RENDER: MENERUSKAN PROPS KE RiwayatView
  // =========================================
  return (
    <RiwayatView
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      query={query}
      setQuery={setQuery}
      openId={openId}
      setOpenId={setOpenId}
      month={month}
      setMonth={setMonth}
      year={year}
      setYear={setYear}
      years={years}
      filteredOrders={filteredOrders}
      summary={summary}
      tabs={tabs}
      monthNames={monthNames}
      statusStyle={statusStyle}
      selectClass={selectClass}
      formatRupiah={formatRupiah}
      formatDate={formatDate}
      orderTotal={orderTotal}
    />
  );
}