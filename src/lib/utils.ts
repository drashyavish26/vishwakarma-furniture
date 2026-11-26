import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SiteSettings } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateWhatsAppUrl(whatsapp: string, productName?: string): string {
  const baseNumber = whatsapp.replace(/\D/g, '')
  const message = productName
    ? `Hello, I am interested in ${productName}. Please share more details and pricing.`
    : `Hello, I would like to know more about your furniture collection.`
  return `https://wa.me/${baseNumber}?text=${encodeURIComponent(message)}`
}

export function formatPrice(price: number | null): string {
  if (!price) return 'Price on Request'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  business_name: 'Shree Vishwakarma Foam Mattress and Furniture',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  address: 'Your Business Address, City, State, India',
  instagram: 'https://instagram.com/vishwakarma_furniture',
  google_maps_embed_url: '',
  hero_title: 'Crafting Comfort. Designing Elegance.',
  hero_description: 'Discover beautifully crafted furniture designed to bring comfort, durability, and elegance to your home.',
  about_description: 'Shree Vishwakarma Foam Mattress and Furniture has been crafting premium quality Sagwan (Teak Wood) furniture for discerning homes. We combine traditional craftsmanship with modern aesthetics to create pieces that last generations.',
  updated_at: new Date().toISOString(),
}

export const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Sofa Sets', slug: 'sofa-sets', description: 'Luxurious sofa sets', image_url: null, display_order: 1, created_at: '' },
  { id: '2', name: 'Wooden Beds', slug: 'wooden-beds', description: 'Beautifully crafted wooden beds', image_url: null, display_order: 2, created_at: '' },
  { id: '3', name: 'Sagwan Furniture', slug: 'sagwan-furniture', description: 'Premium Sagwan furniture', image_url: null, display_order: 3, created_at: '' },
  { id: '4', name: 'Dining Tables', slug: 'dining-tables', description: 'Elegant dining tables', image_url: null, display_order: 4, created_at: '' },
  { id: '5', name: 'Sofa Fabrics', slug: 'sofa-fabrics', description: 'Premium sofa fabrics', image_url: null, display_order: 5, created_at: '' },
  { id: '6', name: 'Mattresses', slug: 'mattresses', description: 'High-comfort mattresses', image_url: null, display_order: 6, created_at: '' },
  { id: '7', name: 'Customized Furniture', slug: 'customized-furniture', description: 'Bespoke furniture', image_url: null, display_order: 7, created_at: '' },
  { id: '8', name: 'Other Furniture', slug: 'other-furniture', description: 'Wardrobes, cabinets and more', image_url: null, display_order: 8, created_at: '' },
]
