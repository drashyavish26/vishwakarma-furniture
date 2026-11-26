'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SiteSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/utils'
import { Save, Globe, Phone, MapPin, Instagram, MessageCircle, FileText } from 'lucide-react'
import { Toast, useToast } from '@/components/admin/Toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast, show, hide } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()
      if (data) setSettings(data)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('site_settings')
      .upsert({ ...settings, id: 1, updated_at: new Date().toISOString() })
    setSaving(false)
    if (error) { show(error.message, 'error'); return }
    show('Settings saved successfully!')
  }

  type FieldKey = keyof SiteSettings

  const updateField = (key: FieldKey, value: string) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  if (loading) {
    return (
      <div className="text-espresso/40 py-8 text-center font-serif">Loading settings...</div>
    )
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={hide} />}
      <h1 className="font-serif text-2xl md:text-3xl text-espresso mb-6">Website Settings</h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">

        {/* Hero Section */}
        <div className="bg-white rounded-sm border border-cream-secondary p-6 space-y-4">
          <h2 className="font-serif text-lg text-espresso border-b border-cream-secondary pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-champagne" /> Hero Section
          </h2>
          <div>
            <label className="admin-label">Hero Heading</label>
            <input
              value={settings.hero_title}
              onChange={e => updateField('hero_title', e.target.value)}
              className="admin-input"
              placeholder="Crafting Comfort. Designing Elegance."
            />
          </div>
          <div>
            <label className="admin-label">Hero Subheading</label>
            <textarea
              rows={3}
              value={settings.hero_description}
              onChange={e => updateField('hero_description', e.target.value)}
              className="admin-input resize-none"
              placeholder="Your hero subtitle..."
            />
          </div>
        </div>

        {/* About Us */}
        <div className="bg-white rounded-sm border border-cream-secondary p-6 space-y-4">
          <h2 className="font-serif text-lg text-espresso border-b border-cream-secondary pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-champagne" /> About Us
          </h2>
          <div>
            <label className="admin-label">About Description</label>
            <textarea
              rows={5}
              value={settings.about_description}
              onChange={e => updateField('about_description', e.target.value)}
              className="admin-input resize-none"
              placeholder="Your business story and mission..."
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-sm border border-cream-secondary p-6 space-y-4">
          <h2 className="font-serif text-lg text-espresso border-b border-cream-secondary pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-champagne" /> Contact Information
          </h2>
          <div>
            <label className="admin-label">Business Name</label>
            <input
              value={settings.business_name}
              onChange={e => updateField('business_name', e.target.value)}
              className="admin-input"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-champagne" /> Phone Number
              </label>
              <input
                value={settings.phone}
                onChange={e => updateField('phone', e.target.value)}
                className="admin-input"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-champagne" /> WhatsApp Number
              </label>
              <input
                value={settings.whatsapp}
                onChange={e => updateField('whatsapp', e.target.value)}
                className="admin-input"
                placeholder="919876543210 (digits only, with country code)"
              />
              <p className="text-xs text-espresso/40 mt-1">Include country code, digits only. e.g. 919876543210</p>
            </div>
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-champagne" /> Business Address
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={e => updateField('address', e.target.value)}
              className="admin-input resize-none"
              placeholder="Shop No. 1, Main Road, City, State, PIN"
            />
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-champagne" /> Instagram URL
            </label>
            <input
              type="url"
              value={settings.instagram}
              onChange={e => updateField('instagram', e.target.value)}
              className="admin-input"
              placeholder="https://instagram.com/your_handle"
            />
          </div>
          <div>
            <label className="admin-label flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-champagne" /> Google Maps Embed URL
            </label>
            <input
              value={settings.google_maps_embed_url}
              onChange={e => updateField('google_maps_embed_url', e.target.value)}
              className="admin-input"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-espresso/40 mt-1">
              Go to Google Maps → Share → Embed a map → Copy the src URL
            </p>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  )
}
