import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Leaf, LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

function friendlyError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('invalid_credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (m.includes('email not confirmed') || m.includes('not confirmed')) {
    return 'Please confirm your email using the link in your inbox before signing in. Check your spam folder if you cannot find it.'
  }
  if (m.includes('supabase is not configured') || m.includes('not configured')) {
    return 'Supabase is not configured yet. Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, then restart the dev server.'
  }
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to fetch')) {
    return 'Cannot reach the server. Check your internet connection and Supabase URL.'
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many login attempts. Please wait a minute and try again.'
  }
  return message
}

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const { error } = await signIn(data.email, data.password)
    if (error) {
      toast.error(friendlyError(error.message), { duration: 6000 })
    } else {
      toast.success('Logged in successfully!')
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-green-700">Reuse Before Return</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    autoComplete="current-password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <LogIn className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 font-medium hover:underline">
                Create one free
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
