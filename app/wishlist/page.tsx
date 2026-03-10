"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

type WishlistItem = {
  id: number
  title: string
  image: string
  price: number
  category: string
  rating: { rate: number; count: number }
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("novacart_wishlist") || "[]")
    setWishlist(data)
    setLoading(false)
  }, [])

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((item) => item.id !== id)
    setWishlist(updated)
    localStorage.setItem("novacart_wishlist", JSON.stringify(updated))
    window.dispatchEvent(new Event("wishlistUpdated"))
  }

  const addToCart = (item: WishlistItem) => {
    const cart = JSON.parse(localStorage.getItem("novacart") || "[]")
    const exists = cart.find((c: any) => c.id === item.id)
    if (exists) {
      exists.qty += 1
    } else {
      cart.push({ ...item, qty: 1 })
    }
    localStorage.setItem("novacart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const moveToCart = (item: WishlistItem) => {
    addToCart(item)
    removeFromWishlist(item.id)
  }

  const clearWishlist = () => {
    setWishlist([])
    localStorage.setItem("novacart_wishlist", JSON.stringify([]))
    window.dispatchEvent(new Event("wishlistUpdated"))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] py-10 px-4">
        <div className="max-w-5xl mx-auto animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl h-28" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-24 md:pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#112663]">My Wishlist</h1>
            <p className="text-gray-400 text-sm mt-1">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm text-red-400 hover:text-red-600 transition font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-[#112663] hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-500">Wishlist</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Empty State ── */}
        {wishlist.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm px-6 py-20 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-300 fill-none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-gray-400 mb-6">
              Save items you love by clicking the ❤️ on any product.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#112663] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#0e1f52] transition"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* ── Wishlist Items ── */}
        {wishlist.length > 0 && (
          <>
            {/* Move all to cart */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => wishlist.forEach((item) => moveToCart(item))}
                className="text-sm bg-[#112663] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#0e1f52] transition"
              >
                Move All to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition">

                  {/* Image */}
                  <div className="relative">
                    <Link href={`/products/${item.id}`}>
                      <div className="h-48 bg-gray-50 flex items-center justify-center p-6">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition group/btn"
                    >
                      <svg className="w-4 h-4 text-red-500 fill-red-500" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 capitalize mb-1">{item.category}</p>
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#112663] transition mb-2">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3 h-3 ${star <= Math.round(item.rating?.rate || 0) ? "text-[#FACC15] fill-[#FACC15]" : "text-gray-200 fill-gray-200"}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">({item.rating?.count || 0})</span>
                    </div>

                    <p className="text-lg font-extrabold text-[#112663] mb-4">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToCart(item)}
                        className="flex-1 bg-[#112663] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#0e1f52] transition"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 border border-[#112663] text-[#112663] py-2.5 rounded-xl text-xs font-bold hover:bg-[#112663] hover:text-white transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}