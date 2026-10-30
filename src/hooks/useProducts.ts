import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

export interface ProductFilters {
  search?: string
  category?: string
  condition?: string
  listing_type?: string
  city?: string
  locality?: string
  status?: string
  owner_id?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'price' | 'title'
  sortDir?: 'asc' | 'desc'
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let q = supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug, icon),
          profiles(id, full_name, avatar_url, city, locality),
          product_images(id, image_url, is_primary)
        `)
        .eq('is_draft', false)
        .neq('status', 'deleted')

      if (filters.status) q = q.eq('status', filters.status)
      else q = q.neq('status', 'deleted')

      if (filters.owner_id) q = q.eq('owner_id', filters.owner_id)
      if (filters.category) q = q.eq('category_id', filters.category)
      if (filters.condition) q = q.eq('condition', filters.condition)
      if (filters.listing_type) q = q.eq('listing_type', filters.listing_type)
      if (filters.city) q = q.ilike('city', `%${filters.city}%`)
      if (filters.locality) q = q.ilike('locality', `%${filters.locality}%`)

      if (filters.search) {
        q = q.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const sortCol = filters.sortBy || 'created_at'
      const sortAsc = filters.sortDir === 'asc'
      q = q.order(sortCol, { ascending: sortAsc })

      if (filters.limit) q = q.limit(filters.limit)
      if (filters.offset) q = q.range(filters.offset, filters.offset + (filters.limit || 20) - 1)

      const { data, error } = await q
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug, icon),
          profiles(id, full_name, avatar_url, city, locality, created_at, role),
          product_images(id, image_url, is_primary)
        `)
        .eq('id', id)
        .neq('status', 'deleted')
        .single()
      if (error) throw error
      // Increment view count (fire and forget)
      supabase.from('products').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id)
      return data as Product
    },
    enabled: !!id,
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').update({ status: 'deleted' }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data
    },
  })
}
