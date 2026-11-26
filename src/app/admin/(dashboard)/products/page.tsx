'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react'
import { Toast, useToast } from '@/components/admin/Toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast, show, hide } = useToast()

  const fetchProducts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name), product_images(image_url, is_primary)')
      .order('display_order', { ascending: true })
    setProducts((data as Product[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('products').update({ is_featured: !current }).eq('id', id)
    fetchProducts()
    show(`Product ${!current ? 'featured' : 'unfeatured'}`)
  }

  const toggleAvailable = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('products').update({ is_available: !current }).eq('id', id)
    fetchProducts()
    show(`Product marked as ${!current ? 'available' : 'unavailable'}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    fetchProducts()
    show('Product deleted successfully')
  }

  type ImgRow = { image_url: string; is_primary: boolean }

  return (
    <div>
      {toast && <Toast {...toast} onClose={hide} />}
      {deleteId && (
        <ConfirmModal
          title="Delete Product"
          message="This will permanently delete the product and all its images. This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-espresso">Products</h1>
        <Link href="/admin/products/new" className="btn-primary text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-sm border border-cream-secondary p-8 text-center text-espresso/40">
          Loading products...
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-cream-secondary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-secondary/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide hidden lg:table-cell">Price</th>
                  <th className="text-center px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide">Featured</th>
                  <th className="text-center px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide">Available</th>
                  <th className="text-right px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-secondary">
                {products.map(product => {
                  const imgs = product.product_images as ImgRow[] | undefined
                  const thumb = imgs?.find(i => i.is_primary) || imgs?.[0]
                  const cat = product.category as { name: string } | null
                  return (
                    <tr key={product.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cream-secondary rounded-sm overflow-hidden flex-shrink-0">
                            {thumb && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb.image_url} alt={product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="font-medium text-espresso truncate max-w-[180px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-espresso/60 hidden md:table-cell">{cat?.name || '—'}</td>
                      <td className="px-4 py-3 text-champagne-dark font-medium hidden lg:table-cell">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleFeatured(product.id, product.is_featured)}
                          className={`p-1.5 rounded-sm transition-colors ${product.is_featured ? 'text-champagne bg-champagne/10' : 'text-espresso/30 hover:text-champagne'}`}
                        >
                          <Star className="w-4 h-4" fill={product.is_featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleAvailable(product.id, product.is_available)}
                          className={`p-1.5 rounded-sm transition-colors ${product.is_available ? 'text-green-600 bg-green-50' : 'text-red-400 bg-red-50'}`}
                        >
                          {product.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`} className="p-1.5 text-teak hover:bg-cream-secondary rounded-sm transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(product.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-sm transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-espresso/40 font-serif">
                      No products yet.{' '}
                      <Link href="/admin/products/new" className="text-teak hover:text-champagne">Add one →</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
