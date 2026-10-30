import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { INDIAN_STATES } from '@/lib/constants'
import { validateIndianPhone } from '@/lib/utils'
import { Loader2, Save, Trash2, Shield } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().refine((v) => !v || validateIndianPhone(v), 'Enter a valid Indian mobile number'),
  bio: z.string().max(300).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  pin_code: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits').optional().or(z.literal('')),
})

const passwordSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, { message: 'Passwords do not match', path: ['confirm_password'] })

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const { register: regProfile, handleSubmit: hProfile, setValue: svProfile, formState: { errors: pErrors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      state: profile?.state || '',
      city: profile?.city || '',
      locality: profile?.locality || '',
      pin_code: profile?.pin_code || '',
    },
  })

  const { register: regPass, handleSubmit: hPass, formState: { errors: passErrors }, reset: resetPass } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })

  const { data: prefs, refetch: refetchPrefs } = useQuery({
    queryKey: ['notification-prefs', profile?.id],
    queryFn: async () => {
      if (!profile) return null
      const { data } = await supabase.from('notification_preferences').select('*').eq('user_id', profile.id).single()
      return data
    },
    enabled: !!profile,
  })

  const updatePrefs = async (field: string, value: boolean | string) => {
    if (!profile) return
    const { error } = await supabase.from('notification_preferences').update({ [field]: value }).eq('user_id', profile.id)
    if (error) toast.error(error.message)
    else { toast.success('Preference saved'); refetchPrefs() }
  }

  const onSaveProfile = async (data: ProfileData) => {
    setSavingProfile(true)
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: data.full_name,
        phone: data.phone || null,
        bio: data.bio || null,
        state: data.state || null,
        city: data.city || null,
        locality: data.locality || null,
        pin_code: data.pin_code || null,
      }).eq('id', profile!.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profile updated!')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (data: PasswordData) => {
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.new_password })
      if (error) throw error
      toast.success('Password changed!')
      resetPass()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    try {
      await supabase.from('profiles').update({ is_active: false }).eq('id', profile!.id)
      await supabase.auth.signOut()
      navigate('/')
      toast.success('Account deleted. We are sorry to see you go.')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete account')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your public name, location, and bio. Phone number is private.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={hProfile(onSaveProfile)} className="space-y-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input {...regProfile('full_name')} />
                  {pErrors.full_name && <p className="text-xs text-red-500 mt-1">{pErrors.full_name.message}</p>}
                </div>
                <div>
                  <Label>Phone Number (private)</Label>
                  <Input {...regProfile('phone')} placeholder="+91 98765 43210" />
                  {pErrors.phone && <p className="text-xs text-red-500 mt-1">{pErrors.phone.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Never shown publicly</p>
                </div>
                <div>
                  <Label>Bio (optional)</Label>
                  <Textarea {...regProfile('bio')} placeholder="A little about yourself..." rows={3} />
                </div>
                <div>
                  <Label>State / UT</Label>
                  <Select onValueChange={(v) => svProfile('state', v)} defaultValue={profile?.state || ''}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City / Town</Label>
                    <Input {...regProfile('city')} placeholder="e.g. Hyderabad" />
                  </div>
                  <div>
                    <Label>Locality / Area</Label>
                    <Input {...regProfile('locality')} placeholder="e.g. Gachibowli" />
                  </div>
                </div>
                <div>
                  <Label>PIN Code</Label>
                  <Input {...regProfile('pin_code')} placeholder="6-digit PIN" maxLength={6} />
                  {pErrors.pin_code && <p className="text-xs text-red-500 mt-1">{pErrors.pin_code.message}</p>}
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Use a strong password with at least 8 characters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={hPass(onChangePassword)} className="space-y-4">
                <div>
                  <Label>New Password</Label>
                  <Input type="password" {...regPass('new_password')} />
                  {passErrors.new_password && <p className="text-xs text-red-500 mt-1">{passErrors.new_password.message}</p>}
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" {...regPass('confirm_password')} />
                  {passErrors.confirm_password && <p className="text-xs text-red-500 mt-1">{passErrors.confirm_password.message}</p>}
                </div>
                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure what emails you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prefs ? (
                <>
                  {[
                    { field: 'email_enabled', label: 'Enable email notifications', description: 'Master toggle for all email notifications' },
                    { field: 'request_emails', label: 'Request notifications', description: 'When someone requests your listing or your request status changes' },
                    { field: 'message_emails', label: 'Message notifications', description: 'When you receive a new message' },
                    { field: 'availability_alerts', label: 'Availability alerts', description: 'When a saved item becomes available' },
                    { field: 'saved_search_alerts', label: 'Saved search alerts', description: 'New listings matching your saved searches' },
                  ].map((item) => (
                    <div key={item.field} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={!!(prefs as Record<string, unknown>)[item.field]}
                        onCheckedChange={(v) => updatePrefs(item.field, v)}
                      />
                    </div>
                  ))}
                  <div className="pt-2">
                    <Label>Digest Frequency</Label>
                    <Select
                      value={(prefs as { digest_frequency?: string }).digest_frequency || 'immediate'}
                      onValueChange={(v) => updatePrefs('digest_frequency', v)}
                    >
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Loading preferences…</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-sm mb-1">Delete Account</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Permanently remove your profile, listings, and all associated data.
                </p>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
