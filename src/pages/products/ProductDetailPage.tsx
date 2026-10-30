import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Calendar, Tag, Truck, Share2, Flag, Edit, Heart, AlertCircle, ChevronLeft, ChevronRight, User, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RequestModal } from '@/components/products/RequestModal'
import { ReportModal } from '@/components/products/ReportModal'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useToggleFavorite, useFavoriteIds } from '@/hooks/useFavorites'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { formatPrice, formatDate, conditionLabel, statusLabel, pickupLabel, listingTypeLabel, cn, timeAgo } from '@/lib/utils'
import { ProductCard } from '@/components/products/ProductCard'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [imgIdx, setImgIdx] = useState(0)
  const [requestOpen, setRequestOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [alertSub, setAlertSub] = useState(false)
  const [alertLoading, setAlertLoading] = useState(false)

  const { data: product, isLoading, error } = useProduct(id)
  const { data: favIds } = useFavoriteIds()
  const toggleFav = useToggleFavorite()
  const isFav = favIds?.has(id || '') ?? false
  const { data: similar } = useProducts({ category: product?.category_id, status: 'active', limit: 5 })
  const similarFiltered = (similar || []).filter(p => p.id !== id)

  const handleFav = async () => {
    if (!user) { navigate('/login'); return }
    await toggleFav.mutateAsync({ productId: id!, isFav })
    toast.success(isFav ? 'Removed from favorites' : 'Saved to favorites!')
  }

  const handleNotifyMe = async () => {
    if (!user) { navigate('/login'); return }
    setAlertLoading(true)
    const { error } = await supabase.from('product_alert_subscriptions').upsert({ user_id: user.id, product_id: id, active: true })
    setAlertLoading(false)
    if (!error) { setAlertSub(true); toast.success("You'll be notified when this item becomes available!") }
    else toast.error('Failed to subscribe.')
  }

  const handleMarkComplete = async () => {
    const { error } = await supabase.from('products').update({ status: 'completed' }).eq('id', id)
    if (!error) { toast.success('Marked as redistributed!'); navigate('/my-listings') }
    else toast.error('Failed to update.')
  }

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: product?.title, url: window.location.href }).catch(() => {})
    else { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }
  }

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-xl" />
        <div className="space-y-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-red-500 text-xl mb-4">Product not found or has been removed.</p>
      <Button onClick={() => navigate('/explore')}>Browse Other Items</Button>
    </div>
  )

  const images = product.product_images || []
  const currentImg = images[imgIdx]?.image_url || PLACEHOLDER
  const isOwner = user?.id === product.owner_id
  const canRequest = !isOwner && product.status === 'active' && !!user
  const isUnavailable = product.status !== 'active'
  const ownerProfile = product.profiles as { full_name?: string; avatar_url?: string; city?: string; created_at?: string; id?: string } | undefined

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/explore" className="hover:text-green-600">Explore</Link>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-xs">{product.title}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={currentImg} alt={product.title} className="w-full h-full object-cover" />
              {isUnavailable && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-2xl font-bold uppercase">{statusLabel(product.status)}</span></div>}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white shadow"><ChevronLeft className="h-4 w-4" /></button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white shadow"><ChevronRight className="h-4 w-4" /></button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setImgIdx(i)} className={cn('w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0', i === imgIdx ? 'border-green-600' : 'border-transparent')}>
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1 leading-tight">{product.title}</h1>
                <button onClick={handleFav} className={cn('p-2 rounded-full border', isFav ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 hover:border-red-200')}>
                  <Heart className={cn('h-5 w-5', isFav && 'fill-current')} />
                </button>
              </div>
              <div className="text-3xl font-bold text-green-700">
                {formatPrice(product.price, product.listing_type)}
                {product.original_price && product.listing_type === 'resale' && <span className="text-sm font-normal text-gray-400 ml-2 line-through">Originally {formatPrice(product.original_price, 'resale')}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.listing_type === 'free' ? 'free' : 'paid'}>{listingTypeLabel(product.listing_type)}</Badge>
              <Badge variant="outline">{conditionLabel(product.condition)}</Badge>
              {product.categories && <Badge variant="secondary">{(product.categories as { name?: string }).name}</Badge>}
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4 text-green-600 shrink-0" /><span>{product.locality}, {product.city}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4 text-green-600 shrink-0" /><span>Listed {timeAgo(product.created_at)}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Truck className="h-4 w-4 text-green-600 shrink-0" /><span>{pickupLabel(product.pickup_preference)}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Tag className="h-4 w-4 text-green-600 shrink-0" /><span>{statusLabel(product.status)}</span></div>
            </div>
            <div><h3 className="font-semibold mb-2">Description</h3><p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p></div>
            {product.reason && <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800"><strong>Reason for redistribution:</strong> {product.reason}</div>}

            {/* Owner */}
            <Card className="border-gray-100">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarImage src={ownerProfile?.avatar_url || ''} /><AvatarFallback className="bg-green-100 text-green-700">{ownerProfile?.full_name?.[0] || 'U'}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{ownerProfile?.full_name}</p>
                    <p className="text-xs text-gray-500">{ownerProfile?.city} · Member since {formatDate(ownerProfile?.created_at || '')}</p>
                  </div>
                  {ownerProfile?.id && <Button variant="outline" size="sm" asChild><Link to={`/profile/${ownerProfile.id}`}><User className="h-4 w-4 mr-1" /> Profile</Link></Button>}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {isOwner ? (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/products/${id}/edit`)}><Edit className="h-4 w-4 mr-2" /> Edit Listing</Button>
                  {product.status === 'reserved' && <Button className="flex-1" onClick={handleMarkComplete}>Mark as Redistributed</Button>}
                </div>
              ) : canRequest ? (
                <Button className="w-full" size="lg" onClick={() => setRequestOpen(true)}>Request This Item</Button>
              ) : isUnavailable ? (
                <div className="space-y-2">
                  <Button disabled className="w-full" size="lg">{statusLabel(product.status)} — Not Available</Button>
                  {product.status === 'reserved' && !alertSub && (
                    <Button variant="outline" className="w-full" onClick={handleNotifyMe} disabled={alertLoading}>
                      <Bell className="h-4 w-4 mr-2" />{alertLoading ? 'Subscribing...' : 'Notify Me When Available'}
                    </Button>
                  )}
                  {alertSub && <p className="text-center text-sm text-green-600">✓ You'll be notified when this becomes available</p>}
                </div>
              ) : !user ? (
                <Button className="w-full" size="lg" onClick={() => navigate('/login')}>Sign In to Request</Button>
              ) : null}
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleShare} className="flex-1"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
                <Button variant="ghost" size="sm" onClick={() => setReportOpen(true)} className="flex-1 text-red-500 hover:text-red-600"><Flag className="h-4 w-4 mr-2" /> Report</Button>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800"><strong>Safety reminder:</strong> Meet at a public place. Don't share your home address publicly. Exact pickup details are shared only after request acceptance.</p>
            </div>
          </div>
        </div>

        {similarFiltered.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Similar Items Nearby</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarFiltered.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <RequestModal product={product} open={requestOpen} onOpenChange={setRequestOpen} />
      <ReportModal targetType="product" targetId={id!} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  )
}
