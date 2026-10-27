
"use client";

import { useState } from "react";
import {
  ShoppingCart,
  ArrowRight,
  Package,
  Check,
  ShoppingBag,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Beras Premium 5 Kg",
    category: "pangan",
    price: 75000,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
    badge: "Terlaris",
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    category: "pangan",
    price: 36000,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800",
    badge: "Pilihan",
  },
  {
    id: 3,
    name: "Gula Pasir 1 Kg",
    category: "pangan",
    price: 18000,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=800",
    badge: "",
  },
  {
    id: 4,
    name: "Kursi Minimalis",
    category: "papan",
    price: 150000,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=800",
    badge: "Favorit",
  },
  {
    id: 5,
    name: "Lampu Meja",
    category: "papan",
    price: 85000,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    badge: "",
  },
  {
    id: 6,
    name: "Rak Penyimpanan",
    category: "papan",
    price: 125000,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800",
    badge: "Baru",
  },
];

const formatRupiah = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductSection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [addedProducts, setAddedProducts] = useState([]);

  const filteredProducts =
    activeCategory === "semua"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  const handleAddToCart = (product) => {
    if (product.stock === 0) return;

    setAddedProducts((prev) => [...prev, product.id]);

    setTimeout(() => {
      setAddedProducts((prev) =>
        prev.filter((id) => id !== product.id)
      );
    }, 1500);
  };

  const filters = [
    { id: "semua", label: "Semua Produk" },
    { id: "pangan", label: "Pangan" },
    { id: "papan", label: "Papan" },
  ];

  return (
    <section
      id="produk"
      className="w-full bg-blue-50 px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold tracking-wider text-blue-600 shadow-sm">
            PRODUK PILIHAN
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
            Produk Terbaik Untukmu
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Temukan berbagai produk pilihan untuk memenuhi
            kebutuhan sehari-hari bersama Warung Biru.
          </p>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* Category Filter */}
        <div className="mb-9 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveCategory(filter.id)}
              className={`
                rounded-full px-6 py-2.5 text-sm font-semibold
                transition duration-300
                ${
                  activeCategory === filter.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "border border-blue-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-700"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const isAdded = addedProducts.includes(product.id);
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                className="
                  group overflow-hidden rounded-3xl
                  border border-blue-100 bg-white
                  shadow-sm shadow-blue-900/5
                  transition duration-500
                  hover:-translate-y-1
                  hover:shadow-xl hover:shadow-blue-900/10
                "
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-blue-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`
                      h-full w-full object-cover
                      transition duration-700
                      group-hover:scale-105
                      ${isOutOfStock ? "opacity-50 grayscale" : ""}
                    `}
                  />

                  {/* Product Badge */}
                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Stock Status */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-950/20">
                      <span className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-lg">
                        Stok Habis
                      </span>
                    </div>
                  )}

                  {!isOutOfStock && (
                    <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-md backdrop-blur">
                      <Package size={14} />
                      Stok {product.stock}
                    </span>
                  )}
                </div>

                {/* Product Information */}
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                    {product.category === "pangan" ? "Pangan" : "Papan"}
                  </span>

                  <h3 className="mt-2 text-lg font-bold text-blue-950 transition hover:text-blue-600">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Harga produk
                      </p>
                      <p className="mt-1 text-lg font-bold text-blue-700">
                        {formatRupiah(product.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className={`
                        flex h-11 items-center justify-center gap-2
                        rounded-xl px-4 text-sm font-semibold
                        transition duration-300
                        ${
                          isOutOfStock
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : isAdded
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg"
                        }
                      `}
                    >
                      {isAdded ? (
                        <>
                          <Check size={17} />
                          Ditambahkan
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={17} />
                          Tambah
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products */}
        <div className="mt-12 text-center">
          <a
            href="/shop"
            className="
              inline-flex items-center gap-2
              rounded-full border-2 border-blue-600
              bg-white px-7 py-3
              text-sm font-bold text-blue-600
              transition duration-300
              hover:bg-blue-600 hover:text-white
            "
          >
            <ShoppingBag size={17} />
            Lihat Semua Produk
            <ArrowRight size={17} />
          </a>
        </div>

      </div>
    </section>
  );
}
