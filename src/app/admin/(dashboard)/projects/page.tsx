'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/types'
import { Plus, Pencil, Trash2, Upload, X, Check } from 'lucide-react'
import { Toast, useToast } from '@/components/admin/Toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

const PROJECT_CATEGORIES = [
  'Sofa', 'Bed', 'Dining Table', 'Wardrobe',
  'Custom Work', 'Sagwan Furniture', 'Railing',
  'Office Furniture', 'Mattress', 'Other',
]

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Project> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const { toast, show, hide } = useToast()

  const fetchProjects = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { show('Max file size is 5MB', 'error'); return }
    setImageUploading(true)
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(`${Date.now()}-${file.name.replace(/\s+/g, '-')}`, file)
    if (error) { show(error.message, 'error'); setImageUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(data.path)
    setEditing(prev => prev ? { ...prev, image_url: publicUrl } : prev)
    setImageUploading(false)
    show('Photo uploaded!')
  }

  const handleSave = async () => {
    if (!editing?.title) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      title: editing.title,
      description: editing.description || null,
      image_url: editing.image_url || null,
      category: editing.category || null,
    }
    if (editing.id) {
      await supabase.from('projects').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('projects').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    fetchProjects()
    show(editing.id ? 'Project updated!' : 'Project added!')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    fetchProjects()
    show('Project deleted')
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={hide} />}
      {deleteId && (
        <ConfirmModal
          title="Delete Project"
          message="This project photo will be permanently deleted."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-espresso">Our Work</h1>
        <button
          onClick={() => setEditing({ title: '', description: '', category: '', image_url: '' })}
          className="btn-primary text-sm px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Edit / Add Form */}
      {editing !== null && (
        <div className="bg-white rounded-sm border border-cream-secondary p-6 mb-6">
          <h2 className="font-serif text-lg text-espresso mb-4">{editing.id ? 'Edit' : 'New'} Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Project Title *</label>
              <input
                value={editing.title || ''}
                onChange={e => setEditing(p => p ? { ...p, title: e.target.value } : p)}
                className="admin-input"
                placeholder="e.g. Custom Sagwan Double Bed"
              />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select
                value={editing.category || ''}
                onChange={e => setEditing(p => p ? { ...p, category: e.target.value } : p)}
                className="admin-input"
              >
                <option value="">Select category</option>
                {PROJECT_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <textarea
                rows={3}
                value={editing.description || ''}
                onChange={e => setEditing(p => p ? { ...p, description: e.target.value } : p)}
                className="admin-input resize-none"
                placeholder="Describe the project, materials used, dimensions..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Project Photo</label>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <span className="btn-secondary text-sm px-3 py-1.5 inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {imageUploading ? 'Uploading...' : 'Upload Photo'}
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
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editing.image_url} alt="" className="w-40 h-32 object-cover rounded-sm" />
                  <button
                    type="button"
                    onClick={() => setEditing(p => p ? { ...p, image_url: '' } : p)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Project'}
            </button>
            <button onClick={() => setEditing(null)} className="btn-secondary text-sm px-4 py-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[4/3] rounded-sm" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-sm border border-cream-secondary py-16 text-center">
          <p className="font-serif text-xl text-espresso/40">No projects yet</p>
          <button
            onClick={() => setEditing({ title: '' })}
            className="btn-primary text-sm mt-4 px-4 py-2"
          >
            Add First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-sm border border-cream-secondary overflow-hidden">
              <div className="relative aspect-[4/3] bg-cream-secondary">
                {project.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-espresso/30 text-sm font-serif italic">
                    No image
                  </div>
                )}
                {project.category && (
                  <span className="absolute top-2 left-2 bg-champagne text-espresso text-xs px-2 py-0.5 rounded-sm">
                    {project.category}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-espresso truncate">{project.title}</p>
                {project.description && (
                  <p className="text-xs text-espresso/50 mt-1 line-clamp-2">{project.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(project)}
                    className="btn-secondary text-xs px-3 py-1.5 flex-1 justify-center"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="flex-1 justify-center flex items-center gap-1 text-red-400 hover:bg-red-50 border border-red-200 text-xs px-3 py-1.5 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
