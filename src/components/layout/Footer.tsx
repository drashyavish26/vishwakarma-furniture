import Link from 'next/link'
import { Phone, MapPin, Instagram, MessageCircle } from 'lucide-react'
import { SiteSettings } from '@/types'

export function Footer({ settings }: { settings: SiteSettings }) {
  const number = settings.whatsapp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent('Hello, I would like to know more about your furniture collection.')}`

  return (
    <footer className="bg-espresso text-cream/80">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl text-cream mb-3">Shree Vishwakarma</h3>
            <p className="text-xs text-champagne tracking-widest uppercase mb-4">Foam Mattress &amp; Furniture</p>
            <p className="text-sm text-cream/60 leading-relaxed max-w-sm">
              Crafting premium quality Sagwan (Teak Wood) furniture and mattresses for discerning homes.
              Quality, comfort, and elegance — delivered.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-cream text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/categories', label: 'Categories' },
                { href: '/our-work', label: 'Our Work' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/60 hover:text-champagne transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-cream text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-champagne mt-0.5 flex-shrink-0" />
                <span className="text-sm text-cream/60">{settings.address}</span>
              </li>
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-cream/60 hover:text-champagne transition-colors">
                  <Phone className="w-4 h-4 text-champagne flex-shrink-0" />{settings.phone}
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cream/60 hover:text-green-400 transition-colors">
                  <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> WhatsApp
                </a>
              </li>
              {settings.instagram && (
                <li>
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cream/60 hover:text-champagne transition-colors">
                    <Instagram className="w-4 h-4 text-champagne flex-shrink-0" /> Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Shree Vishwakarma Foam Mattress and Furniture. All rights reserved.
          </p>
          <Link href="/admin/login" className="text-xs text-cream/30 hover:text-cream/60 transition-colors">
            Owner Login
          </Link>
        </div>
      </div>
    </footer>
  )
}
