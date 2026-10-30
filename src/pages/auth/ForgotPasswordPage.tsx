import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Leaf, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/settings?tab=password` })
    setLoading(false)
    if (error) toast.error(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center"><Leaf className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-bold text-green-700">Reuse Before Return</span>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>{sent ? 'Check your email for a reset link.' : "Enter your email and we'll send a reset link."}</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"><Mail className="h-8 w-8 text-green-600" /></div>
                <p className="text-sm text-gray-600">If an account with <strong>{email}</strong> exists, a password reset link has been sent. Check your inbox and spam folder.</p>
                <Link to="/login"><Button variant="outline" className="w-full"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Login</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fp-email">Email Address</Label>
                  <Input id="fp-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading || !email.trim()}>
                  <Mail className="h-4 w-4 mr-2" />{loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Link to="/login" className="block text-center text-sm text-green-600 hover:underline"><ArrowLeft className="h-3 w-3 inline mr-1" />Back to Login</Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
