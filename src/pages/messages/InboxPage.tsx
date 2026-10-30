import { Link } from 'react-router-dom'
import { useConversations } from '@/hooks/useMessages'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, MessageSquare } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

interface ConvRequest {
  products?: { title: string }
  profiles?: { id: string; full_name: string; avatar_url?: string }
  owner?: { id: string; full_name: string; avatar_url?: string }
}

interface Conv {
  id: string
  created_at: string
  requests?: ConvRequest
}

export default function InboxPage() {
  const { user } = useAuth()
  const { data: conversations = [], isLoading } = useConversations()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : (conversations as Conv[]).length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No conversations yet</h2>
          <p className="text-muted-foreground">Conversations start when a request is accepted</p>
        </div>
      ) : (
        <div className="divide-y border rounded-xl overflow-hidden">
          {(conversations as Conv[]).map((conv) => {
            const req = conv.requests
            const otherUser = req?.profiles?.id === user?.id ? req?.owner : req?.profiles
            const productTitle = req?.products?.title || 'Unknown item'
            const initials = otherUser?.full_name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
            return (
              <Link key={conv.id} to={`/messages/${conv.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{otherUser?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{productTitle}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">{timeAgo(conv.created_at)}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
