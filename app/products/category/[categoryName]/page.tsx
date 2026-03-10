"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProductCard from "@/app/components/ProductCard"
import Link from "next/link"
import { Product } from "@/types/product"



export default function CategoryPage() {
  const params = useParams()
  const categoryName = decodeURIComponent(params.categoryName as string)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const formatCategory = (cat: string) =>
    cat.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const filtered = data.filter((p) => p.category === categoryName)
        setProducts(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [categoryName])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f1f3f6] pb-20 md:pb-6">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="h-4 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20 md:pb-6">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/" className="hover:text-[#112663] transition">Home</Link>
            <span>→</span>
            <Link href="/products" className="hover:text-[#112663] transition">Products</Link>
            <span>→</span>
            <span className="text-gray-600">{formatCategory(categoryName)}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#112663]">
            {formatCategory(categoryName)}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} products found
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
            <Link
              href="/products"
              className="mt-4 inline-block bg-[#112663] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0e1f52] transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </main>
  )
}