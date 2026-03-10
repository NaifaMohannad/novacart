import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-6 pb-20 md:pb-0">
      <div className="text-center max-w-lg">

        {/* 404 Visual */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-extrabold text-gray-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">😕</span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#112663] mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-[#112663] text-white font-bold rounded-xl hover:bg-[#0F1F4D] transition"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-white text-[#112663] font-bold rounded-xl border border-[#112663] hover:bg-[#112663] hover:text-white transition"
          >
            Browse Products
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Electronics", href: "/products/category/electronics" },
              { label: "Fashion", href: "/products/category/men's clothing" },
              { label: "Jewelry", href: "/products/category/jewelery" },
              { label: "Cart", href: "/cart" },
              { label: "Login", href: "/login" },
              { label: "About", href: "/about" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 bg-white text-sm text-gray-600 rounded-lg border border-gray-200 hover:border-[#112663] hover:text-[#112663] transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}