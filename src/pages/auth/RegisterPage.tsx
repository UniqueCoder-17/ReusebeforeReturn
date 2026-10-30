import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf, UserPlus } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { INDIAN_STATES } from '@/lib/constants'
import toast from 'react-hot-toast'

const schema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  phone: z.string().optional().refine(v => !v || v.trim() === '' || /^(\+91)?[6-9]\d{9}$/.test(v.replace(/[\s\-().]/g, '')), 'Enter a valid 10-digit Indian mobile number'),
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  pin_code: z.string().optional().refine(v => !v || /^\d{6}$/.test(v), 'PIN code must be 6 digits'),
  terms: z.boolean().refine(v => v, 'You must accept the terms and conditions'),
}).refine(d => d.password === d.confirm_password, { message: 'Passwords do not match', path: ['confirm_password'] })
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { terms: false } })

  const onSubmit = async (data: FormData) => {
    const { error, needsEmailConfirmation } = await signUp({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      phone: data.phone,
      state: data.state,
      city: data.city,
      locality: data.locality,
      pin_code: data.pin_code,
    })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user_already_exists')) {
        toast.error('This email is already registered. Try logging in instead.')
      } else if (msg.includes('supabase is not configured') || msg.includes('not configured')) {
        toast.error('Supabase is not configured yet. Fill in .env and restart the dev server.')
      } else {
        toast.error(error.message)
      }
    } else {
      if (needsEmailConfirmation) {
        toast.success('Account created! Check your email to confirm your address before signing in.', { duration: 6000 })
        navigate('/login')
      } else {
        toast.success('Account created successfully!')
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center"><Leaf className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-bold text-green-700">Reuse Before Return</span>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join thousands of Indians giving products a second life</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="full_name" placeholder="Arjun Reddy" {...register('full_name')} />
                  {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="reg-email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="reg-email" type="email" placeholder="you@example.com" {...register('email')} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-pw">Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="reg-pw" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" {...register('password')} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-cpw">Confirm Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="reg-cpw" type={showCpw ? 'text' : 'password'} placeholder="Repeat password" {...register('confirm_password')} />
                    <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  {errors.confirm_password && <p className="text-red-500 text-xs">{errors.confirm_password.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="phone">Mobile Number (optional)</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210 or 9876543210" {...register('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  <p className="text-xs text-gray-500">Indian mobile number (+91 optional). Not shown publicly.</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Your Location (optional — helps with nearby discovery)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>State / UT</Label>
                      <Controller name="state" control={control} render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      )} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>City / Town</Label>
                      <Input placeholder="e.g. Hyderabad" {...register('city')} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Locality / Area</Label>
                      <Input placeholder="e.g. Madhapur" {...register('locality')} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>PIN Code</Label>
                      <Input placeholder="e.g. 500081" maxLength={6} {...register('pin_code')} />
                      {errors.pin_code && <p className="text-red-500 text-xs">{errors.pin_code.message}</p>}
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Controller name="terms" control={control} render={({ field }) => (
                    <div className="flex items-start gap-3">
                      <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                      <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                        I agree to the <Link to="/terms" className="text-green-600 underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy" className="text-green-600 underline" target="_blank">Privacy Policy</Link>. I confirm I am 18 years or older.
                      </label>
                    </div>
                  )} />
                  {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                <UserPlus className="h-4 w-4 mr-2" />{isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}<Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
