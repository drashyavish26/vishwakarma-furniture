export interface Profile {
  id: string
  email: string
  role: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  display_order: number
}

export interface Product {
  id: string
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
  created_at: string
  category?: Category | null
  product_images?: ProductImage[]
}

export interface Project {
  id: string
  title: string
  description: string | null
  image_url: string | null
  category: string | null
  created_at: string
}

export interface SiteSettings {
  id: number
  business_name: string
  phone: string
  whatsapp: string
  address: string
  instagram: string
  google_maps_embed_url: string
  hero_title: string
  hero_description: string
  about_description: string
  updated_at: string
}

export type AdminStats = {
  totalProducts: number
  totalCategories: number
  featuredProducts: number
  recentProducts: Product[]
}
