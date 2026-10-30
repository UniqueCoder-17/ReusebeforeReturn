import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Calendar, Package } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/types'

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, locality, state, bio, created_at, role')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!id,
  })

  const { data: products = [], isLoading: productsLoading } = useProducts({ owner_id: id, status: 'active', limit: 20 })
  const { data: completedProducts = [] } = useProducts({ owner_id: id, status: 'completed', limit: 100 })

  if (profileLoading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
  }

  if (!profile) {
    return <div className="text-center py-24"><h1 className="text-xl font-semibold">Profile not found</h1></div>
  }

  const initials = profile.full_name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start gap-6 mb-8 p-6 border rounded-xl bg-muted/30">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-green-100 text-green-700 text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            {profile.role === 'admin' && <Badge variant="default" className="text-xs">Admin</Badge>}
          </div>
          {(profile.locality || profile.city) && (
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {[profile.locality, profile.city, profile.state].filter(Boolean).join(', ')}
            </p>
          )}
          {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />Member since {formatDate(profile.created_at)}
          </p>
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{products.length}</div>
              <div className="text-xs text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{completedProducts.length}</div>
              <div className="text-xs text-muted-foreground">Redistributed</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-green-600" />
        Active Listings ({products.length})
      </h2>

      {productsLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-green-600" /></div>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground text-center py-8 border-2 border-dashed rounded-xl">No active listings</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
