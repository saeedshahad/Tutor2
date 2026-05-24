"use client"

import { useState } from 'react'
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  FileText,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { StatCard, SectionCard, StatusBadge } from '@/components/dashboard-cards'
import { 
  mockTutorApplications, 
  mockSessionRecords, 
  mockPlatformAnalytics,
  TutorApplication,
  SessionRecord
} from '@/lib/mock-data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#285132', '#5B9BD5', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280']

export function AdminDashboard() {
  const [applications, setApplications] = useState(mockTutorApplications)
  const [sessions, setSessions] = useState(mockSessionRecords)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Rejection modal state
  const [rejectingSession, setRejectingSession] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApproveApplication = (id: string) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === id ? { ...app, status: 'approved' as const } : app
      )
    )
  }

  const handleRejectApplication = (id: string) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === id ? { ...app, status: 'rejected' as const } : app
      )
    )
  }

  const handleApproveHours = (id: string) => {
    setSessions(sess =>
      sess.map(s =>
        s.id === id ? { ...s, status: 'approved' as const } : s
      )
    )
  }

  const handleRejectHours = () => {
    if (!rejectingSession) return
    setSessions(sess =>
      sess.map(s =>
        s.id === rejectingSession 
          ? { ...s, status: 'rejected' as const, rejectionReason } 
          : s
      )
    )
    setRejectingSession(null)
    setRejectionReason('')
  }

  const pendingApplications = applications.filter(a => a.status === 'pending')
  const pendingSessions = sessions.filter(s => s.status === 'pending-approval')

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage tutors, sessions, and platform operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={mockPlatformAnalytics.totalStudents}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Tutors"
          value={mockPlatformAnalytics.totalTutors}
          icon={<UserCheck className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Sessions"
          value={mockPlatformAnalytics.activeSessions}
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Hours This Month"
          value={mockPlatformAnalytics.totalHoursThisMonth}
          icon={<Clock className="w-6 h-6" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 rounded-xl">
          <TabsTrigger value="applications" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <AlertCircle className="w-4 h-4" />
            Pending Applications
            {pendingApplications.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-warning/20 text-warning rounded-full">
                {pendingApplications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="hours" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="w-4 h-4" />
            Hour Auditing
            {pendingSessions.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-warning/20 text-warning rounded-full">
                {pendingSessions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Pending Tutor Applications */}
        <TabsContent value="applications" className="space-y-4">
          <SectionCard
            title="Pending Tutor Applications"
            subtitle="Review and approve student tutor applications"
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 h-9 rounded-lg"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            }
          >
            {pendingApplications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-muted-foreground">No pending applications to review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app, index) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onApprove={() => handleApproveApplication(app.id)}
                    onReject={() => handleRejectApplication(app.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Hour Auditing */}
        <TabsContent value="hours" className="space-y-4">
          <SectionCard
            title="Volunteer Hours Auditing"
            subtitle="Review and approve completed tutoring sessions"
          >
            {pendingSessions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">All hours approved!</p>
                <p className="text-muted-foreground">No pending sessions to review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSessions.map((session, index) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onApprove={() => handleApproveHours(session.id)}
                    onReject={() => setRejectingSession(session.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Distribution */}
            <SectionCard title="Subject Distribution" subtitle="Sessions by subject area">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPlatformAnalytics.subjectDistribution}
                      dataKey="count"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ subject, percent }) => `${subject} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {mockPlatformAnalytics.subjectDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(0.16 0.02 250)',
                        border: '1px solid oklch(0.28 0.02 250)',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Weekly Sessions */}
            <SectionCard title="Weekly Session Trend" subtitle="Sessions per day this week">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockPlatformAnalytics.weeklyTrend}>
                    <XAxis 
                      dataKey="day" 
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
                    <Bar 
                      dataKey="sessions" 
                      fill="#285132"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rejection Modal */}
      <Dialog open={!!rejectingSession} onOpenChange={() => setRejectingSession(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Volunteer Hours</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting these hours. This will be communicated to the tutor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejecting these hours (e.g., session not verified, time discrepancy, etc.)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingSession(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectHours}
              disabled={!rejectionReason.trim()}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject Hours
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ApplicationCard({ 
  application, 
  onApprove, 
  onReject,
  index 
}: { 
  application: TutorApplication
  onApprove: () => void
  onReject: () => void
  index: number
}) {
  return (
    <div 
      className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {application.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{application.name}</h4>
              <StatusBadge status={application.status} />
            </div>
            {/* Contact Info with Icons */}
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {application.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {application.phone}
              </span>
            </div>
            {/* Age and Grade */}
            <p className="text-sm text-muted-foreground">
              Age: <span className="font-medium text-foreground">{application.age}</span> | Grade: <span className="font-medium text-foreground">{application.grade}</span>
            </p>
            {/* Subjects */}
            <div className="flex flex-wrap gap-2 mt-2">
              {application.subjects.map(subject => (
                <span 
                  key={subject}
                  className="px-2 py-1 text-xs rounded-lg bg-primary/10 text-primary"
                >
                  {subject}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2 italic">&quot;{application.bio}&quot;</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-col">
          <Button 
            onClick={onApprove}
            size="sm" 
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Tutor
          </Button>
          <Button 
            onClick={onReject}
            variant="outline" 
            size="sm" 
            className="gap-2 text-destructive hover:bg-destructive/10"
          >
            <XCircle className="w-4 h-4" />
            Reject Application
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                View Full Application
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Contact Applicant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

function SessionCard({ 
  session, 
  onApprove,
  onReject,
  index 
}: { 
  session: SessionRecord
  onApprove: () => void
  onReject: () => void
  index: number
}) {
  return (
    <div 
      className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{session.subject}</h4>
              <p className="text-sm text-muted-foreground">
                Tutor: {session.tutorName} | Student: {session.studentName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {session.duration} hours
            </span>
            <span>
              {new Date(session.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            {session.requiresParentVerification && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${session.parentVerified ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                {session.parentVerified ? 'Parent Verified' : 'Awaiting Parent Verification'}
              </span>
            )}
          </div>
          {session.notes && (
            <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded-lg">
              Notes: {session.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={onApprove}
            size="sm" 
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </Button>
          <Button 
            onClick={onReject}
            variant="outline" 
            size="sm" 
            className="gap-2 text-destructive hover:bg-destructive/10"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  )
}
