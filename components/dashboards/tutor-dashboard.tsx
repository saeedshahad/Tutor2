"use client"

import { useState } from 'react'
import { 
  Clock, 
  CheckCircle2, 
  BookOpen,
  Search,
  Filter,
  AlertTriangle,
  Video,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Award,
  Link2,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DialogFooter,
} from "@/components/ui/dialog"
import { StatCard, SectionCard, StatusBadge } from '@/components/dashboard-cards'
import { useAuth } from '@/lib/auth-context'
import { 
  mockTutorRequests, 
  subjects,
  avatarOptions,
  TutorRequest
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const modalityIcons: Record<string, React.ReactNode> = {
  'zoom': <Video className="w-4 h-4" />,
  'google-meets': <Video className="w-4 h-4" />,
  'phone-call': <Phone className="w-4 h-4" />,
  'in-person': <MapPin className="w-4 h-4" />,
}

export function TutorDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(mockTutorRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar-1')
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  
  // Meeting link modal state
  const [linkModalSession, setLinkModalSession] = useState<TutorRequest | null>(null)
  const [meetingLink, setMeetingLink] = useState('')

  // Check if tutor is approved
  const isApproved = user?.isApproved !== false

  const handleClaimSession = (id: string) => {
    const session = requests.find(r => r.id === id)
    if (!session) return
    
    // For virtual sessions (Zoom/Google Meets), open link modal
    if (session.modality === 'zoom' || session.modality === 'google-meets') {
      setLinkModalSession(session)
      setMeetingLink('')
    } else {
      // For phone/in-person, claim directly
      setRequests(reqs =>
        reqs.map(req =>
          req.id === id 
            ? { 
                ...req, 
                status: 'claimed' as const,
                tutorId: user?.id,
                tutorName: user?.name,
                tutorEmail: user?.email,
                scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
              } 
            : req
        )
      )
    }
  }

  const handleSubmitLink = () => {
    if (!linkModalSession || !meetingLink.trim()) return
    
    setRequests(reqs =>
      reqs.map(req =>
        req.id === linkModalSession.id 
          ? { 
              ...req, 
              status: 'claimed' as const,
              tutorId: user?.id,
              tutorName: user?.name,
              tutorEmail: user?.email,
              meetingLink: meetingLink.trim(),
              scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            } 
          : req
      )
    )
    setLinkModalSession(null)
    setMeetingLink('')
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const claimedByMe = requests.filter(r => r.status === 'claimed' && r.tutorId === user?.id)

  const filteredRequests = pendingRequests.filter(req => {
    const matchesSearch = req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || req.subject === subjectFilter
    return matchesSearch && matchesSubject
  })

  // Pending approval state
  if (!isApproved) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="max-w-md text-center space-y-6 p-8">
          <div className="w-20 h-20 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-warning" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Pending Administrative Review</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your tutor application is currently under review by our administrators. 
              You will be notified once your application has been approved.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Application Status:</span> Pending Administrative Approval
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            This usually takes 1-2 business days. If you have questions, contact the Academy Tech Office.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tutor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Browse and claim tutoring sessions</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setShowAvatarDialog(true)}>
          <Settings className="w-4 h-4" />
          Profile Settings
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Hours"
          value={user?.pendingHours || 0}
          subtitle="Awaiting approval"
          icon={<Clock className="w-6 h-6" />}
        />
        <StatCard
          title="Approved Hours"
          value={user?.approvedHours || 0}
          subtitle="Official record"
          icon={<Award className="w-6 h-6" />}
          className="border-primary/30"
        />
        <StatCard
          title="My Active Sessions"
          value={claimedByMe.length}
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Available Requests"
          value={pendingRequests.length}
          icon={<Calendar className="w-6 h-6" />}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 rounded-xl">
          <TabsTrigger value="marketplace" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="w-4 h-4" />
            Session Marketplace
          </TabsTrigger>
          <TabsTrigger value="my-sessions" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="w-4 h-4" />
            My Sessions
            {claimedByMe.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-primary/20 rounded-full">
                {claimedByMe.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Marketplace */}
        <TabsContent value="marketplace" className="space-y-4">
          <SectionCard
            title="Available Student Requests"
            subtitle="Browse and claim sessions to help fellow students"
            action={
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-48 h-9 rounded-lg"
                  />
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full sm:w-40 h-9 rounded-lg">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }
          >
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No requests available</p>
                <p className="text-muted-foreground">Check back later for new tutoring requests.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRequests.map((request, index) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onClaim={() => handleClaimSession(request.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* My Sessions */}
        <TabsContent value="my-sessions" className="space-y-4">
          <SectionCard
            title="My Claimed Sessions"
            subtitle="Sessions you have claimed and are scheduled to complete"
          >
            {claimedByMe.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No active sessions</p>
                <p className="text-muted-foreground">Claim sessions from the marketplace to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {claimedByMe.map((session, index) => (
                  <ClaimedSessionCard key={session.id} session={session} index={index} />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Select your profile avatar from the school-approved options.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Choose Your Avatar</Label>
            <div className="grid grid-cols-3 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    selectedAvatar === avatar.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
                    avatar.color
                  )}>
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-muted-foreground">{avatar.name}</span>
                </button>
              ))}
            </div>
            <Button className="w-full" onClick={() => setShowAvatarDialog(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Link Modal */}
      <Dialog open={!!linkModalSession} onOpenChange={() => setLinkModalSession(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Provide Meeting Link</DialogTitle>
            <DialogDescription>
              Enter the {linkModalSession?.modality === 'zoom' ? 'Zoom' : 'Google Meet'} link for this session. 
              The student will see this link on their dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-2">
              <p className="text-sm"><span className="text-muted-foreground">Student:</span> <span className="font-medium">{linkModalSession?.studentName}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{linkModalSession?.subject}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Preferred Date:</span> <span className="font-medium">{linkModalSession?.preferredDate}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Preferred Time:</span> <span className="font-medium">{linkModalSession?.preferredTime}</span></p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting-link" className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Meeting Link *
              </Label>
              <Input
                id="meeting-link"
                type="url"
                placeholder={linkModalSession?.modality === 'zoom' 
                  ? 'https://zoom.us/j/...' 
                  : 'https://meet.google.com/...'}
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Paste your meeting room link. Make sure the link is active and accessible.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkModalSession(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitLink}
              disabled={!meetingLink.trim()}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Claim Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RequestCard({ 
  request, 
  onClaim,
  index 
}: { 
  request: TutorRequest
  onClaim: () => void
  index: number
}) {
  const isInPerson = request.modality === 'in-person'
  const isVirtual = request.modality === 'zoom' || request.modality === 'google-meets'

  return (
    <div 
      className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {request.studentName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{request.subject}</h4>
              <p className="text-sm text-muted-foreground">
                {request.studentName} | {request.grade}
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {request.preferredDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {request.preferredTime}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card text-sm text-muted-foreground border border-border">
              {modalityIcons[request.modality]}
              {request.modality.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card text-sm text-muted-foreground border border-border">
              Gender Pref: {request.genderPreference === 'any' ? 'Any' : request.genderPreference.charAt(0).toUpperCase() + request.genderPreference.slice(1)}
            </span>
          </div>

          {isInPerson && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-warning">
                <span className="font-semibold">In-Person Session:</span> Requires signed parental permission slip. A parent/guardian must be physically present for the entire duration.
              </p>
            </div>
          )}

          {isVirtual && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-info/10 border border-info/20">
              <Video className="w-4 h-4 text-info shrink-0 mt-0.5" />
              <p className="text-xs text-info">
                <span className="font-semibold">Virtual Session:</span> You will need to provide a meeting link when claiming this session.
              </p>
            </div>
          )}
        </div>

        <Button onClick={onClaim} className="gap-2 bg-primary hover:bg-primary/90 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          Claim Session
        </Button>
      </div>
    </div>
  )
}

function ClaimedSessionCard({ 
  session,
  index 
}: { 
  session: TutorRequest
  index: number
}) {
  const isVirtual = session.modality === 'zoom' || session.modality === 'google-meets'
  
  return (
    <div 
      className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{session.subject}</h4>
              <p className="text-sm text-muted-foreground">
                Student: {session.studentName} | {session.grade}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {modalityIcons[session.modality]}
              {session.modality.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {session.scheduledDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {session.preferredTime}
            </span>
          </div>
          {isVirtual && session.meetingLink && (
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              <a 
                href={session.meetingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {session.meetingLink}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
        <StatusBadge status="claimed" />
      </div>
    </div>
  )
}
