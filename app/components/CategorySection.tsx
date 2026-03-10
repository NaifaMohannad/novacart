"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

const categoryConfig: Record<string, { image: string; color: string }> = {
  "electronics": {
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80",
    color: "from-blue-900/80 to-blue-600/60",
  },
  "jewelery": {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    color: "from-yellow-900/80 to-yellow-600/60",
  },
  "men's clothing": {
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80",
    color: "from-gray-900/80 to-gray-600/60",
  },
  "women's clothing": {
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80",
    color: "from-pink-900/80 to-pink-600/60",
  },
}

export default function CategorySection() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((r) => r.json())
      .then(setCategories)
  }, [])

  const formatName = (cat: string) =>
    cat.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return (
    <section className="w-full px-6 py-10 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#112663]">Shop by Category</h2>
            <p className="text-gray-400 text-sm mt-1">Find exactly what you're looking for</p>
          </div>
          <Link href="/products" className="text-sm font-medium text-[#112663] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const config = categoryConfig[cat] || {
              image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
              color: "from-[#112663]/80 to-[#1a3a8f]/60",
            }
            return (
              <Link
                key={cat}
                href={`/products/category/${cat}`}
                className="group relative overflow-hidden rounded-2xl cursor-pointer min-h-[160px]"
              >
                {/* Background Image */}
                <Image
                  src={config.image}
                  alt={cat}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${config.color} group-hover:opacity-80 transition-opacity duration-300`} />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm md:text-base">{formatName(cat)}</p>
                  <p className="text-white/70 text-xs mt-0.5">Shop Now →</p>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}