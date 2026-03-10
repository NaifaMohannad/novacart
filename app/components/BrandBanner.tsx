import Image from "next/image"
import Link from "next/link"

export default function BrandBanner() {
  return (
    <section className="w-full px-6 py-6 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl min-h-[200px] md:min-h-[260px]">

          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&q=80"
            alt="Brand Banner"
            fill
            className="object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#112663]/80 to-transparent" />

          {/* Content */}
          <div className="relative px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-[#FACC15] text-[#112663] text-xs font-bold px-3 py-1 rounded-full mb-3">
                LIMITED TIME OFFER
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2">
                Up to <span className="text-[#FACC15]">40% Off</span> Premium Brands
              </h2>
              <p className="text-white/70 text-sm md:text-base">
                Exclusive deals on top-rated products. Don't miss out!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/products"
                className="px-8 py-3 bg-[#FACC15] text-[#112663] font-bold rounded-lg hover:bg-yellow-300 transition text-center"
              >
                Shop Deals
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}