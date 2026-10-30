import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import { useMyRequests, useIncomingRequests } from '@/hooks/useRequests'
import { useNotifications } from '@/hooks/useNotifications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Send, Inbox, Bell, Heart, Plus, ArrowRight, CheckCircle2 } from 'lucide-react'
import { formatDate, statusLabel } from '@/lib/utils'
import type { Notification } from '@/types'

export default function DashboardPage() {
  const { profile } = useAuth()
  const { data: myListings = [] } = useProducts({ owner_id: profile?.id, limit: 100 })
  const { data: myRequests = [] } = useMyRequests()
  const { data: incomingRequests = [] } = useIncomingRequests()
  const { data: notifications = [] } = useNotifications()

  const activeListings = myListings.filter((p) => p.status === 'active').length
  const completedListings = myListings.filter((p) => p.status === 'completed').length
  const pendingIncoming = (incomingRequests as { status: string }[]).filter((r) => r.status === 'pending').length
  const unreadNotifs = (notifications as Notification[]).filter((n) => !n.is_read).length

  const stats = [
    { label: 'Active Listings', value: activeListings, icon: Package, href: '/dashboard/my-listings', color: 'text-green-600' },
    { label: 'Redistributed', value: completedListings, icon: CheckCircle2, href: '/dashboard/my-listings', color: 'text-purple-600' },
    { label: 'Requests Sent', value: myRequests.length, icon: Send, href: '/dashboard/my-requests', color: 'text-blue-600' },
    { label: 'Pending Requests', value: pendingIncoming, icon: Inbox, href: '/dashboard/incoming-requests', color: 'text-orange-600' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profile?.locality && profile?.city ? `${profile.locality}, ${profile.city}` : profile?.city || 'India'}
          </p>
        </div>
        <Button asChild>
          <Link to="/list-item"><Plus className="h-4 w-4 mr-2" />List an Item</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Incoming Requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/incoming-requests">View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {(incomingRequests as { id: string; status: string; created_at: string; products?: { title: string }; profiles?: { full_name: string } }[]).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No requests yet</p>
            ) : (
              <div className="space-y-3">
                {(incomingRequests as { id: string; status: string; created_at: string; products?: { title: string }; profiles?: { full_name: string } }[]).slice(0, 4).map((req) => (
                  <div key={req.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{req.products?.title || '—'}</p>
                      <p className="text-xs text-muted-foreground">From {req.profiles?.full_name || 'Someone'} · {formatDate(req.created_at)}</p>
                    </div>
                    <Badge variant={req.status === 'pending' ? 'reserved' : req.status === 'accepted' ? 'free' : 'secondary'} className="shrink-0 text-xs">
                      {statusLabel(req.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Notifications
              {unreadNotifs > 0 && <Badge variant="default" className="text-xs">{unreadNotifs}</Badge>}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/notifications">View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {(notifications as Notification[]).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notifications yet</p>
            ) : (
              <div className="space-y-3">
                {(notifications as Notification[]).slice(0, 4).map((n) => (
                  <div key={n.id} className={`flex items-start gap-2 ${!n.is_read ? 'font-medium' : ''}`}>
                    <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${!n.is_read ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/dashboard/my-listings', icon: Package, label: 'My Listings' },
          { to: '/dashboard/my-requests', icon: Send, label: 'My Requests' },
          { to: '/dashboard/favorites', icon: Heart, label: 'Saved Items' },
          { to: '/messages', icon: Inbox, label: 'Messages' },
        ].map((item) => (
          <Button key={item.to} variant="outline" asChild className="h-auto flex-col py-4 gap-2">
            <Link to={item.to}>
              <item.icon className="h-5 w-5 text-green-600" />
              <span className="text-xs">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
