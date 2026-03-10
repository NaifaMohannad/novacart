"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

type CartItem = {
  id: number
  title: string
  price: number
  image: string
  qty: number
}

const PROMO_CODES: Record<string, number> = {
  NOVA10: 10,
  NOVA20: 20,
  SAVE15: 15,
  FLAT50: 50,
}

export default function CheckoutPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Address
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [addressError, setAddressError] = useState("")

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [paymentError, setPaymentError] = useState("")

  // Promo
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("novacart_user")
    if (!stored) {
      router.push("/login?redirect=/checkout")
      return
    }
    const parsedUser = JSON.parse(stored)
    setUser(parsedUser)
    setFullName(`${parsedUser.firstName || ""} ${parsedUser.lastName || ""}`.trim())

    const cartData = JSON.parse(localStorage.getItem("novacart") || "[]")
    if (cartData.length === 0) {
      router.push("/cart")
      return
    }
    setCart(cartData)
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const discountAmount = (subtotal * promoDiscount) / 100
  const total = subtotal + shipping - discountAmount

  const handleApplyPromo = () => {
    setPromoError("")
    const code = promoCode.trim().toUpperCase()
    if (!code) {
      setPromoError("Please enter a promo code.")
      return
    }
    if (PROMO_CODES[code]) {
      setPromoApplied(code)
      setPromoDiscount(PROMO_CODES[code])
      setPromoError("")
    } else {
      setPromoApplied("")
      setPromoDiscount(0)
      setPromoError("Invalid promo code. Try NOVA10, NOVA20, SAVE15 or FLAT50.")
    }
  }

  const handleRemovePromo = () => {
    setPromoCode("")
    setPromoApplied("")
    setPromoDiscount(0)
    setPromoError("")
  }

  const validateAddress = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setAddressError("Please fill in all delivery address fields.")
      return false
    }
    if (!/^\d{5,6}$/.test(pincode.trim())) {
      setAddressError("Please enter a valid pincode (5-6 digits).")
      return false
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setAddressError("Please enter a valid 10-digit phone number.")
      return false
    }
    setAddressError("")
    return true
  }

  const validatePayment = () => {
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setPaymentError("Please fill in all card details.")
        return false
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setPaymentError("Please enter a valid 16-digit card number.")
        return false
      }
    }
    setPaymentError("")
    return true
  }

  const handlePlaceOrder = () => {
    if (!validateAddress()) return
    if (!validatePayment()) return

    setLoading(true)

    // Simulate order processing
    setTimeout(() => {
      const newOrderId = `NC${Date.now().toString().slice(-8)}`
      setOrderId(newOrderId)

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("novacart_orders") || "[]")
      const newOrder = {
        orderId: newOrderId,
        items: cart,
        subtotal,
        shipping,
        discount: discountAmount,
        total,
        promoCode: promoApplied || null,
        paymentMethod,
        address: { fullName, phone, address, city, state, pincode },
        placedAt: new Date().toISOString(),
        status: "Confirmed",
      }
      existingOrders.unshift(newOrder)
      localStorage.setItem("novacart_orders", JSON.stringify(existingOrders))

      // Clear cart
      localStorage.removeItem("novacart")
      window.dispatchEvent(new Event("cartUpdated"))

      setLoading(false)
      setOrderPlaced(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 2000)
  }

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(.{4})/g, "$1 ").trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  if (!user || cart.length === 0) return null

  // ── Order Success Screen ──
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full px-8 py-10 text-center">

          {/* Success animation */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold text-[#112663] mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 text-sm mb-4">
            Your order has been confirmed and will be delivered soon.
          </p>

          <div className="bg-gray-50 rounded-xl px-5 py-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-[#112663]">#{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items</span>
              <span className="font-medium text-gray-700">{cart.reduce((s, i) => s + i.qty, 0)} items</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-700 capitalize">{paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "upi" ? "UPI" : "Cash on Delivery"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Deliver to</span>
              <span className="font-medium text-gray-700 text-right max-w-[60%]">{city}, {state} - {pincode}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full bg-[#112663] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0e1f52] transition"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-sm text-[#112663] hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/cart" className="text-sm text-[#112663] hover:underline">Cart</Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-500">Checkout</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#112663] mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── Delivery Address ── */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-bold text-[#112663] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#112663] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                Delivery Address
              </h2>

              {addressError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                  {addressError}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Full Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Phone Number</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit number"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, Street, Area"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">State</label>
                    <input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Pincode</label>
                    <input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Payment Method ── */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-bold text-[#112663] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#112663] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                Payment Method
              </h2>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                  {paymentError}
                </div>
              )}

              {/* Payment options */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { id: "card", label: "Card", icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  )},
                  { id: "upi", label: "UPI", icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  )},
                  { id: "cod", label: "Cash on Delivery", icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  )},
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition text-sm font-semibold ${
                      paymentMethod === method.id
                        ? "border-[#112663] bg-[#112663]/5 text-[#112663]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {method.icon}
                    {method.label}
                  </button>
                ))}
              </div>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Card Number</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition font-mono tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Cardholder Name</label>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Expiry Date</label>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">CVV</label>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="•••"
                        maxLength={3}
                        type="password"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI */}
              {paymentMethod === "upi" && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-4 text-sm text-blue-600">
                  <p className="font-semibold mb-1">📱 UPI Payment</p>
                  <p>You will be redirected to your UPI app after placing the order.</p>
                </div>
              )}

              {/* COD */}
              {paymentMethod === "cod" && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-4 text-sm text-yellow-700">
                  <p className="font-semibold mb-1">💵 Cash on Delivery</p>
                  <p>Pay when your order arrives at your doorstep. Extra ₹40 COD fee may apply.</p>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN — Order Summary ── */}
          <div className="space-y-5">

            {/* Promo Code */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-[#112663] mb-3">Promo Code</h3>

              {promoApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                  <div>
                    <p className="text-sm font-bold text-green-600">{promoApplied} applied!</p>
                    <p className="text-xs text-green-500">{promoDiscount}% discount</p>
                  </div>
                  <button onClick={handleRemovePromo} className="text-red-400 hover:text-red-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition uppercase"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-[#112663] text-white text-sm font-semibold rounded-lg hover:bg-[#0e1f52] transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
                  <p className="text-xs text-gray-400 mt-2">Try: NOVA10, NOVA20, SAVE15, FLAT50</p>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-[#112663] mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 font-medium line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="text-xs font-bold text-[#112663] shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-500 font-medium">
                    <span>Discount ({promoDiscount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {shipping === 0 && (
                  <p className="text-xs text-green-500">🎉 You qualify for free shipping!</p>
                )}
                <div className="flex justify-between text-base font-extrabold text-[#112663] border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-5 bg-[#FACC15] text-[#112663] py-3.5 rounded-xl text-sm font-extrabold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Place Order • ${total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Secure & encrypted checkout
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}