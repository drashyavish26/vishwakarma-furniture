import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/data'
import { Phone, MessageCircle, Instagram, Hammer, Award, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'About Us' }

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const number = settings.whatsapp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent('Hello, I would like to learn more about Shree Vishwakarma Furniture.')}`

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-espresso to-teak-dark text-cream">
        <div className="section-container py-20">
          <p className="text-champagne text-sm tracking-widest uppercase mb-3">Our Story</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4 max-w-2xl leading-tight">
            Craftsmanship Passed Down Through Generations
          </h1>
          <p className="text-cream/70 max-w-xl leading-relaxed">{settings.about_description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-champagne">
        <div className="section-container py-10">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Hammer, num: '500+', label: 'Projects Completed' },
              { icon: Users, num: '300+', label: 'Happy Families' },
              { icon: Award, num: '10+', label: 'Years Experience' },
            ].map(item => (
              <div key={item.label}>
                <item.icon className="w-7 h-7 text-espresso mx-auto mb-2" />
                <p className="font-serif text-3xl text-espresso font-bold">{item.num}</p>
                <p className="text-espresso/70 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="section-container section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-espresso mb-6">Why We Do What We Do</h2>
          <div className="space-y-4 text-espresso/70 leading-relaxed text-lg">
            <p>
              At Shree Vishwakarma Foam Mattress and Furniture, we believe that your home deserves the very best.
              Every piece of furniture we create is a reflection of our commitment to quality, craftsmanship, and customer satisfaction.
            </p>
            <p>
              Specializing in Sagwan (Teak Wood) furniture — known globally for its exceptional durability, natural beauty,
              and resistance to weathering — we source only the finest grade timber to craft beds, sofas, dining tables,
              and bespoke pieces that stand the test of time.
            </p>
            <p>
              From our manufacturing unit, each piece passes through the hands of skilled craftsmen who have honed their
              skills over decades. We complement traditional joinery and woodworking techniques with modern finishing,
              ensuring furniture that is as functional as it is beautiful.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <a href={`tel:${settings.phone}`} className="btn-secondary">
              <Phone className="w-4 h-4" /> {settings.phone}
            </a>
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-cream-secondary">
            <h3 className="font-serif text-xl text-espresso mb-4">Explore Our Work</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary text-sm px-4 py-2">View Products</Link>
              <Link href="/our-work" className="btn-secondary text-sm px-4 py-2">Our Portfolio</Link>
              <Link href="/contact" className="btn-secondary text-sm px-4 py-2">Get a Quote</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
