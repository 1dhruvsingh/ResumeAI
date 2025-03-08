"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2 } from "lucide-react"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { AnimatedSection } from "@/components/animated-section"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, just redirect to the builder page
      router.push("/builder-split")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = (userData: any) => {
    console.log("Google auth success:", userData)
    // Redirect to the builder page
    router.push("/builder-split")
  }

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#e6e1ff]">
      <div className="container flex flex-1 items-center justify-center py-12">
        <AnimatedSection className="mx-auto w-full max-w-md">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="text-sm text-gray-500">
                New user?{" "}
                <Link href="/signup" className="font-medium text-[#6b46c1] hover:underline">
                  Sign up
                </Link>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-gray-500">Sign in to your account to continue</p>
            </div>

            {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            <div className="mt-6">
              <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

              <div className="mt-4 flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400">OR</span>
                <Separator className="flex-1" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-[#6b46c1] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

