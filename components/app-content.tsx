"use client"

import { useAuth } from '@/lib/auth-context'
import { SignInForm } from '@/components/sign-in-form'
import { DashboardHeader } from '@/components/dashboard-header'
import { GlobalFooter } from '@/components/global-footer'
import { AdminDashboard } from '@/components/dashboards/admin-dashboard'
import { TutorDashboard } from '@/components/dashboards/tutor-dashboard'
import { StudentDashboard } from '@/components/dashboards/student-dashboard'
import { ParentDashboard } from '@/components/dashboards/parent-dashboard'

export function AppContent() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <SignInForm />
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />
      case 'tutor':
        return <TutorDashboard />
      case 'student':
        return <StudentDashboard />
      case 'parent':
        return <ParentDashboard />
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {renderDashboard()}
      </main>
      <GlobalFooter />
    </div>
  )
}
