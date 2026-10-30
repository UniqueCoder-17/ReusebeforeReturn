import { Link } from 'react-router-dom'
import { useFavorites } from '@/hooks/useFavorites'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import type { Product } from '@/types'

export default function FavoritesPage() {
  const { data: favorites = [], isLoading } = useFavorites()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Items</h1>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No saved items yet</h2>
          <p className="text-muted-foreground mb-4">Tap the heart icon on any listing to save it for later</p>
          <Button asChild><Link to="/explore">Explore Items</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(favorites as { id: string; products: Product }[]).map((fav) =>
            fav.products ? <ProductCard key={fav.id} product={fav.products} /> : null
          )}
        </div>
      )}
    </div>
  )
}
