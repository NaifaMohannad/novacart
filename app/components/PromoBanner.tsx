import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="w-full px-6 py-6 bg-[#f0f4ff]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1 - electonics */}
        <div className="relative overflow-hidden rounded-2xl min-h-[200px] group">
          <Image
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
            alt="Electronics Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-blue-300 text-xs font-medium">Hot Deals</span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Latest Electronics
            </h3>
            <p className="text-white/70 text-sm mt-1">
              Top gadgets at unbeatable prices.
            </p>
            <Link
              href="/products/category/electronics"
              className="mt-4 inline-block bg-white text-blue-900 font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>

        {/* Banner 2 - Jewelry */}
        <div className="relative overflow-hidden rounded-2xl min-h-[200px] group">
          <Image
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
            alt="Jewelry Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#112663]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-[#FACC15] text-xs font-medium">
              Exclusive Deals
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Jewelry & Accessories
            </h3>
            <p className="text-white/70 text-sm mt-1">
              Premium pieces at amazing prices.
            </p>
            <Link
              href="/products/category/jewelery"
              className="mt-4 inline-block bg-[#FACC15] text-[#112663] font-bold px-6 py-2 rounded-lg text-sm hover:bg-yellow-300 transition"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
