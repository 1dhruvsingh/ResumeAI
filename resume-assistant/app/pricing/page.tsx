import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Star, Sparkles, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#e6e1ff]">
      {/* Top banner */}
      <div className="w-full bg-gradient-to-r from-yellow-100 to-green-100 py-3 text-center text-sm font-medium">
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Start now with our AI-powered resume builder - 14-day money-back guarantee!
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b bg-[#e6e1ff]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#6b46c1]">ResumeAI</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/#features" className="text-sm font-medium transition-colors hover:text-[#6b46c1]">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-[#6b46c1]">
              Pricing
            </Link>
            <Link href="/templates" className="text-sm font-medium transition-colors hover:text-[#6b46c1]">
              Templates
            </Link>
            <Link href="#blog" className="text-sm font-medium transition-colors hover:text-[#6b46c1]">
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-[#6b46c1] text-[#6b46c1] hover:bg-[#6b46c1]/10">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#6b46c1] hover:bg-[#5a3aa3]">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="container relative py-12 md:py-16">
          {/* Decorative elements */}
          <div className="absolute left-1/4 top-12 text-[#6b46c1]/30">
            <Star className="h-8 w-8" />
          </div>
          <div className="absolute right-1/4 top-1/3 text-[#6b46c1]/30">
            <Sparkles className="h-10 w-10" />
          </div>

          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-[#2d2d2d] md:text-5xl">
              Simple, transparent
              <span className="relative">
                <span className="relative z-10 text-[#6b46c1]"> pricing </span>
                <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-yellow-200/70"></span>
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that's right for your career journey. All plans include our core AI resume building
              features.
            </p>
          </AnimatedSection>
        </section>

        {/* Pricing tiers */}
        <section className="container pb-16">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free tier */}
            <AnimatedSection
              delay={100}
              className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Free</h3>
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">No Credit Card</div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
                <p className="mt-2 text-sm text-gray-500">Perfect for getting started</p>
              </div>
              <Button className="mb-6 w-full bg-gray-900 hover:bg-gray-800">Get Started</Button>
              <ul className="space-y-3">
                {[
                  "3 resume credits per month",
                  "Basic AI resume builder",
                  "5 basic templates",
                  "PDF export",
                  "Basic ATS compatibility check",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Pro tier */}
            <AnimatedSection
              delay={200}
              className="group relative rounded-xl border-2 border-[#6b46c1] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6b46c1] px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#6b46c1]">Pro</h3>
                <div className="rounded-full bg-[#6b46c1]/10 px-3 py-1 text-xs font-medium text-[#6b46c1]">
                  14-day free trial
                </div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
                <p className="mt-2 text-sm text-gray-500">Billed monthly or $99/year</p>
              </div>
              <Link href="/builder-split">
                <Button className="mb-6 w-full bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md">
                  Start Free Trial
                </Button>
              </Link>
              <ul className="space-y-3">
                {[
                  "Unlimited resume credits",
                  "Advanced AI resume builder",
                  "All 20+ premium templates",
                  "PDF & DOCX export",
                  "Advanced ATS optimization",
                  "Grammar & style suggestions",
                  "Job description analyzer",
                  "LinkedIn profile optimization",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Enterprise tier */}
            <AnimatedSection
              delay={300}
              className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">Custom Solutions</div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-gray-500">/month</span>
                <p className="mt-2 text-sm text-gray-500">For teams and businesses</p>
              </div>
              <Button className="mb-6 w-full bg-gray-900 hover:bg-gray-800">Contact Sales</Button>
              <ul className="space-y-3">
                {[
                  "Everything in Pro plan",
                  "Team management dashboard",
                  "Custom branding options",
                  "API access",
                  "Dedicated account manager",
                  "Priority support",
                  "Bulk resume generation",
                  "Advanced analytics",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </section>

        {/* Feature comparison */}
        <section className="bg-white py-16">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Compare all features</h2>
              <p className="mt-4 text-gray-600">A detailed breakdown of what's included in each plan</p>
            </AnimatedSection>

            <AnimatedSection delay={100} className="mt-12 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b border-r border-gray-200 p-4 text-left font-medium text-gray-500">
                        Features
                      </th>
                      <th className="border-b border-r border-gray-200 p-4 text-left font-medium text-gray-500">
                        Free
                      </th>
                      <th className="border-b border-r border-gray-200 p-4 text-left font-medium text-[#6b46c1]">
                        Pro
                      </th>
                      <th className="border-b border-gray-200 p-4 text-left font-medium text-gray-500">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Resume Credits", free: "3 per month", pro: "Unlimited", enterprise: "Unlimited" },
                      { feature: "Templates", free: "5 basic", pro: "20+ premium", enterprise: "20+ premium + custom" },
                      { feature: "AI Resume Builder", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                      {
                        feature: "Export Formats",
                        free: "PDF only",
                        pro: "PDF, DOCX, TXT",
                        enterprise: "All formats + API",
                      },
                      {
                        feature: "ATS Optimization",
                        free: "Basic check",
                        pro: "Advanced analysis",
                        enterprise: "Advanced analysis",
                      },
                      { feature: "Grammar Check", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                      { feature: "Job Description Analyzer", free: "❌", pro: "✅", enterprise: "✅" },
                      { feature: "LinkedIn Optimization", free: "❌", pro: "✅", enterprise: "✅" },
                      { feature: "Team Management", free: "❌", pro: "❌", enterprise: "✅" },
                      { feature: "Custom Branding", free: "❌", pro: "❌", enterprise: "✅" },
                      { feature: "API Access", free: "❌", pro: "❌", enterprise: "✅" },
                      { feature: "Priority Support", free: "❌", pro: "❌", enterprise: "✅" },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="border-r border-gray-200 p-4 font-medium">{row.feature}</td>
                        <td className="border-r border-gray-200 p-4">{row.free}</td>
                        <td className="border-r border-gray-200 p-4">{row.pro}</td>
                        <td className="p-4">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ section */}
        <section className="container py-16">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-gray-600">Everything you need to know about our pricing and plans</p>
          </AnimatedSection>

          <AnimatedSection delay={100} className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "What happens after my free trial ends?",
                  answer:
                    "After your 14-day free trial ends, you'll be automatically charged for the Pro plan. You can cancel anytime before the trial ends to avoid being charged.",
                },
                {
                  question: "Can I switch between plans?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and Apple Pay. For Enterprise plans, we also offer invoice payment options.",
                },
                {
                  question: "Is there a money-back guarantee?",
                  answer:
                    "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with our service, you can request a full refund within 14 days of your purchase.",
                },
                {
                  question: "What's included in the free plan?",
                  answer:
                    "The free plan includes 3 resume credits per month, access to 5 basic templates, PDF export, and basic ATS compatibility check. It's perfect for getting started with ResumeAI.",
                },
                {
                  question: "Do I need to enter my credit card for the free plan?",
                  answer:
                    "No, you don't need to enter your credit card information to use the free plan. You can upgrade to a paid plan whenever you're ready.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left font-medium hover:text-[#6b46c1]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </section>

        {/* CTA section */}
        <section className="bg-[#6b46c1] py-16 text-white">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to build your perfect resume?</h2>
              <p className="mt-4 text-white/80">
                Start with our free plan or try Pro with a 14-day free trial. No credit card required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/builder-split">
                  <Button
                    size="lg"
                    className="bg-white text-[#6b46c1] hover:bg-white/90 transition-all hover:scale-105 hover:shadow-md group"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View All Features
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
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

