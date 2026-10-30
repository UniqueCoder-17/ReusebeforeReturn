import { useNotifications, useMarkNotificationsRead } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkNotificationsRead()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {(notifications as Notification[]).some((n) => !n.is_read) && (
          <Button variant="outline" size="sm" onClick={() => markRead.mutate(undefined)}>
            <CheckCheck className="h-4 w-4 mr-2" />Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : (notifications as Notification[]).length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No notifications yet</h2>
          <p className="text-muted-foreground">Activity on your listings and requests will show up here</p>
        </div>
      ) : (
        <div className="divide-y border rounded-xl overflow-hidden">
          {(notifications as Notification[]).map((n) => (
            <div key={n.id} className={cn('flex items-start gap-3 px-4 py-3', !n.is_read ? 'bg-green-50' : 'bg-background')}>
              <Bell className={cn('h-4 w-4 mt-1 shrink-0', !n.is_read ? 'text-green-600' : 'text-muted-foreground')} />
              <div className="flex-1">
                <p className={cn('text-sm', !n.is_read ? 'font-semibold' : '')}>{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <Button variant="ghost" size="sm" className="shrink-0 text-xs" onClick={() => markRead.mutate([n.id])}>
                  Mark read
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
