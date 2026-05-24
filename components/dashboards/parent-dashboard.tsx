"use client"

import { useState } from 'react'
import { 
  Calendar,
  Clock,
  TrendingUp,
  User,
  ChevronRight,
  BookOpen,
  Video,
  Phone,
  MapPin,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard, SectionCard } from '@/components/dashboard-cards'
import { useAuth } from '@/lib/auth-context'
import { mockParentChildData, mockStudentProgress, k6Grades } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

const modalityIcons: Record<string, React.ReactNode> = {
  'zoom': <Video className="w-4 h-4" />,
  'google-meets': <Video className="w-4 h-4" />,
  'phone-call': <Phone className="w-4 h-4" />,
  'in-person': <MapPin className="w-4 h-4" />,
}

export function ParentDashboard() {
  const { user } = useAuth()
  const childData = mockParentChildData
  
  // Check if child is K-6 (requires parent verification)
  const isK6 = k6Grades.includes(childData.grade)
  
  // Session verification state
  const [pendingVerifications, setPendingVerifications] = useState(childData.pendingVerifications)
  const [verifyingSession, setVerifyingSession] = useState<typeof pendingVerifications[0] | null>(null)
  const [sessionHistory, setSessionHistory] = useState(childData.sessionHistory)

  const handleVerifySession = () => {
    if (!verifyingSession) return
    
    // Remove from pending verifications
    setPendingVerifications(prev => prev.filter(s => s.id !== verifyingSession.id))
    
    // Update session history to mark as verified
    setSessionHistory(prev => 
      prev.map(s => 
        s.id === verifyingSession.id.replace('verify-', 'hist-')
          ? { ...s, isVerified: true }
          : s
      )
    )
    
    setVerifyingSession(null)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor {childData.childName}&apos;s learning progress</p>
      </div>

      {/* K-6 Parent Verification Banner */}
      {isK6 && pendingVerifications.length > 0 && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-warning">Parent Verification Required</h3>
            <p className="text-sm text-warning/90">
              Your child is in {childData.grade}. For students in grades K-6, completed tutoring sessions require parental verification 
              before volunteer hours can be submitted for administrative approval.
            </p>
            <p className="text-sm text-warning font-medium">
              You have {pendingVerifications.length} session{pendingVerifications.length > 1 ? 's' : ''} awaiting verification.
            </p>
          </div>
        </div>
      )}

      {/* Child Profile Card */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">{childData.childName}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
                {childData.grade}
              </span>
              {isK6 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium w-fit">
                  <Shield className="w-3 h-3" />
                  K-6 Guardian Oversight
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Connected to your parent account: {user?.email}
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <FileText className="w-4 h-4" />
            Full Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sessions"
          value={childData.totalSessions}
          subtitle="Completed sessions"
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Learning Hours"
          value={childData.totalHours}
          subtitle="Total tutoring time"
          icon={<Clock className="w-6 h-6" />}
        />
        <StatCard
          title="Upcoming"
          value={childData.upcomingSessions.length}
          subtitle="Scheduled sessions"
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatCard
          title="This Month"
          value={mockStudentProgress[mockStudentProgress.length - 1].sessions}
          subtitle="Sessions completed"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* K-6 Pending Verifications */}
      {isK6 && pendingVerifications.length > 0 && (
        <SectionCard
          title="Sessions Awaiting Your Verification"
          subtitle="Verify that these sessions were completed successfully"
          className="border-warning/30"
        >
          <div className="space-y-4">
            {pendingVerifications.map((session, index) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-warning/5 border border-warning/20 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{session.subject}</h4>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-warning/10 text-warning">
                        Awaiting Verification
                      </span>
                    </div>
                    {/* Tutor Contact Info */}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span>Tutor: <span className="text-foreground font-medium">{session.tutorName}</span></span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${session.tutorEmail}`} className="text-primary hover:underline">
                          {session.tutorEmail}
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {session.duration}h
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded-lg">
                        <span className="font-medium">Tutor Notes:</span> {session.notes}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => setVerifyingSession(session)}
                    className="gap-2 bg-primary hover:bg-primary/90 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <SectionCard
          title="Upcoming Sessions"
          subtitle="Scheduled tutoring appointments"
          action={
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View Calendar
              <ChevronRight className="w-4 h-4" />
            </Button>
          }
        >
          {childData.upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {childData.upcomingSessions.map((session, index) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <h4 className="font-semibold text-foreground">{session.subject}</h4>
                        </div>
                        {/* Tutor Info with Email */}
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span>Tutor: <span className="text-foreground font-medium">{session.tutorName}</span></span>
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            <a href={`mailto:${session.tutorEmail}`} className="text-primary hover:underline">
                              {session.tutorEmail}
                            </a>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {new Date(session.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card text-sm text-muted-foreground border border-border">
                        {modalityIcons[session.modality]}
                      </span>
                    </div>
                    
                    {/* Meeting Link */}
                    {session.meetingLink ? (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => window.open(session.meetingLink!, '_blank')}
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/5 border border-warning/20">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-xs text-warning">Meeting link pending from tutor</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Session History */}
        <SectionCard
          title="Session History"
          subtitle="Past tutoring sessions with notes"
          action={
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            {sessionHistory.map((session, index) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-secondary/50 border border-border animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{session.subject}</h4>
                      <span className="text-xs text-muted-foreground">
                        {session.duration}h
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isK6 && session.requiresVerification && (
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          session.isVerified 
                            ? "bg-primary/10 text-primary" 
                            : "bg-warning/10 text-warning"
                        )}>
                          {session.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  {/* Tutor Info with Email */}
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>Tutor: <span className="text-foreground">{session.tutorName}</span></span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${session.tutorEmail}`} className="text-primary hover:underline text-xs">
                        {session.tutorEmail}
                      </a>
                    </span>
                  </div>
                  {session.notes && (
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Notes:</span> {session.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Progress Chart */}
      <SectionCard
        title="Performance Trend"
        subtitle="Monthly session and hour tracking"
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

      {/* Verification Confirmation Dialog */}
      <Dialog open={!!verifyingSession} onOpenChange={() => setVerifyingSession(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Session Was Successful</DialogTitle>
            <DialogDescription>
              By verifying this session, you confirm that your child participated in the tutoring session and it was completed successfully.
            </DialogDescription>
          </DialogHeader>
          
          {verifyingSession && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium text-foreground">{verifyingSession.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tutor:</span>
                  <span className="font-medium text-foreground">{verifyingSession.tutorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-foreground">
                    {new Date(verifyingSession.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{verifyingSession.duration} hours</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                <p className="text-xs text-info">
                  Once verified, the volunteer hours will be sent to the school administration for final approval.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyingSession(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleVerifySession}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify Session Was Successful
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
