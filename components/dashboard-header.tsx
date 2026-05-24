"use client"

import { useAuth, UserRole } from '@/lib/auth-context'
import { 
  LayoutDashboard, 
  LogOut, 
  User,
  GraduationCap,
  Users,
  Shield,
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { AcademyLogo } from '@/components/academy-logo'

const roleIcons: Record<UserRole, React.ReactNode> = {
  student: <GraduationCap className="w-4 h-4" />,
  parent: <Users className="w-4 h-4" />,
  tutor: <User className="w-4 h-4" />,
  admin: <Shield className="w-4 h-4" />,
}

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  parent: 'Parent',
  tutor: 'Tutor',
  admin: 'Administrator',
}

export function DashboardHeader() {
  const { user, logout, switchRole } = useAuth()

  if (!user) return null

  const allRoles: UserRole[] = ['student', 'parent', 'tutor', 'admin']

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <AcademyLogo size="md" showText={true} />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Role Switcher for Testing */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {roleIcons[user.role]}
                <span className="hidden sm:inline">{roleLabels[user.role]}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch View (Testing)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => switchRole(role)}
                  className={user.role === role ? 'bg-accent' : ''}
                >
                  {roleIcons[role]}
                  <span className="ml-2">{roleLabels[role]}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="hidden md:inline text-sm">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
