
import { ArrowRight, ShoppingBasket, House } from "lucide-react";

const categories = [
  {
    id: "pangan",
    name: "Pangan",
    subtitle: "Kebutuhan makanan dan sehari-hari",
    description:
      "Temukan berbagai kebutuhan pangan berkualitas untuk memenuhi kebutuhan harianmu.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000",
    icon: ShoppingBasket,
    button: "Jelajahi Pangan",
  },
  {
    id: "papan",
    name: "Papan",
    subtitle: "Kebutuhan rumah dan tempat tinggal",
    description:
      "Lengkapi kebutuhan rumah dan perlengkapan tempat tinggal dengan mudah.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000",
    icon: House,
    button: "Jelajahi Papan",
  },
];

export default function CategorySection() {
  return (
    <section
      id="kategori"
      className="relative w-full overflow-hidden bg-blue-50 px-5 py-16 sm:px-8 lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold tracking-wider text-blue-600 shadow-sm">
            KATEGORI WARUNG BIRU
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
            Temukan Kebutuhanmu
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Pilih kategori produk sesuai kebutuhanmu.
            Belanja lebih mudah bersama Warung Biru.
          </p>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-blue-600" />
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.id}
                className="
                  group relative min-h-[350px] overflow-hidden
                  rounded-[2rem] border border-blue-200/70
                  bg-blue-100 shadow-lg shadow-blue-900/5
                  transition duration-500
                  hover:-translate-y-1 hover:shadow-xl
                  hover:shadow-blue-900/10
                  sm:min-h-[400px]
                "
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    absolute inset-0 h-full w-full
                    object-cover transition duration-700
                    group-hover:scale-105
                  "
                />

                {/* Image Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-r
                    from-blue-950/85
                    via-blue-900/55
                    to-blue-900/10
                  "
                />

                {/* Card Content */}
                <div
                  className="
                    relative z-10 flex min-h-[350px]
                    max-w-lg flex-col items-start justify-center
                    p-7 text-white sm:min-h-[400px] sm:p-10
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      mb-5 flex h-14 w-14 items-center
                      justify-center rounded-2xl
                      border border-white/30
                      bg-blue-500/40 text-white
                      shadow-lg shadow-blue-950/20
                      backdrop-blur-xl
                    "
                  >
                    <Icon size={25} />
                  </div>

                  {/* Subtitle */}
                  <span
                    className="
                      text-xs font-semibold uppercase
                      tracking-[0.2em] text-blue-200
                    "
                  >
                    {category.subtitle}
                  </span>

                  {/* Category Name */}
                  <h3
                    className="
                      mt-3 text-4xl font-bold tracking-tight
                      sm:text-5xl
                    "
                  >
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="
                      mt-4 max-w-sm text-sm leading-7
                      text-white/85
                    "
                  >
                    {category.description}
                  </p>

                  {/* Button */}
                  <a
                    href={`/shop?category=${category.id}`}
                    className="
                      mt-7 inline-flex items-center gap-3
                      rounded-full bg-blue-600 px-6 py-3
                      text-sm font-semibold text-white
                      shadow-lg shadow-blue-950/20
                      transition duration-300
                      hover:bg-white hover:text-blue-700
                      hover:shadow-xl
                    "
                  >
                    {category.button}

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
