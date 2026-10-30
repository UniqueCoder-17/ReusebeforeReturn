import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const isPlaceholderUrl = /your-project|example\.supabase\.co/i.test(supabaseUrl)

export const supabaseConfigurationError =
  !supabaseUrl || !supabaseAnonKey || isPlaceholderUrl
    ? 'Supabase is not configured. Set a real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then restart the dev server.'
    : null

const createNoopResult = (message = supabaseConfigurationError ?? 'Supabase is not configured.') => ({
  data: null,
  error: new Error(message),
})

const createNoopQueryBuilder = () => {
  const result = createNoopResult()
  const builder = {
    select: () => builder,
    insert: async () => result,
    update: () => builder,
    upsert: async () => result,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    or: () => builder,
    in: () => builder,
    is: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    maybeSingle: async () => result,
    single: async () => result,
    then: (resolve: (value: typeof result) => unknown) => resolve(result),
    catch: (onRejected: (reason: unknown) => unknown) => Promise.resolve(result).catch(onRejected),
  }
  return builder
}

const createNoopSupabase = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => undefined,
        },
      },
      error: null,
    }),
    signInWithPassword: async () => ({ data: { user: null }, error: createNoopResult().error }),
    signUp: async () => ({ data: { user: null }, error: createNoopResult().error }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: createNoopResult().error }),
    updateUser: async () => ({ data: { user: null }, error: createNoopResult().error }),
  },
  from: () => createNoopQueryBuilder(),
  rpc: async () => createNoopResult(),
  storage: {
    from: () => ({
      upload: async () => createNoopResult(),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => undefined }),
    }),
  }),
  removeChannel: () => undefined,
})

if (supabaseConfigurationError) {
  console.warn(`[Reuse Before Return] ${supabaseConfigurationError}`)
}

export const supabase = supabaseConfigurationError
  ? (createNoopSupabase() as unknown as ReturnType<typeof createClient>)
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
