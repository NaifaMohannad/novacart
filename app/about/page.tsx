import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "About – NovaCart",
  description: "Learn about NovaCart's story, mission and values",
}

const stats = [
  { value: "50K+", label: "Products" },
  { value: "120K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "99%", label: "Satisfaction Rate" },
]

const features = [
  {
    icon: "🚚",
    title: "Free Delivery",
    description: "Free shipping on all orders above $50. Fast and reliable delivery to your doorstep.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    description: "Your payment information is always safe with our industry-standard encryption.",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    description: "Not satisfied? Return any product within 30 days for a full refund, no questions asked.",
  },
  {
    icon: "🎧",
    title: "24/7 Support",
    description: "Our customer support team is always available to help you with any questions.",
  },
  {
    icon: "✅",
    title: "Quality Guaranteed",
    description: "Every product is carefully vetted to ensure the highest quality standards.",
  },
  {
    icon: "💰",
    title: "Best Prices",
    description: "We guarantee the best prices on all products. Find it cheaper? We'll match it.",
  },
]

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    emoji: "👨‍💼",
    bg: "from-blue-100 to-blue-200",
  },
  {
    name: "Sarah Williams",
    role: "Head of Design",
    emoji: "👩‍🎨",
    bg: "from-pink-100 to-pink-200",
  },
  {
    name: "Mike Chen",
    role: "Lead Developer",
    emoji: "👨‍💻",
    bg: "from-green-100 to-green-200",
  },
  {
    name: "Priya Patel",
    role: "Customer Success",
    emoji: "👩‍💼",
    bg: "from-yellow-100 to-yellow-200",
  },
]

const testimonials = [
  {
    name: "Emma R.",
    location: "New York, USA",
    text: "NovaCart has completely changed how I shop online. The product variety is amazing and delivery is always on time!",
    rating: 5,
    emoji: "👩",
  },
  {
    name: "James T.",
    location: "London, UK",
    text: "Best e-commerce experience I've had. The UI is clean, products are genuine and customer support is excellent.",
    rating: 5,
    emoji: "👨",
  },
  {
    name: "Aisha M.",
    location: "Dubai, UAE",
    text: "I love how easy it is to find what I need. The filter system is super helpful and checkout is seamless.",
    rating: 5,
    emoji: "👩‍🦱",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20 md:pb-6">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#112663] to-[#1a3a8f] py-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FACC15]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#FACC15] text-[#112663] text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            OUR STORY
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            We're Building the Future of
            <span className="text-[#FACC15]"> Shopping</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            NovaCart was born from a simple idea — that online shopping should be
            fast, reliable, and enjoyable for everyone, everywhere.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[#112663]">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold text-[#112663] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Who We Are
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-4 mb-5 leading-tight">
              More Than Just an Online Store
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Founded in 2024, NovaCart started as a passion project to create a
              shopping experience that puts customers first. We believe great
              products should be accessible to everyone.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              Today we serve over 120,000 customers worldwide with a curated
              selection of 50,000+ products across electronics, fashion, jewelry,
              and more — all backed by our satisfaction guarantee.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#112663] text-white font-bold rounded-xl hover:bg-[#0F1F4D] transition"
            >
              Explore Products
            </Link>
          </div>

          {/* Visual */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
              alt="NovaCart Team"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#112663]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-bold">Our Team</p>
              <p className="text-white/70 text-sm">Working hard for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="bg-[#112663] px-6 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-[#FACC15] uppercase tracking-widest">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-6 leading-tight">
            To make quality products accessible to everyone
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            We're committed to delivering exceptional shopping experiences through
            technology, transparency, and trust. Every decision we make is guided
            by what's best for our customers.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#112663]">Why Choose NovaCart?</h2>
          <p className="text-gray-400 mt-2">Everything you need for a great shopping experience</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-white border-t border-b border-gray-200 px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#112663]">Meet the Team</h2>
            <p className="text-gray-400 mt-2">The people behind NovaCart</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="text-center group"
              >
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.bg} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {member.emoji}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#112663]">What Our Customers Say</h2>
          <p className="text-gray-400 mt-2">Real reviews from real customers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-[#FACC15]">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  {t.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#112663] to-[#1a3a8f] px-8 py-12 text-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FACC15]/10 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white mb-3">
                Ready to Start Shopping?
              </h2>
              <p className="text-white/70 mb-8">
                Join 120,000+ customers who trust NovaCart
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/products"
                  className="px-8 py-3 bg-[#FACC15] text-[#112663] font-bold rounded-xl hover:bg-yellow-300 transition"
                >
                  Shop Now
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}