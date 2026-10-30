import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useConversations, useMessages, useSendMessage } from '@/hooks/useMessages'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'
import toast from 'react-hot-toast'

interface ConvReq {
  profiles?: { id: string; full_name: string }
  owner?: { id: string; full_name: string }
  products?: { title: string; id: string }
}
interface Conv { id: string; requests?: ConvReq }

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: conversations = [] } = useConversations()
  const { data: messages = [], isLoading } = useMessages(id)
  const sendMessage = useSendMessage()
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const conversation = (conversations as Conv[]).find((c) => c.id === id)
  const req = conversation?.requests
  const otherUser = req?.profiles?.id === user?.id ? req?.owner : req?.profiles
  const productTitle = req?.products?.title
  const productId = req?.products?.id

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!text.trim() || !id) return
    sendMessage.mutate({ conversation_id: id, message_text: text.trim() }, {
      onSuccess: () => setText(''),
      onError: (e) => toast.error(e.message),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background">
        <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {otherUser?.full_name?.split(' ').map((w) => w[0]).join('').slice(0, 2) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{otherUser?.full_name || 'User'}</p>
          {productTitle && productId && (
            <Link to={`/products/${productId}`} className="text-xs text-muted-foreground hover:underline truncate block">
              Re: {productTitle}
            </Link>
          )}
        </div>
      </div>

      <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs text-center border-b">
        🛡️ Meet in a safe public place. Never share financial details. Check community rules before pickup.
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-green-600" /></div>
        ) : (messages as Message[]).length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">No messages yet. Say hello!</div>
        ) : (
          (messages as Message[]).map((msg) => {
            const isMe = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={cn('flex items-end gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
                {!isMe && (
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarFallback className="text-xs">{(msg.profiles?.full_name || '?')[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-[75%] rounded-2xl px-3 py-2 text-sm', isMe ? 'bg-green-600 text-white' : 'bg-muted')}>
                  <p className="whitespace-pre-wrap">{msg.message_text}</p>
                  <p className={cn('text-xs mt-1', isMe ? 'text-green-100' : 'text-muted-foreground')}>{timeAgo(msg.created_at)}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t flex gap-2 items-end">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="resize-none flex-1"
        />
        <Button onClick={handleSend} disabled={!text.trim() || sendMessage.isPending} size="icon" className="h-10 w-10">
          {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
