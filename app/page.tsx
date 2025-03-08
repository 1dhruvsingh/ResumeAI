import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Sparkles } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

export default function Home() {
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
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#6b46c1]">ResumeAI</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-[#6b46c1]">
              Features & Pricing
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
              <Button
                variant="outline"
                className="border-[#6b46c1] text-[#6b46c1] hover:bg-[#6b46c1]/10 transition-all hover:scale-105"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="container relative py-12 md:py-24 lg:py-32">
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

          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
            <AnimatedSection className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter text-[#2d2d2d] md:text-5xl lg:text-6xl lg:leading-[1.1]">
                Your smart
                <span className="relative">
                  <span className="relative z-10 text-[#6b46c1]"> resume </span>
                  <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-yellow-200/70"></span>
                </span>
                companion
              </h1>
              <p className="max-w-[600px] text-lg text-gray-600 sm:text-xl">
                From entry-level to executive: ResumeAI is the only AI-powered assistant that creates professional
                resumes tailored to your career goals and optimized for ATS systems.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/builder-split">
                  <Button
                    size="lg"
                    className="gap-2 bg-[#6b46c1] hover:bg-[#5a3aa3] transition-all hover:scale-105 hover:shadow-md group"
                  >
                    Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#6b46c1] text-[#6b46c1] hover:bg-[#6b46c1]/10 transition-all hover:scale-105"
                  >
                    View Templates
                  </Button>
                </Link>
              </div>
              <div className="pt-4 text-sm text-gray-500">Available on: Web, iOS, and Android</div>
            </AnimatedSection>

            <AnimatedSection delay={200} direction="left">
              <div className="relative mx-auto max-w-[300px]">
                {/* Background blob */}
                <div className="absolute -right-10 -top-10 h-[300px] w-[300px] rounded-full bg-yellow-300/30 blur-3xl"></div>

                {/* Device mockup */}
                <div className="relative z-10 overflow-hidden rounded-[2rem] border-[8px] border-gray-800 bg-white shadow-xl">
                  <div className="aspect-[9/16]">
                    {/* Mobile UI mockup */}
                    <div className="h-full w-full bg-white">
                      {/* Status bar */}
                      <div className="flex h-6 items-center justify-between bg-gray-100 px-4 text-[10px]">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                        </div>
                      </div>

                      {/* App header */}
                      <div className="border-b border-gray-200 p-3">
                        <div className="text-center text-sm font-bold text-[#6b46c1]">ResumeAI</div>
                      </div>

                      {/* App content */}
                      <div className="p-3">
                        <div className="mb-3 rounded-lg bg-[#6b46c1]/10 p-3">
                          <div className="text-xs font-medium text-[#6b46c1]">Welcome back, John!</div>
                          <div className="mt-1 text-xs text-gray-600">Continue building your resume</div>
                        </div>

                        <div className="mb-3 space-y-2">
                          <div className="text-xs font-medium">Resume Progress</div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 w-3/4 rounded-full bg-[#6b46c1]"></div>
                          </div>
                          <div className="text-xs text-gray-500">75% complete</div>
                        </div>

                        <div className="mb-3 rounded-lg border border-gray-200 p-3">
                          <div className="text-xs font-medium">AI Suggestions</div>
                          <div className="mt-1 text-xs text-gray-600">Add more skills to improve your ATS score</div>
                        </div>

                        <div className="flex gap-2">
                          <div className="h-8 w-full rounded-md bg-[#6b46c1] flex items-center justify-center">
                            <span className="text-xs text-white">Continue Editing</span>
                          </div>
                          <div className="h-8 w-full rounded-md bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">Preview</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom navigation */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 bg-white p-2">
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-[#6b46c1]"></div>
                          <span className="text-[8px] text-[#6b46c1]">Home</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                          <span className="text-[8px] text-gray-500">Templates</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                          <span className="text-[8px] text-gray-500">Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 top-0 h-6 rounded-t-2xl bg-gray-800"></div>
                </div>

                {/* Floating UI elements */}
                <div className="absolute -left-16 top-20 z-20 rounded-lg bg-white p-3 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-[#6b46c1] p-2 text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">ATS Optimized</span>
                  </div>
                </div>

                <div className="absolute -right-12 bottom-32 z-20 rounded-lg bg-white p-3 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-[#6b46c1] p-2 text-white">
                      <Star className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">AI Powered</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="bg-white py-16">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Create the perfect resume in minutes, not hours
              </h2>
              <p className="mt-4 text-gray-600">
                Our AI assistant guides you through the entire process, asking the right questions to highlight your
                strengths.
              </p>
            </AnimatedSection>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <AnimatedSection
                delay={100}
                className="rounded-xl bg-[#f8f7ff] p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-[#6b46c1]/10 p-3 w-fit">
                  <Sparkles className="h-6 w-6 text-[#6b46c1]" />
                </div>
                <h3 className="text-xl font-bold">Conversational AI</h3>
                <p className="mt-2 text-gray-600">
                  Our AI asks you questions and builds your resume based on your responses, making the process feel
                  natural.
                </p>
              </AnimatedSection>

              <AnimatedSection
                delay={200}
                className="rounded-xl bg-[#f8f7ff] p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-[#6b46c1]/10 p-3 w-fit">
                  <Star className="h-6 w-6 text-[#6b46c1]" />
                </div>
                <h3 className="text-xl font-bold">ATS Optimization</h3>
                <p className="mt-2 text-gray-600">
                  Get real-time feedback on how well your resume will perform with Applicant Tracking Systems.
                </p>
              </AnimatedSection>

              <AnimatedSection
                delay={300}
                className="rounded-xl bg-[#f8f7ff] p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-[#6b46c1]/10 p-3 w-fit">
                  <ArrowRight className="h-6 w-6 text-[#6b46c1]" />
                </div>
                <h3 className="text-xl font-bold">Professional Templates</h3>
                <p className="mt-2 text-gray-600">
                  Choose from dozens of professionally designed templates that stand out to recruiters.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-t border-gray-200 bg-[#e6e1ff] py-12">
          <div className="container">
            <AnimatedSection className="text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Trusted by job seekers worldwide
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-8 grayscale opacity-70">
                {["Forbes", "TechCrunch", "Business Insider", "CNBC", "Fast Company"].map((brand) => (
                  <div key={brand} className="flex h-8 items-center">
                    <span className="text-lg font-bold text-gray-400">{brand}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Templates section */}
        <section id="templates" className="container py-16">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Professional Resume Templates</h2>
            <p className="mt-4 text-gray-600">
              Choose from our collection of professionally designed templates that help you stand out.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Executive", style: "Classic and authoritative" },
              { name: "Modern", style: "Clean and contemporary" },
              { name: "Creative", style: "Bold and distinctive" },
            ].map((template, index) => (
              <AnimatedSection
                key={template.name}
                delay={index * 100}
                className="group relative overflow-hidden rounded-lg border transition-all hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="aspect-[8.5/11] bg-white p-4">
                  <div className="h-full w-full rounded border bg-gray-50 p-2">
                    <div className="h-1/6 w-full border-b">
                      <div className="h-4 w-1/2 rounded bg-[#6b46c1]/20"></div>
                    </div>
                    <div className="flex h-5/6">
                      <div className="h-full w-1/3 border-r p-2">
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-gray-200"></div>
                          <div className="h-3 w-4/5 rounded bg-gray-200"></div>
                          <div className="h-3 w-full rounded bg-gray-200"></div>
                        </div>
                      </div>
                      <div className="h-full w-2/3 p-2">
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-gray-200"></div>
                          <div className="h-3 w-full rounded bg-gray-200"></div>
                          <div className="h-3 w-4/5 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#6b46c1]/90 opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                  <p className="text-sm text-white/80">{template.style}</p>
                  <Button
                    className="mt-4 bg-white text-[#6b46c1] hover:bg-white/90 transition-all hover:scale-105"
                    size="sm"
                  >
                    Use Template
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-[#6b46c1] py-16 text-white">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to build your perfect resume?</h2>
              <p className="mt-4 text-white/80">
                Join thousands of job seekers who have successfully landed their dream jobs with ResumeAI.
              </p>
              <div className="mt-8">
                <Link href="/builder-split">
                  <Button
                    size="lg"
                    className="bg-white text-[#6b46c1] hover:bg-white/90 transition-all hover:scale-105 hover:shadow-md group"
                  >
                    Get Started for Free
                  </Button>
                </Link>
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

