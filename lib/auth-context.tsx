"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'student' | 'parent' | 'tutor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  grade?: string
  subjects?: string[]
  isApproved?: boolean
  pendingHours?: number
  approvedHours?: number
  linkedChildId?: string
}

// Mock users for testing different roles
export const mockUsers: Record<UserRole, User> = {
  student: {
    id: 'student-001',
    name: 'Ahmad Hassan',
    email: 'ahmad.h@hifzacademy.edu',
    role: 'student',
    avatar: 'avatar-1',
    grade: '8th Grade',
  },
  parent: {
    id: 'parent-001',
    name: 'Fatima Hassan',
    email: 'fatima.h@email.com',
    role: 'parent',
    avatar: 'avatar-2',
    linkedChildId: 'student-001',
  },
  tutor: {
    id: 'tutor-001',
    name: 'Yusuf Ali',
    email: 'yusuf.a@hifzacademy.edu',
    role: 'tutor',
    avatar: 'avatar-3',
    grade: '11th Grade',
    subjects: ['Mathematics', 'Science'],
    isApproved: true,
    pendingHours: 4.5,
    approvedHours: 28,
  },
  admin: {
    id: 'admin-001',
    name: 'Dr. Sarah Ahmed',
    email: 'sarah.ahmed@hifzacademy.edu',
    role: 'admin',
    avatar: 'avatar-4',
  },
}

// Mock pending tutor for testing approval flow
export const pendingTutor: User = {
  id: 'tutor-002',
  name: 'Mariam Khan',
  email: 'mariam.k@hifzacademy.edu',
  role: 'tutor',
  avatar: 'avatar-5',
  grade: '10th Grade',
  subjects: ['ELA/English', 'Islamic Studies'],
  isApproved: false,
  pendingHours: 0,
  approvedHours: 0,
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (role: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (role: UserRole) => {
    setUser(mockUsers[role])
  }

  const logout = () => {
    setUser(null)
  }

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role])
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
