"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Clock, Download, Edit, FileText, Plus, User } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">ResumeAI</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/templates" className="text-sm font-medium transition-colors hover:text-primary">
              Templates
            </Link>
            <Link href="/settings" className="text-sm font-medium transition-colors hover:text-primary">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Credits: 3</span>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
              <p className="text-muted-foreground">Manage your resumes and create new ones with AI assistance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Refreshes in 14:32:45</p>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Create New Resume</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Start building with AI assistance
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/builder" className="w-full">
                    <Button variant="secondary" className="w-full gap-1">
                      <Plus className="h-4 w-4" /> New Resume
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <Tabs defaultValue="resumes" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                <TabsTrigger value="resumes">My Resumes</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="resumes" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Software Developer Resume",
                      date: "Updated 2 days ago",
                      progress: 100,
                    },
                    {
                      title: "Project Manager Application",
                      date: "Updated 1 week ago",
                      progress: 100,
                    },
                    {
                      title: "UX Designer Resume",
                      date: "Created 3 weeks ago",
                      progress: 75,
                    },
                  ].map((resume, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{resume.title}</CardTitle>
                        <CardDescription>{resume.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span>Completion</span>
                          <span>{resume.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${resume.progress}%` }}></div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="templates" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Professional", style: "Traditional and clean" },
                    { name: "Modern", style: "Contemporary and sleek" },
                    { name: "Creative", style: "Bold and distinctive" },
                    { name: "Executive", style: "Authoritative and polished" },
                    { name: "Minimalist", style: "Simple and elegant" },
                    { name: "Technical", style: "Detailed and structured" },
                  ].map((template, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-[8.5/11] bg-muted p-4">
                        <div className="h-full w-full rounded border bg-background p-2">
                          <div className="h-1/6 w-full border-b">
                            <div className="h-4 w-1/2 rounded bg-primary/20"></div>
                          </div>
                          <div className="flex h-5/6">
                            <div className="h-full w-1/3 border-r p-2">
                              <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-muted"></div>
                                <div className="h-3 w-4/5 rounded bg-muted"></div>
                                <div className="h-3 w-full rounded bg-muted"></div>
                              </div>
                            </div>
                            <div className="h-full w-2/3 p-2">
                              <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-muted"></div>
                                <div className="h-3 w-full rounded bg-muted"></div>
                                <div className="h-3 w-4/5 rounded bg-muted"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.style}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full gap-1">
                          Use Template <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

