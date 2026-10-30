import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Calendar, Tag, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToggleFavorite, useFavoriteIds } from '@/hooks/useFavorites'
import { useAuth } from '@/contexts/AuthContext'
import { formatPrice, formatDate, conditionLabel, statusLabel, cn } from '@/lib/utils'
import type { Product } from '@/types'

const CATEGORY_IMAGES: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'toys-baby': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  appliances: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80',
  handicrafts: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80',
}
const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'

interface Props { product: Product; distance?: number }

export function ProductCard({ product, distance }: Props) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: favIds } = useFavoriteIds()
  const toggleFav = useToggleFavorite()
  const [imgError, setImgError] = useState(false)

  const primaryImage = product.product_images?.find(i => i.is_primary)?.image_url || product.product_images?.[0]?.image_url
  const categorySlug = (product.categories as { slug?: string } | undefined)?.slug
  const fallbackImg = categorySlug ? (CATEGORY_IMAGES[categorySlug] || PLACEHOLDER) : PLACEHOLDER
  const imgSrc = (!imgError && primaryImage) ? primaryImage : fallbackImg
  const isFav = favIds?.has(product.id) ?? false

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    await toggleFav.mutateAsync({ productId: product.id, isFav })
  }

  return (
    <Card className="product-card overflow-hidden cursor-pointer group" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img src={imgSrc} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} loading="lazy" />
        {product.status !== 'active' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg uppercase">{statusLabel(product.status)}</span>
          </div>
        )}
        {product.listing_type === 'free' && product.status === 'active' && <Badge variant="free" className="absolute top-2 left-2">Free</Badge>}
        <button onClick={handleFav} className={cn('absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow transition-colors', isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-400')} aria-label={isFav ? 'Remove from favorites' : 'Save'}>
          <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
        </button>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">{product.title}</h3>
          <div className="text-sm font-bold text-green-700 whitespace-nowrap">{formatPrice(product.price, product.listing_type)}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">{conditionLabel(product.condition)}</Badge>
          {product.categories && <Badge variant="secondary" className="text-xs">{(product.categories as { name?: string }).name}</Badge>}
        </div>
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{product.locality}, {product.city}</span>
            {distance !== undefined && <span className="ml-auto text-green-600 font-medium shrink-0">{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)} km`}</span>}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formatDate(product.created_at)}</span>
            {product.views_count > 0 && <span className="ml-auto flex items-center gap-0.5"><Eye className="h-3 w-3" /> {product.views_count}</span>}
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full text-xs h-7 mt-1" onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`) }}>
          <Tag className="h-3 w-3 mr-1" /> View Details
        </Button>
      </div>
    </Card>
  )
}
