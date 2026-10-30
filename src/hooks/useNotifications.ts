import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export function useNotifications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Realtime subscription for notifications
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel(`notifications_${user.id}_${crypto.randomUUID()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, queryClient])

  return query
}

export function useUnreadCount() {
  const { data: notifications } = useNotifications()
  return notifications?.filter((n: { is_read: boolean }) => !n.is_read).length ?? 0
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (ids?: string[]) => {
      if (!user) return
      let q = supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
      if (ids && ids.length > 0) q = q.in('id', ids)
      const { error } = await q
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export async function createNotification(params: {
  user_id: string
  type: string
  title: string
  message: string
  related_entity_id?: string
  related_entity_type?: string
}) {
  await supabase.from('notifications').insert(params)
}
