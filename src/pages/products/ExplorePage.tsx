import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Map, List, X, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductCard } from '@/components/products/ProductCard'
import { MapView } from '@/components/map/MapView'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts, useCategories } from '@/hooks/useProducts'
import { useAuth } from '@/contexts/AuthContext'
import { haversineKm } from '@/lib/utils'
import { PRODUCT_CONDITIONS, DEFAULT_LAT, DEFAULT_LNG } from '@/lib/constants'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
]

export function ExplorePage() {
  const [params] = useSearchParams()
  const { profile } = useAuth()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(params.get('q') || '')
  const [city, setCity] = useState(params.get('city') || '')
  const [locality, setLocality] = useState(params.get('locality') || '')
  const [categoryId, setCategoryId] = useState(params.get('category') || '')
  const [condition, setCondition] = useState('')
  const [freeOnly, setFreeOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 12

  const { data: categories } = useCategories()
  const sortMap: Record<string, { sortBy: 'created_at' | 'price'; sortDir: 'asc' | 'desc' }> = {
    newest: { sortBy: 'created_at', sortDir: 'desc' },
    price_asc: { sortBy: 'price', sortDir: 'asc' },
    price_desc: { sortBy: 'price', sortDir: 'desc' },
  }
  const { data: products, isLoading, isFetching } = useProducts({
    search: search || undefined, city: city || undefined, locality: locality || undefined,
    category: categoryId || undefined, condition: condition || undefined,
    listing_type: freeOnly ? 'free' : undefined, status: 'active',
    limit: PAGE_SIZE, offset: page * PAGE_SIZE, ...sortMap[sort],
  })

  const userLat = profile?.latitude ?? DEFAULT_LAT
  const userLng = profile?.longitude ?? DEFAULT_LNG
  const productsWithDist = (products || []).map(p => ({
    product: p,
    distance: p.latitude && p.longitude ? haversineKm(userLat, userLng, p.latitude, p.longitude) : undefined,
  }))

  const clearFilters = () => { setSearch(''); setCity(''); setLocality(''); setCategoryId(''); setCondition(''); setFreeOnly(false); setSort('newest'); setPage(0) }
  const hasFilters = search || city || locality || categoryId || condition || freeOnly
  useEffect(() => { setPage(0) }, [search, city, locality, categoryId, condition, freeOnly, sort])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search charger, books, kurti..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1.5 shrink-0">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {hasFilters && <Badge className="ml-1 h-4 w-4 p-0 text-[10px]">!</Badge>}
            </Button>
            <div className="flex border rounded-md overflow-hidden">
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}><List className="h-4 w-4" /></button>
              <button onClick={() => setViewMode('map')} className={`p-2 ${viewMode === 'map' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}><Map className="h-4 w-4" /></button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 items-end">
              <div className="space-y-1">
                <Label className="text-xs">City</Label>
                <Input placeholder="e.g. Hyderabad" value={city} onChange={e => setCity(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Locality</Label>
                <Input placeholder="e.g. Madhapur" value={locality} onChange={e => setLocality(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {(categories || []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Condition</SelectItem>
                    {PRODUCT_CONDITIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sort</Label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{SORT_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <Checkbox checked={freeOnly} onCheckedChange={v => setFreeOnly(v as boolean)} /> Free only
                </label>
                {hasFilters && <button onClick={clearFilters} className="text-xs text-red-500 flex items-center gap-1 hover:underline"><X className="h-3 w-3" /> Clear</button>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `${products?.length ?? 0} item${products?.length !== 1 ? 's' : ''} found`}{city && ` in ${city}`}{locality && `, ${locality}`}
          </p>
          {isFetching && !isLoading && <Loader className="h-4 w-4 animate-spin text-green-600" />}
        </div>
        {viewMode === 'map' && <div className="h-[500px] mb-6"><MapView products={products || []} /></div>}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <div key={i} className="space-y-3"><Skeleton className="h-44 w-full rounded-xl" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>)}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {productsWithDist.map(({ product, distance }) => <ProductCard key={product.id} product={product} distance={distance} />)}
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {page > 0 && <Button variant="outline" onClick={() => setPage(p => p - 1)}>Previous</Button>}
              {products.length === PAGE_SIZE && <Button variant="outline" onClick={() => setPage(p => p + 1)}>Next Page</Button>}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium text-gray-600">No items found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
            {hasFilters && <Button variant="outline" className="mt-4" onClick={clearFilters}><X className="h-4 w-4 mr-2" /> Clear All Filters</Button>}
          </div>
        )}
      </div>
    </div>
  )
}
