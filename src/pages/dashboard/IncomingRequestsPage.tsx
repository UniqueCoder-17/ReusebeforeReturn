import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useIncomingRequests, useUpdateRequestStatus } from '@/hooks/useRequests'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Inbox, Check, X } from 'lucide-react'
import { formatDate, statusLabel } from '@/lib/utils'
import type { Request } from '@/types'
import toast from 'react-hot-toast'

export default function IncomingRequestsPage() {
  const { user } = useAuth()
  const { data: requests = [], isLoading } = useIncomingRequests()
  const updateStatus = useUpdateRequestStatus()
  const [tab, setTab] = useState('pending')

  const filtered = (requests as Request[]).filter((r) => tab === 'all' ? true : r.status === tab)

  const handle = (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user) return
    updateStatus.mutate({ requestId, status, userId: user.id }, {
      onSuccess: () => toast.success(status === 'accepted' ? 'Request accepted! Conversation started.' : 'Request declined.'),
      onError: (e) => toast.error(e.message),
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Incoming Requests</h1>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No {tab === 'all' ? '' : tab} requests</h2>
          <p className="text-muted-foreground">Requests on your listings will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const product = req.products
            const requester = req.profiles
            const img = product?.product_images?.find((i) => i.is_primary) || product?.product_images?.[0]
            return (
              <Card key={req.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                      {img ? (
                        <img src={img.image_url} alt={product?.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/products/${product?.id}`} className="font-semibold text-sm hover:underline line-clamp-1">{product?.title}</Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Requested by <strong>{requester?.full_name || 'Someone'}</strong>
                            {requester?.city && ` · ${requester.city}`}
                          </p>
                        </div>
                        <Badge variant={req.status === 'pending' ? 'reserved' : req.status === 'accepted' ? 'free' : 'secondary'} className="shrink-0 text-xs capitalize">
                          {statusLabel(req.status)}
                        </Badge>
                      </div>
                      {req.message && (
                        <p className="text-sm mt-2 italic text-muted-foreground bg-muted px-3 py-2 rounded-md">"{req.message}"</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(req.created_at)}</p>
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" onClick={() => handle(req.id, 'accepted')} disabled={updateStatus.isPending} className="flex-1">
                        <Check className="h-4 w-4 mr-1" />Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handle(req.id, 'rejected')} disabled={updateStatus.isPending} className="flex-1">
                        <X className="h-4 w-4 mr-1" />Decline
                      </Button>
                    </div>
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
