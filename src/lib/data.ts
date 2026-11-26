import { createClient } from '@/lib/supabase/server'
import { Category, Product, Project, SiteSettings } from '@/types'
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from '@/lib/utils'

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings').select('*').eq('id', 1).single()
    if (error || !data) return DEFAULT_SETTINGS
    return data
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories').select('*').order('display_order', { ascending: true })
    if (error || !data) return DEFAULT_CATEGORIES as Category[]
    return data
  } catch {
    return DEFAULT_CATEGORIES as Category[]
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories').select('*').eq('slug', slug).single()
    if (error || !data) {
      const fallback = DEFAULT_CATEGORIES.find(c => c.slug === slug)
      return (fallback as Category) || null
    }
    return data
  } catch {
    const fallback = DEFAULT_CATEGORIES.find(c => c.slug === slug)
    return (fallback as Category) || null
  }
}

export async function getProducts(options?: {
  categorySlug?: string
  featured?: boolean
  search?: string
  limit?: number
}): Promise<Product[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .eq('is_available', true)
      .order('display_order', { ascending: true })

    if (options?.featured) query = query.eq('is_featured', true)
    if (options?.search) query = query.ilike('name', `%${options.search}%`)
    if (options?.categorySlug) {
      const categories = await getCategories()
      const cat = categories.find(c => c.slug === options.categorySlug)
      if (cat) query = query.eq('category_id', cat.id)
    }
    if (options?.limit) query = query.limit(options.limit)

    const { data, error } = await query
    if (error || !data) return []
    return data
  } catch { return [] }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .eq('slug', slug).single()
    if (error || !data) return null
    return data
  } catch { return null }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data
  } catch { return [] }
}
