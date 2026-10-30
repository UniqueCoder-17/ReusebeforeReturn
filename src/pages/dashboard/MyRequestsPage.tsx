import { Link } from 'react-router-dom'
import { useMyRequests } from '@/hooks/useRequests'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Send, ArrowRight } from 'lucide-react'
import { formatDate, statusLabel } from '@/lib/utils'
import type { Request } from '@/types'

function statusVariant(status: string): 'reserved' | 'free' | 'destructive' | 'completed' | 'secondary' {
  if (status === 'pending') return 'reserved'
  if (status === 'accepted') return 'free'
  if (status === 'rejected') return 'destructive'
  if (status === 'completed') return 'completed'
  return 'secondary'
}

export default function MyRequestsPage() {
  const { data: requests = [], isLoading } = useMyRequests()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No requests yet</h2>
          <p className="text-muted-foreground mb-4">Browse items and send a request when you find something you need</p>
          <Button asChild><Link to="/explore">Explore Items</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {(requests as Request[]).map((req) => {
            const product = req.products
            const img = product?.product_images?.find((i) => i.is_primary) || product?.product_images?.[0]
            return (
              <Card key={req.id}>
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                    {img ? (
                      <img src={img.image_url} alt={product?.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm truncate">{product?.title || 'Listing Removed'}</h3>
                      <Badge variant={statusVariant(req.status)} className="shrink-0 text-xs capitalize">
                        {statusLabel(req.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product?.city && `${product.city} · `}Requested {formatDate(req.created_at)}
                    </p>
                    {req.message && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">"{req.message}"</p>
                    )}
                    {req.status === 'accepted' && (
                      <div className="mt-2">
                        <Badge variant="free" className="text-xs">Request accepted — check Messages</Badge>
                      </div>
                    )}
                  </div>
                  {product && (
                    <Button size="sm" variant="ghost" asChild className="shrink-0">
                      <Link to={`/products/${product.id}`}><ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
