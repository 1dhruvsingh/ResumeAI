"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  googleAuth: (googleData: any) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const { fetchApi, isLoading, error } = useApi()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await fetchApi<User>("/api/user")
          setUser(userData)
        }
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem("token")
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthError(null)
      const data = await fetchApi<{ token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: { email, password },
        requiresAuth: false,
      })

      localStorage.setItem("token", data.token)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthError(null)
      const data = await fetchApi<{ token: string; user: User }>("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
        requiresAuth: false,
      })

      localStorage.setItem("token", data.token)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  const googleAuth = async (googleData: any) => {
    try {
      setAuthError(null)
      const data = await fetchApi<{ token: string; user: User }>("/api/auth/google", {
        method: "POST",
        body: {
          googleId: googleData.sub,
          email: googleData.email,
          name: googleData.name,
        },
        requiresAuth: false,
      })

      localStorage.setItem("token", data.token)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Google authentication failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const clearError = () => {
    setAuthError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: authLoading || isLoading,
        error: authError || error,
        login,
        register,
        googleAuth,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

