
import Link from "next/link";

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs"
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-blue-500 transition hover:text-blue-700"
        >
          <span>⌂</span>
          <span>Home</span>
        </Link>

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-blue-300">›</span>

            {item.href && index !== items.length - 1 ? (
              <Link
                href={item.href}
                className="text-blue-500 transition hover:text-blue-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-blue-800">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
