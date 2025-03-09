import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Sparkles, Search, Filter, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TemplatesPage() {
  // Template categories
  const categories = ["All Templates", "Professional", "Creative", "Modern", "Simple", "Executive", "Entry-Level"]

  // Template data
  const templates = [
    {
      id: "professional-1",
      name: "Executive",
      category: "Professional",
      description: "A classic and authoritative template perfect for senior positions",
      popular: true,
      new: false,
      color: "blue",
      tags: ["Corporate", "Traditional", "ATS-Optimized"],
      content: {
        name: "John Smith",
        title: "Senior Product Manager",
        summary: "Results-driven product leader with 10+ years of experience in tech.",
        experience: [
          "Led cross-functional teams to deliver enterprise solutions",
          "Increased revenue by 35% through strategic product initiatives",
          "Managed $2M budget and resource allocation across departments",
        ],
      },
    },
    {
      id: "modern-1",
      name: "Minimalist",
      category: "Modern",
      description: "Clean and contemporary design with a focus on readability",
      popular: true,
      new: false,
      color: "gray",
      tags: ["Clean", "Minimal", "Versatile"],
      content: {
        name: "Emily Chen",
        title: "UX/UI Designer",
        summary: "Creative designer crafting intuitive digital experiences for global brands.",
        experience: [
          "Redesigned mobile app increasing user engagement by 40%",
          "Created design system used across 12 product teams",
          "Conducted user research and usability testing for key features",
        ],
      },
    },
    {
      id: "creative-1",
      name: "Vibrant",
      category: "Creative",
      description: "Bold and distinctive design for creative professionals",
      popular: false,
      new: true,
      color: "purple",
      tags: ["Creative", "Bold", "Distinctive"],
      content: {
        name: "Alex Rivera",
        title: "Creative Director",
        summary: "Award-winning creative leader with expertise in branding and campaigns.",
        experience: [
          "Directed visual identity for Fortune 500 company rebrand",
          "Led team of 15 designers across multiple creative projects",
          "Received industry recognition for innovative campaign designs",
        ],
      },
    },
    {
      id: "simple-1",
      name: "Essential",
      category: "Simple",
      description: "A straightforward and clean design that focuses on content",
      popular: false,
      new: false,
      color: "green",
      tags: ["Simple", "Clean", "ATS-Friendly"],
      content: {
        name: "Sarah Johnson",
        title: "Marketing Specialist",
        summary: "Strategic marketer with proven success in digital campaigns and analytics.",
        experience: [
          "Managed social media strategy resulting in 65% follower growth",
          "Executed email campaigns with 28% above-industry open rates",
          "Analyzed marketing data to optimize campaign performance",
        ],
      },
    },
    {
      id: "executive-1",
      name: "Leadership",
      category: "Executive",
      description: "Sophisticated design for executive and leadership positions",
      popular: false,
      new: false,
      color: "navy",
      tags: ["Executive", "Leadership", "Professional"],
      content: {
        name: "Michael Thompson",
        title: "Chief Financial Officer",
        summary: "Strategic financial executive with expertise in growth and operational efficiency.",
        experience: [
          "Led financial strategy for $100M company through 30% YoY growth",
          "Restructured operations saving $2.5M in annual costs",
          "Secured $15M in funding through investor relations initiatives",
        ],
      },
    },
    {
      id: "entry-1",
      name: "Graduate",
      category: "Entry-Level",
      description: "Perfect for recent graduates and those new to the workforce",
      popular: false,
      new: true,
      color: "teal",
      tags: ["Entry-Level", "Graduate", "First Job"],
      content: {
        name: "Jordan Taylor",
        title: "Business Administration Graduate",
        summary: "Recent graduate with strong analytical skills and internship experience.",
        experience: [
          "Completed marketing internship with demonstrated project success",
          "Managed student organization budget and event planning",
          "Developed research project analyzing industry trends",
        ],
      },
    },
    {
      id: "modern-2",
      name: "Contemporary",
      category: "Modern",
      description: "A fresh and modern approach to the traditional resume",
      popular: true,
      new: false,
      color: "indigo",
      tags: ["Modern", "Fresh", "Professional"],
      content: {
        name: "David Park",
        title: "Software Engineer",
        summary: "Full-stack developer specializing in scalable web applications and APIs.",
        experience: [
          "Developed microservices architecture for enterprise application",
          "Implemented CI/CD pipeline reducing deployment time by 40%",
          "Optimized database queries improving performance by 25%",
        ],
      },
    },
    {
      id: "creative-2",
      name: "Artisan",
      category: "Creative",
      description: "For designers and artists who want to showcase creativity",
      popular: false,
      new: false,
      color: "pink",
      tags: ["Design", "Creative", "Artistic"],
      content: {
        name: "Olivia Martinez",
        title: "Graphic Designer & Illustrator",
        summary: "Versatile designer creating compelling visual stories across mediums.",
        experience: [
          "Created illustrations for award-winning children's book series",
          "Designed brand identity for boutique retail businesses",
          "Developed custom typography for national advertising campaign",
        ],
      },
    },
    {
      id: "professional-2",
      name: "Corporate",
      category: "Professional",
      description: "Structured and professional design for corporate environments",
      popular: false,
      new: true,
      color: "gray",
      tags: ["Corporate", "Business", "Structured"],
      content: {
        name: "Robert Wilson",
        title: "Business Development Manager",
        summary: "Strategic sales professional with track record of exceeding targets.",
        experience: [
          "Expanded territory revenue by 45% within first year",
          "Negotiated key partnerships resulting in $3.2M new business",
          "Implemented CRM strategy improving lead conversion by 30%",
        ],
      },
    },
  ]

  // Get color class based on template color
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      gray: "bg-gray-100 text-gray-800",
      purple: "bg-purple-100 text-purple-800",
      green: "bg-green-100 text-green-800",
      navy: "bg-indigo-100 text-indigo-800",
      teal: "bg-teal-100 text-teal-800",
      indigo: "bg-indigo-100 text-indigo-800",
      pink: "bg-pink-100 text-pink-800",
    }
    return colorMap[color] || "bg-gray-100 text-gray-800"
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

      <header className="sticky top-0 z-40 border-b bg-[#e6e1ff]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#6b46c1]">ResumeAI</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-[#6b46c1]">
              Features & Pricing
            </Link>
            <Link href="/templates" className="text-sm font-medium text-[#6b46c1]">
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
              Professional resume
              <span className="relative">
                <span className="relative z-10 text-[#6b46c1]"> templates </span>
                <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-yellow-200/70"></span>
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose from our collection of professionally designed templates that help you stand out to employers and
              pass ATS systems.
            </p>
          </AnimatedSection>

          {/* Search and filter */}
          <AnimatedSection delay={100} className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10 bg-white border-gray-200 focus-visible:ring-[#6b46c1]"
                />
              </div>
              <Button
                variant="outline"
                className="gap-2 border-gray-200 bg-white hover:bg-gray-50 transition-all hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </AnimatedSection>
        </section>

        {/* Templates section */}
        <section className="container pb-16">
          <AnimatedSection delay={150}>
            <Tabs defaultValue="All Templates" className="w-full">
              <div className="mb-8 overflow-x-auto">
                <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-[#6b46c1] data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:shadow-md hover:scale-105"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {templates
                      .filter((template) => category === "All Templates" || template.category === category)
                      .map((template, index) => (
                        <AnimatedSection
                          key={template.id}
                          delay={index * 50}
                          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                        >
                          <div className="relative">
                            {/* Template preview */}
                            <div className="aspect-[8.5/11] bg-white p-4">
                              <div className="h-full w-full rounded border bg-gray-50 p-2">
                                {/* Header with name and title */}
                                <div className="h-1/6 w-full border-b p-2">
                                  <div className="text-center">
                                    <div
                                      className={`text-sm font-bold ${
                                        template.color === "purple"
                                          ? "text-purple-700"
                                          : template.color === "blue"
                                            ? "text-blue-700"
                                            : template.color === "green"
                                              ? "text-green-700"
                                              : template.color === "navy"
                                                ? "text-indigo-700"
                                                : template.color === "teal"
                                                  ? "text-teal-700"
                                                  : template.color === "indigo"
                                                    ? "text-indigo-700"
                                                    : template.color === "pink"
                                                      ? "text-pink-700"
                                                      : "text-gray-700"
                                      }`}
                                    >
                                      {template.content.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{template.content.title}</div>
                                  </div>
                                </div>
                                <div className="flex h-5/6">
                                  {/* Left sidebar */}
                                  <div className="h-full w-1/3 border-r p-2">
                                    <div className="space-y-2">
                                      <div className="text-xs font-semibold">SKILLS</div>
                                      <div className="h-1 w-full rounded bg-gray-200"></div>
                                      <div className="space-y-1">
                                        <div className="h-2 w-full rounded bg-gray-200"></div>
                                        <div className="h-2 w-4/5 rounded bg-gray-200"></div>
                                        <div className="h-2 w-full rounded bg-gray-200"></div>
                                      </div>

                                      <div className="pt-2 text-xs font-semibold">EDUCATION</div>
                                      <div className="h-1 w-full rounded bg-gray-200"></div>
                                      <div className="space-y-1">
                                        <div className="h-2 w-full rounded bg-gray-200"></div>
                                        <div className="h-2 w-4/5 rounded bg-gray-200"></div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Main content */}
                                  <div className="h-full w-2/3 p-2">
                                    <div className="space-y-2">
                                      <div className="text-xs font-semibold">SUMMARY</div>
                                      <div className="h-1 w-full rounded bg-gray-200"></div>
                                      <div className="text-[7px] text-gray-600 line-clamp-2">
                                        {template.content.summary}
                                      </div>

                                      <div className="pt-2 text-xs font-semibold">EXPERIENCE</div>
                                      <div className="h-1 w-full rounded bg-gray-200"></div>
                                      <div className="space-y-1">
                                        {template.content.experience.map((exp, i) => (
                                          <div key={i} className="flex items-start gap-1">
                                            <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400"></div>
                                            <div className="text-[6px] text-gray-600 line-clamp-1">{exp}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#6b46c1]/90 opacity-0 transition-opacity group-hover:opacity-100">
                              <h3 className="text-xl font-bold text-white">{template.name}</h3>
                              <p className="text-sm text-white/80">{template.category}</p>
                              <div className="mt-4 flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-white text-[#6b46c1] hover:bg-white/90 transition-all hover:scale-105"
                                >
                                  Preview
                                </Button>
                                <Link href="/builder-split">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10 transition-all hover:scale-105"
                                  >
                                    Use Template
                                  </Button>
                                </Link>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute left-3 top-3 flex flex-col gap-2">
                              {template.popular && <Badge className="bg-yellow-500 hover:bg-yellow-600">Popular</Badge>}
                              {template.new && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                            </div>
                          </div>

                          {/* Template info */}
                          <div className="p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <h3 className="font-bold">{template.name}</h3>
                              <Badge variant="outline" className={getColorClass(template.color)}>
                                {template.category}
                              </Badge>
                            </div>
                            <p className="mb-3 text-sm text-gray-600">{template.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {template.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </AnimatedSection>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </AnimatedSection>
        </section>

        {/* CTA section */}
        <section className="bg-[#6b46c1] py-16 text-white">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to create your professional resume?
              </h2>
              <p className="mt-4 text-white/80">
                Choose from our collection of templates and let our AI assistant help you build a standout resume.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/builder-split">
                  <Button
                    size="lg"
                    className="bg-white text-[#6b46c1] hover:bg-white/90 transition-all hover:scale-105 hover:shadow-md group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                  View All Templates
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

