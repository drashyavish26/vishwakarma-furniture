'use client'
import { useState } from 'react'
import { Phone, MessageCircle, MapPin, Instagram, Send, CheckCircle, Clock } from 'lucide-react'
import { SiteSettings } from '@/types'

export function ContactContent({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({ name: '', phone: '', interest: 'General Inquiry', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const number = settings.whatsapp.replace(/\D/g, '')
    const text = `*New Inquiry from Website*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Interest:* ${form.interest}\n*Message:* ${form.message}`
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`

    window.open(url, '_blank')
    setSubmitted(true)
    setLoading(false)
  }

  const cleanWhatsApp = settings.whatsapp.replace(/\D/g, '')

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <p className="text-champagne text-sm tracking-widest uppercase mb-2">Get In Touch</p>
          <h1 className="font-serif text-3xl md:text-4xl text-espresso mb-2">Contact Us</h1>
          <p className="text-espresso/60 max-w-xl">
            Have a question about our handcrafted Sagwan furniture, mattresses, or custom orders? Reach out to us today.
          </p>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div>
            <h2 className="font-serif text-2xl text-espresso mb-6">We&apos;d Love to Hear From You</h2>
            <p className="text-espresso/70 mb-8 leading-relaxed">
              Whether you&apos;re looking for a specific piece of furniture, want to discuss custom designs and measurements,
              or wish to visit our workshop and showroom — we are here to assist you.
            </p>

            <div className="space-y-6">
              <a href={`tel:${settings.phone}`} className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-champagne/10 rounded-sm flex items-center justify-center group-hover:bg-champagne/20 transition-colors flex-shrink-0">
                  <Phone className="w-5 h-5 text-champagne" />
                </div>
                <div>
                  <p className="text-xs text-espresso/50 uppercase tracking-wide">Phone</p>
                  <p className="text-espresso font-medium text-lg">{settings.phone}</p>
                  <p className="text-xs text-espresso/40">Available 9:00 AM - 8:00 PM</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-green-50 rounded-sm flex items-center justify-center group-hover:bg-green-100 transition-colors flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-espresso/50 uppercase tracking-wide">WhatsApp</p>
                  <p className="text-espresso font-medium text-lg">Instant Chat &amp; Inquiries</p>
                  <p className="text-xs text-espresso/40">Fastest response time</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-champagne/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-champagne" />
                </div>
                <div>
                  <p className="text-xs text-espresso/50 uppercase tracking-wide">Showroom &amp; Workshop</p>
                  <p className="text-espresso font-medium leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-champagne/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-champagne" />
                </div>
                <div>
                  <p className="text-xs text-espresso/50 uppercase tracking-wide">Business Hours</p>
                  <p className="text-espresso font-medium">Monday – Sunday: 9:00 AM – 8:30 PM</p>
                </div>
              </div>

              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-champagne/10 rounded-sm flex items-center justify-center group-hover:bg-champagne/20 transition-colors flex-shrink-0">
                    <Instagram className="w-5 h-5 text-champagne" />
                  </div>
                  <div>
                    <p className="text-xs text-espresso/50 uppercase tracking-wide">Instagram</p>
                    <p className="text-espresso font-medium">Follow our latest projects &amp; arrivals</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white p-6 md:p-8 rounded-sm border border-cream-secondary shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="font-serif text-2xl text-espresso mb-2">Inquiry Prepared!</h3>
                <p className="text-espresso/70 mb-6 max-w-sm">
                  We&apos;ve opened WhatsApp with your message details pre-filled. Simply tap send to chat with our team.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', phone: '', interest: 'General Inquiry', message: '' })
                  }}
                  className="btn-primary"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-serif text-xl text-espresso mb-2">Send Us an Inquiry</h3>
                <p className="text-espresso/60 text-sm mb-6">
                  Fill in your details and message, and we&apos;ll instantly connect with you on WhatsApp.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="admin-label">Your Full Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Ramesh Sharma"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Phone / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Interested In</label>
                    <select
                      value={form.interest}
                      onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                      className="admin-input"
                    >
                      <option value="Sofa Sets">Sofa Sets &amp; Couches</option>
                      <option value="Wooden Beds">Wooden / Sagwan Beds</option>
                      <option value="Dining Tables">Dining Tables &amp; Chairs</option>
                      <option value="Foam & Mattresses">Foam &amp; Mattresses</option>
                      <option value="Custom Furniture">Customized Bespoke Furniture</option>
                      <option value="Sofa Fabrics">Sofa Fabrics &amp; Re-upholstery</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="admin-label">Your Message or Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what you are looking for (dimensions, wood type, style, budget)..."
                      className="admin-input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Opening WhatsApp...' : 'Submit Inquiry via WhatsApp'}
                  </button>
                  <p className="text-xs text-espresso/40 text-center">
                    This will open WhatsApp with your inquiry pre-formatted for instant response.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Embedded Google Map if available */}
        {settings.google_maps_embed_url && (
          <div className="mt-16">
            <div className="text-center mb-6">
              <p className="text-champagne text-sm tracking-widest uppercase mb-1">Find Us</p>
              <h2 className="font-serif text-2xl md:text-3xl text-espresso">Visit Our Showroom</h2>
            </div>
            <div className="w-full h-80 md:h-96 rounded-sm overflow-hidden border border-cream-secondary shadow-sm">
              <iframe
                src={settings.google_maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shree Vishwakarma Showroom Location"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
