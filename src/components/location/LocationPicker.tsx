import { useState } from 'react'
import { MapPin, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INDIAN_STATES } from '@/lib/constants'

interface LocationValue { state: string; city: string; locality: string; pin_code?: string; latitude?: number; longitude?: number }
interface Props { value: LocationValue; onChange: (v: LocationValue) => void; showPinCode?: boolean }

export function LocationPicker({ value, onChange, showPinCode = true }: Props) {
  const [geoLoading, setGeoLoading] = useState(false)

  const requestGeo = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported. Please enter your location manually.'); return }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        const data = await res.json()
        const addr = data.address || {}
        onChange({ ...value, latitude, longitude, city: addr.city || addr.town || addr.village || value.city, locality: addr.suburb || addr.neighbourhood || value.locality, state: addr.state || value.state, pin_code: addr.postcode || value.pin_code })
      } catch { onChange({ ...value, latitude, longitude }) }
      finally { setGeoLoading(false) }
    }, () => { setGeoLoading(false); alert('Location permission denied. Please enter your location manually.') })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Location</h4>
        <Button type="button" variant="outline" size="sm" onClick={requestGeo} disabled={geoLoading} className="text-xs">
          {geoLoading ? <><Loader className="h-3 w-3 mr-1 animate-spin" />Detecting...</> : <><MapPin className="h-3 w-3 mr-1" />Use My Location</>}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>State / Union Territory <span className="text-red-500">*</span></Label>
          <Select value={value.state} onValueChange={v => onChange({ ...value, state: v })}>
            <SelectTrigger><SelectValue placeholder="Select state..." /></SelectTrigger>
            <SelectContent>{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>City / Town <span className="text-red-500">*</span></Label>
          <Input value={value.city} onChange={e => onChange({ ...value, city: e.target.value })} placeholder="e.g. Hyderabad" />
        </div>
        <div className="space-y-1.5">
          <Label>Locality / Area <span className="text-red-500">*</span></Label>
          <Input value={value.locality} onChange={e => onChange({ ...value, locality: e.target.value })} placeholder="e.g. Madhapur, Gachibowli" />
        </div>
        {showPinCode && (
          <div className="space-y-1.5">
            <Label>PIN Code (optional)</Label>
            <Input value={value.pin_code || ''} onChange={e => onChange({ ...value, pin_code: e.target.value })} placeholder="e.g. 500081" maxLength={6} />
          </div>
        )}
      </div>
    </div>
  )
}
