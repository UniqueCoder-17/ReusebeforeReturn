import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useProduct, useCategories } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PRODUCT_CONDITIONS, LISTING_TYPES, PICKUP_PREFERENCES, INDIAN_STATES } from '@/lib/constants'
import { AlertCircle, Loader2, Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category_id: z.string().uuid('Select a category'),
  condition: z.enum(['new_unopened', 'like_new', 'gently_used', 'used_functional']),
  listing_type: z.enum(['free', 'resale', 'exchange']),
  price: z.number().min(0).optional(),
  original_price: z.number().min(0).optional(),
  brand: z.string().max(80).optional(),
  reason: z.string().max(500).optional(),
  state: z.string().min(1, 'Select a state'),
  city: z.string().min(2, 'Enter city / town'),
  locality: z.string().min(2, 'Enter locality / area'),
  pin_code: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits').optional().or(z.literal('')),
  pickup_preference: z.enum(['public_place', 'gate', 'arrange_after']),
})

type FormData = z.infer<typeof schema>

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: product, isLoading: loadingProduct } = useProduct(id)
  const { data: categories = [] } = useCategories()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const listingType = watch('listing_type')

  useEffect(() => {
    if (product) {
      if (product.owner_id !== user?.id) {
        toast.error('You are not the owner of this listing')
        navigate('/dashboard/my-listings')
        return
      }
      reset({
        title: product.title,
        description: product.description,
        category_id: product.category_id,
        condition: product.condition,
        listing_type: product.listing_type,
        price: product.price ?? undefined,
        original_price: product.original_price ?? undefined,
        brand: product.brand ?? '',
        reason: product.reason ?? '',
        state: product.state,
        city: product.city,
        locality: product.locality,
        pin_code: product.pin_code ?? '',
        pickup_preference: product.pickup_preference,
      })
    }
  }, [product, user, navigate, reset])

  const onSubmit = async (data: FormData) => {
    if (!id) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          condition: data.condition,
          listing_type: data.listing_type,
          price: data.listing_type === 'resale' ? (data.price ?? null) : null,
          original_price: data.original_price ?? null,
          brand: data.brand || null,
          reason: data.reason || null,
          state: data.state,
          city: data.city,
          locality: data.locality,
          pin_code: data.pin_code || null,
          pickup_preference: data.pickup_preference,
        })
        .eq('id', id)
        .eq('owner_id', user!.id)

      if (error) throw error
      toast.success('Listing updated!')
      navigate(`/products/${id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update listing')
    } finally {
      setSaving(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Listing Not Found</h1>
        <Button onClick={() => navigate('/dashboard/my-listings')}>Go to My Listings</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Listing</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register('title')} placeholder="e.g. OnePlus charger — unused, in box" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" rows={4} {...register('description')} placeholder="Describe the item honestly..." />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select onValueChange={(v) => setValue('category_id', v)} defaultValue={product.category_id}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(categories as { id: string; name: string }[]).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
              </div>
              <div>
                <Label>Condition *</Label>
                <Select onValueChange={(v) => setValue('condition', v as FormData['condition'])} defaultValue={product.condition}>
                  <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CONDITIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="brand">Brand (optional)</Label>
              <Input id="brand" {...register('brand')} placeholder="e.g. Samsung, Prestige, Wildcraft" />
            </div>
            <div>
              <Label htmlFor="reason">Why redistributing? (optional)</Label>
              <Textarea id="reason" rows={2} {...register('reason')} placeholder="e.g. Got a duplicate as a gift, wrong size..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Listing Type</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type *</Label>
              <Select onValueChange={(v) => setValue('listing_type', v as FormData['listing_type'])} defaultValue={product.listing_type}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {listingType === 'resale' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Asking Price (₹) *</Label>
                  <Input id="price" type="number" min={0} {...register('price', { valueAsNumber: true })} placeholder="e.g. 299" />
                </div>
                <div>
                  <Label htmlFor="original_price">Original Price (₹, optional)</Label>
                  <Input id="original_price" type="number" min={0} {...register('original_price', { valueAsNumber: true })} placeholder="e.g. 1299" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Location</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>State / UT *</Label>
              <Select onValueChange={(v) => setValue('state', v)} defaultValue={product.state}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City / Town *</Label>
                <Input id="city" {...register('city')} placeholder="e.g. Hyderabad" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="locality">Locality / Area *</Label>
                <Input id="locality" {...register('locality')} placeholder="e.g. Madhapur" />
                {errors.locality && <p className="text-xs text-red-500 mt-1">{errors.locality.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="pin_code">PIN Code (optional)</Label>
              <Input id="pin_code" {...register('pin_code')} placeholder="6-digit PIN" maxLength={6} />
              {errors.pin_code && <p className="text-xs text-red-500 mt-1">{errors.pin_code.message}</p>}
            </div>
            <div>
              <Label>Pickup Preference *</Label>
              <Select onValueChange={(v) => setValue('pickup_preference', v as FormData['pickup_preference'])} defaultValue={product.pickup_preference}>
                <SelectTrigger><SelectValue placeholder="Select pickup preference" /></SelectTrigger>
                <SelectContent>
                  {PICKUP_PREFERENCES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
