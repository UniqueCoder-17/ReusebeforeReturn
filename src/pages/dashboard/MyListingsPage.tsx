import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Package, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function MyListingsPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data: products = [], isLoading, refetch } = useProducts({
    owner_id: profile?.id,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 100,
  })
  const deleteProduct = useDeleteProduct()

  const handleMarkComplete = async (id: string) => {
    const { error } = await supabase.from('products').update({ status: 'completed' }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Marked as redistributed!'); refetch() }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this listing? This cannot be undone.')) return
    deleteProduct.mutate(id, {
      onSuccess: () => { toast.success('Listing removed'); refetch() },
      onError: (e) => toast.error(e.message),
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="completed">Redistributed</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild><Link to="/list-item"><Plus className="h-4 w-4 mr-2" />New Listing</Link></Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No listings yet</h2>
          <p className="text-muted-foreground mb-4">Start by listing an item you'd like to share</p>
          <Button asChild><Link to="/list-item">List an Item</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/products/${product.id}/edit`)}>Edit</Button>
                {product.status === 'active' && (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMarkComplete(product.id)}>
                    Mark Redistributed
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
