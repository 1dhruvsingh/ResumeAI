import type React from "react"
import "./globals.css"
import "./animations.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ResumeProvider } from "@/contexts/resume-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ResumeAI - Build Professional Resumes with AI",
  description: "Create professional resumes with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <ResumeProvider>{children}</ResumeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

