"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"
import { getProducts } from "@/data/products"

// ── Star Rating ──
function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rate) ? "text-[#FACC15]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ── Variant config per category ──
const variantConfig: Record<string, { sizes?: string[]; colors?: string[] }> = {
  "men's clothing": {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Gray"],
  },
  "women's clothing": {
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Pink", "Red", "Blue"],
  },
  "electronics": {
    sizes: ["64GB", "128GB", "256GB", "512GB"],
    colors: ["Black", "Silver", "Gold"],
  },
  "jewelery": {
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["Gold", "Silver", "Rose Gold"],
  },
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [variantError, setVariantError] = useState("")

  useEffect(() => {
    getProducts().then((products) => {
      const found = products.find((p) => p.id === Number(id))
      setProduct(found || null)

      if (found) {
        const rel = products
          .filter((p) => p.category === found.category && p.id !== found.id)
          .slice(0, 4)
        setRelated(rel)

        // Save to browsing history
        const history = JSON.parse(localStorage.getItem("browsingHistory") || "[]")
        const updated = [found.id, ...history.filter((hid: number) => hid !== found.id)].slice(0, 10)
        localStorage.setItem("browsingHistory", JSON.stringify(updated))
      }

      setLoading(false)
    })
  }, [id])

  const variants = product ? variantConfig[product.category] || {} : {}
  const hasVariants = variants.sizes || variants.colors

  const addToCart = () => {
    if (variants.sizes && !selectedSize) {
      setVariantError("Please select a size")
      return
    }
    if (variants.colors && !selectedColor) {
      setVariantError("Please select a color")
      return
    }
    setVariantError("")

    const cart = JSON.parse(localStorage.getItem("novacart") || "[]")
    const idx = cart.findIndex(
      (i: { id: number; size?: string; color?: string }) =>
        i.id === product!.id && i.size === selectedSize && i.color === selectedColor
    )

    if (idx > -1) {
      cart[idx].qty += quantity
    } else {
      cart.push({ ...product, qty: quantity, size: selectedSize, color: selectedColor })
    }

    localStorage.setItem("novacart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    setAdded(true)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      setAdded(false)
    }, 3500)
  }

  const discount = product && product.id % 3 === 0
    ? [10, 15, 20, 25, 30][product.id % 5]
    : null
  const originalPrice = product && discount
    ? parseFloat((product.price / (1 - discount / 100)).toFixed(2))
    : null

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f1f3f6] pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-white rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-gray-500 font-medium">Product not found</p>
          <Link href="/products" className="mt-4 inline-block text-[#112663] font-semibold hover:underline">
            Back to Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-24 md:pb-10">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 text-sm text-gray-400 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#112663] transition">Home</Link>
          <span>→</span>
          <Link href="/products" className="hover:text-[#112663] transition">Products</Link>
          <span>→</span>
          <Link href={`/products/category/${product.category}`} className="hover:text-[#112663] transition capitalize">
            {product.category}
          </Link>
          <span>→</span>
          <span className="text-gray-600 line-clamp-1">{product.title}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image */}
          <div className="relative w-full h-80 md:h-[450px] bg-gray-50 rounded-xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-8"
              priority
            />
            {discount && (
              <div className="absolute top-4 left-4 bg-[#FACC15] text-[#112663] text-xs font-bold px-3 py-1 rounded-full">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">

            {/* Category */}
            <span className="text-xs font-semibold text-[#112663] uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-full">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rate={product.rating.rate} />
              <span className="text-sm text-gray-500">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 py-3 border-t border-b border-gray-100">
              <span className="text-3xl font-extrabold text-[#112663]">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              {discount && (
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-4">

                {/* Size */}
                {variants.sizes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Size: {selectedSize && <span className="text-[#112663]">{selectedSize}</span>}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {variants.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            selectedSize === size
                              ? "bg-[#112663] text-white border-[#112663]"
                              : "bg-white text-gray-600 border-gray-300 hover:border-[#112663]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {variants.colors && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Color: {selectedColor && <span className="text-[#112663]">{selectedColor}</span>}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {variants.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            selectedColor === color
                              ? "bg-[#112663] text-white border-[#112663]"
                              : "bg-white text-gray-600 border-gray-300 hover:border-[#112663]"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Variant Error */}
            {variantError && (
              <p className="text-red-500 text-sm font-medium">⚠️ {variantError}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition font-bold"
                >
                  −
                </button>
                <span className="px-5 py-2 font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={addToCart}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-[#112663] text-white hover:bg-[#0F1F4D]"
                }`}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <Link
                href="/cart"
                onClick={addToCart}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-[#112663] text-[#112663] hover:bg-[#112663] hover:text-white transition text-center"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-2 pt-4 border-t border-gray-100">
              {[
                { icon: "🚚", text: "Free Delivery" },
                { icon: "↩️", text: "Easy Returns" },
                { icon: "🔒", text: "Secure Payment" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-[#112663] mb-5">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="relative h-40 bg-gray-50">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-800 font-medium line-clamp-2">{p.title}</p>
                    <p className="text-sm font-bold text-[#112663] mt-1">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Toast ── */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in">
          <span>🛍️ Added to cart!</span>
          <Link href="/cart" className="text-[#FACC15] font-semibold hover:underline">
            View Cart
          </Link>
        </div>
      )}

    </main>
  )
}