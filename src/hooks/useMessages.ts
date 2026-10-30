import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export function useConversations() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          requests(
            id, status, message,
            products(title, product_images(image_url, is_primary)),
            profiles!requests_requester_id_fkey(id, full_name, avatar_url),
            owner:profiles!requests_owner_id_fkey(id, full_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      // Filter to only conversations where user is a participant
      return data.filter((c: { requests: { profiles: { id: string }; owner: { id: string } } }) => {
        const req = c.requests
        return req?.profiles?.id === user.id || req?.owner?.id === user.id
      })
    },
    enabled: !!user,
  })
}

export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return []
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(id, full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!conversationId,
  })

  useEffect(() => {
    if (!conversationId || !user) return
    const channel = supabase
      .channel(`messages_${conversationId}_${crypto.randomUUID()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId, user, queryClient])

  return query
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async ({ conversation_id, message_text }: { conversation_id: string; message_text: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('messages').insert({
        conversation_id,
        sender_id: user.id,
        message_text,
      })
      if (error) throw error
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['messages', vars.conversation_id] })
    },
  })
}
