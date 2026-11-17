"use client";

// =========================================
// IMPORT HOOK & LIBRARY EKSTERNAL / UTILS
// =========================================
import { ImagePlus, Pencil, RefreshCw, Trash2, X } from "lucide-react";

// =========================================
// KOMPONEN UTAMA: ProductManagementView (Presentational Component)
// =========================================
export default function ProductManagementView(viewProps) {
  // Destrukturisasi semua state, ref, dan fungsi handler yang dikirim dari parent component
  const {
    form,
    categories,
    categoriesLoading,
    categoriesError,
    products,
    productsLoading,
    productsError,
    formError,
    successMessage,
    isSubmitting,
    imagePreview,
    setImagePreview,
    setSelectedImage,
    setRefreshKey,
    editingId,
    deletingId,
    formSectionRef,
    fileInputRef,
    unitOptions,
    statusOptions,
    updateField,
    updatePrice,
    handleImageSelect,
    startEditing,
    cancelEditing,
    handleDelete,
    handleSubmit,
    formatPrice,
    formatPriceInput,
  } = viewProps;

  return (
    <div className="space-y-10">
      
      {/* =========================================
          SECTION: FORM INPUT / EDIT PRODUK
          ========================================= */}
      <section
        ref={formSectionRef}
        className="scroll-mt-24 border-y border-blue-100 bg-white px-5 py-7 sm:px-8"
      >
        {/* Header Form (Judul dinamis: Tambah atau Edit Produk) */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingId ? "Edit produk" : "Tambah produk"}
          </h2>
          {editingId && (
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100"
              type="button"
              aria-label="Batalkan edit"
              title="Batalkan edit"
              onClick={cancelEditing}
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* Form Utama */}
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          
          {/* Input: Nama Produk */}
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Nama produk
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              name="name"
              value={form.name}
              onChange={updateField}
              maxLength={160}
              required
            />
          </label>

          {/* Dropdown: Kategori Produk */}
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Kategori
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              name="category_id"
              value={form.category_id}
              onChange={updateField}
              required
              disabled={categoriesLoading || categories.length === 0}
            >
              <option value="">
                {categoriesLoading ? "Memuat kategori..." : "Pilih kategori"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {/* Textarea: Deskripsi Produk */}
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">
            Deskripsi
            <textarea
              className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              name="description"
              value={form.description}
              onChange={updateField}
              maxLength={2000}
              required
            />
          </label>

          {/* Grid Harga & Jumlah Stok */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            
            {/* Input Harga */}
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Harga
              <div className="flex items-center rounded-md border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="px-3 text-slate-500">Rp</span>
                <input
                  className="min-w-0 flex-1 rounded-r-md px-3 py-2.5 font-normal outline-none"
                  type="text"
                  inputMode="decimal"
                  aria-label="Harga dalam Rupiah"
                  value={formatPriceInput(form.price)}
                  onChange={updatePrice}
                  placeholder="Contoh: 21.211,50"
                  required
                />
              </div>
            </label>

            {/* Input Jumlah / Stok */}
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Jumlah
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={updateField}
                min="0"
                step="1"
                required
              />
            </label>
          </div>

          {/* Upload Gambar Produk */}
          <div className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">
            <span className="block">Gambar produk</span>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm font-normal text-slate-600 hover:border-blue-500 hover:bg-blue-50">
              <ImagePlus size={18} />
              <span>Pilih gambar dari bucket product-images (maks. 5 MiB)</span>
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>

            {/* Pratinjau Gambar Jika Ada */}
            {imagePreview && (
              <div className="relative mt-2 h-28 w-28">
                <img
                  src={imagePreview}
                  alt="Pratinjau gambar produk"
                  className="h-full w-full rounded-md border border-slate-200 object-cover"
                />
                <button
                  className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow"
                  type="button"
                  aria-label="Hapus gambar pilihan"
                  title="Hapus gambar pilihan"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(form.image || "");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Grid Satuan & Status Produk */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            
            {/* Dropdown Satuan */}
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Satuan
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="unit"
                value={form.unit}
                onChange={updateField}
                required
              >
                <option value="">Pilih satuan</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>

            {/* Dropdown Status */}
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Status
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="status"
                value={form.status}
                onChange={updateField}
                required
              >
                <option value="">Pilih status</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Pesan Error & Notifikasi Form */}
          {categoriesError && (
            <p className="text-sm text-red-700 md:col-span-2" role="alert">
              {categoriesError}
            </p>
          )}
          {categories.length === 0 && !categoriesLoading && !categoriesError && (
            <p className="text-sm text-slate-600 md:col-span-2">
              Belum ada kategori. Produk belum dapat ditambahkan.
            </p>
          )}
          {formError && (
            <p className="text-sm text-red-700 md:col-span-2" role="alert">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-green-700 md:col-span-2" role="status">
              {successMessage}
            </p>
          )}

          {/* Tombol Submit / Simpan */}
          <div className="md:col-span-2">
            <button
              className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={
                isSubmitting || categoriesLoading || categories.length === 0
              }
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingId
                  ? "Simpan perubahan"
                  : "Tambah produk"}
            </button>
          </div>
        </form>
      </section>

      {/* =========================================
          SECTION: DAFTAR PRODUK
          ========================================= */}
      <section aria-labelledby="product-list-heading">
        
        {/* Header Daftar Produk & Tombol Refresh */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="product-list-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Daftar produk
          </h2>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            type="button"
            aria-label="Muat ulang produk"
            title="Muat ulang produk"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={productsLoading}
          >
            <RefreshCw size={16} className={productsLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Pesan Error Produk */}
        {productsError && (
          <p className="mb-4 text-sm text-red-700" role="alert">
            {productsError}
          </p>
        )}

        {/* Kondisi Tampilan Data (Loading, Kosong, atau Grid Produk) */}
        {productsLoading ? (
          <p className="py-8 text-sm text-slate-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="py-8 text-sm text-slate-500">Belum ada produk.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => {
              const category = categories.find(
                (item) => String(item.id) === String(product.category_id)
              );
              const normalizedStatus = String(product.status ?? "")
                .toLowerCase()
                .replaceAll("_", " ");
              const isDeleting = deletingId === product.id;

              return (
                <article
                  key={product.id ?? `${product.name}-${index}`}
                  className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
                >
                  {/* Gambar Produk */}
                  <div className="h-44 bg-slate-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Gambar tidak tersedia
                      </div>
                    )}
                  </div>

                  {/* Detail Kartu Produk */}
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {category?.name ?? product.category_id}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-sm bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {statusOptions.find(
                          (status) => status.value === normalizedStatus
                        )?.label ?? product.status}
                      </span>
                    </div>

                    <p className="font-semibold text-blue-700">
                      {formatPrice(product.price)}
                      <span className="ml-1 text-sm font-normal text-slate-500">
                        / {product.unit}
                      </span>
                    </p>

                    <p className="text-sm text-slate-600">
                      Stok: {product.quantity} {product.unit}
                    </p>

                    {/* Tombol Aksi: Edit & Hapus */}
                    <div className="flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        type="button"
                        onClick={() => startEditing(product)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={isDeleting}
                      >
                        <Trash2 size={15} />
                        {isDeleting ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}