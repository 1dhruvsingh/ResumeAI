"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Sparkles, ArrowLeft, CreditCard, Check, Shield, Loader2 } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isLoading, setIsLoading] = useState(false)
  const [formStep, setFormStep] = useState(1)

  // Form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [country, setCountry] = useState("US")

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)
  }

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setFormStep(2) // Move to confirmation step
    setIsLoading(false)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value)
    setCardExpiry(formattedValue)
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
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-[#6b46c1] text-[#6b46c1] hover:bg-[#6b46c1]/10 transition-all hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pricing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container relative py-12">
          {/* Decorative elements */}
          <div className="absolute left-1/4 top-12 text-[#6b46c1]/30">
            <Star className="h-8 w-8" />
          </div>
          <div className="absolute right-1/4 top-1/3 text-[#6b46c1]/30">
            <Sparkles className="h-10 w-10" />
          </div>

          {formStep === 1 ? (
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-5">
              {/* Checkout form */}
              <div className="md:col-span-3">
                <AnimatedSection>
                  <Card className="border-gray-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Complete your purchase</CardTitle>
                      <CardDescription>You're just a few steps away from creating professional resumes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Plan selection */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Select your plan</h3>
                          <RadioGroup
                            value={selectedPlan}
                            onValueChange={handlePlanChange}
                            className="grid gap-4 md:grid-cols-2"
                          >
                            <div>
                              <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                              <Label
                                htmlFor="monthly"
                                className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#6b46c1] peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-[#6b46c1] transition-all hover:shadow"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Monthly</span>
                                  {selectedPlan === "monthly" && <Check className="h-4 w-4 text-[#6b46c1]" />}
                                </div>
                                <div className="mt-2">
                                  <span className="text-2xl font-bold">$9.99</span>
                                  <span className="text-gray-500">/month</span>
                                </div>
                                <span className="mt-1 text-xs text-gray-500">Billed monthly</span>
                              </Label>
                            </div>

                            <div>
                              <RadioGroupItem value="annual" id="annual" className="peer sr-only" />
                              <Label
                                htmlFor="annual"
                                className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#6b46c1] peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-[#6b46c1] transition-all hover:shadow"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Annual</span>
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                      Save 17%
                                    </span>
                                  </div>
                                  {selectedPlan === "annual" && <Check className="h-4 w-4 text-[#6b46c1]" />}
                                </div>
                                <div className="mt-2">
                                  <span className="text-2xl font-bold">$99</span>
                                  <span className="text-gray-500">/year</span>
                                </div>
                                <span className="mt-1 text-xs text-gray-500">Billed annually</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator />

                        {/* Payment method */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Payment method</h3>
                          <Tabs defaultValue="card" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger
                                value="card"
                                onClick={() => setPaymentMethod("credit-card")}
                                className="data-[state=active]:bg-[#6b46c1] data-[state=active]:text-white"
                              >
                                Credit Card
                              </TabsTrigger>
                              <TabsTrigger
                                value="paypal"
                                onClick={() => setPaymentMethod("paypal")}
                                className="data-[state=active]:bg-[#6b46c1] data-[state=active]:text-white"
                              >
                                PayPal
                              </TabsTrigger>
                              <TabsTrigger
                                value="apple-pay"
                                onClick={() => setPaymentMethod("apple-pay")}
                                className="data-[state=active]:bg-[#6b46c1] data-[state=active]:text-white"
                              >
                                Apple Pay
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="card" className="mt-4 space-y-4">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="card-number">Card number</Label>
                                  <div className="relative">
                                    <Input
                                      id="card-number"
                                      placeholder="1234 5678 9012 3456"
                                      value={cardNumber}
                                      onChange={handleCardNumberChange}
                                      maxLength={19}
                                      className="pr-10 focus-visible:ring-[#6b46c1]"
                                      required
                                    />
                                    <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="card-name">Name on card</Label>
                                  <Input
                                    id="card-name"
                                    placeholder="John Doe"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="focus-visible:ring-[#6b46c1]"
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="card-expiry">Expiry date</Label>
                                    <Input
                                      id="card-expiry"
                                      placeholder="MM/YY"
                                      value={cardExpiry}
                                      onChange={handleExpiryChange}
                                      maxLength={5}
                                      className="focus-visible:ring-[#6b46c1]"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="card-cvc">CVC</Label>
                                    <Input
                                      id="card-cvc"
                                      placeholder="123"
                                      value={cardCvc}
                                      onChange={(e) => setCardCvc(e.target.value)}
                                      maxLength={3}
                                      className="focus-visible:ring-[#6b46c1]"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="paypal" className="mt-4">
                              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
                                <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M20.067 8.478c.492.88.629 1.865.629 3.06 0 3.453-2.958 6.212-6.695 6.212H9.334c-.432 0-.798-.287-.909-.695L6.57 6.295c-.113-.409.125-.834.53-.947l.023-.006h5.36c1.088 0 2.072.285 2.815.833.745.55 1.27 1.302 1.545 2.215a4.03 4.03 0 0 1 3.225-.833z"
                                    fill="#002C8A"
                                  />
                                  <path
                                    d="M20.067 8.478c.492.88.629 1.865.629 3.06 0 3.453-2.958 6.212-6.695 6.212h-2.572c-.432 0-.798-.287-.909-.695l-1.854-10.76c-.113-.409.125-.834.53-.947l.023-.006h5.36c1.088 0 2.072.285 2.815.833.745.55 1.27 1.302 1.545 2.215.492.88.629 1.865.629 3.06 0 3.453-2.958 6.212-6.695 6.212h-2.572c-.432 0-.798-.287-.909-.695l-1.854-10.76c-.113-.409.125-.834.53-.947l.023-.006h5.36c1.088 0 2.072.285 2.815.833.745.55 1.27 1.302 1.545 2.215z"
                                    fill="#0085CC"
                                  />
                                  <path
                                    d="M7.575 18.34c-.113-.409.125-.834.53-.947l.023-.006h2.572c3.737 0 6.695-2.76 6.695-6.212 0-1.195-.137-2.18-.629-3.06a4.03 4.03 0 0 0-1.545-2.215c-.743-.548-1.727-.833-2.815-.833H7.046c-.432 0-.798.287-.909.695L4.283 16.522c-.113.409.125.834.53.947l.023.006h2.572c.432 0 .798-.287.909-.695l.258-1.5c.111-.408.477-.695.909-.695h1.5c3.737 0 6.695-2.76 6.695-6.212 0-1.195-.137-2.18-.629-3.06"
                                    fill="#00186A"
                                  />
                                </svg>
                                <p className="mt-4 text-center text-sm text-gray-600">
                                  Click the button below to pay with PayPal. You'll be redirected to PayPal to complete
                                  your purchase securely.
                                </p>
                                <Button className="mt-4 bg-[#0070ba] hover:bg-[#003087] transition-all hover:scale-105">
                                  Pay with PayPal
                                </Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="apple-pay" className="mt-4">
                              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
                                <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M6.25 4C4.45507 4 3 5.45507 3 7.25V16.75C3 18.5449 4.45507 20 6.25 20H17.75C19.5449 20 21 18.5449 21 16.75V7.25C21 5.45507 19.5449 4 17.75 4H6.25Z"
                                    fill="black"
                                  />
                                  <path
                                    d="M10.5 7.5C9.2753 7.5 8.5 8.4253 8.5 9.5C8.5 9.6553 8.5 10 8.5 10C8.5 10 8.75 10 9 10C9.25 10 9.5 9.75 9.5 9.5C9.5 9 9.75 8.5 10.5 8.5C11.25 8.5 11.5 9 11.5 9.5C11.5 10 11.25 10.5 10.5 10.5C9.75 10.5 9 11.25 9 12V12.5C9 12.7761 9.22386 13 9.5 13H10.5C10.7761 13 11 12.7761 11 12.5V12C11 12 11.75 11.75 12.25 11.25C12.75 10.75 12.75 10 12.75 9.5C12.75 8.4253 11.7247 7.5 10.5 7.5Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M10 14C9.72386 14 9.5 14.2239 9.5 14.5V15.5C9.5 15.7761 9.72386 16 10 16H11C11.2761 16 11.5 15.7761 11.5 15.5V14.5C11.5 14.2239 11.2761 14 11 14H10Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M15.5 10.5C14.6716 10.5 14 11.1716 14 12C14 12.8284 14.6716 13.5 15.5 13.5C16.3284 13.5 17 12.8284 17 12C17 11.1716 16.3284 10.5 15.5 10.5Z"
                                    fill="white"
                                  />
                                </svg>
                                <p className="mt-4 text-center text-sm text-gray-600">
                                  Click the button below to pay with Apple Pay. You'll be prompted to confirm your
                                  payment with Face ID or Touch ID.
                                </p>
                                <Button className="mt-4 bg-black hover:bg-gray-800 transition-all hover:scale-105">
                                  Pay with Apple Pay
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        <Separator />

                        {/* Billing information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Billing information</h3>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email address</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="focus-visible:ring-[#6b46c1]"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                  id="first-name"
                                  placeholder="John"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="focus-visible:ring-[#6b46c1]"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                  id="last-name"
                                  placeholder="Doe"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  className="focus-visible:ring-[#6b46c1]"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger className="focus:ring-[#6b46c1]">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="US">United States</SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                  <SelectItem value="DE">Germany</SelectItem>
                                  <SelectItem value="FR">France</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <Link href="/pricing">
                            <Button variant="outline" type="button" className="transition-all hover:scale-105">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                          </Link>
                          <Button
                            type="submit"
                            className="bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>Complete Purchase</>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>

              {/* Order summary */}
              <div className="md:col-span-2">
                <AnimatedSection delay={100}>
                  <Card className="border-gray-200 shadow-lg sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Pro Plan ({selectedPlan === "monthly" ? "Monthly" : "Annual"})
                        </span>
                        <span className="font-bold">{selectedPlan === "monthly" ? "$9.99" : "$99.00"}</span>
                      </div>

                      {selectedPlan === "annual" && (
                        <div className="flex items-center justify-between text-green-600">
                          <span>Savings (17%)</span>
                          <span>-$20.88</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-center justify-between font-medium">
                        <span>Total</span>
                        <span className="text-lg font-bold text-[#6b46c1]">
                          {selectedPlan === "monthly" ? "$9.99" : "$99.00"}
                        </span>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-[#6b46c1] mt-0.5" />
                          <div>
                            <h4 className="font-medium">Secure Checkout</h4>
                            <p className="text-sm text-gray-600">
                              Your payment information is encrypted and secure. We use industry-standard security
                              measures to protect your data.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-[#6b46c1]/10 p-4">
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-[#6b46c1] mt-0.5" />
                          <div>
                            <h4 className="font-medium">14-Day Money-Back Guarantee</h4>
                            <p className="text-sm text-gray-600">
                              Not satisfied? Get a full refund within 14 days, no questions asked.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-xs text-gray-500 pt-4">
                        By completing your purchase, you agree to our{" "}
                        <Link href="/terms" className="text-[#6b46c1] hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#6b46c1] hover:underline">
                          Privacy Policy
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          ) : (
            <AnimatedSection className="mx-auto max-w-2xl">
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
                  <CardDescription>Thank you for your purchase. Your subscription is now active.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-medium">Order Details</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plan</span>
                        <span>Pro {selectedPlan === "monthly" ? "Monthly" : "Annual"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span>{selectedPlan === "monthly" ? "$9.99" : "$99.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment method</span>
                        <span>
                          {paymentMethod === "credit-card"
                            ? "Credit Card"
                            : paymentMethod === "paypal"
                              ? "PayPal"
                              : "Apple Pay"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order ID</span>
                        <span>ORD-{Math.floor(Math.random() * 1000000)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#6b46c1]/10 p-4">
                    <h3 className="font-medium">What's Next?</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#6b46c1] mt-0.5" />
                        <span>Your Pro subscription is now active</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#6b46c1] mt-0.5" />
                        <span>You have access to all premium templates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#6b46c1] mt-0.5" />
                        <span>Advanced AI features are now unlocked</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#6b46c1] mt-0.5" />
                        <span>A receipt has been sent to your email</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    className="w-full bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full transition-all hover:scale-105"
                    onClick={() => router.push("/templates")}
                  >
                    Browse Templates
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedSection>
          )}
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

