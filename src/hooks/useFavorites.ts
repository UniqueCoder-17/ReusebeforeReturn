import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useFavorites() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('favorites')
        .select(`*, products(*, categories(name, slug), product_images(image_url, is_primary))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useFavoriteIds() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['favorite-ids', user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>()
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id)
      if (error) throw error
      return new Set(data.map((f: { product_id: string }) => f.product_id))
    },
    enabled: !!user,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ productId, isFav }: { productId: string; isFav: boolean }) => {
      if (!user) throw new Error('Not authenticated')
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] })
    },
  })
}
