'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types'
import { slugify } from '@/lib/utils'
import { Plus, Pencil, Trash2, Upload, X, Check } from 'lucide-react'
import { Toast, useToast } from '@/components/admin/Toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Category> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const { toast, show, hide } = useToast()

  const fetchCategories = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('display_order')
    setCategories(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { show('Max file size is 5MB', 'error'); return }
    setImageUploading(true)
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('category-images')
      .upload(`${Date.now()}-${file.name.replace(/\s+/g, '-')}`, file)
    if (error) { show(error.message, 'error'); setImageUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('category-images').getPublicUrl(data.path)
    setEditing(prev => prev ? { ...prev, image_url: publicUrl } : prev)
    setImageUploading(false)
    show('Image uploaded')
  }

  const handleSave = async () => {
    if (!editing?.name) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      description: editing.description || null,
      image_url: editing.image_url || null,
      display_order: editing.display_order || 0,
    }
    if (editing.id) {
      await supabase.from('categories').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('categories').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    fetchCategories()
    show(editing.id ? 'Category updated!' : 'Category created!')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const supabase = createClient()
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', deleteId)
    if (count && count > 0) {
      show(`Cannot delete — ${count} product(s) use this category`, 'error')
      setDeleting(false)
      setDeleteId(null)
      return
    }
    await supabase.from('categories').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    fetchCategories()
    show('Category deleted')
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={hide} />}
      {deleteId && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure? Products in this category will lose their category assignment."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-espresso">Categories</h1>
        <button
          onClick={() => setEditing({ name: '', slug: '', description: '', display_order: categories.length })}
          className="btn-primary text-sm px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-sm border border-cream-secondary p-6 mb-6">
          <h2 className="font-serif text-lg text-espresso mb-4">{editing.id ? 'Edit' : 'New'} Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Name *</label>
              <input
                value={editing.name || ''}
                onChange={e => setEditing(p => p ? {
                  ...p,
                  name: e.target.value,
                  slug: p.id ? p.slug : slugify(e.target.value)
                } : p)}
                className="admin-input"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="admin-label">Slug</label>
              <input
                value={editing.slug || ''}
                onChange={e => setEditing(p => p ? { ...p, slug: e.target.value } : p)}
                className="admin-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <input
                value={editing.description || ''}
                onChange={e => setEditing(p => p ? { ...p, description: e.target.value } : p)}
                className="admin-input"
                placeholder="Short description"
              />
            </div>
            <div>
              <label className="admin-label">Display Order</label>
              <input
                type="number"
                value={editing.display_order || 0}
                onChange={e => setEditing(p => p ? { ...p, display_order: parseInt(e.target.value) || 0 } : p)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Category Image</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="btn-secondary text-sm px-3 py-1.5 inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imageUploading}
                />
              </label>
              {editing.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.image_url} alt="" className="w-20 h-20 object-cover rounded-sm mt-2" />
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Category'}
            </button>
            <button onClick={() => setEditing(null)} className="btn-secondary text-sm px-4 py-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm border border-cream-secondary overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-secondary/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide hidden md:table-cell">Slug</th>
              <th className="text-left px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide hidden lg:table-cell">Order</th>
              <th className="text-right px-4 py-3 text-xs text-espresso/50 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-secondary">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cat.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-cover rounded-sm flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-cream-secondary rounded-sm flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-espresso">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-espresso/50 truncate max-w-[200px]">{cat.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-espresso/50 font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                <td className="px-4 py-3 text-espresso/50 hidden lg:table-cell">{cat.display_order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(cat)} className="p-1.5 text-teak hover:bg-cream-secondary rounded-sm transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-sm transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-espresso/40 font-serif">No categories yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
