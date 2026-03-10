import Link from "next/link"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Cart", href: "/cart" },
]

const categories = [
  { label: "Electronics", href: "/products/category/electronics" },
  { label: "Jewelery", href: "/products/category/jewelery" },
  { label: "Men's Fashion", href: "/products/category/men's clothing" },
  { label: "Women's Fashion", href: "/products/category/women's clothing" },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white mt-10">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-end gap-1 mb-4">
            <span className="text-2xl font-extrabold text-[#FACC15]">Nova</span>
            <span className="text-xl font-semibold text-white">Cart</span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed">
            Premium modern shopping experience with the best products and prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm mb-4 text-[#FACC15]">Quick Links</h4>

          <ul className="space-y-2 text-sm text-white/60">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-white transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-sm mb-4 text-[#FACC15]">Categories</h4>

          <ul className="space-y-2 text-sm text-white/60">
            {categories.map((category) => (
              <li key={category.label}>
                <Link
                  href={category.href}
                  className="hover:text-white transition"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-sm mb-4 text-[#FACC15]">Contact</h4>

          <ul className="space-y-2 text-sm text-white/60">
            <li>📧 support@novacart.com</li>
            <li>📞 +1 (800) 123-4567</li>
            <li>📍 New York, USA</li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-4">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">

          <span>© 2025 NovaCart. All rights reserved.</span>

          <span>Built with Next.js & Tailwind CSS</span>

        </div>

      </div>

    </footer>
  )
}