'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

interface NavbarProps {
  businessName: string
  whatsapp: string
}

export function Navbar({ businessName, whatsapp }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const number = whatsapp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent('Hello, I would like to know more about your furniture collection.')}`

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-cream-secondary'
          : 'bg-cream/90 backdrop-blur-sm'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-serif text-lg md:text-xl font-bold text-espresso">Shree Vishwakarma</span>
            <span className="text-xs text-teak tracking-widest uppercase">Furniture &amp; Mattress</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-teak',
                  pathname === link.href
                    ? 'text-teak border-b-2 border-champagne pb-0.5'
                    : 'text-espresso'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">WhatsApp Inquiry</span>
              <span className="lg:hidden">Inquiry</span>
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-espresso"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-cream border-t border-cream-secondary">
          <div className="section-container py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-sm text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-cream-secondary text-teak'
                    : 'text-espresso hover:bg-cream-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center mt-3"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
