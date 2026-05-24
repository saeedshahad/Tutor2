"use client"

import { useState } from 'react'
import { useAuth, UserRole } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  GraduationCap, 
  Users, 
  User, 
  Shield,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Phone
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AcademyLogoLarge } from '@/components/academy-logo'
import { subjects, gradeLevels } from '@/lib/mock-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const roles: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: 'student', 
    label: 'Student', 
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Request tutoring sessions'
  },
  { 
    value: 'parent', 
    label: 'Parent', 
    icon: <Users className="w-5 h-5" />,
    description: 'Monitor your child\'s progress'
  },
  { 
    value: 'tutor', 
    label: 'Tutor', 
    icon: <User className="w-5 h-5" />,
    description: 'Help fellow students excel'
  },
  { 
    value: 'admin', 
    label: 'Administrator', 
    icon: <Shield className="w-5 h-5" />,
    description: 'Manage the platform'
  },
]

type ViewMode = 'role-select' | 'sign-in' | 'tutor-apply'

export function SignInForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('role-select')
  const { login } = useAuth()

  // Tutor Application State
  const [tutorApplication, setTutorApplication] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    grade: '',
    subjects: [] as string[],
  })
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    login(selectedRole)
    setIsLoading(false)
  }

  const handleTutorChoice = (choice: 'sign-in' | 'apply') => {
    if (choice === 'sign-in') {
      setViewMode('sign-in')
    } else {
      setViewMode('tutor-apply')
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    if (role === 'tutor') {
      // Show tutor options (sign in or apply)
      return
    }
    setViewMode('sign-in')
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setApplicationSubmitted(true)
    setIsLoading(false)
  }

  const toggleSubject = (subject: string) => {
    setTutorApplication(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const resetToRoleSelect = () => {
    setViewMode('role-select')
    setSelectedRole(null)
    setApplicationSubmitted(false)
  }

  // Application submitted confirmation screen
  if (applicationSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="max-w-md text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for applying to become a tutor at Hifz Academy. Your application is now under review by our administrators.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Status:</span> Pending Administrative Review
            </p>
            <p className="text-xs text-muted-foreground">
              You will receive an email notification once your application has been reviewed. This typically takes 1-2 business days.
            </p>
          </div>
          <Button onClick={resetToRoleSelect} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="lg:w-1/2 bg-sidebar p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 mb-12">
          <AcademyLogoLarge />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
              <Sparkles className="w-4 h-4" />
              Peer Tutoring Platform
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
              Empowering Students Through
              <span className="text-primary"> Excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with peer tutors for Mathematics, Science, ELA, Islamic Studies, and Quran. Building a community of knowledge and growth.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-border">
            <div>
              <p className="text-3xl font-bold text-foreground">156</p>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">Certified Tutors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Sessions Completed</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()} Hifz Academy. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Role Selection View */}
          {viewMode === 'role-select' && (
            <>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-foreground">Welcome Back</h3>
                <p className="text-muted-foreground mt-2">Select your role to continue</p>
              </div>

              <div className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Your Role</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleSelect(role.value)}
                        className={cn(
                          "relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left",
                          selectedRole === role.value
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
                          selectedRole === role.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}>
                          {role.icon}
                        </div>
                        <span className="font-medium text-foreground">{role.label}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{role.description}</span>
                        {selectedRole === role.value && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tutor Options */}
                {selectedRole === 'tutor' && (
                  <div className="space-y-3 animate-fade-in">
                    <Label className="text-sm font-medium">What would you like to do?</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        onClick={() => handleTutorChoice('sign-in')}
                        className="h-auto py-4 justify-start gap-3"
                      >
                        <User className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Sign In</div>
                          <div className="text-xs opacity-80">I already have a tutor account</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleTutorChoice('apply')}
                        className="h-auto py-4 justify-start gap-3"
                      >
                        <Sparkles className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Apply to be a Tutor</div>
                          <div className="text-xs opacity-80">I want to help other students</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Demo Notice */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    <span className="font-medium text-foreground">Demo Mode:</span> Select any role to explore the dashboard. No credentials required.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Sign In View */}
          {viewMode === 'sign-in' && (
            <>
              <div className="text-center lg:text-left">
                <button 
                  onClick={resetToRoleSelect}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h3 className="text-2xl font-bold text-foreground">Sign In</h3>
                <p className="text-muted-foreground mt-2">
                  Signing in as <span className="text-primary font-medium">{roles.find(r => r.value === selectedRole)?.label}</span>
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@hifzacademy.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-card border-border"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <button type="button" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 rounded-xl bg-card border-border"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl text-base font-medium gap-2 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Tutor Application View */}
          {viewMode === 'tutor-apply' && (
            <>
              <div className="text-center lg:text-left">
                <button 
                  onClick={resetToRoleSelect}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h3 className="text-2xl font-bold text-foreground">Apply to be a Tutor</h3>
                <p className="text-muted-foreground mt-2">Fill out the form below to apply</p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    placeholder="Enter your full name"
                    value={tutorApplication.fullName}
                    onChange={(e) => setTutorApplication(prev => ({ ...prev, fullName: e.target.value }))}
                    className="h-11 rounded-xl bg-card border-border"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="appEmail" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="appEmail"
                    type="email"
                    required
                    placeholder="you@hifzacademy.edu"
                    value={tutorApplication.email}
                    onChange={(e) => setTutorApplication(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11 rounded-xl bg-card border-border"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="(555) 123-4567"
                      value={tutorApplication.phone}
                      onChange={(e) => setTutorApplication(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-11 rounded-xl bg-card border-border pl-10"
                    />
                  </div>
                </div>

                {/* Age and Grade Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                    <Input
                      id="age"
                      required
                      placeholder="16"
                      value={tutorApplication.age}
                      onChange={(e) => setTutorApplication(prev => ({ ...prev, age: e.target.value }))}
                      className="h-11 rounded-xl bg-card border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Grade *</Label>
                    <Select 
                      value={tutorApplication.grade} 
                      onValueChange={(v) => setTutorApplication(prev => ({ ...prev, grade: v }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.slice(6).map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subjects You Can Teach *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map((subject) => (
                      <label
                        key={subject}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                          tutorApplication.subjects.includes(subject)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Checkbox
                          checked={tutorApplication.subjects.includes(subject)}
                          onCheckedChange={() => toggleSubject(subject)}
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !tutorApplication.fullName || !tutorApplication.email || !tutorApplication.phone || !tutorApplication.age || !tutorApplication.grade || tutorApplication.subjects.length === 0}
                  className="w-full h-12 rounded-xl text-base font-medium gap-2 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your application will be reviewed by school administrators. You will be notified via email once approved.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
