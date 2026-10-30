import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Search, MessageSquare, MapPin, Shield, CheckCircle2, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Camera, title: '1. List Your Item', color: 'bg-green-100 text-green-700',
    items: ['Sign in or create a free account', 'Take clear photos of the item', 'Fill in title, description, condition, and category', 'Choose your locality — street address stays private', 'Select free giveaway, low-cost resale (₹), or exchange', 'Publish — your listing goes live immediately'],
  },
  {
    icon: Search, title: '2. Discover Items Near You', color: 'bg-blue-100 text-blue-700',
    items: ['Browse the Explore page or use the map view', 'Filter by category, condition, listing type, and distance', 'Search by locality, city, or PIN code', 'Save items with the heart icon', 'Tap an item to see full details and photos'],
  },
  {
    icon: MessageSquare, title: '3. Request & Connect', color: 'bg-purple-100 text-purple-700',
    items: ['Send a request message to the owner', 'The owner accepts or declines', 'If accepted, a private conversation opens', 'Coordinate pickup details over chat', 'Agree on a safe, convenient pickup spot'],
  },
  {
    icon: MapPin, title: '4. Safe Local Pickup', color: 'bg-orange-100 text-orange-700',
    items: ['Meet at the agreed location — public place, gate, or another arrangement', 'Hand over the item — no shipping, no boxes, no waiting', 'Mark the listing as redistributed when done', 'The item finds its new home; the planet benefits'],
  },
]

const safetyTips = [
  'Always meet in a well-lit, public place — a local market, café, or community area',
  'Bring a friend if you\'re meeting someone you don\'t know',
  'For apartment/gated community exchanges, use the main gate or common lobby',
  'Check your building or community\'s rules about receiving visitors',
  'Never share your bank account or UPI details with strangers',
  'Trust your instincts — if something feels off, cancel the exchange',
  'For high-value items, consider meeting during daylight hours',
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">How It Works</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Reuse Before Return is designed to be simple. List, discover, connect, and hand over — all locally.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardContent className="p-6">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 ${step.color}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-lg mb-3">{step.title}</h2>
              <ul className="space-y-2">
                {step.items.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-yellow-700" />
          <h2 className="font-semibold text-yellow-900">Safety Tips for Pickup</h2>
        </div>
        <ul className="space-y-2">
          {safetyTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-yellow-800">
              <span className="font-bold mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted/50 border rounded-xl p-6 mb-10">
        <h2 className="font-semibold mb-2">Your Privacy</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>→ Your phone number is never shown publicly</li>
          <li>→ Your street address is never required or displayed</li>
          <li>→ Exact pickup details are only shared after a request is accepted</li>
          <li>→ Only your city and locality are visible to other users</li>
        </ul>
      </div>

      <div className="text-center">
        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/list-item">List an Item</Link></Button>
          <Button variant="outline" asChild><Link to="/explore">Browse Items <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
      </div>
    </div>
  )
}
