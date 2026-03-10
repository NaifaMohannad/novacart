"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

type CartItem = Product & { qty: number; size?: string; color?: string };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("novacart") || "[]");
    setCart(data);
    setLoading(false);
  }, []);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("novacart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (index: number) => {
    const updated = [...cart];
    updated[index].qty += 1;
    saveCart(updated);
  };

  const decreaseQty = (index: number) => {
    const updated = [...cart];
    if (updated[index].qty <= 1) {
      removeItem(index);
      return;
    }
    updated[index].qty -= 1;
    saveCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const clearCart = () => saveCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f1f3f6] pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl h-28" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-24 md:pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#112663]">Shopping Cart</h1>
            <p className="text-gray-400 text-sm mt-1">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 transition font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart */
        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/products"
            className="px-8 py-3 bg-[#112663] text-white rounded-xl font-bold hover:bg-[#0F1F4D] transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
          {/* ── Cart Items ── */}
          <div className="flex-1 space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-start"
              >
                {/* Image */}
                <Link href={`/products/${item.id}`} className="shrink-0">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#112663] transition">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Variants */}
                  <div className="flex gap-3 mt-1">
                    {item.size && (
                      <span className="text-xs text-gray-400">
                        Size:{" "}
                        <span className="text-gray-600 font-medium">
                          {item.size}
                        </span>
                      </span>
                    )}
                    {item.color && (
                      <span className="text-xs text-gray-400">
                        Color:{" "}
                        <span className="text-gray-600 font-medium">
                          {item.color}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <p className="text-[#112663] font-bold mt-1">
                    ${(item.price * item.qty).toFixed(2)}
                    <span className="text-gray-400 font-normal text-xs ml-1">
                      (${item.price.toFixed(2)} each)
                    </span>
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => decreaseQty(index)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 font-semibold text-sm text-gray-800">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(index)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-400 hover:text-red-600 transition font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-[#112663] font-medium hover:underline mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Order Summary ── */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#112663] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-green-600 font-medium"
                        : "font-medium"
                    }
                  >
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span className="text-[#112663]">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full mt-6 py-3 bg-[#112663] text-white rounded-xl font-bold hover:bg-[#0F1F4D] transition text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full mt-3 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm text-center block"
              >
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                {[
                  { icon: "🔒", text: "Secure Checkout" },
                  { icon: "🚚", text: "Free shipping over $50" },
                  { icon: "↩️", text: "Easy 30-day returns" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-2 text-xs text-gray-400"
                  >
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
