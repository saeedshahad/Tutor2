// Mock data for the entire application

export interface TutorRequest {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  grade: string
  subject: string
  modality: 'zoom' | 'google-meets' | 'phone-call' | 'in-person'
  genderPreference: 'any' | 'male' | 'female'
  preferredDate: string
  preferredTime: string
  createdAt: string
  status: 'pending' | 'claimed' | 'completed' | 'pending-link'
  tutorId?: string
  tutorName?: string
  tutorEmail?: string
  scheduledDate?: string
  meetingLink?: string
  notes?: string
  parentVerified?: boolean
}

export interface TutorApplication {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  age: string
  grade: string
  subjects: string[]
  bio: string
  appliedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface SessionRecord {
  id: string
  tutorId: string
  tutorName: string
  tutorEmail: string
  studentId: string
  studentName: string
  studentGrade: string
  subject: string
  date: string
  duration: number // in hours
  status: 'pending-parent-verification' | 'pending-approval' | 'approved' | 'rejected'
  notes?: string
  rejectionReason?: string
  requiresParentVerification: boolean
  parentVerified?: boolean
}

export interface ProgressEntry {
  month: string
  sessions: number
  hours: number
}

// Subjects available for tutoring
export const subjects = [
  'Mathematics',
  'ELA/English',
  'Science',
  'Social Studies',
  'Islamic Studies',
  'Tajweed/Quran',
]

// Grade levels
export const gradeLevels = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
]

// K-6 grades that require parent verification
export const k6Grades = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
]

// Helper function to check if grade requires parent verification
export function requiresParentVerification(grade: string): boolean {
  return k6Grades.includes(grade)
}

// Modality options
export const modalityOptions = [
  { value: 'zoom', label: 'Zoom Link', isVirtual: true },
  { value: 'google-meets', label: 'Google Meets', isVirtual: true },
  { value: 'phone-call', label: 'Phone Call', isVirtual: true },
  { value: 'in-person', label: 'In-Person', isVirtual: false },
]

// Time slot options
export const timeSlotOptions = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
]

// Gender preference options
export const genderPreferenceOptions = [
  { value: 'any', label: 'No Preference / Any Available' },
  { value: 'male', label: 'Male Tutors Only' },
  { value: 'female', label: 'Female Tutors Only' },
]

// Avatar options for tutors
export const avatarOptions = [
  { id: 'avatar-1', name: 'Scholar Blue', color: 'bg-blue-500' },
  { id: 'avatar-2', name: 'Sage Green', color: 'bg-emerald-700' },
  { id: 'avatar-3', name: 'Wisdom Purple', color: 'bg-purple-500' },
  { id: 'avatar-4', name: 'Sunset Orange', color: 'bg-orange-500' },
  { id: 'avatar-5', name: 'Ocean Teal', color: 'bg-teal-500' },
  { id: 'avatar-6', name: 'Rose Pink', color: 'bg-pink-500' },
]

// Mock tutor requests (marketplace)
export const mockTutorRequests: TutorRequest[] = [
  {
    id: 'req-001',
    studentId: 'student-001',
    studentName: 'Ahmad H.',
    studentEmail: 'ahmad.h@hifzacademy.edu',
    grade: '8th Grade',
    subject: 'Mathematics',
    modality: 'zoom',
    genderPreference: 'any',
    preferredDate: '2024-01-20',
    preferredTime: '3:00 PM',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'claimed',
    tutorId: 'tutor-001',
    tutorName: 'Yusuf Ali',
    tutorEmail: 'yusuf.a@hifzacademy.edu',
    scheduledDate: '2024-01-20T15:00:00Z',
    meetingLink: 'https://zoom.us/j/123456789',
  },
  {
    id: 'req-006',
    studentId: 'student-001',
    studentName: 'Ahmad H.',
    studentEmail: 'ahmad.h@hifzacademy.edu',
    grade: '8th Grade',
    subject: 'Science',
    modality: 'google-meets',
    genderPreference: 'any',
    preferredDate: '2024-01-22',
    preferredTime: '4:00 PM',
    createdAt: '2024-01-16T08:00:00Z',
    status: 'pending-link',
    tutorId: 'tutor-002',
    tutorName: 'Noor Hassan',
    tutorEmail: 'noor.h@hifzacademy.edu',
    scheduledDate: '2024-01-22T16:00:00Z',
  },
  {
    id: 'req-002',
    studentId: 'student-002',
    studentName: 'Sara M.',
    studentEmail: 'sara.m@hifzacademy.edu',
    grade: '6th Grade',
    subject: 'Science',
    modality: 'google-meets',
    genderPreference: 'female',
    preferredDate: '2024-01-21',
    preferredTime: '2:00 PM',
    createdAt: '2024-01-15T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'req-003',
    studentId: 'student-003',
    studentName: 'Omar K.',
    studentEmail: 'omar.k@hifzacademy.edu',
    grade: '5th Grade',
    subject: 'Tajweed/Quran',
    modality: 'in-person',
    genderPreference: 'male',
    preferredDate: '2024-01-22',
    preferredTime: '4:00 PM',
    createdAt: '2024-01-14T14:00:00Z',
    status: 'pending',
  },
  {
    id: 'req-004',
    studentId: 'student-004',
    studentName: 'Layla A.',
    studentEmail: 'layla.a@hifzacademy.edu',
    grade: '9th Grade',
    subject: 'ELA/English',
    modality: 'zoom',
    genderPreference: 'any',
    preferredDate: '2024-01-18',
    preferredTime: '3:00 PM',
    createdAt: '2024-01-14T11:00:00Z',
    status: 'pending-link',
    tutorId: 'tutor-001',
    tutorName: 'Yusuf A.',
    tutorEmail: 'yusuf.a@hifzacademy.edu',
    scheduledDate: '2024-01-18T15:00:00Z',
  },
  {
    id: 'req-005',
    studentId: 'student-005',
    studentName: 'Zayn R.',
    studentEmail: 'zayn.r@hifzacademy.edu',
    grade: '7th Grade',
    subject: 'Islamic Studies',
    modality: 'zoom',
    genderPreference: 'male',
    preferredDate: '2024-01-19',
    preferredTime: '5:00 PM',
    createdAt: '2024-01-13T16:00:00Z',
    status: 'pending',
  },
]

// Mock tutor applications for admin review
export const mockTutorApplications: TutorApplication[] = [
  {
    id: 'app-001',
    userId: 'tutor-002',
    name: 'Mariam Khan',
    email: 'mariam.k@hifzacademy.edu',
    phone: '(555) 123-4567',
    age: '16',
    grade: '10th Grade',
    subjects: ['ELA/English', 'Islamic Studies'],
    bio: 'I love helping younger students understand literature and Islamic history. I have been a top student in these subjects for 3 years.',
    appliedAt: '2024-01-14T08:00:00Z',
    status: 'pending',
  },
  {
    id: 'app-002',
    userId: 'tutor-003',
    name: 'Ibrahim Patel',
    email: 'ibrahim.p@hifzacademy.edu',
    phone: '(555) 234-5678',
    age: '17',
    grade: '12th Grade',
    subjects: ['Mathematics', 'Science'],
    bio: 'As a senior with strong STEM skills, I want to give back by tutoring students in math and science.',
    appliedAt: '2024-01-13T12:00:00Z',
    status: 'pending',
  },
  {
    id: 'app-003',
    userId: 'tutor-004',
    name: 'Aisha Rahman',
    email: 'aisha.r@hifzacademy.edu',
    phone: '(555) 345-6789',
    age: '16',
    grade: '11th Grade',
    subjects: ['Tajweed/Quran'],
    bio: 'I have completed my Hifz and want to help younger students with their Quran recitation and memorization.',
    appliedAt: '2024-01-12T09:00:00Z',
    status: 'pending',
  },
]

// Mock session records for hour auditing
export const mockSessionRecords: SessionRecord[] = [
  {
    id: 'session-001',
    tutorId: 'tutor-001',
    tutorName: 'Yusuf Ali',
    tutorEmail: 'yusuf.a@hifzacademy.edu',
    studentId: 'student-006',
    studentName: 'Hana B.',
    studentGrade: '8th Grade',
    subject: 'Mathematics',
    date: '2024-01-12T14:00:00Z',
    duration: 1.5,
    status: 'pending-approval',
    notes: 'Covered algebra basics and practice problems.',
    requiresParentVerification: false,
  },
  {
    id: 'session-002',
    tutorId: 'tutor-001',
    tutorName: 'Yusuf Ali',
    tutorEmail: 'yusuf.a@hifzacademy.edu',
    studentId: 'student-007',
    studentName: 'Khalid M.',
    studentGrade: '4th Grade',
    subject: 'Science',
    date: '2024-01-11T15:30:00Z',
    duration: 1,
    status: 'pending-parent-verification',
    notes: 'Reviewed photosynthesis chapter.',
    requiresParentVerification: true,
    parentVerified: false,
  },
  {
    id: 'session-003',
    tutorId: 'tutor-005',
    tutorName: 'Noor Hassan',
    tutorEmail: 'noor.h@hifzacademy.edu',
    studentId: 'student-008',
    studentName: 'Amira S.',
    studentGrade: '3rd Grade',
    subject: 'ELA/English',
    date: '2024-01-10T13:00:00Z',
    duration: 2,
    status: 'pending-parent-verification',
    notes: 'Essay writing and grammar review.',
    requiresParentVerification: true,
    parentVerified: false,
  },
]

// Mock student progress data
export const mockStudentProgress: ProgressEntry[] = [
  { month: 'Sep', sessions: 2, hours: 3 },
  { month: 'Oct', sessions: 4, hours: 6 },
  { month: 'Nov', sessions: 3, hours: 4.5 },
  { month: 'Dec', sessions: 5, hours: 7.5 },
  { month: 'Jan', sessions: 4, hours: 6 },
]

// Mock parent view data
export const mockParentChildData = {
  childName: 'Ahmad Hassan',
  childId: 'student-001',
  grade: '4th Grade', // K-6 grade for parent verification flow
  totalSessions: 18,
  totalHours: 27,
  upcomingSessions: [
    {
      id: 'upcoming-001',
      subject: 'Mathematics',
      tutorName: 'Yusuf A.',
      tutorEmail: 'yusuf.a@hifzacademy.edu',
      date: '2024-01-18T15:00:00Z',
      modality: 'zoom',
      meetingLink: 'https://zoom.us/j/123456789',
    },
    {
      id: 'upcoming-002',
      subject: 'Science',
      tutorName: 'Noor H.',
      tutorEmail: 'noor.h@hifzacademy.edu',
      date: '2024-01-20T14:00:00Z',
      modality: 'google-meets',
      meetingLink: null, // Pending link
    },
  ],
  sessionHistory: [
    {
      id: 'hist-001',
      subject: 'Mathematics',
      tutorName: 'Yusuf A.',
      tutorEmail: 'yusuf.a@hifzacademy.edu',
      date: '2024-01-10T15:00:00Z',
      duration: 1.5,
      notes: 'Great progress on fractions and decimals.',
      requiresVerification: true,
      isVerified: false,
    },
    {
      id: 'hist-002',
      subject: 'ELA/English',
      tutorName: 'Mariam K.',
      tutorEmail: 'mariam.k@hifzacademy.edu',
      date: '2024-01-08T14:00:00Z',
      duration: 1,
      notes: 'Worked on reading comprehension strategies.',
      requiresVerification: true,
      isVerified: true,
    },
    {
      id: 'hist-003',
      subject: 'Islamic Studies',
      tutorName: 'Ibrahim P.',
      tutorEmail: 'ibrahim.p@hifzacademy.edu',
      date: '2024-01-05T13:00:00Z',
      duration: 1,
      notes: 'Reviewed Prophet stories and key lessons.',
      requiresVerification: true,
      isVerified: true,
    },
  ],
  // Sessions requiring parent verification (K-6)
  pendingVerifications: [
    {
      id: 'verify-001',
      subject: 'Mathematics',
      tutorName: 'Yusuf A.',
      tutorEmail: 'yusuf.a@hifzacademy.edu',
      date: '2024-01-10T15:00:00Z',
      duration: 1.5,
      notes: 'Great progress on fractions and decimals.',
    },
  ],
}

// Platform analytics for admin
export const mockPlatformAnalytics = {
  totalStudents: 156,
  totalTutors: 24,
  activeSessions: 12,
  totalHoursThisMonth: 89,
  pendingApplications: 3,
  pendingHoursApproval: 4.5,
  subjectDistribution: [
    { subject: 'Mathematics', count: 45 },
    { subject: 'Science', count: 32 },
    { subject: 'ELA/English', count: 28 },
    { subject: 'Islamic Studies', count: 25 },
    { subject: 'Tajweed/Quran', count: 18 },
    { subject: 'Social Studies', count: 8 },
  ],
  weeklyTrend: [
    { day: 'Mon', sessions: 8 },
    { day: 'Tue', sessions: 12 },
    { day: 'Wed', sessions: 10 },
    { day: 'Thu', sessions: 15 },
    { day: 'Fri', sessions: 6 },
    { day: 'Sat', sessions: 4 },
    { day: 'Sun', sessions: 2 },
  ],
}
