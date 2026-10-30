import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Leaf, Recycle, Users, TrendingDown, ArrowRight, ShoppingBag, Package, CheckCircle, Star, Zap, Heart, BookOpen, Smartphone, Home, Baby, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useProducts, useCategories } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

const STEPS = [
  { icon: <Package className="h-8 w-8 text-green-600" />, title: 'List Your Item', desc: 'Got an unwanted product from an online order? List it in minutes — add photos, describe condition, and set your location.' },
  { icon: <Search className="h-8 w-8 text-green-600" />, title: 'Someone Nearby Discovers It', desc: 'People in your city browse available items by category, distance, and keyword. Your item shows up on their map.' },
  { icon: <CheckCircle className="h-8 w-8 text-green-600" />, title: 'Coordinate a Safe Pickup', desc: 'Accept a request, chat through the platform, and arrange pickup — at a public place, your gate, or wherever works.' },
]

const STATS = [
  { icon: <Recycle className="h-6 w-6" />, label: 'Items Redistributed', value: '2,400+', note: 'Sample figure' },
  { icon: <Users className="h-6 w-6" />, label: 'Active Members', value: '5,000+', note: 'Sample figure' },
  { icon: <TrendingDown className="h-6 w-6" />, label: 'Returns Avoided', value: '1,800+', note: 'Estimate' },
  { icon: <MapPin className="h-6 w-6" />, label: 'Cities & Towns', value: '40+', note: 'Across India' },
]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  electronics: <Smartphone className="h-6 w-6" />, clothing: <ShoppingBag className="h-6 w-6" />, books: <BookOpen className="h-6 w-6" />,
  'home-kitchen': <Home className="h-6 w-6" />, 'toys-baby': <Baby className="h-6 w-6" />, sports: <Activity className="h-6 w-6" />,
}

const TESTIMONIALS = [
  { name: 'Priya S.', location: 'Hyderabad', text: 'Got the wrong size kurti from Amazon. Instead of returning it, I listed it here and a neighbour picked it up the same day!', rating: 5 },
  { name: 'Rahul G.', location: 'Mumbai', text: 'Found a brand new pressure cooker near me for ₹400. The seller had received it as a duplicate gift. Win-win!', rating: 5 },
  { name: 'Meera I.', location: 'Chennai', text: 'Made it so easy to give away my son\'s old NCERT books. Somebody in my area needed them for their daughter.', rating: 5 },
]

export function LandingPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const { data: recentProducts, isLoading } = useProducts({ status: 'active', limit: 6, sortBy: 'created_at', sortDir: 'desc' })
  const { data: categories } = useCategories()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (searchCity) params.set('city', searchCity)
    navigate(`/explore?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-green-700 bg-green-100">🌱 India's Local Redistribution Platform</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Unwanted Purchase Could Be<br /><span className="text-green-600">Someone Else's Perfect Find.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Give products a second life. Share unwanted e-commerce purchases with people nearby, reduce waste, and make reuse easier — across India.
          </p>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-8">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <Input className="border-0 shadow-none focus-visible:ring-0" placeholder="Search for charger, books, kurti..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 px-3 sm:border-l">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <Input className="border-0 shadow-none focus-visible:ring-0" placeholder="City (e.g. Hyderabad)" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
            </div>
            <Button type="submit" size="lg" className="rounded-xl shrink-0">Search</Button>
          </form>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/explore')} className="gap-2"><Search className="h-5 w-5" /> Explore Nearby Items</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/list-item')} className="gap-2 border-green-600 text-green-700 hover:bg-green-50"><Package className="h-5 w-5" /> List an Item</Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-700 py-12 px-4">
        <div className="container mx-auto">
          <p className="text-center text-green-200 text-xs mb-6 uppercase tracking-wide">⚠ Sample metrics — not real platform data</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2 text-green-300">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-green-200 text-sm">{stat.label}</div>
                <div className="text-green-400 text-xs">({stat.note})</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Reuse Before Return Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Three simple steps to give products a second life in your neighbourhood.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">{step.icon}</div>
                <div className="text-green-600 text-sm font-bold mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10"><Link to="/how-it-works"><Button variant="outline">Learn More <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10"><h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(categories || []).map(cat => (
              <button key={cat.id} onClick={() => navigate(`/explore?category=${cat.id}`)} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-green-500 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                  {CATEGORY_ICONS[cat.slug] || <Package className="h-6 w-6" />}
                </div>
                <span className="text-xs font-medium text-center text-gray-700 leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div><h2 className="text-3xl font-bold text-gray-900 mb-2">Recently Listed Items</h2><p className="text-gray-600">Fresh listings from people near you</p></div>
            <Button variant="outline" onClick={() => navigate('/explore')}>View All <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="space-y-3"><Skeleton className="h-48 w-full rounded-xl" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>)}
            </div>
          ) : recentProducts && recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No listings yet</p>
              <p className="text-sm mt-2">Be the first to list an unwanted item!</p>
              <Button className="mt-6" onClick={() => navigate('/list-item')}>List an Item</Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Reuse */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900 mb-3">Why Reuse Instead of Return?</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Leaf className="h-6 w-6 text-green-600" />, title: 'Less Environmental Impact', desc: 'Return logistics generate CO₂. Local redistribution keeps transport footprint minimal.' },
              { icon: <Heart className="h-6 w-6 text-green-600" />, title: 'Help Someone in Need', desc: 'Your unwanted item could be exactly what someone nearby has been looking for.' },
              { icon: <Zap className="h-6 w-6 text-green-600" />, title: 'Quick and Free', desc: 'No packaging, no courier, no waiting. Coordinate a local handoff in hours.' },
            ].map(b => (
              <Card key={b.title} className="text-center border-green-100">
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">{b.icon}</div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-600">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-4"><h2 className="text-3xl font-bold text-gray-900">What People Are Saying</h2></div>
          <p className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2 px-4 mb-10 max-w-lg mx-auto">⚠ Illustrative sample testimonials — not verified user reviews</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-gray-700 text-sm mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">{t.name[0]}</div>
                    <div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-gray-500">{t.location}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-green-700 text-center">
        <div className="container mx-auto max-w-2xl">
          <Leaf className="h-12 w-12 text-green-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to give something a second life?</h2>
          <p className="text-green-200 mb-8">Join thousands of Indians already reducing waste through local redistribution.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="xl" onClick={() => navigate('/register')} className="bg-white text-green-700 hover:bg-green-50">Get Started — It's Free</Button>
            <Button size="xl" variant="outline" onClick={() => navigate('/explore')} className="border-white text-white hover:bg-green-600">Explore Items</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
