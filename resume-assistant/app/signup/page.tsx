"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { AnimatedSection } from "@/components/animated-section"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const acceptTerms = formData.get("terms") === "on"

    // Simple validation
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, just redirect to the builder page
      router.push("/builder-split")
    } catch (err) {
      setError("An error occurred during signup")
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
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#6b46c1] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-sm text-gray-500">Sign up to get started with ResumeAI</p>
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
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" autoComplete="name" required />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" name="terms" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#6b46c1] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#6b46c1] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

