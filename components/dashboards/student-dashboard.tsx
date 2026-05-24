"use client"

import { useState, useMemo } from 'react'
import { 
  BookOpen,
  Calendar,
  TrendingUp,
  Plus,
  Video,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Clock,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StatCard, SectionCard } from '@/components/dashboard-cards'
import { useAuth } from '@/lib/auth-context'
import { 
  subjects,
  gradeLevels,
  modalityOptions,
  genderPreferenceOptions,
  timeSlotOptions,
  mockStudentProgress,
  mockTutorRequests
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type RequestStep = 1 | 2 | 3 | 4 | 5

export function StudentDashboard() {
  const { user } = useAuth()
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [currentStep, setCurrentStep] = useState<RequestStep>(1)
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    modality: '',
    genderPreference: '',
    preferredDate: '',
    preferredTime: '',
  })

  const totalSessions = mockStudentProgress.reduce((acc, p) => acc + p.sessions, 0)
  const totalHours = mockStudentProgress.reduce((acc, p) => acc + p.hours, 0)

  // Get my sessions with meeting links
  const mySessions = mockTutorRequests.filter(
    r => r.studentId === 'student-001' && (r.status === 'claimed' || r.status === 'pending-link')
  )

  // Generate available dates (next 14 days, excluding past dates)
  const availableDates = useMemo(() => {
    const dates: { value: string; label: string; disabled: boolean }[] = []
    const today = new Date()
    
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const value = date.toISOString().split('T')[0]
      const label = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
      
      // For in-person sessions, disable today (24-hour rule)
      const disabled = formData.modality === 'in-person' && i === 0
      
      dates.push({ value, label, disabled })
    }
    
    return dates
  }, [formData.modality])

  // Check if current date selection is valid for in-person
  const isDateValidForModality = useMemo(() => {
    if (formData.modality !== 'in-person') return true
    if (!formData.preferredDate) return true
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(formData.preferredDate)
    
    // Must be at least 24 hours in advance for in-person
    return selectedDate > today
  }, [formData.modality, formData.preferredDate])

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as RequestStep)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RequestStep)
    }
  }

  const handleSubmitRequest = () => {
    setShowRequestModal(false)
    setCurrentStep(1)
    setFormData({ subject: '', grade: '', modality: '', genderPreference: '', preferredDate: '', preferredTime: '' })
  }

  const resetModal = () => {
    setCurrentStep(1)
    setFormData({ subject: '', grade: '', modality: '', genderPreference: '', preferredDate: '', preferredTime: '' })
  }

  // When modality changes, reset date if it becomes invalid
  const handleModalityChange = (value: string) => {
    setFormData(d => {
      const newData = { ...d, modality: value }
      
      // If switching to in-person and today is selected, clear the date
      if (value === 'in-person' && d.preferredDate) {
        const today = new Date().toISOString().split('T')[0]
        if (d.preferredDate === today) {
          newData.preferredDate = ''
        }
      }
      
      return newData
    })
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.subject && formData.grade
      case 2: return formData.modality
      case 3: return formData.preferredDate && formData.preferredTime && isDateValidForModality
      case 4: return formData.genderPreference
      case 5: return true
      default: return false
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name?.split(' ')[0]}! Ready to learn?</p>
        </div>
        <Dialog open={showRequestModal} onOpenChange={(open) => {
          setShowRequestModal(open)
          if (!open) resetModal()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Request a Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Request a Tutor</DialogTitle>
              <DialogDescription>
                Step {currentStep} of 5 - {getStepTitle(currentStep)}
              </DialogDescription>
            </DialogHeader>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                  </div>
                  {step < 5 && (
                    <div className={cn(
                      "w-8 h-1 rounded-full mx-1",
                      currentStep > step ? "bg-primary" : "bg-secondary"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="py-4 min-h-[200px]">
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={formData.subject} onValueChange={(v) => setFormData(d => ({ ...d, subject: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Select value={formData.grade} onValueChange={(v) => setFormData(d => ({ ...d, grade: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <Label>Session Modality</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {modalityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleModalityChange(option.value)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                          formData.modality === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          formData.modality === option.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}>
                          {option.value === 'zoom' && <Video className="w-5 h-5" />}
                          {option.value === 'google-meets' && <Video className="w-5 h-5" />}
                          {option.value === 'phone-call' && <Phone className="w-5 h-5" />}
                          {option.value === 'in-person' && <MapPin className="w-5 h-5" />}
                        </div>
                        <span className="font-medium text-foreground">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  {formData.modality === 'in-person' && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 animate-fade-in">
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-warning text-sm">In-Person Session Requirements</p>
                        <p className="text-xs text-warning/90">
                          Requires a signed parental permission slip. A parent or guardian must be physically present for the entire duration. Sessions must be scheduled at least 24 hours in advance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Preferred Date
                    </Label>
                    <Select 
                      value={formData.preferredDate} 
                      onValueChange={(v) => setFormData(d => ({ ...d, preferredDate: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map(date => (
                          <SelectItem 
                            key={date.value} 
                            value={date.value}
                            disabled={date.disabled}
                          >
                            {date.label}
                            {date.disabled && ' (24hr advance required)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.modality === 'in-person' && (
                      <p className="text-xs text-muted-foreground">
                        In-person sessions require at least 24 hours advance booking.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Preferred Time Slot
                    </Label>
                    <Select 
                      value={formData.preferredTime} 
                      onValueChange={(v) => setFormData(d => ({ ...d, preferredTime: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlotOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!isDateValidForModality && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">
                        In-person sessions cannot be scheduled for today. Please select a date at least 24 hours in advance.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <Label>Tutor Gender Preference</Label>
                  <div className="space-y-3">
                    {genderPreferenceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(d => ({ ...d, genderPreference: option.value }))}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                          formData.genderPreference === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          formData.genderPreference === option.value
                            ? "border-primary"
                            : "border-muted-foreground"
                        )}>
                          {formData.genderPreference === option.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-muted-foreground">Review your request before submitting:</p>
                  <div className="space-y-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium text-foreground">{formData.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grade:</span>
                      <span className="font-medium text-foreground">{formData.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modality:</span>
                      <span className="font-medium text-foreground">
                        {modalityOptions.find(m => m.value === formData.modality)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preferred Date:</span>
                      <span className="font-medium text-foreground">
                        {new Date(formData.preferredDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preferred Time:</span>
                      <span className="font-medium text-foreground">{formData.preferredTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender Preference:</span>
                      <span className="font-medium text-foreground">
                        {genderPreferenceOptions.find(g => g.value === formData.genderPreference)?.label}
                      </span>
                    </div>
                  </div>
                  {formData.modality === 'in-person' && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-xs text-warning">
                        Remember: A parent/guardian must be present for the entire in-person session.
                      </p>
                    </div>
                  )}
                  {(formData.modality === 'zoom' || formData.modality === 'google-meets') && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 border border-info/20">
                      <Video className="w-4 h-4 text-info shrink-0 mt-0.5" />
                      <p className="text-xs text-info">
                        The meeting link will appear on your dashboard once a tutor claims your session and provides it.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              {currentStep < 5 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepValid()}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitRequest}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Request
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          subtitle="Completed this year"
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Learning Hours"
          value={totalHours}
          subtitle="Total tutoring time"
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatCard
          title="Current Streak"
          value="4 weeks"
          subtitle="Keep it up!"
          icon={<TrendingUp className="w-6 h-6" />}
          className="border-primary/30"
        />
      </div>

      {/* Upcoming Sessions with Meeting Links */}
      {mySessions.length > 0 && (
        <SectionCard
          title="Your Upcoming Sessions"
          subtitle="Sessions claimed by tutors"
        >
          <div className="space-y-3">
            {mySessions.map((session, index) => (
              <div 
                key={session.id}
                className="p-4 rounded-xl bg-secondary/50 border border-border animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{session.subject}</h4>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        session.meetingLink 
                          ? "bg-primary/10 text-primary" 
                          : "bg-warning/10 text-warning"
                      )}>
                        {session.meetingLink ? 'Ready to Join' : 'Pending Link'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tutor: <span className="text-foreground">{session.tutorName}</span>
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {session.scheduledDate && new Date(session.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {session.preferredTime}
                      </span>
                    </div>
                  </div>
                  
                  {session.meetingLink ? (
                    <Button 
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() => window.open(session.meetingLink, '_blank')}
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Waiting for tutor to provide link...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Progress Chart */}
      <SectionCard
        title="Your Progress"
        subtitle="Sessions and hours over the past months"
        action={
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            View Details
            <ChevronRight className="w-4 h-4" />
          </Button>
        }
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockStudentProgress}>
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'oklch(0.22 0.025 250)',
                  border: '1px solid oklch(0.32 0.025 250)',
                  borderRadius: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#285132" 
                strokeWidth={2}
                dot={{ fill: '#285132', strokeWidth: 2 }}
                name="Sessions"
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#5B9BD5" 
                strokeWidth={2}
                dot={{ fill: '#5B9BD5', strokeWidth: 2 }}
                name="Hours"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all text-left group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Browse Available Tutors</h3>
              <p className="text-sm text-muted-foreground">Find help in any subject</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
        </button>
        <button className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all text-left group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">View Upcoming Sessions</h3>
              <p className="text-sm text-muted-foreground">Check your schedule</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
        </button>
      </div>
    </div>
  )
}

function getStepTitle(step: RequestStep): string {
  switch (step) {
    case 1: return 'Subject & Grade'
    case 2: return 'Session Modality'
    case 3: return 'Date & Time'
    case 4: return 'Tutor Preference'
    case 5: return 'Review & Submit'
  }
}
