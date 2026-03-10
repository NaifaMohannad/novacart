"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type User = {
  firstName: string
  lastName: string
  email: string
  username: string
  token: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("novacart_user")
    if (!stored) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(stored)
    setUser(parsed)
    setFirstName(parsed.firstName || "")
    setLastName(parsed.lastName || "")
    setEmail(parsed.email || "")
  }, [])

  const handleSave = () => {
    if (!user) return
    const updated = { ...user, firstName, lastName, email }
    localStorage.setItem("novacart_user", JSON.stringify(updated))
    setUser(updated)
    window.dispatchEvent(new Event("userUpdated"))
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("novacart_user")
    document.cookie = "novacart_token=; path=/; max-age=0"
    window.dispatchEvent(new Event("userUpdated"))
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-sm text-[#112663] hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-500">My Profile</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Top banner */}
          <div className="bg-[#112663] px-6 py-8 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#FACC15] flex items-center justify-center text-[#112663] text-2xl font-extrabold shrink-0">
              {(firstName || user.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold capitalize">
                {firstName} {lastName}
              </h2>
              <p className="text-blue-200 text-sm">@{user.username}</p>
            </div>
          </div>

          {/* Saved success */}
          {saved && (
            <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              ✅ Profile updated successfully!
            </div>
          )}

          {/* Fields */}
          <div className="px-6 py-6 space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">First Name</label>
                {isEditing ? (
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                  />
                ) : (
                  <p className="text-sm text-gray-800 font-medium capitalize">{firstName || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Last Name</label>
                {isEditing ? (
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                  />
                ) : (
                  <p className="text-sm text-gray-800 font-medium capitalize">{lastName || "—"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email</label>
              {isEditing ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                />
              ) : (
                <p className="text-sm text-gray-800 font-medium">{email || "—"}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Username</label>
              <p className="text-sm text-gray-800 font-medium">@{user.username}</p>
              <p className="text-xs text-gray-400 mt-0.5">Username cannot be changed</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#112663] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0e1f52] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFirstName(user.firstName || "")
                      setLastName(user.lastName || "")
                      setEmail(user.email || "")
                    }}
                    className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-[#112663] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0e1f52] transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#112663]">Quick Links</h3>
          </div>
          <div className="divide-y divide-gray-100">

            <Link href="/orders" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-[#112663] transition">
                <svg className="w-4 h-4 text-[#112663] group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#112663] transition">My Orders</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>

            <Link href="/cart" className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
              <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:bg-[#FACC15] transition">
                <svg className="w-4 h-4 text-[#FACC15] group-hover:text-[#112663] transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#112663] transition">My Cart</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition group w-full"
            >
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-500 transition">
                <svg className="w-4 h-4 text-red-500 group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-500">Logout</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}