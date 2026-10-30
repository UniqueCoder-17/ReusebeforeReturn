import { useState } from 'react'
import { Flag, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { REPORT_REASONS } from '@/lib/constants'
import toast from 'react-hot-toast'

interface Props { targetType: 'product' | 'user'; targetId: string; open: boolean; onOpenChange: (o: boolean) => void }

export function ReportModal({ targetType, targetId, open, onOpenChange }: Props) {
  const { user } = useAuth()
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user) return
    if (!reason) { toast.error('Please select a reason.'); return }
    setLoading(true)
    const { error } = await supabase.from('reports').insert({ reporter_id: user.id, target_type: targetType, target_id: targetId, reason, description: description.trim() || null })
    setLoading(false)
    if (error) toast.error('Failed to submit report.')
    else { toast.success('Report submitted. Our team will review it.'); onOpenChange(false); setReason(''); setDescription('') }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Flag className="h-5 w-5 text-red-500" /> Report {targetType === 'product' ? 'Listing' : 'User'}</DialogTitle>
          <DialogDescription>Help keep Reuse Before Return safe.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">False reports may result in action against your account. Only report genuine violations.</p>
          </div>
          <div className="space-y-2">
            <Label>Reason <span className="text-red-500">*</span></Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Select a reason..." /></SelectTrigger>
              <SelectContent>{REPORT_REASONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Additional details (optional)</Label>
            <Textarea placeholder="Provide any additional context..." value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={500} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={loading || !reason}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
