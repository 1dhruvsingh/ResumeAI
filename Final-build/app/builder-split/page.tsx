"use client";

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
import { useAuth } from "@/contexts/auth-context"
import { useResume } from "@/contexts/resume-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BuilderSplitPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const {
    currentResume,
    jobDescriptions,
    currentJobDescription,
    analysis,
    chatMessages,
    isLoading,
    fetchResumes,
    fetchJobDescriptions,
    createResume,
    updateResume,
    analyzeResume,
    sendChatMessage,
    setCurrentResume,
    setCurrentJobDescription,
    createJobDescription,
    resumes,
  } = useResume()

  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [input, setInput] = useState("")
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState(false)
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [jobDescriptionTitle, setJobDescriptionTitle] = useState("")
  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch resumes and job descriptions on mount
  useEffect(() => {
    if (user) {
      fetchResumes()
      fetchJobDescriptions()
    }
  }, [user])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Create a new resume if none exists
  useEffect(() => {
    if (!currentResume && !isLoading) {
      // Check if we have any resumes
      if (resumes && resumes.length > 0) {
        setCurrentResume(resumes[0])
      } else {
        // Create a new resume with initial data
        createResume("My Resume", initialResumeData)
      }
    }
  }, [currentResume, isLoading])

  const handleSend = () => {
    if (!input.trim()) return

    // Check if the message is about job description analysis
    if (input.toLowerCase().includes("job description") || input.toLowerCase().includes("analyze")) {
      setShowJobDescriptionModal(true)
      return
    }

    // Send message to AI
    sendChatMessage(input)

    // Clear input
    setInput("")
  }

  const handleJobDescriptionSubmit = async () => {
    if (!jobDescriptionText.trim() || !jobDescriptionTitle.trim()) return

    // Create job description
    await createJobDescription(jobDescriptionTitle, jobDescriptionText)

    // Close modal
    setShowJobDescriptionModal(false)

    // Clear inputs
    setJobDescriptionTitle("")
    setJobDescriptionText("")

    // Analyze resume with job description
    if (currentResume && currentJobDescription) {
      analyzeResume(currentResume.id, currentJobDescription.id)
    }
  }

  const handleExport = () => {
    if (!currentResume) return

    // In a real implementation, this would generate and download the file
    alert(`Your resume has been exported as PDF!`)
  }

  // If loading or not authenticated, show loading state
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
              disabled={isLoading || !currentResume}
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
              {currentResume ? (
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
                            {currentResume.data.personalInfo.fullName}
                          </h1>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div
                          className={`flex flex-wrap gap-2 text-sm text-muted-foreground ${selectedTemplate === "modern" ? "justify-center" : ""}`}
                        >
                          {currentResume.data.personalInfo.email && <span>{currentResume.data.personalInfo.email}</span>}
                          {currentResume.data.personalInfo.email && currentResume.data.personalInfo.phone && <span>•</span>}
                          {currentResume.data.personalInfo.phone && <span>{currentResume.data.personalInfo.phone}</span>}
                          {(currentResume.data.personalInfo.email || currentResume.data.personalInfo.phone) &&
                            currentResume.data.personalInfo.location && <span>•</span>}
                          {currentResume.data.personalInfo.location && <span>{currentResume.data.personalInfo.location}</span>}
                          {currentResume.data.personalInfo.linkedin && (
                            <>
                              <span>•</span>
                              <span>{currentResume.data.personalInfo.linkedin}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      {currentResume.data.summary && (
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
                          <p className="text-sm">{currentResume.data.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {currentResume.data.workExperience.length > 0 && (
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
                          {currentResume.data.workExperience.map((job, index) => (
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
                      {currentResume.data.education.length > 0 && (
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
                          {currentResume.data.education.map((edu, index) => (
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
                      {currentResume.data.skills.length > 0 && (
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
                            {currentResume.data.skills.map((skill, index) => (
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
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
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
                  {chatMessages.map((message, index) => (
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
                  {isLoading && (
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
                    disabled={isLoading || !currentResume}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || !currentResume}
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
    onClick={() => { // ✅ Fixed the syntax here
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
    Analyze Job Description
  </Badge>
</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Job Description Modal */}
      <Dialog open={showJobDescriptionModal} onOpenChange={setShowJobDescriptionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Job Description</DialogTitle>
            <DialogDescription>
              Paste a job description to analyze and optimize your resume for this position.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="Software Engineer, Product Manager, etc."
                value={jobDescriptionTitle}
                onChange={(e) => setJobDescriptionTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJobDescriptionModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJobDescriptionSubmit}
              disabled={!jobDescriptionText.trim() || !jobDescriptionTitle.trim() || isLoading}
            >
              {isLoading ? (
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Initial resume data
const initialResumeData = {
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

