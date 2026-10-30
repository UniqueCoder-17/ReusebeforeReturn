import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useMyRequests() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['my-requests', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('requests')
        .select(`*, products(*, categories(name), product_images(image_url, is_primary)), profiles!requests_owner_id_fkey(full_name, avatar_url, city)`)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useIncomingRequests() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['incoming-requests', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('requests')
        .select(`*, products(*, categories(name), product_images(image_url, is_primary)), profiles!requests_requester_id_fkey(full_name, avatar_url, city, locality)`)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useSubmitRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: { product_id: string; owner_id: string; message: string }) => {
      const { data, error } = await supabase.from('requests').insert({
        product_id: params.product_id,
        owner_id: params.owner_id,
        message: params.message,
      }).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] })
    },
  })
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ requestId, status, userId }: { requestId: string; status: string; userId: string }) => {
      if (status === 'accepted') {
        // Use the atomic function to prevent race conditions
        const { data, error } = await supabase.rpc('accept_request', {
          p_request_id: requestId,
          p_admin_user_id: userId,
        })
        if (error) throw error
        const result = data as { success: boolean; error?: string }
        if (!result.success) throw new Error(result.error || 'Could not accept request')
      } else {
        const { error } = await supabase
          .from('requests')
          .update({ status })
          .eq('id', requestId)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incoming-requests'] })
      queryClient.invalidateQueries({ queryKey: ['my-requests'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
