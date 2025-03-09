"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useApi } from "@/hooks/use-api"

// Types
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

interface Resume {
  id: string
  title: string
  data: ResumeData
  created_at: string
  updated_at: string
}

interface JobDescription {
  id: string
  title: string
  text: string
  keywords: string[]
  created_at: string
}

interface ResumeAnalysis {
  score: {
    overall: number
    content: number
    keywords: number
    format: number
  }
  analysis: {
    atsCompatibility: string[]
    grammarIssues: string[]
    sentimentFeedback: string[]
  }
  keywords?: {
    found: string[]
    missing: string[]
  }
  suggestions: string[]
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ResumeContextType {
  resumes: Resume[]
  currentResume: Resume | null
  jobDescriptions: JobDescription[]
  currentJobDescription: JobDescription | null
  analysis: ResumeAnalysis | null
  chatMessages: ChatMessage[]
  isLoading: boolean
  error: string | null
  fetchResumes: () => Promise<void>
  fetchResume: (id: string) => Promise<void>
  createResume: (title: string, data: ResumeData) => Promise<void>
  updateResume: (id: string, title: string, data: ResumeData) => Promise<void>
  deleteResume: (id: string) => Promise<void>
  fetchJobDescriptions: () => Promise<void>
  createJobDescription: (title: string, text: string) => Promise<void>
  deleteJobDescription: (id: string) => Promise<void>
  analyzeResume: (resumeId: string, jobDescriptionId?: string) => Promise<void>
  sendChatMessage: (message: string) => Promise<void>
  clearChatMessages: () => void
  setCurrentResume: (resume: Resume | null) => void
  setCurrentJobDescription: (jobDescription: JobDescription | null) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])
  const [currentJobDescription, setCurrentJobDescription] = useState<JobDescription | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI resume assistant. I'll help you create a professional resume that stands out to employers and passes ATS systems. What would you like help with today?",
    },
  ])
  const { fetchApi, isLoading, error } = useApi()

  const fetchResumes = async () => {
    try {
      const data = await fetchApi<Resume[]>("/resumes")
      setResumes(data)
    } catch (err) {
      console.error("Failed to fetch resumes:", err)
    }
  }

  const fetchResume = async (id: string) => {
    try {
      const data = await fetchApi<Resume>(`/resumes/${id}`)
      setCurrentResume(data)
    } catch (err) {
      console.error("Failed to fetch resume:", err)
    }
  }

  const createResume = async (title: string, data: ResumeData) => {
    try {
      const newResume = await fetchApi<Resume>("/resumes", {
        method: "POST",
        body: { title, data },
      })
      setResumes((prev) => [...prev, newResume])
      setCurrentResume(newResume)
    } catch (err) {
      console.error("Failed to create resume:", err)
    }
  }

  const updateResume = async (id: string, title: string, data: ResumeData) => {
    try {
      const updatedResume = await fetchApi<Resume>(`/resumes/${id}`, {
        method: "PUT",
        body: { title, data },
      })
      setResumes((prev) => prev.map((resume) => (resume.id === id ? updatedResume : resume)))
      setCurrentResume(updatedResume)
    } catch (err) {
      console.error("Failed to update resume:", err)
    }
  }

  const deleteResume = async (id: string) => {
    try {
      await fetchApi(`/resumes/${id}`, {
        method: "DELETE",
      })
      setResumes((prev) => prev.filter((resume) => resume.id !== id))
      if (currentResume?.id === id) {
        setCurrentResume(null)
      }
    } catch (err) {
      console.error("Failed to delete resume:", err)
    }
  }

  const fetchJobDescriptions = async () => {
    try {
      const data = await fetchApi<JobDescription[]>("/job-descriptions")
      setJobDescriptions(data)
    } catch (err) {
      console.error("Failed to fetch job descriptions:", err)
    }
  }

  const createJobDescription = async (title: string, text: string) => {
    try {
      const newJobDescription = await fetchApi<JobDescription>("/job-descriptions", {
        method: "POST",
        body: { title, text },
      })
      setJobDescriptions((prev) => [...prev, newJobDescription])
      setCurrentJobDescription(newJobDescription)
    } catch (err) {
      console.error("Failed to create job description:", err)
    }
  }

  const deleteJobDescription = async (id: string) => {
    try {
      await fetchApi(`/job-descriptions/${id}`, {
        method: "DELETE",
      })
      setJobDescriptions((prev) => prev.filter((jd) => jd.id !== id))
      if (currentJobDescription?.id === id) {
        setCurrentJobDescription(null)
      }
    } catch (err) {
      console.error("Failed to delete job description:", err)
    }
  }

  const analyzeResume = async (resumeId: string, jobDescriptionId?: string) => {
    try {
      const data = await fetchApi<ResumeAnalysis>(`/resumes/${resumeId}/analyze`, {
        method: "POST",
        body: jobDescriptionId ? { job_description_id: jobDescriptionId } : {},
      })
      setAnalysis(data)
    } catch (err) {
      console.error("Failed to analyze resume:", err)
    }
  }

  const sendChatMessage = async (message: string) => {
    if (!currentResume) return

    // Add user message to chat
    const userMessage: ChatMessage = { role: "user", content: message }
    setChatMessages((prev) => [...prev, userMessage])

    try {
      const data = await fetchApi<{ response: string }>("/chat", {
        method: "POST",
        body: {
          message,
          resume_id: currentResume.id,
          conversation_history: chatMessages,
        },
      })

      // Add AI response to chat
      const aiMessage: ChatMessage = { role: "assistant", content: data.response }
      setChatMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Failed to send chat message:", err)
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setChatMessages((prev) => [...prev, errorMessage])
    }
  }

  const clearChatMessages = () => {
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hi there! I'm your AI resume assistant. I'll help you create a professional resume that stands out to employers and passes ATS systems. What would you like help with today?",
      },
    ])
  }

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        jobDescriptions,
        currentJobDescription,
        analysis,
        chatMessages,
        isLoading,
        error,
        fetchResumes,
        fetchResume,
        createResume,
        updateResume,
        deleteResume,
        fetchJobDescriptions,
        createJobDescription,
        deleteJobDescription,
        analyzeResume,
        sendChatMessage,
        clearChatMessages,
        setCurrentResume,
        setCurrentJobDescription,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}

