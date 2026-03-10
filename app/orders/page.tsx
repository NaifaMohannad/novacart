"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type OrderItem = {
  id: number
  title: string
  image: string
  price: number
  qty: number
}

type Order = {
  orderId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  promoCode: string | null
  paymentMethod: string
  address: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  placedAt: string
  status: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("novacart_user")
    if (!stored) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(stored))

    const savedOrders = JSON.parse(localStorage.getItem("novacart_orders") || "[]")
    setOrders(savedOrders)
  }, [])

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentLabel = (method: string) => {
    if (method === "card") return "Credit/Debit Card"
    if (method === "upi") return "UPI"
    if (method === "cod") return "Cash on Delivery"
    return method
  }

  const getStatusColor = (status: string) => {
    if (status === "Confirmed") return "bg-green-100 text-green-600"
    if (status === "Shipped") return "bg-blue-100 text-blue-600"
    if (status === "Delivered") return "bg-purple-100 text-purple-600"
    if (status === "Cancelled") return "bg-red-100 text-red-600"
    return "bg-gray-100 text-gray-600"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-sm text-[#112663] hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/profile" className="text-sm text-[#112663] hover:underline">My Profile</Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-500">My Orders</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#112663] rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#112663]">My Orders</h1>
              <p className="text-sm text-gray-400">
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="hidden sm:block text-sm font-semibold text-[#112663] border border-[#112663] px-4 py-2 rounded-lg hover:bg-[#112663] hover:text-white transition"
          >
            + Shop More
          </Link>
        </div>

        {/* ── Empty State ── */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm px-6 py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-sm text-gray-400 mb-6">
              Looks like you haven&apos;t placed any orders yet.
              <br />Start shopping and your orders will appear here!
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#112663] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#0e1f52] transition"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* ── Orders List ── */}
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Order ID</p>
                  <p className="text-sm font-bold text-[#112663]">#{order.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Placed On</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(order.placedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Total</p>
                  <p className="text-sm font-bold text-green-600">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                  className="text-sm text-[#112663] font-semibold hover:underline flex items-center gap-1"
                >
                  {expandedOrder === order.orderId ? "Hide" : "Details"}
                  <svg className={`w-4 h-4 transition-transform ${expandedOrder === order.orderId ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="px-6 py-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-50 border-2 border-white rounded-lg p-1 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-10 h-10 bg-gray-100 border-2 border-white rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {order.items.reduce((s, i) => s + i.qty, 0)} item{order.items.reduce((s, i) => s + i.qty, 0) > 1 ? "s" : ""}
                {" • "}{getPaymentLabel(order.paymentMethod)}
              </p>
            </div>

            {/* ── Expanded Details ── */}
            {expandedOrder === order.orderId && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-5 bg-gray-50">

                {/* All Items */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-400">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-sm font-bold text-[#112663] shrink-0">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Price Summary</h4>
                  <div className="bg-white rounded-xl px-4 py-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping</span>
                      <span className={order.shipping === 0 ? "text-green-500" : ""}>
                        {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Discount {order.promoCode ? `(${order.promoCode})` : ""}</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-extrabold text-[#112663] border-t border-gray-100 pt-2 mt-1">
                      <span>Total Paid</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Delivery Address</h4>
                  <div className="bg-white rounded-xl px-4 py-4">
                    <p className="text-sm font-bold text-gray-800">{order.address.fullName}</p>
                    <p className="text-sm text-gray-500 mt-1">{order.address.address}</p>
                    <p className="text-sm text-gray-500">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    <p className="text-sm text-gray-500">📞 {order.address.phone}</p>
                  </div>
                </div>

              </div>
            )}

          </div>
        ))}

        {/* Back to Profile */}
        <div className="text-center pb-6">
          <Link href="/profile" className="text-sm text-[#112663] hover:underline font-medium">
            ← Back to Profile
          </Link>
        </div>

      </div>
    </div>
  )
}