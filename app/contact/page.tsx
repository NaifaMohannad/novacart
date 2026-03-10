"use client"

import { useState } from "react"
import Link from "next/link"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    setError("")

    if (!name) { setError("Please enter your name"); return }
    if (!email || !email.includes("@")) { setError("Please enter a valid email"); return }
    if (!subject) { setError("Please enter a subject"); return }
    if (!message || message.length < 10) { setError("Message must be at least 10 characters"); return }

    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1500)
  }

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      value: "support@novacart.com",
      subtitle: "We reply within 24 hours",
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      icon: "📞",
      title: "Call Us",
      value: "+1 (800) 123-4567",
      subtitle: "Mon–Fri, 9am–6pm EST",
      bg: "bg-green-50",
      color: "text-green-500",
    },
    {
      icon: "📍",
      title: "Visit Us",
      value: "123 Nova Street",
      subtitle: "New York, NY 10001, USA",
      bg: "bg-yellow-50",
      color: "text-yellow-500",
    },
    {
      icon: "💬",
      title: "Live Chat",
      value: "Available 24/7",
      subtitle: "Instant support anytime",
      bg: "bg-purple-50",
      color: "text-purple-500",
    },
  ]

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Standard delivery takes 3–5 business days. Express delivery is available for 1–2 business days.",
    },
    {
      q: "What is your return policy?",
      a: "We offer free returns within 30 days of purchase. Items must be in original condition.",
    },
    {
      q: "How do I track my order?",
      a: "Once your order ships, you'll receive a tracking number via email to monitor your delivery.",
    },
    {
      q: "Are my payments secure?",
      a: "Yes! We use industry-standard SSL encryption to protect all payment information.",
    },
  ]

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20 md:pb-6">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#112663] to-[#1a3a8f] py-16 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FACC15]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#FACC15] text-[#112663] text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            We'd Love to <span className="text-[#FACC15]">Hear From You</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? Our team is here to help!
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className={`w-12 h-12 ${info.bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                {info.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{info.title}</h3>
              <p className={`font-semibold text-sm ${info.color}`}>{info.value}</p>
              <p className="text-xs text-gray-400 mt-1">{info.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Form + FAQ ── */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-extrabold text-[#112663] mb-2">Send us a Message</h2>
            <p className="text-gray-400 text-sm mb-6">Fill out the form and we'll get back to you shortly.</p>

            {/* Success */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="text-green-700 font-semibold text-sm">Message sent successfully!</p>
                  <p className="text-green-500 text-xs">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-500 text-sm">⚠️ {error}</p>
              </div>
            )}

            <div className="space-y-4">

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,12 2,6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition appearance-none bg-white text-gray-700"
                  >
                    <option value="">Select a subject...</option>
                    <option value="order">Order Issue</option>
                    <option value="return">Return & Refund</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping Query</option>
                    <option value="payment">Payment Issue</option>
                    <option value="other">Other</option>
                  </select>
                  <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{message.length} characters</p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                  loading || success
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#112663] text-white hover:bg-[#0F1F4D]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </span>
                ) : success ? "✓ Message Sent!" : "Send Message"}
              </button>

            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#112663] mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-sm mb-6">Quick answers to common questions.</p>
            </div>

            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-[#112663] rounded-lg flex items-center justify-center text-[#FACC15] font-bold text-xs shrink-0 mt-0.5">
                    Q
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{faq.q}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", color: "bg-blue-600", icon: "f" },
                  { label: "Twitter", color: "bg-sky-500", icon: "t" },
                  { label: "Instagram", color: "bg-pink-500", icon: "in" },
                  { label: "YouTube", color: "bg-red-500", icon: "yt" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className={`w-10 h-10 ${s.color} text-white rounded-xl flex items-center justify-center text-xs font-bold hover:opacity-80 transition`}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}