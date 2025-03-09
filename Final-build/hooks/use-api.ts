"use client"

import { useState } from "react"

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Types
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE"

interface ApiOptions {
  method?: ApiMethod
  body?: any
  headers?: Record<string, string>
  requiresAuth?: boolean
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchApi = async <T>(endpoint: string, options: ApiOptions = {})
  : Promise<T> =>
  {
    const { method = "GET", body, headers = {}, requiresAuth = true } = options

    setIsLoading(true)
    setError(null)

    try {
      // Get token from localStorage if authentication is required
      if (requiresAuth) {
        const token = localStorage.getItem("token")
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }
      }

      // Set content type for JSON requests
      if (body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json"
      }

      // Make sure we don't duplicate the /api prefix
      const url = endpoint.startsWith("/api")
        ? `${API_URL}${endpoint.substring(4)}` // Remove the /api prefix if it exists
        : `${API_URL}${endpoint}`

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      return data as T
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fetchApi,
    isLoading,
    error,
  }
}

