"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.")
      return
    }
    setLoading(true)
    setError("")

    // ✅ Check local registered users first
    const localUsers: any[] = JSON.parse(localStorage.getItem("novacart_users") || "[]")
    const localUser = localUsers.find(
      (u) => u.username === username.trim() && u.password === password
    )

    if (localUser) {
      const loggedInUser = {
        firstName: localUser.firstName,
        lastName: localUser.lastName,
        email: localUser.email,
        username: localUser.username,
        token: `local_${Date.now()}`,
      }
      localStorage.setItem("novacart_user", JSON.stringify(loggedInUser))
      document.cookie = `novacart_token=${loggedInUser.token}; path=/; max-age=86400`
      window.dispatchEvent(new Event("userUpdated"))
      setLoading(false)
      router.push(redirect)
      return
    }

    // ✅ Fallback: try Fake Store API (for johnd etc.)
    fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          setError("Invalid username or password.")
          setLoading(false)
          return
        }
        const data = await res.json()
        const token = data.token

        // Fetch name from API users
        const usersRes = await fetch("https://fakestoreapi.com/users")
        const users = await usersRes.json()
        const apiUser = users.find((u: any) => u.username === username.trim())

        const loggedInUser = {
          firstName: apiUser?.name?.firstname || username,
          lastName: apiUser?.name?.lastname || "",
          email: apiUser?.email || "",
          username: username.trim(),
          token,
        }
        localStorage.setItem("novacart_user", JSON.stringify(loggedInUser))
        document.cookie = `novacart_token=${token}; path=/; max-age=86400`
        window.dispatchEvent(new Event("userUpdated"))
        setLoading(false)
        router.push(redirect)
      })
      .catch(() => {
        setError("Something went wrong. Please try again.")
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#112663] px-8 py-8 text-center">
            <Link href="/" className="inline-flex items-end gap-1 mb-3">
              <span className="text-3xl font-extrabold text-[#FACC15]">Nova</span>
              <span className="text-2xl font-semibold text-white">Cart</span>
            </Link>
            <p className="text-blue-200 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:border-[#112663] focus:ring-2 focus:ring-[#112663]/20 outline-none transition"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#112663] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0e1f52] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#112663] font-semibold hover:underline">
                Create Account
              </Link>
            </p>

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} NovaCart. All rights reserved.
        </p>
      </div>
    </div>
  )
}