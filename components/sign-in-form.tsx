"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function SignInForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    if (result.error) setError(result.error)
    setLoading(false)
  }

  return (
    

      
        
          Hifz Academy
          Sign in to your account
        
        
          

            

              Email
               setEmail(e.target.value)} required disabled={loading} />
            

            

              Password
               setPassword(e.target.value)} required disabled={loading} />
            

            {error && 

{error}

}
            
              {loading ? 'Signing in...' : 'Sign In'}
            
          

        
      
    

  )
}
