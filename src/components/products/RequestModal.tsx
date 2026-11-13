import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useSubmitRequest } from '@/hooks/useRequests'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface Props { product: Product; open: boolean; onOpenChange: (o: boolean) => void }

export function RequestModal({ product, open, onOpenChange }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const submit = useSubmitRequest()

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return }
    if (!message.trim()) { toast.error('Please add a short message explaining your interest.'); return }
    const { data: existing } = await supabase.from('requests').select('id').eq('product_id', product.id).eq('requester_id', user.id).in('status', ['pending', 'accepted']).maybeSingle()
    if (existing) { toast.error('You already have an active request for this item.'); return }
    try {
      await submit.mutateAsync({ product_id: product.id, owner_id: product.owner_id, message: message.trim() })
      toast.success('Request sent! The owner will be notified.')
      setMessage(''); onOpenChange(false); navigate('/my-requests')
    } catch (err) { toast.error((err as Error).message || 'Failed to send request') }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-green-600" /> Request this Item</DialogTitle>
          <DialogDescription>Send a message to the owner of <strong>{product.title}</strong>.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">Submitting a request does not guarantee ownership. The owner reviews all requests. Pickup details are shared only after acceptance.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="req-msg">Your message <span className="text-red-500">*</span></Label>
            <Textarea id="req-msg" placeholder="Hi! I'm interested because... I can pick up at..." value={message} onChange={e => setMessage(e.target.value)} rows={4} maxLength={500} />
            <p className="text-xs text-gray-400 text-right">{message.length}/500</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800">
            🛡️ <strong>Safety reminder:</strong> Meet at a public place — mall, café, or metro station. Don't share your home address publicly.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submit.isPending || !message.trim()}>{submit.isPending ? 'Sending...' : 'Send Request'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
