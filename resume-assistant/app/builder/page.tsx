"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Send, User, Upload, Download, AlertCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

// Import the AnimatedSection component at the top of the file
import { AnimatedSection } from "@/components/animated-section"

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

// Initial empty resume data
const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  summary: "",
}

export default function ResumeBuilder() {
  // State for chat messages
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your AI resume assistant. I'll help you create a professional resume that stands out to employers and passes ATS systems. Let's start with your basic information. What's your full name?",
    },
  ])
  
  const [input, setInput] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [jobDescription, setJobDescription] = useState("")
  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false)
  const [resumeScore, setResumeScore] = useState({
    overall: 0,
    content: 0,
    keywords: 0,
    format: 0
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysisResults, setAnalysisResults] = useState({
    atsCompatibility: [] as string[],
    grammarIssues: [] as string[],
    sentimentFeedback: [] as string[]
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
  const steps = [
    { name: "Personal Info", completed: currentStep > 0 },
    { name: "Experience", completed: currentStep > 2 },
    { name: "Education", completed: currentStep > 4 },
    { name: "Skills", completed: currentStep > 5 },
    { name: "Summary", completed: currentStep > 6 },
  ]
  
  // Simulate AI response based on current step
  const getAIResponse = (userInput: string, step: number) => {
    // Update resume data based on user input and current step
    const updatedResumeData = { ...resumeData }
    
    switch(step) {
      case 0: // Name input
        updatedResumeData.personalInfo.fullName = userInput
        setResumeData(updatedResumeData)
        return "Great! Now, what's your email address?"
      
      case 1: // Email input
        updatedResumeData.personalInfo.email = userInput
        setResumeData(updatedResumeData)
        return "Perfect. What's your phone number?"
      
      case 2: // Phone input
        updatedResumeData.personalInfo.phone = userInput
        setResumeData(updatedResumeData)
        return "Where are you located? (City, State/Province, Country)"
      
      case 3: // Location input
        updatedResumeData.personalInfo.location = userInput
        setResumeData(updatedResumeData)
        return "Let's move on to your work experience. What's your most recent job title?"
      
      case 4: // Job title input
        if (!updatedResumeData.workExperience[0]) {
          updatedResumeData.workExperience[0] = {
            title: userInput,
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: []
          }
        } else {
          updatedResumeData.workExperience[0].title = userInput
        }
        setResumeData(updatedResumeData)
        return "At which company did you work in this role?"
      
      case 5: // Company input
        updatedResumeData.workExperience[0].company = userInput
        setResumeData(updatedResumeData)
        return "Could you describe your key responsibilities and achievements in this role? (Separate different points with a new line)"
      
      case 6: // Job description input
        updatedResumeData.workExperience[0].description = userInput.split('\n').filter(item => item.trim() !== '')
        setResumeData(updatedResumeData)
        return "Now, let's add your education. What's your highest degree? (e.g., Bachelor of Science in Computer Science)"
      
      case 7: // Education degree input
        if (!updatedResumeData.education[0]) {
          updatedResumeData.education[0] = {
            degree: userInput,
            institution: "",
            location: "",
            graduationDate: ""
          }
        } else {
          updatedResumeData.education[0].degree = userInput
        }
        setResumeData(updatedResumeData)
        return "From which institution did you receive this degree?"
      
      case 8: // Institution input
        updatedResumeData.education[0].institution = userInput
        setResumeData(updatedResumeData)
        return "When did you graduate? (Month Year)"
      
      case 9: // Graduation date input
        updatedResumeData.education[0].graduationDate = userInput
        setResumeData(updatedResumeData)
        return "Let's list your key skills. What are your top professional skills? (Separate different skills with a comma)"
      
      case 10: // Skills input
        updatedResumeData.skills = userInput.split(',').map(skill => skill.trim()).filter(skill => skill !== '')
        setResumeData(updatedResumeData)
        return "Finally, let's create a professional summary. In a few sentences, describe your professional background and what you bring to the table."
      
      case 11: // Summary input
        updatedResumeData.summary = userInput
        setResumeData(updatedResumeData)
        
        // Simulate resume analysis
        simulateResumeAnalysis(updatedResumeData)
        
        return "Great job! I've collected all the necessary information for your resume. Would you like to provide a job description to optimize your resume for a specific position? This will help tailor your resume to pass ATS systems and highlight relevant skills."
      
      case 12: // Job description or final step
        if (userInput.toLowerCase().includes('yes')) {
          setShowJobDescriptionModal(true)
          return "Perfect! Please paste the job description in the popup window."
        } else {
          simulateResumeScoring(updatedResumeData)
          return "Your resume is ready! I've analyzed it and provided some feedback. You can now choose a template and export your resume."
        }
      
      default:
        return "Is there anything else you'd like to add to your resume?"
    }
  }
  
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
      
      const aiResponse = getAIResponse(input, currentStep)
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
        },
      ])
      
      setCurrentStep(currentStep + 1)
    }, 1500)
  }
  
  // Simulate resume analysis for ATS compatibility, grammar, and sentiment
  const simulateResumeAnalysis = (data: ResumeData) => {
    // Simulate ATS compatibility analysis
    const atsIssues = []
    
    if (data.skills.length < 5) {
      atsIssues.push("Consider adding more skills to improve ATS matching")
    }
    
    if (data.workExperience[0]?.description.length < 3) {
      atsIssues.push("Add more bullet points to your work experience for better keyword coverage")
    }
    
    if (!data.summary || data.summary.length < 50) {
      atsIssues.push("Expand your professional summary to include more relevant keywords")
    }
    
    // Simulate grammar check
    const grammarIssues = []
    
    // Check for potential grammar issues in work descriptions
    data.workExperience.forEach(job => {
      job.description.forEach((bullet, index) => {
        if (!bullet.startsWith(bullet[0].toUpperCase())) {
          grammarIssues.push(`Work experience bullet ${index + 1} should start with a capital letter`)
        }
        
        if (!bullet.includes('ed ') && !bullet.includes('ing ')) {
          grammarIssues.push(`Work experience bullet ${index + 1} may need action verbs (past tense or gerund form)`)
        }
      })
    })
    
    // Simulate sentiment analysis
    const sentimentFeedback = []
    
    if (data.summary && data.summary.includes('I am')) {
      sentimentFeedback.push("Consider using third person in your summary instead of first person")
    }
    
    if (data.workExperience[0]?.description.some(desc => desc.includes('responsible for'))) {
      sentimentFeedback.push("Replace 'responsible for' with stronger action verbs to emphasize achievements")
    }
    
    setAnalysisResults({
      atsCompatibility: atsIssues,
      grammarIssues,
      sentimentFeedback
    })
  }
  
  // Simulate resume scoring
  const simulateResumeScoring = (data: ResumeData) => {
    // Calculate content score based on completeness
    const contentScore = Math.min(100, 
      (data.personalInfo.fullName ? 10 : 0) +
      (data.personalInfo.email ? 10 : 0) +
      (data.personalInfo.phone ? 10 : 0) +
      (data.workExperience.length > 0 ? 20 : 0) +
      (data.education.length > 0 ? 15 : 0) +
      (data.skills.length >= 5 ? 15 : data.skills.length * 3) +
      (data.summary ? 20 : 0)
    )
    
    // Calculate keyword score (would be based on job description match in a real implementation)
    const keywordScore = 70 + Math.floor(Math.random() * 30)
    
    // Calculate format score based on analysis results
    const formatScore = 100 - (
      (analysisResults.grammarIssues.length * 10) + 
      (analysisResults.sentimentFeedback.length * 5)
    )
    
    // Calculate overall score
    const overallScore = Math.floor((contentScore * 0.4) + (keywordScore * 0.4) + (formatScore * 0.2))
    
    setResumeScore({
      overall: overallScore,
      content: contentScore,
      keywords: keywordScore,
      format: formatScore
    })
  }
  
  // Handle job description submission
  const handleJobDescriptionSubmit = () => {
    setShowJobDescriptionModal(false)
    
    // Simulate processing
    setIsGenerating(true)
    
    setTimeout(() => {
      setIsGenerating(false)
      
      // Simulate optimized resume data
      const optimizedResumeData = { ...resumeData }
      
      // Add job-specific skills based on job description
      if (jobDescription.toLowerCase().includes('react')) {
        optimizedResumeData.skills = [...new Set([...optimizedResumeData.skills, 'React.js', 'Frontend Development', 'UI/UX'])]
      }
      
      if (jobDescription.toLowerCase().includes('data')) {
        optimizedResumeData.skills = [...new Set([...optimizedResumeData.skills, 'Data Analysis', 'SQL', 'Reporting'])]
      }
      
      setResumeData(optimizedResumeData)
      
      // Update resume score
      simulateResumeScoring(optimizedResumeData)
      
      // Add AI message about optimization
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've analyzed the job description and optimized your resume. I've added some relevant skills that match the job requirements. Your resume score has been updated!"
        },
      ])
    }, 3000)
  }
  
  // Simulate resume export
  const handleExport = (format: 'pdf' | 'docx') => {
    setIsGenerating(true)
    
    setTimeout(() => {
      setIsGenerating(false)
      
      // In a real implementation, this would generate and download the file
      alert(`Your resume has been exported as ${format.toUpperCase()}!`)
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
            {isGenerating && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
            <Button size="sm" onClick={() => handleExport('pdf')} disabled={isGenerating} className="button-hover">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-full flex-col md:flex-row">
            {/* Chat section */}
            <div className="flex flex-1 flex-col border-r">
              <div className="flex-1 overflow-flow-auto p-4">
                
<div className="space-y-4 pb-20">
  {messages.map((message, index) => (
    <div
      key={index}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[80%] items-start gap-3 rounded-lg px-4 py-2 ${
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
          <p className="text-sm">{message.content}</p>
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
      <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-muted px-4 py-2 chat-bubble-in">
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
              <div className="border-t bg-background p-4">
                <div className="flex items-center gap-2">
                  {currentStep >= 6 && currentStep <= 7 ? (
                    <Textarea
                      placeholder="Type your response..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 min-h-[100px]"
                    />
                  ) : (
                    <Input
                      placeholder="Type your response..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      className="flex-1"
                    />
                  )}
                  <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Preview and analysis section */}
            <div className="hidden md:flex md:w-1/2 md:flex-col">
              <Tabs defaultValue="preview" className="flex-1">
                <div className="flex items-center justify-between border-b p-4">
                  <TabsList>
                    <TabsTrigger value="preview">Resume Preview</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Score:</span>
                    <Badge variant={resumeScore.overall >= 80 ? "default" : resumeScore.overall >= 60 ? "secondary" : "destructive"}>
                      {resumeScore.overall}%
                    </Badge>
                  </div>
                </div>
                
                
<TabsContent value="preview" className="flex-1 overflow-auto p-4 m-0 border-0">
  <AnimatedSection>
    <div className={`rounded-lg border bg-card p-6 shadow-sm ${selectedTemplate === 'modern' ? 'divide-y' : ''}`}>
      <div className="space-y-6">
        {/* Personal Info */}
        <div className={`space-y-2 ${selectedTemplate === 'modern' ? 'pb-4 text-center' : ''}`}>
          <h1 className={`text-2xl font-bold ${selectedTemplate === 'modern' ? 'text-primary text-3xl' : ''}`}>
            {resumeData.personalInfo.fullName || "Your Name"}
          </h1>
          <div className={`flex flex-wrap gap-2 text-sm text-muted-foreground ${selectedTemplate === 'modern' ? 'justify-center' : ''}`}>
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.email && resumeData.personalInfo.phone && <span>•</span>}
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {(resumeData.personalInfo.email || resumeData.personalInfo.phone) && resumeData.personalInfo.location && <span>•</span>}
            {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
          </div>
        </div>
        
        {/* Summary */}
        {resumeData.summary && (
          <div className={`space-y-2 ${selectedTemplate === 'modern' ? 'py-4' : ''}`}>
            <h2 className={`text-lg font-semibold ${selectedTemplate === 'modern' ? 'text-primary' : ''}`}>
              Professional Summary
            </h2>
            <p className="text-sm">{resumeData.summary}</p>
          </div>
        )}
        
        {/* Experience */}
        {resumeData.workExperience.length > 0 && (
          <div className={`space-y-2 ${selectedTemplate === 'modern' ? 'py-4' : ''}`}>
            <h2 className={`text-lg font-semibold ${selectedTemplate === 'modern' ? 'text-primary' : ''}`}>
              Experience
            </h2>
            {resumeData.workExperience.map((job, index) => (
              <div key={index} className="rounded-md border p-3 mt-2 stagger-item">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{job.title || "Job Title"}</h3>
                    <p className="text-sm text-muted-foreground">{job.company || "Company Name"}</p>
                  </div>
                  {job.startDate && job.endDate && (
                    <p className="text-sm text-muted-foreground">{job.startDate} - {job.endDate}</p>
                  )}
                </div>
                {job.description.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-sm">
                    {job.description.map((desc, i) => (
                      <li key={i} className="stagger-item">{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className={`space-y-2 ${selectedTemplate === 'modern' ? 'py-4' : ''}`}>
            <h2 className={`text-lg font-semibold ${selectedTemplate === 'modern' ? 'text-primary' : ''}`}>
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="rounded-md border p-3 mt-2 stagger-item">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution || "Institution"}</p>
                  </div>
                  {edu.graduationDate && (
                    <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className={`space-y-2 ${selectedTemplate === 'modern' ? 'py-4' : ''}`}>
            <h2 className={`text-lg font-semibold ${selectedTemplate === 'modern' ? 'text-primary' : ''}`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`rounded-full px-3 py-1 text-xs stagger-item ${
                    selectedTemplate === 'modern' ? 'bg-primary/10 text-primary' : 'bg-muted'
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
</TabsContent>
                
                
<TabsContent value="analysis" className="flex-1 overflow-auto p-4 m-0 border-0">
  <div className="space-y-6">
    {/* Resume Score */}
    <AnimatedSection>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Resume Score</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4 hover-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Overall Score</h3>
              <span className={`text-sm font-medium ${
                resumeScore.overall >= 80 ? 'text-green-500' : 
                resumeScore.overall >= 60 ? 'text-amber-500' : 'text-red-500'
              }`}>
                {resumeScore.overall}%
              </span>
            </div>
            <Progress 
              value={resumeScore.overall} 
              className="mt-2 progress-bar-animate"
              indicatorClassName={
                resumeScore.overall >= 80 ? 'bg-green-500' : 
                resumeScore.overall >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }
            />
          </div>
          
          <div className="rounded-lg border p-4 hover-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Content Quality</h3>
              <span className="text-sm font-medium">{resumeScore.content}%</span>
            </div>
            <Progress value={resumeScore.content} className="mt-2 progress-bar-animate" />
          </div>
          
          <div className="rounded-lg border p-4 hover-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Keyword Optimization</h3>
              <span className="text-sm font-medium">{resumeScore.keywords}%</span>
            </div>
            <Progress value={resumeScore.keywords} className="mt-2 progress-bar-animate" />
          </div>
          
          <div className="rounded-lg border p-4 hover-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Format & Grammar</h3>
              <span className="text-sm font-medium">{resumeScore.format}%</span>
            </div>
            <Progress value={resumeScore.format} className="mt-2 progress-bar-animate" />
          </div>
        </div>
      </div>
    </AnimatedSection>
    
    {/* ATS Compatibility */}
    <AnimatedSection delay={100}>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">ATS Compatibility</h2>
        {analysisResults.atsCompatibility.length > 0 ? (
          <ul className="space-y-2">
            {analysisResults.atsCompatibility.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-amber-600 stagger-item">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No ATS compatibility issues detected.</p>
        )}
      </div>
    </AnimatedSection>
    
    {/* Grammar & Formatting */}
    <AnimatedSection delay={200}>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Grammar & Formatting</h2>
        {analysisResults.grammarIssues.length > 0 ? (
          <ul className="space-y-2">
            {analysisResults.grammarIssues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-500 stagger-item">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No grammar or formatting issues detected.</p>
        )}
      </div>
    </AnimatedSection>
    
    {/* Sentiment Analysis */}
    <AnimatedSection delay={300}>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Tone & Phrasing</h2>
        {analysisResults.sentimentFeedback.length > 0 ? (
          <ul className="space-y-2">
            {analysisResults.sentimentFeedback.map((feedback, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-500 stagger-item">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{feedback}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Your resume has a professional tone and phrasing.</p>
        )}
      </div>
    </AnimatedSection>
    
    {/* Job Description Analysis */}
    <AnimatedSection delay={400}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Job Description Analysis</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowJobDescriptionModal(true)}
            className="button-hover"
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Job Description
          </Button>
        </div>
        {jobDescription ? (
          <div className="rounded-lg border p-4 hover-glow">
            <h3 className="font-medium mb-2">Job Description</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{jobDescription}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add a job description to get tailored recommendations and improve your ATS score.
          </p>
        )}
      </div>
    </AnimatedSection>
  </div>
</TabsContent>
                
                
<TabsContent value="templates" className="flex-1 overflow-auto p-4 m-0 border-0">
  <AnimatedSection>
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Choose a Template</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div 
          className={`cursor-pointer rounded-lg border p-2 transition-all template-hover ${
            selectedTemplate === 'professional' ? 'ring-2 ring-primary' : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedTemplate('professional')}
        >
          <div className="aspect-[8.5/11] bg-card p-4 relative overflow-hidden">
            <div className="h-full w-full rounded border bg-background p-2">
              <div className="h-1/6 w-full border-b">
                <div className="h-4 w-1/2 rounded bg-primary/20"></div>
              </div>
              <div className="flex h-5/6">
                <div className="h-full w-full p-2">
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted"></div>
                    <div className="h-3 w-full rounded bg-muted"></div>
                    <div className="h-3 w-4/5 rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-background/80 opacity-0 flex items-center justify-center template-overlay transition-opacity">
              <Button variant="default" size="sm" className="button-hover">Select Template</Button>
            </div>
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-medium">Professional</h3>
            <p className="text-xs text-muted-foreground">Traditional and clean</p>
          </div>
        </div>
        
        <div 
          className={`cursor-pointer rounded-lg border p-2 transition-all template-hover ${
            selectedTemplate === 'modern' ? 'ring-2 ring-primary' : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedTemplate('modern')}
        >
          <div className="aspect-[8.5/11] bg-card p-4 relative overflow-hidden">
            <div className="h-full w-full rounded border bg-background p-2">
              <div className="h-1/6 w-full border-b bg-primary/10">
                <div className="flex h-full items-center justify-center">
                  <div className="h-4 w-1/3 rounded bg-primary/30"></div>
                </div>
              </div>
              <div className="flex h-5/6">
                <div className="h-full w-full p-2">
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted"></div>
                    <div className="h-3 w-full rounded bg-muted"></div>
                    <div className="h-3 w-4/5 rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-background/80 opacity-0 flex items-center justify-center template-overlay transition-opacity">
              <Button variant="default" size="sm" className="button-hover">Select Template</Button>
            </div>
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-medium">Modern</h3>
            <p className="text-xs text-muted-foreground">Contemporary and sleek</p>
          </div>
        </div>
      </div>
    </div>
  </AnimatedSection>
</TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      
      
<div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8">
  <Card className="border-primary/20 bg-background/95 backdrop-blur hover-lift">
    <CardContent className="flex items-center gap-4 p-2 sm:p-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-300 ${
              currentStep > index
                ? "bg-primary text-primary-foreground"
                : currentStep === index
                ? "bg-primary/80 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`hidden text-xs sm:ml-2 sm:block transition-colors duration-300 ${
              currentStep >= index ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <ArrowRight className="mx-1 h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </CardContent>
  </Card>
</div>
      
      
<Dialog open={showJobDescriptionModal} onOpenChange={setShowJobDescriptionModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Job Description</DialogTitle>
      <DialogDescription>
        Paste the job description to optimize your resume for this specific position.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px]"
        />
      </div>
      
<div className="flex justify-end gap-2">
  <Button variant="outline" onClick={() => setShowJobDescriptionModal(false)} className="hover-scale">
    Cancel
  </Button>
  <Button onClick={handleJobDescriptionSubmit} disabled={!jobDescription.trim()} className="button-hover">
    Analyze & Optimize
  </Button>
</div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  )
}

