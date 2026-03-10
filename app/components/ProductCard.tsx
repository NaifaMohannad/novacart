"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Product } from "@/types/product"
import Link from "next/link"

type Props = {
  product: Product
}

function getDiscount(id: number) {
  const discounts = [10, 15, 20, 25, 30]
  return id % 3 === 0 ? discounts[id % discounts.length] : null
}

function getBadge(id: number): "new" | "offer" | null {
  if (id % 5 === 0) return "new"
  if (id % 3 === 0) return "offer"
  return null
}

function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rate) ? "text-[#FACC15]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product }: Props) {
  const [added, setAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastTimeout, setToastTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [wishlisted, setWishlisted] = useState(false)

  const discount = getDiscount(product.id)
  const badge = getBadge(product.id)
  const originalPrice = discount
    ? parseFloat((product.price / (1 - discount / 100)).toFixed(2))
    : null

  // ── Load wishlist state on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("novacart_wishlist") || "[]")
    setWishlisted(wishlist.some((item: any) => item.id === product.id))
  }, [product.id])

  // ── Toggle Wishlist
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const wishlist = JSON.parse(localStorage.getItem("novacart_wishlist") || "[]")
    const exists = wishlist.some((item: any) => item.id === product.id)
    const updated = exists
      ? wishlist.filter((item: any) => item.id !== product.id)
      : [...wishlist, product]
    localStorage.setItem("novacart_wishlist", JSON.stringify(updated))
    setWishlisted(!exists)
    window.dispatchEvent(new Event("wishlistUpdated"))
  }

  const addToCart = () => {
    const existing = JSON.parse(localStorage.getItem("novacart") || "[]")
    const index = existing.findIndex((item: { id: number; qty: number }) => item.id === product.id)
    if (index > -1) {
      existing[index].qty += 1
    } else {
      existing.push({ ...product, qty: 1 })
    }
    localStorage.setItem("novacart", JSON.stringify(existing))
    window.dispatchEvent(new Event("cartUpdated"))
    setAdded(true)
    setShowToast(true)
    if (toastTimeout) clearTimeout(toastTimeout)
    const t = setTimeout(() => {
      setShowToast(false)
      setAdded(false)
    }, 3500)
    setToastTimeout(t)
  }

  const undoCart = () => {
    const existing = JSON.parse(localStorage.getItem("novacart") || "[]")
    const updated = existing.filter((item: { id: number }) => item.id !== product.id)
    localStorage.setItem("novacart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cartUpdated"))
    setAdded(false)
    setShowToast(false)
  }

  return (
    <>
      {/* ── Card ── */}
      <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

        {/* Badge */}
        {badge && (
          <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
            badge === "new" ? "bg-[#112663] text-white" : "bg-[#FACC15] text-[#112663]"
          }`}>
            {badge === "new" ? "New Arrival" : "On Sale"}
          </div>
        )}

        {/* ── Wishlist Heart Button ── */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              wishlisted ? "text-red-500 fill-red-500" : "text-gray-400 fill-none"
            }`}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-48 bg-gray-50 overflow-hidden cursor-pointer">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">

          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {product.category}
          </span>

          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-[#112663] transition cursor-pointer">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <StarRating rate={product.rating.rate} />
            <span className="text-xs text-gray-400">({product.rating.count})</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-[#112663]">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            {discount && (
              <span className="text-xs font-bold text-green-600">-{discount}%</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={addToCart}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                added ? "bg-green-500 text-white" : "bg-[#112663] text-white hover:bg-[#0F1F4D]"
              }`}
            >
              {added ? "✓ Added" : "Add to Cart"}
            </button>

            <Link
              href="/cart"
              onClick={addToCart}
              className="flex-1 py-2 rounded-lg text-sm font-medium border border-[#112663] text-[#112663] hover:bg-[#112663] hover:text-white transition text-center"
            >
              Buy Now
            </Link>
          </div>

        </div>
      </div>

      {/* ── Toast Notification ── */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in">
          <span>🛍️ Added to cart!</span>
          <button onClick={undoCart} className="text-[#FACC15] font-semibold hover:underline">
            Undo
          </button>
        </div>
      )}
    </>
  )
}