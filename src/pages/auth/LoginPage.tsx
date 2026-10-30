import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Leaf, LogIn, Users, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'
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

const DEMO_ACCOUNTS = [
  { label: 'Citizen 1', name: 'Arjun Reddy', email: 'citizen1@rbr.demo', password: 'Demo@1234', icon: '👤', role: 'user' },
  { label: 'Citizen 2', name: 'Priya Sharma', email: 'citizen2@rbr.demo', password: 'Demo@1234', icon: '👤', role: 'user' },
  { label: 'Citizen 3', name: 'Ravi Kumar', email: 'citizen3@rbr.demo', password: 'Demo@1234', icon: '👤', role: 'user' },
  { label: 'Admin', name: 'Platform Admin', email: 'admin@rbr.demo', password: 'Admin@1234', icon: '🛡️', role: 'admin' },
]

function friendlyError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('invalid_credentials')) {
    return 'Incorrect email or password. Try a demo account below.'
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
  const [showDemo, setShowDemo] = useState(true)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
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

  const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setValue('email', account.email, { shouldValidate: true })
    setValue('password', account.password, { shouldValidate: true })
    toast(`Filled: ${account.name}`, { icon: account.icon, duration: 2000 })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-4">

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-green-700">Reuse Before Return</span>
          </div>
        </div>

        {/* Demo Accounts Panel */}
        <Card className="border-green-200 bg-green-50/70 shadow-sm">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-green-800 hover:bg-green-100/60 rounded-t-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Demo Accounts — click to auto-fill
            </span>
            {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDemo && (
            <div className="px-4 pb-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-all text-xs hover:shadow-sm active:scale-95 ${
                      acc.role === 'admin'
                        ? 'border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-900'
                        : 'border-green-200 bg-white hover:bg-green-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span>{acc.icon}</span>
                      {acc.role === 'admin' && (
                        <ShieldCheck className="w-3 h-3 text-orange-500" />
                      )}
                      <span className="font-semibold">{acc.label}</span>
                    </div>
                    <div className="text-gray-500 truncate">{acc.name}</div>
                    <div className="text-gray-400 font-mono text-[10px] mt-0.5">{acc.email}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-green-700 text-center pt-1">
                Password for citizens: <code className="bg-green-100 px-1 rounded font-mono">Demo@1234</code>
                {' '}· Admin: <code className="bg-green-100 px-1 rounded font-mono">Admin@1234</code>
              </p>
              <p className="text-[11px] text-gray-400 text-center">
                Run <code className="bg-gray-100 px-1 rounded">npm run seed:demo</code> once to create these accounts in Supabase
              </p>
            </div>
          )}
        </Card>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
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
                  placeholder="citizen1@rbr.demo"
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
