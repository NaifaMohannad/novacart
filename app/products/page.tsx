"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Product } from "@/types/product"
import { getProducts } from "@/data/products"
import ProductCard from "@/app/components/ProductCard"

// ── Skeleton ──
function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-8 bg-gray-200 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Filter Panel ──
function FilterPanel({
  products,
  selectedCategory,
  setSelectedCategory,
  maxPriceValue,
  setMaxPriceValue,
  minRating,
  setMinRating,
  onReset,
}: {
  products: Product[]
  selectedCategory: string
  setSelectedCategory: (v: string) => void
  maxPriceValue: number
  setMaxPriceValue: (v: number) => void
  minRating: number
  setMinRating: (v: number) => void
  onReset: () => void
}) {
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)))

  const formatCategory = (cat: string) =>
    cat.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#112663]">Filters</h3>
        <button onClick={onReset} className="text-xs text-gray-400 hover:text-red-500 transition">
          Reset All
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="category" checked={selectedCategory === "all"} onChange={() => setSelectedCategory("all")} className="accent-[#112663]" />
            <span className="text-sm text-gray-600 group-hover:text-[#112663]">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="accent-[#112663]" />
              <span className="text-sm text-gray-600 group-hover:text-[#112663]">{formatCategory(cat)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Max Price: <span className="text-[#112663] font-bold">${maxPriceValue}</span>
        </h4>
        <input
          type="range" min={0} max={maxPrice}
          value={maxPriceValue}
          onChange={(e) => setMaxPriceValue(Number(e.target.value))}
          className="w-full accent-[#112663]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span><span>${maxPrice}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="rating" checked={minRating === rating} onChange={() => setMinRating(rating)} className="accent-[#112663]" />
              <span className="text-sm text-gray-600 group-hover:text-[#112663]">
                {rating === 0 ? "All Ratings" : `${rating}★ & above`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [maxPriceValue, setMaxPriceValue] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setMaxPriceValue(Math.ceil(Math.max(...data.map((p) => p.price))))
      setLoading(false)
    })
  }, [])

  const maxPrice = products.length > 0
    ? Math.ceil(Math.max(...products.map((p) => p.price)))
    : 1000

  const resetFilters = () => {
    setSelectedCategory("all")
    setMaxPriceValue(maxPrice)
    setMinRating(0)
    setSearchQuery("")
  }

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory
    const matchPrice = p.price <= maxPriceValue
    const matchRating = p.rating.rate >= minRating
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchPrice && matchRating && matchSearch
  })

  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + (minRating > 0 ? 1 : 0)

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-24 md:pb-6">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#112663]">All Products</h1>
            <p className="text-gray-400 text-sm mt-1">
              Showing {filtered.length} of {products.length} products
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            <FilterPanel
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPriceValue={maxPriceValue}
              setMaxPriceValue={setMaxPriceValue}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={resetFilters}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <ProductsGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">😕</div>
              <p className="font-medium">No products found</p>
              <button onClick={resetFilters} className="mt-4 text-[#112663] font-semibold hover:underline text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Floating Filter Button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 bg-[#112663] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-medium text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 6h18M6 12h12M9 18h6" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-[#FACC15] text-[#112663] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#112663]">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPriceValue={maxPriceValue}
              setMaxPriceValue={setMaxPriceValue}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={resetFilters}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-6 py-3 bg-[#112663] text-white rounded-xl font-semibold hover:bg-[#0F1F4D] transition"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}

    </main>
  )
}