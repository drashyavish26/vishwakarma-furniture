'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Category, ProductImage } from '@/types'
import { slugify } from '@/lib/utils'
import { Toast, useToast } from './Toast'
import { Upload, X, Star } from 'lucide-react'

interface ProductFormData {
  id?: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  price: number | null
  material: string | null
  sizes: string[]
  colors: string[]
  customization_available: boolean
  is_featured: boolean
  is_available: boolean
  display_order: number
  product_images?: ProductImage[]
}

interface ProductFormProps {
  product?: ProductFormData
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { toast, show, hide } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ProductImage[]>(product?.product_images || [])
  const [uploadingImages, setUploadingImages] = useState(false)

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    price: product?.price?.toString() || '',
    material: product?.material || '',
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    customization_available: product?.customization_available ?? true,
    is_featured: product?.is_featured ?? false,
    is_available: product?.is_available ?? true,
    display_order: product?.display_order?.toString() || '0',
  })

  useEffect(() => {
    async function fetchCategories() {
      const client = createClient()
      const { data } = await client.from('categories').select('*').order('display_order')
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: product ? f.slug : slugify(name) }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingImages(true)

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { show('File too large (max 5MB)', 'error'); continue }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        show('Only JPG, PNG, WebP allowed', 'error'); continue
      }
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file)
      if (error) { show(`Upload failed: ${error.message}`, 'error'); continue }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path)
      setImages(prev => [
        ...prev,
        {
          id: `temp-${Date.now()}-${Math.random()}`,
          product_id: product?.id || '',
          image_url: publicUrl,
          is_primary: prev.length === 0,
          display_order: prev.length,
        },
      ])
    }
    setUploadingImages(false)
    show('Images uploaded successfully')
  }

  const removeImage = (idx: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== idx)
      if (updated.length > 0 && !updated.some(img => img.is_primary)) {
        updated[0] = { ...updated[0], is_primary: true }
      }
      return updated
    })
  }

  const setPrimary = (idx: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === idx })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      category_id: form.category_id || null,
      price: form.price ? parseFloat(form.price) : null,
      material: form.material || null,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      customization_available: form.customization_available,
      is_featured: form.is_featured,
      is_available: form.is_available,
      display_order: parseInt(form.display_order) || 0,
    }

    let productId = product?.id
    if (product?.id) {
      const { error } = await supabase.from('products').update(productData).eq('id', product.id)
      if (error) { show(error.message, 'error'); setLoading(false); return }
    } else {
      const { data, error } = await supabase.from('products').insert(productData).select().single()
      if (error) { show(error.message, 'error'); setLoading(false); return }
      productId = data.id
    }

    if (productId) {
      await supabase.from('product_images').delete().eq('product_id', productId)
      if (images.length > 0) {
        await supabase.from('product_images').insert(
          images.map((img, idx) => ({
            product_id: productId,
            image_url: img.image_url,
            is_primary: img.is_primary,
            display_order: idx,
          }))
        )
      }
    }

    show(product ? 'Product updated!' : 'Product created!')
    setTimeout(() => router.push('/admin/products'), 1000)
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={hide} />}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              className="admin-input"
              placeholder="e.g. Royal Sagwan Double Bed"
            />
          </div>
          <div>
            <label className="admin-label">URL Slug *</label>
            <input
              required
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="admin-input"
              placeholder="auto-generated from name"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Description</label>
          <textarea
            rows={4}
            value={form.description || ''}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="admin-input resize-none"
            placeholder="Describe the product..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="admin-label">Category</label>
            <select
              value={form.category_id || ''}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="admin-input"
            >
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Price (₹) — blank = &quot;On Request&quot;</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="admin-input"
              placeholder="e.g. 25000"
              min="0"
            />
          </div>
          <div>
            <label className="admin-label">Material</label>
            <input
              value={form.material || ''}
              onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
              className="admin-input"
              placeholder="e.g. Sagwan Teak Wood"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Available Sizes (comma-separated)</label>
            <input
              value={form.sizes}
              onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
              className="admin-input"
              placeholder="e.g. Single, Double, Queen, King"
            />
          </div>
          <div>
            <label className="admin-label">Available Colors (comma-separated)</label>
            <input
              value={form.colors}
              onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
              className="admin-input"
              placeholder="e.g. Walnut, Natural Teak, White"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="admin-label">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={e => setForm(f => ({ ...f, display_order: e.target.value }))}
              className="admin-input"
              min="0"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={form.customization_available}
              onChange={e => setForm(f => ({ ...f, customization_available: e.target.checked }))}
              className="w-4 h-4 accent-champagne"
            />
            <span className="text-sm text-espresso">Customizable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              className="w-4 h-4 accent-champagne"
            />
            <span className="text-sm text-espresso">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))}
              className="w-4 h-4 accent-champagne"
            />
            <span className="text-sm text-espresso">Available</span>
          </label>
        </div>

        {/* Image Uploader */}
        <div>
          <label className="admin-label mb-2">Product Images</label>
          <label className="border-2 border-dashed border-cream-secondary rounded-sm p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-champagne transition-colors">
            <Upload className="w-8 h-8 text-espresso/30" />
            <p className="text-sm text-espresso/50 text-center">
              Click to upload images (JPG, PNG, WebP — max 5MB each)
            </p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImages}
            />
            {uploadingImages && (
              <p className="text-champagne text-sm animate-pulse">Uploading...</p>
            )}
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt="" className="w-full aspect-square object-cover rounded-sm" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      title="Set as primary"
                      className={`p-1.5 rounded-full ${img.is_primary ? 'bg-champagne' : 'bg-white/80'}`}
                    >
                      <Star className="w-3 h-3 text-espresso" fill={img.is_primary ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 bg-red-500 rounded-full"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  {img.is_primary && (
                    <span className="absolute top-1 left-1 bg-champagne text-espresso text-xs px-1 rounded-sm leading-5">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-cream-secondary">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
