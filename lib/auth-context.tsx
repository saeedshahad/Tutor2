"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

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

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)

  const buildUser = async (session: Session): Promise => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (!profile) return null
    return {
      id: session.user.id,
      name: profile.full_name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
      role: profile.role as UserRole,
      avatar: profile.avatar_url || 'avatar-1',
      isApproved: profile.is_approved,
      pendingHours: profile.pending_hours || 0,
      approvedHours: profile.approved_hours || 0,
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) setUser(await buildUser(session))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) setUser(await buildUser(session))
        else setUser(null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const switchRole = (_role: UserRole) => {}

  return (
    
      {children}
    
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
