"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Sparkles, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Simulate password reset process
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your password reset endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful submission
      setIsSubmitted(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#e6e1ff]">
      {/* Top banner */}
      <div className="w-full bg-gradient-to-r from-yellow-100 to-green-100 py-3 text-center text-sm font-medium">
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Start now with our AI-powered resume builder - 14-day money-back guarantee!
        </p>
      </div>

      <header className="border-b bg-[#e6e1ff]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#6b46c1]">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-[#6b46c1] text-[#6b46c1] hover:bg-[#6b46c1]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container relative flex flex-col items-center justify-center py-12 md:py-24">
          {/* Decorative elements */}
          <div className="absolute left-1/4 top-12 text-[#6b46c1]/30">
            <Star className="h-8 w-8" />
          </div>
          <div className="absolute right-1/4 top-1/3 text-[#6b46c1]/30">
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="absolute bottom-12 left-1/3 text-[#6b46c1]/30">
            <Sparkles className="h-6 w-6" />
          </div>

          <AnimatedSection className="w-full max-w-md">
            <Card className="border-gray-200 shadow-lg hover-lift">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Check your email</h3>
                      <p className="text-sm text-gray-500 mt-2">We've sent a password reset link to {email}</p>
                    </div>
                    <Button
                      className="mt-4 w-full bg-[#6b46c1] hover:bg-[#5a3aa3] button-hover"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Return to login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="focus-visible:ring-[#6b46c1]"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#6b46c1] hover:bg-[#5a3aa3] button-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-xs text-gray-500">
                  Remember your password?{" "}
                  <Link href="/login" className="text-[#6b46c1] hover:underline">
                    Back to login
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </AnimatedSection>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-[#6b46c1]">ResumeAI</span>
            <p className="text-sm text-gray-500">Build professional resumes with AI assistance.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-[#6b46c1]">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#6b46c1]">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-[#6b46c1]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

