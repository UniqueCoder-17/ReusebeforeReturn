import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, AlertCircle, Loader } from 'lucide-react'
import { useForm, Controller, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocationPicker } from '@/components/location/LocationPicker'
import { useAuth } from '@/contexts/AuthContext'
import { useCategories } from '@/hooks/useProducts'
import { supabase } from '@/lib/supabase'
import { PRODUCT_CONDITIONS, LISTING_TYPES, PICKUP_PREFERENCES } from '@/lib/constants'
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category_id: z.string().min(1, 'Please select a category'),
  condition: z.string().min(1, 'Please select condition'),
  listing_type: z.string().min(1, 'Please select listing type'),
  price: z.string().optional(),
  original_price: z.string().optional(),
  brand: z.string().optional(),
  reason: z.string().optional(),
  pickup_preference: z.string().min(1, 'Please select pickup preference'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  pin_code: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface UploadedImage { file: File; preview: string; uploaded?: string }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function ListItemPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError } = useCategories()
  const [images, setImages] = useState<UploadedImage[]>([])
  const [saving, setSaving] = useState(false)
  const [location, setLocation] = useState({ state: profile?.state || '', city: profile?.city || '', locality: profile?.locality || '', pin_code: profile?.pin_code || '', latitude: profile?.latitude, longitude: profile?.longitude })

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { listing_type: 'free', pickup_preference: 'public_place', state: profile?.state || '', city: profile?.city || '', locality: profile?.locality || '' },
  })

  const listingType = watch('listing_type')

  const onInvalid = (formErrors: FieldErrors<FormData>) => {
    const firstError = Object.values(formErrors).find(error => typeof error?.message === 'string')?.message
    toast.error(typeof firstError === 'string' ? firstError : 'Please check the required fields.')
  }

  const onDrop = useCallback((accepted: File[]) => {
    const valid = accepted.filter(f => {
      if (!ALLOWED_TYPES.includes(f.type)) { toast.error(`${f.name}: Invalid file type. Use JPEG, PNG, or WebP.`); return false }
      if (f.size > MAX_SIZE) { toast.error(`${f.name}: File too large. Max size is 5MB.`); return false }
      return true
    })
    const newImgs = valid.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setImages(prev => [...prev, ...newImgs].slice(0, 6))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxFiles: 6 })

  const removeImage = (idx: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx) })
  }

  const uploadImages = async (productId: string): Promise<string[]> => {
    const urls: string[] = []
    for (const img of images) {
      const ext = img.file.name.split('.').pop()
      const path = `products/${productId}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, img.file, { contentType: img.file.type })
      if (error) {
        throw new Error(`Image upload failed for ${img.file.name}: ${error.message}. Check the product-images bucket and its upload policy.`)
      }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      urls.push(publicUrl)
    }
    return urls
  }

  const onSubmit = async (data: FormData, isDraft = false) => {
    if (!user) return
    setSaving(true)
    try {
      const { data: product, error: pErr } = await supabase.from('products').insert({
        owner_id: user.id,
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        condition: data.condition,
        listing_type: data.listing_type,
        price: data.price ? parseFloat(data.price) : null,
        original_price: data.original_price ? parseFloat(data.original_price) : null,
        brand: data.brand || null,
        reason: data.reason || null,
        pickup_preference: data.pickup_preference,
        state: location.state || data.state,
        city: location.city || data.city,
        locality: location.locality || data.locality,
        pin_code: location.pin_code || data.pin_code || null,
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        is_draft: isDraft,
        status: 'active',
      }).select().single()

      if (pErr) throw pErr

      if (images.length > 0) {
        const urls = await uploadImages(product.id)
        if (urls.length > 0) {
          const { error } = await supabase.from('product_images').insert(
            urls.map((url, i) => ({ product_id: product.id, image_url: url, is_primary: i === 0 }))
          )
          if (error) throw new Error(`Images uploaded, but saving their records failed: ${error.message}`)
        }
      }

      toast.success(isDraft ? 'Draft saved!' : 'Listing published successfully!')
      navigate(`/products/${product.id}`)
    } catch (err) {
      toast.error((err as Error).message || 'Failed to create listing')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">List an Item</h1>
          <p className="text-gray-600 text-sm mt-1">Share an unwanted product with someone nearby. All fields marked with * are required.</p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6 flex gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <strong>Prohibited items:</strong> Do not list medicines, alcohol, tobacco, weapons, hazardous materials, counterfeit goods, or adult content.
            <Link to="/community-guidelines" className="ml-1 underline">View full guidelines</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(data => onSubmit(data, false), onInvalid)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Product Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Product Title <span className="text-red-500">*</span></Label>
                <Input id="title" placeholder="e.g. OnePlus 65W Charger — Duplicate, Brand New" {...register('title')} />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea id="description" placeholder="Describe the item — why you're giving it away, what's included, any defects, etc." rows={4} {...register('description')} />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <Controller name="category_id" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {isLoadingCategories && <p className="text-xs text-muted-foreground">Loading categories...</p>}
                  {categoriesError && <p className="text-xs text-red-500">Could not load categories: {categoriesError.message}</p>}
                  {!isLoadingCategories && !categoriesError && categories.length === 0 && (
                    <p className="text-xs text-red-500">No categories found. Check the categories table in Supabase.</p>
                  )}
                  {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Condition <span className="text-red-500">*</span></Label>
                  <Controller name="condition" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                      <SelectContent>{PRODUCT_CONDITIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                  {errors.condition && <p className="text-red-500 text-xs">{errors.condition.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Brand (optional)</Label>
                  <Input placeholder="e.g. Samsung, Prestige" {...register('brand')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Redistribution Type & Price</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Type <span className="text-red-500">*</span></Label>
                <Controller name="listing_type" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{LISTING_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </div>
              {listingType === 'resale' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Asking Price (₹) <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="e.g. 299" min="0" {...register('price')} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Original Price (₹, optional)</Label>
                    <Input type="number" placeholder="e.g. 1299" min="0" {...register('original_price')} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Product Images</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/30'}`}>
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">{isDragActive ? 'Drop images here...' : 'Drag & drop images, or click to browse'}</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP · Max 5MB each · Up to 6 images</p>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-[10px] text-center py-0.5">Cover</span>}
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <div {...getRootProps()} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-green-400">
                      <input {...getInputProps()} />
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Pickup Location</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocationPicker value={location} onChange={loc => {
                setLocation({ ...loc, pin_code: loc.pin_code ?? '', latitude: loc.latitude ?? undefined, longitude: loc.longitude ?? undefined })
                setValue('state', loc.state, { shouldValidate: true })
                setValue('city', loc.city, { shouldValidate: true })
                setValue('locality', loc.locality, { shouldValidate: true })
              }} />
              {(errors.state || errors.city || errors.locality) && (
                <p className="text-xs text-red-500">
                  {errors.state?.message || errors.city?.message || errors.locality?.message}
                </p>
              )}
              <div className="space-y-1.5">
                <Label>Pickup Preference <span className="text-red-500">*</span></Label>
                <Controller name="pickup_preference" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PICKUP_PREFERENCES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </div>
            </CardContent>
          </Card>

          {/* Reason */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Additional Information</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label>Reason for redistribution (optional)</Label>
                <Textarea placeholder="e.g. Received as a duplicate gift, wrong size, upgrading to a newer model..." rows={2} {...register('reason')} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1" disabled={saving}>
              {saving ? <><Loader className="h-4 w-4 mr-2 animate-spin" /> Publishing...</> : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
