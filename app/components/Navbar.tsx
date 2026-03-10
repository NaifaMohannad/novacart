"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  title: string
  image: string
  category: string
  price: number
}

type User = {
  firstName: string
  lastName: string
  email: string
  username: string
  token: string
}

export default function Navbar() {
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("novacart") || "[]")
      setCartCount(cart.length)
    }
    updateCart()
    window.addEventListener("cartUpdated", updateCart)
    return () => window.removeEventListener("cartUpdated", updateCart)
  }, [])

  // ── Wishlist count
  useEffect(() => {
    const updateWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("novacart_wishlist") || "[]")
      setWishlistCount(wishlist.length)
    }
    updateWishlist()
    window.addEventListener("wishlistUpdated", updateWishlist)
    return () => window.removeEventListener("wishlistUpdated", updateWishlist)
  }, [])

  // ── Auth
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("novacart_user")
      setUser(stored ? JSON.parse(stored) : null)
    }
    loadUser()
    window.addEventListener("userUpdated", loadUser)
    return () => window.removeEventListener("userUpdated", loadUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("novacart_user")
    document.cookie = "novacart_token=; path=/; max-age=0"
    setUser(null)
    setAccountOpen(false)
    window.dispatchEvent(new Event("userUpdated"))
    router.push("/")
  }

  const formatCategory = (cat: string) =>
    cat.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  const handleSearch = (query: string, isMobile = false) => {
    if (isMobile) setMobileSearchQuery(query)
    else setSearchQuery(query)
    const q = query.toLowerCase().trim()
    if (q.length < 2) { setSearchResults([]); return }
    const results = products
      .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6)
    setSearchResults(results)
  }

  const clearSearch = (isMobile = false) => {
    if (isMobile) setMobileSearchQuery("")
    else setSearchQuery("")
    setSearchResults([])
    setSearchFocused(false)
    setMobileSearchFocused(false)
  }

  const handleProductClick = (id: number, isMobile = false) => {
    clearSearch(isMobile)
    router.push(`/products/${id}`)
  }

  const handleSeeAll = (isMobile = false) => {
    const query = isMobile ? mobileSearchQuery : searchQuery
    clearSearch(isMobile)
    router.push(`/products?search=${query}`)
  }

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="w-full bg-[#112663] text-white text-sm py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            "🚚 Free Delivery on Orders Above $50",
            "🛍️ NovaCart Premium Shopping Experience",
            "🔥 10% Off Selected Products",
            "🆕 New Arrivals Added Daily",
          ].map((text, i) => (
            <span key={i} className="mx-12">{text}</span>
          ))}
          {[
            "🚚 Free Delivery on Orders Above $50",
            "🛍️ NovaCart Premium Shopping Experience",
            "🔥 10% Off Selected Products",
            "🆕 New Arrivals Added Daily",
          ].map((text, i) => (
            <span key={`dup-${i}`} className="mx-12">{text}</span>
          ))}
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header className="w-full bg-white border-b border-[#e0e8ff] px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-end gap-1 select-none shrink-0">
            <span className="text-3xl font-extrabold tracking-tight text-[#FACC15]">Nova</span>
            <span className="text-2xl font-semibold tracking-wide text-[#112663]">Cart</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link href="/" className="relative group">
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#112663] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/products" className="relative group">
              Products
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#112663] transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="relative group flex items-center gap-1 font-medium text-gray-600 hover:text-[#112663] transition"
              >
                Categories
                <svg className={`w-4 h-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#112663] transition-all duration-300 group-hover:w-full" />
              </button>
              {categoryOpen && (
                <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-xl w-52 z-50 py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/products/category/${cat}`}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#112663] hover:text-white transition"
                    >
                      {formatCategory(cat)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="relative group">
              About
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#112663] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/contact" className="relative group">
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#112663] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* ── Desktop Search Bar ── */}
          <div className="hidden md:flex relative w-full max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 300)}
              placeholder="Search products..."
              className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            {searchQuery && (
              <button onMouseDown={() => clearSearch()} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Desktop Dropdown Results */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">
                    {searchResults.length} results for "<span className="text-[#112663] font-medium">{searchQuery}</span>"
                  </p>
                </div>
                {searchResults.map((product) => (
                  <div key={product.id} onMouseDown={() => handleProductClick(product.id)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition group cursor-pointer">
                    <img src={product.image} alt={product.title} className="w-10 h-10 object-contain bg-gray-50 rounded-lg p-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium line-clamp-1 group-hover:text-[#112663] transition">{product.title}</p>
                      <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                    </div>
                    <p className="text-sm font-bold text-[#112663] shrink-0">${product.price.toFixed(2)}</p>
                  </div>
                ))}
                <div onMouseDown={() => handleSeeAll()} className="block px-3 py-2.5 text-center text-sm text-[#112663] font-semibold hover:bg-gray-50 border-t border-gray-100 transition cursor-pointer">
                  See all results for "{searchQuery}" →
                </div>
              </div>
            )}

            {/* Desktop No Results */}
            {searchFocused && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 text-center">
                <p className="text-gray-400 text-sm">No products found for "<span className="font-medium text-gray-600">{searchQuery}</span>"</p>
                <div onMouseDown={() => { clearSearch(); router.push("/products") }} className="text-xs text-[#112663] font-medium hover:underline mt-1 block cursor-pointer">
                  Browse all products →
                </div>
              </div>
            )}
          </div>

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Contact — desktop only */}
            <Link href="/contact" className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-[#112663] hover:text-white transition group">
              <svg className="w-4 h-4 text-[#112663] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3l2 5-2 2a16 16 0 006 6l2-2 5 2v3a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>

            {/* ── Wishlist — shows on BOTH mobile & desktop ── */}
            <Link href="/wishlist" className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-500 transition group">
              <svg
                className="w-4 h-4 text-gray-500 fill-none group-hover:text-white group-hover:fill-white transition"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* ── Account / Login ── */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#112663] text-white hover:bg-[#0e1f52] transition"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FACC15] text-[#112663] font-bold text-xs flex items-center justify-center shrink-0">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium hidden md:block capitalize">{user.firstName}</span>
                  <svg className={`w-3 h-3 transition-transform hidden md:block ${accountOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-[#112663] capitalize">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email || user.username}</p>
                    </div>
                    <Link href="/profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#112663] transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link href="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#112663] transition">
                      <svg className="w-4 h-4 fill-none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      My Wishlist
                    </Link>
                    <Link href="/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#112663] transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      My Orders
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-[#112663] hover:text-white transition group">
                <svg className="w-4 h-4 text-[#112663] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-[#112663] hover:text-white transition group">
              <svg className="w-5 h-5 text-[#112663] group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FACC15] text-[#112663] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </header>

      {/* ── Mobile Search Bar ── */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 px-4 py-3">
        <div className="relative w-full">
          <input
            type="text"
            value={mobileSearchQuery}
            onChange={(e) => handleSearch(e.target.value, true)}
            onFocus={() => setMobileSearchFocused(true)}
            onBlur={() => setTimeout(() => setMobileSearchFocused(false), 300)}
            placeholder="Search for products..."
            className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          {mobileSearchQuery && (
            <button onMouseDown={() => clearSearch(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Mobile Dropdown Results */}
          {mobileSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">
                  {searchResults.length} results for "<span className="text-[#112663] font-medium">{mobileSearchQuery}</span>"
                </p>
              </div>
              {searchResults.map((product) => (
                <div key={product.id} onMouseDown={() => handleProductClick(product.id, true)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition group cursor-pointer">
                  <img src={product.image} alt={product.title} className="w-10 h-10 object-contain bg-gray-50 rounded-lg p-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium line-clamp-1 group-hover:text-[#112663] transition">{product.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                  </div>
                  <p className="text-sm font-bold text-[#112663] shrink-0">${product.price.toFixed(2)}</p>
                </div>
              ))}
              <div onMouseDown={() => handleSeeAll(true)} className="block px-3 py-2.5 text-center text-sm text-[#112663] font-semibold hover:bg-gray-50 border-t border-gray-100 transition cursor-pointer">
                See all results for "{mobileSearchQuery}" →
              </div>
            </div>
          )}

          {/* Mobile No Results */}
          {mobileSearchFocused && mobileSearchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 text-center">
              <p className="text-gray-400 text-sm">No products found for "<span className="font-medium text-gray-600">{mobileSearchQuery}</span>"</p>
              <div onMouseDown={() => { clearSearch(true); router.push("/products") }} className="text-xs text-[#112663] font-medium hover:underline mt-1 block cursor-pointer">
                Browse all products →
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around py-3 z-50">

        <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-[#112663] transition text-xs gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>

        <button onClick={() => setMobileDrawerOpen(true)} className="flex flex-col items-center text-gray-500 hover:text-[#112663] transition text-xs gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Categories
        </button>

        <Link href="/cart" className="relative flex flex-col items-center text-gray-500 hover:text-[#112663] transition text-xs gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute top-0 right-4 bg-[#FACC15] text-[#112663] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          Cart
        </Link>

        {/* ── Mobile Account Tab ── */}
        <Link href={user ? "/profile" : "/login"} className="flex flex-col items-center text-gray-500 hover:text-[#112663] transition text-xs gap-1">
          {user ? (
            <span className="w-6 h-6 rounded-full bg-[#112663] text-[#FACC15] font-bold text-xs flex items-center justify-center">
              {user.firstName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          {user ? user.firstName : "Account"}
        </Link>

        <button onClick={() => setMoreMenuOpen(true)} className="flex flex-col items-center text-gray-500 hover:text-[#112663] transition text-xs gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
          More
        </button>

      </div>

      {/* ── Mobile Category Drawer ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#112663]">Categories</h3>
              <button onClick={() => setMobileDrawerOpen(false)}>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Link key={cat} href={`/products/category/${cat}`} onClick={() => setMobileDrawerOpen(false)} className="block px-4 py-3 text-sm text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-[#112663] hover:text-white transition font-medium">
                  {formatCategory(cat)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile More Menu Drawer ── */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-[#112663] mb-4">More</h3>
              <div className="space-y-1">

                <Link href="/about" onClick={() => setMoreMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-[#112663] transition">
                    <svg className="w-5 h-5 text-[#112663] group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">About Us</p>
                    <p className="text-xs text-gray-400">Our story & mission</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </Link>

                <Link href="/contact" onClick={() => setMoreMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition">
                    <svg className="w-5 h-5 text-green-500 group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3l2 5-2 2a16 16 0 006 6l2-2 5 2v3a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Contact Us</p>
                    <p className="text-xs text-gray-400">+1 (800) 123-4567</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </Link>

                <Link href="/products" onClick={() => setMoreMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:bg-[#FACC15] transition">
                    <svg className="w-5 h-5 text-[#FACC15] group-hover:text-[#112663] transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">All Products</p>
                    <p className="text-xs text-gray-400">Browse our collection</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </Link>

                {/* ── Wishlist in More drawer ── */}
                <Link href="/wishlist" onClick={() => setMoreMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-500 transition">
                    <svg className="w-5 h-5 text-red-500 group-hover:text-white transition fill-none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Wishlist</p>
                    <p className="text-xs text-gray-400">Your saved items</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </Link>

                {/* ── My Account / Logout ── */}
                {user ? (
                  <button onClick={() => { handleLogout(); setMoreMenuOpen(false) }} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group w-full text-left">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-500 transition">
                      <svg className="w-5 h-5 text-red-500 group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Logout</p>
                      <p className="text-xs text-gray-400 capitalize">Signed in as {user.firstName}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMoreMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition group">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition">
                      <svg className="w-5 h-5 text-purple-500 group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">My Account</p>
                      <p className="text-xs text-gray-400">Login or register</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                  </Link>
                )}

              </div>
              <button onClick={() => setMoreMenuOpen(false)} className="w-full mt-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-200 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}