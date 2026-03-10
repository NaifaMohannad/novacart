"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: 1,
    tag: "New Collection 2025",
    title: "Discover Your",
    highlight: "Perfect Style",
    subtitle: "Shop the latest trends with exclusive deals and premium quality products delivered to your door.",
    cta: "Shop Now",
    ctaLink: "/products",
    secondaryCta: "View Categories",
    secondaryLink: "/products/category/women's clothing",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    stats: [
      { value: "50K+", label: "Products" },
      { value: "120K+", label: "Customers" },
      { value: "4.9★", label: "Rating" },
    ],
  },
  {
    id: 2,
    tag: "Electronics Sale",
    title: "Latest Tech at",
    highlight: "Best Prices",
    subtitle: "Explore our wide range of electronics — from smartphones to laptops, all at unbeatable prices.",
    cta: "Explore Electronics",
    ctaLink: "/products/category/electronics",
    secondaryCta: "View All",
    secondaryLink: "/products",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
    stats: [
      { value: "30%", label: "Off Today" },
      { value: "Free", label: "Delivery" },
      { value: "24/7", label: "Support" },
    ],
  },
  {
    id: 3,
    tag: "Fashion Week",
    title: "Wear What You",
    highlight: "Love Most",
    subtitle: "Trendy clothing and accessories for every occasion. Express yourself with NovaCart fashion.",
    cta: "Shop Fashion",
    ctaLink: "/products/category/women's clothing",
    secondaryCta: "Men's Fashion",
    secondaryLink: "/products/category/men's clothing",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    stats: [
      { value: "500+", label: "Styles" },
      { value: "New", label: "Arrivals" },
      { value: "Easy", label: "Returns" },
    ],
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [current])

  const goTo = (index: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }

  const slide = slides[current]

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "520px" }}>

      {/* Background Image */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}>
        <Image
          src={slide.image}
          alt={slide.highlight}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/75 via-[#112663]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* Left Content */}
        <div className={`flex-1 max-w-xl transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#FACC15] rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">{slide.tag}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            {slide.title}
            <br />
            <span className="text-[#FACC15]">{slide.highlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href={slide.ctaLink}
              className="px-8 py-3 bg-[#FACC15] text-[#112663] font-bold rounded-lg hover:bg-yellow-300 transition shadow-lg hover:-translate-y-0.5"
            >
              {slide.cta}
            </Link>
            <Link
              href={slide.secondaryLink}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition hover:-translate-y-0.5"
            >
              {slide.secondaryCta}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {slide.stats.map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-[#FACC15]">{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2.5 bg-[#FACC15]" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

    </section>
  )
}