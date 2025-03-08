"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Send, User, Download, Settings, ChevronDown, Edit, Plus, Sparkles, Loader2 } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types for resume data
interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    website?: string
  }
  workExperience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string[]
    isPresent?: boolean
  }>
  education: Array<{
    degree: string
    institution: string
    location: string
    graduationDate: string
    gpa?: string
    achievements?: string[]
  }>
  skills: string[]
  summary: string
  achievements?: string[]
}

// Initial resume data
const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.com",
  },
  workExperience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "New York, NY",
      startDate: "Jan 2020",
      endDate: "Present",
      isPresent: true,
      description: [
        "Led development of cloud-based SaaS platform serving 50,000+ users",
        "Implemented microservices architecture reducing system downtime by 35%",
        "Mentored junior developers and conducted code reviews to ensure quality",
      ],
    },
    {
      title: "Software Engineer",
      company: "Digital Innovations",
      location: "Boston, MA",
      startDate: "Mar 2017",
      endDate: "Dec 2019",
      description: [
        "Developed RESTful APIs for mobile applications with 100,000+ downloads",
        "Optimized database queries reducing load times by 40%",
        "Collaborated with UX team to implement responsive design patterns",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "Massachusetts Institute of Technology",
      location: "Cambridge, MA",
      graduationDate: "2017",
      gpa: "3.8/4.0",
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduationDate: "2015",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "SQL",
    "CI/CD",
    "Agile Methodologies",
    "System Design",
  ],
  summary:
    "Results-driven Software Engineer with 6+ years of experience developing scalable web applications and services. Specialized in full-stack development with expertise in cloud architecture and performance optimization. Passionate about creating elegant solutions to complex problems and mentoring junior developers.",
}

export default function BuilderSplitPage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [isLoading, setIsLoading] = useState(false)

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI resume assistant. I'll help you create a professional resume that stands out to employers and passes ATS systems. What would you like help with today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Job description state
  const [jobDescription, setJobDescription] = useState("")
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState(false)
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ])

    // Clear input
    setInput("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)

      // Generate a response based on the input
      const aiResponse = generateAIResponse(input)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ])
    }, 1500)
  }

  const generateAIResponse = (userInput: string) => {
    const inputLower = userInput.toLowerCase()

    if (inputLower.includes("experience") || inputLower.includes("work history")) {
      return "To improve your work experience section, try using strong action verbs at the beginning of each bullet point. Quantify your achievements with numbers when possible. For example, instead of 'Responsible for managing team', try 'Led cross-functional team of 8 engineers, increasing productivity by 25%'."
    }

    if (inputLower.includes("skills") || inputLower.includes("abilities")) {
      return "For your skills section, prioritize technical skills that are mentioned in the job description. Group similar skills together, and consider adding a proficiency level for technical skills if appropriate. Remove generic skills like 'communication' unless they're specifically mentioned in the job posting."
    }

    if (inputLower.includes("summary") || inputLower.includes("profile")) {
      return "Your professional summary should be concise (3-5 lines) and highlight your most relevant experience, skills, and achievements. Tailor it to the specific job you're applying for. Start with your professional identity, then mention your years of experience and key specializations."
    }

    if (inputLower.includes("education")) {
      return "For your education section, list your degrees in reverse chronological order. Include your degree, institution, location, and graduation date. If you graduated with honors or a high GPA (3.5+), include that information. Recent graduates can add relevant coursework or projects."
    }

    if (inputLower.includes("ats") || inputLower.includes("applicant tracking")) {
      return "To make your resume ATS-friendly, use standard section headings like 'Experience', 'Education', and 'Skills'. Include keywords from the job description, but avoid keyword stuffing. Use a clean, simple format without tables, headers/footers, or complex designs that might confuse the ATS."
    }

    if (inputLower.includes("job description") || inputLower.includes("analyze")) {
      setShowJobDescriptionInput(true)
      return "I'd be happy to analyze a job description for you! Please paste the job description in the text area that just appeared below, and I'll help you tailor your resume to match the requirements."
    }

    // Default response
    return "I'm here to help you create a standout resume. I can provide suggestions for improving specific sections, help you tailor your resume to a job description, or give general formatting advice. What specific aspect of your resume would you like help with?"
  }

  const handleJobDescriptionAnalysis = () => {
    if (!jobDescription.trim()) return

    setIsAnalyzingJob(true)

    // Add user message about job description
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: "I'd like to tailor my resume to this job description: " + jobDescription.substring(0, 100) + "...",
      },
    ])

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzingJob(false)
      setShowJobDescriptionInput(false)

      // Generate keywords and suggestions based on the job description
      const keywords = extractKeywords(jobDescription)
      const suggestions = generateSuggestions(jobDescription, resumeData)

      const response = `
I've analyzed the job description and found these key requirements:

**Key Skills Mentioned:**
${keywords.map((k) => `- ${k}`).join("\n")}

**Suggestions to Improve Your Resume:**
${suggestions.map((s) => `- ${s}`).join("\n")}

Would you like me to help you incorporate these suggestions into your resume?
      `

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ])
    }, 3000)
  }

  // Simple keyword extraction (in a real app, this would be more sophisticated)
  const extractKeywords = (text: string) => {
    const commonKeywords = [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "AWS",
      "Cloud",
      "DevOps",
      "CI/CD",
      "Agile",
      "Scrum",
      "Leadership",
      "Communication",
      "Problem-solving",
      "Team management",
      "Bachelor's degree",
      "Master's degree",
      "5+ years experience",
    ]

    return commonKeywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase())).slice(0, 5)
  }

  // Generate suggestions based on job description and resume
  const generateSuggestions = (jobDesc: string, resume: ResumeData) => {
    const suggestions = [
      "Add more quantifiable achievements to your work experience",
      "Highlight your experience with cloud technologies more prominently",
      "Move your most relevant skills to the top of the skills section",
      "Tailor your professional summary to emphasize leadership experience",
      "Add a projects section to showcase relevant technical work",
    ]

    return suggestions
  }

  const handleExport = () => {
    setIsLoading(true)

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      alert("Your resume has been exported as PDF!")
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 transition-all hover:scale-105">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Change Template</DropdownMenuItem>
                <DropdownMenuItem>Font Settings</DropdownMenuItem>
                <DropdownMenuItem>Color Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              onClick={handleExport}
              disabled={isLoading}
              className="transition-all hover:scale-105 hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex w-full flex-col md:flex-row">
          {/* Resume preview section (left side) */}
          <div className="flex w-full flex-col border-r md:w-2/3">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Resume Preview</h2>
                <Tabs defaultValue="preview" className="w-[400px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <AnimatedSection>
                <div className="mx-auto max-w-[800px]">
                  <div
                    className={`rounded-lg border bg-white p-8 shadow-sm ${selectedTemplate === "modern" ? "divide-y" : ""}`}
                  >
                    {/* Personal Info */}
                    <div className={`space-y-2 ${selectedTemplate === "modern" ? "pb-4 text-center" : ""}`}>
                      <div className="flex items-center justify-between">
                        <h1
                          className={`text-2xl font-bold ${selectedTemplate === "modern" ? "text-primary text-3xl" : ""}`}
                        >
                          {resumeData.personalInfo.fullName}
                        </h1>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div
                        className={`flex flex-wrap gap-2 text-sm text-muted-foreground ${selectedTemplate === "modern" ? "justify-center" : ""}`}
                      >
                        {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                        {resumeData.personalInfo.email && resumeData.personalInfo.phone && <span>•</span>}
                        {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                        {(resumeData.personalInfo.email || resumeData.personalInfo.phone) &&
                          resumeData.personalInfo.location && <span>•</span>}
                        {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                        {resumeData.personalInfo.linkedin && (
                          <>
                            <span>•</span>
                            <span>{resumeData.personalInfo.linkedin}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className={`space-y-2 ${selectedTemplate === "modern" ? "py-4" : "mt-6"}`}>
                        <div className="flex items-center justify-between">
                          <h2
                            className={`text-lg font-semibold ${selectedTemplate === "modern" ? "text-primary" : ""}`}
                          >
                            Professional Summary
                          </h2>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm">{resumeData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.workExperience.length > 0 && (
                      <div className={`space-y-4 ${selectedTemplate === "modern" ? "py-4" : "mt-6"}`}>
                        <div className="flex items-center justify-between">
                          <h2
                            className={`text-lg font-semibold ${selectedTemplate === "modern" ? "text-primary" : ""}`}
                          >
                            Experience
                          </h2>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {resumeData.workExperience.map((job, index) => (
                          <div key={index} className="rounded-md border p-3 mt-2 relative group">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.company} • {job.location}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {job.startDate} - {job.isPresent ? "Present" : job.endDate}
                              </p>
                            </div>
                            {job.description.length > 0 && (
                              <ul className="mt-2 list-inside list-disc text-sm">
                                {job.description.map((desc, i) => (
                                  <li key={i} className="stagger-item">
                                    {desc}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className={`space-y-4 ${selectedTemplate === "modern" ? "py-4" : "mt-6"}`}>
                        <div className="flex items-center justify-between">
                          <h2
                            className={`text-lg font-semibold ${selectedTemplate === "modern" ? "text-primary" : ""}`}
                          >
                            Education
                          </h2>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="rounded-md border p-3 mt-2 relative group">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-medium">{edu.degree}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {edu.institution} • {edu.location}
                                </p>
                                {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                              </div>
                              <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div className={`space-y-4 ${selectedTemplate === "modern" ? "py-4" : "mt-6"}`}>
                        <div className="flex items-center justify-between">
                          <h2
                            className={`text-lg font-semibold ${selectedTemplate === "modern" ? "text-primary" : ""}`}
                          >
                            Skills
                          </h2>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className={`rounded-full px-3 py-1 text-xs stagger-item ${
                                selectedTemplate === "modern" ? "bg-primary/10 text-primary" : "bg-muted"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Chat section (right side) */}
          <div className="flex w-full flex-col md:w-1/3">
            <div className="border-b p-4">
              <h2 className="text-lg font-bold">AI Resume Assistant</h2>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4 pb-20">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex max-w-[90%] items-start gap-3 rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground chat-bubble-out"
                            : "bg-muted chat-bubble-in"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {message.role === "assistant" && (
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                            AI
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-background text-xs font-medium">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[90%] items-start gap-3 rounded-lg bg-muted px-4 py-2 chat-bubble-in">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          AI
                        </div>
                        <div className="flex-1">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Job description input */}
              {showJobDescriptionInput && (
                <div className="border-t p-4 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <Label htmlFor="job-description" className="font-medium">
                        Job Description Analysis
                      </Label>
                    </div>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description here to get tailored resume suggestions..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[100px] focus-visible:ring-primary"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJobDescriptionInput(false)}
                        className="transition-all hover:scale-105"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleJobDescriptionAnalysis}
                        disabled={isAnalyzingJob || !jobDescription.trim()}
                        className="transition-all hover:scale-105 hover:shadow-md"
                      >
                        {isAnalyzingJob ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Ask for resume advice or suggestions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    className="flex-1 focus-visible:ring-primary"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="transition-all hover:scale-105 hover:shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => {
                      setInput("How can I improve my work experience section?")
                      setTimeout(() => handleSend(), 100)
                    }}
                  >
                    Improve experience
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => {
                      setInput("Make my resume more ATS-friendly")
                      setTimeout(() => handleSend(), 100)
                    }}
                  >
                    ATS optimization
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => {
                      setInput("Analyze a job description")
                      setTimeout(() => handleSend(), 100)
                    }}
                  >
                    Job description analysis
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

