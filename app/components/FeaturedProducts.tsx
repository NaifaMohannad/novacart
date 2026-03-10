"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import Link from "next/link"
import { Product } from "@/types/product"


export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(4, 10))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="w-full px-6 py-10 bg-[#f1f3f6]">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full px-6 py-12 bg-[#f1f3f6]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-[#FACC15] rounded-full" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gradient-to-r from-[#FACC15] to-yellow-400 text-[#112663] text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ Featured
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#112663]">Featured Products</h2>
              <p className="text-gray-400 text-sm mt-0.5">Handpicked deals just for you</p>
            </div>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#112663] border border-[#112663] px-4 py-2 rounded-lg hover:bg-[#112663] hover:text-white transition"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href="/products"
            className="text-sm font-semibold text-[#112663] border border-[#112663] px-6 py-2.5 rounded-lg hover:bg-[#112663] hover:text-white transition"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  )
}