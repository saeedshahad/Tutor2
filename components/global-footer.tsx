"use client"

import { Mail, Clock, HelpCircle, Shield } from 'lucide-react'

export function GlobalFooter() {
  return (
    <footer className="border-t border-border bg-sidebar py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HA</span>
              </div>
              <span className="font-semibold text-foreground">Hifz Academy Scholar Link</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students through peer tutoring excellence.
            </p>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Help & Support Desk
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@hifzacademy.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Tech Office: Mon-Fri, 8am-4pm</span>
              </div>
            </div>
          </div>

          {/* Safety */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Safety & Privacy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Report concerns or safety issues directly to the Academy Tech Office. All sessions are monitored for student safety.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hifz Academy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
