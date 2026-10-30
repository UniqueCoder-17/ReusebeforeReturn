import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigurationError } from '@/lib/supabase'
import type { Profile } from '@/types'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (data: SignUpData) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

interface SignUpData {
  email: string
  password: string
  full_name: string
  phone?: string
  state?: string
  city?: string
  locality?: string
  pin_code?: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error && data) setProfile(data as Profile)
  }

  const refreshProfile = async () => {
    if (user?.id) await fetchProfile(user.id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (supabaseConfigurationError) return { error: new Error(supabaseConfigurationError) }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        // Supabase wraps errors in AuthApiError — pass through cleanly
        return { error: error as unknown as Error }
      }
      // If email confirmation is ON and user hasn't confirmed yet
      if (data?.user && !data.user.email_confirmed_at) {
        return {
          error: new Error(
            'Email not confirmed. Please check your inbox, or ask the admin to disable email confirmation in Supabase Auth settings.'
          ),
        }
      }
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unable to sign in.') }
    }
  }

  const signUp = async (data: SignUpData) => {
    if (supabaseConfigurationError) {
      return { error: new Error(supabaseConfigurationError), needsEmailConfirmation: false }
    }

    try {
      const { error, data: authData } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.full_name.trim(),
            phone: data.phone?.trim() || null,
            state: data.state || null,
            city: data.city?.trim() || null,
            locality: data.locality?.trim() || null,
            pin_code: data.pin_code?.trim() || null,
          },
        },
      })

      if (error) {
        return { error, needsEmailConfirmation: false }
      }

      return {
        error: null,
        needsEmailConfirmation: !authData.session,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Unable to create account.'),
        needsEmailConfirmation: false,
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      isAdmin: profile?.role === 'admin',
      signIn, signUp, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
