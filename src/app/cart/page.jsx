"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../components/cart/CartProvider";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function CartPage() {
  const { cart, cartCount, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          BELANJA
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          Keranjang Belanja
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {cartCount} barang di keranjang
        </p>

        {cart.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Keranjangmu masih kosong.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Lihat produk
            </Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
            <section className="space-y-3">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl bg-slate-100 object-contain p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-slate-900">{item.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatRupiah(item.price)} / item
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Kurangi jumlah ${item.name}`}
                          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
                        >
                          <Minus size={15} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(event) => {
                            if (event.target.value !== "") {
                              updateQuantity(item.id, event.target.value);
                            }
                          }}
                          aria-label={`Jumlah ${item.name}`}
                          className="h-9 w-16 rounded-lg border border-slate-200 text-center text-sm font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 99}
                          aria-label={`Tambah jumlah ${item.name}`}
                          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <p className="font-bold text-blue-700">
                        {formatRupiah(Number(item.price || 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Ringkasan</h2>
              <div className="mt-4 flex justify-between text-sm text-slate-600">
                <span>Total barang</span>
                <span>{cartCount}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 font-bold text-slate-900">
                <span>Total harga</span>
                <span>{formatRupiah(total)}</span>
              </div>
              <Link
                href="/shop"
                className="mt-5 flex justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Lanjut belanja
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
