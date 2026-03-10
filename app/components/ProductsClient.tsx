"use client"

import { useState, useMemo } from "react"
import { Product } from "@/types/product"
import ProductCard from "./ProductCard"

type Props = {
  products: Product[]
}

export default function ProductsClient({ products }: Props) {
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)))

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [maxPriceValue, setMaxPriceValue] = useState(maxPrice)
  const [minRating, setMinRating] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const formatCategory = (cat: string) =>
    cat.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  // ── Instant filtering ──
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const categoryMatch = selectedCategory === "all" || p.category === selectedCategory
      const priceMatch = p.price <= maxPriceValue
      const ratingMatch = p.rating.rate >= minRating
      return categoryMatch && priceMatch && ratingMatch
    })
  }, [products, selectedCategory, maxPriceValue, minRating])

  const resetFilters = () => {
    setSelectedCategory("all")
    setMaxPriceValue(maxPrice)
    setMinRating(0)
  }

  const activeFilterCount = [
    selectedCategory !== "all",
    maxPriceValue < maxPrice,
    minRating > 0,
  ].filter(Boolean).length

  // ── Shared Filter Panel UI ──
  const FilterPanel = () => (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#112663]">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-red-400 hover:text-red-600 transition font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "all"}
              onChange={() => setSelectedCategory("all")}
              className="accent-[#112663]"
            />
            <span className="text-sm text-gray-600 group-hover:text-[#112663]">
              All Categories
            </span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="accent-[#112663]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#112663]">
                {formatCategory(cat)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Max Price:{" "}
          <span className="text-[#112663] font-bold">${maxPriceValue}</span>
        </h4>
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={maxPriceValue}
          onChange={(e) => setMaxPriceValue(Number(e.target.value))}
          className="w-full accent-[#112663]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[
            { value: 0, label: "All Ratings" },
            { value: 3, label: "3★ & above" },
            { value: 4, label: "4★ & above" },
            { value: 4.5, label: "4.5★ & above" },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={minRating === value}
                onChange={() => setMinRating(value)}
                className="accent-[#112663]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#112663]">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex gap-6">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* ── Products Area ── */}
        <div className="flex-1">

          {/* Results bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#112663]">{filtered.length}</span> products found
            </p>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center gap-2 bg-[#112663] text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 6h18M7 12h10M11 18h2" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#FACC15] text-[#112663] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">😕</p>
              <p className="text-gray-500 font-medium">No products match your filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-[#112663] text-white rounded-lg text-sm font-medium hover:bg-[#0F1F4D] transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-[#112663] text-lg">Filters</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            <div className="px-6 py-4">
              <FilterPanel />
            </div>

            {/* Done Button */}
            <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 bg-[#112663] text-white rounded-xl font-semibold hover:bg-[#0F1F4D] transition"
              >
                Show {filtered.length} Products
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}