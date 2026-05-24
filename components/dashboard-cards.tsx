"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-card border border-border p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-primary/10 text-primary" 
                : "bg-destructive/10 text-destructive"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface SectionCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, subtitle, action, children, className }: SectionCardProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-card border border-border overflow-hidden",
      className
    )}>
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'claimed' | 'completed' | 'active'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-primary/10 text-primary border-primary/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    claimed: 'bg-info/10 text-info border-info/20',
    completed: 'bg-primary/10 text-primary border-primary/20',
    active: 'bg-primary/10 text-primary border-primary/20',
  }

  const labels: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    claimed: 'Claimed',
    completed: 'Completed',
    active: 'Active',
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  )
}
