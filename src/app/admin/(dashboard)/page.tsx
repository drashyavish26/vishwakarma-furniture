import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Package, Tags, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: featuredProducts },
    { count: totalProjects },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase
      .from('products')
      .select('id, name, price, is_available, is_featured, category:categories(name), product_images(image_url, is_primary)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Total Products', value: totalProducts ?? 0, icon: Package, href: '/admin/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Categories', value: totalCategories ?? 0, icon: Tags, href: '/admin/categories', color: 'bg-purple-50 text-purple-600' },
    { label: 'Featured', value: featuredProducts ?? 0, icon: Star, href: '/admin/products', color: 'bg-champagne/20 text-champagne-dark' },
    { label: 'Portfolio', value: totalProjects ?? 0, icon: TrendingUp, href: '/admin/projects', color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-espresso mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-sm p-5 border border-cream-secondary hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="font-serif text-2xl text-espresso font-semibold">{stat.value}</p>
            <p className="text-xs text-espresso/50 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-cream-secondary">
        <div className="flex items-center justify-between p-5 border-b border-cream-secondary">
          <h2 className="font-serif text-lg text-espresso">Recent Products</h2>
          <Link href="/admin/products" className="text-teak text-sm hover:text-champagne transition-colors">View all →</Link>
        </div>
        <div className="divide-y divide-cream-secondary">
          {recentProducts?.map(product => {
            type ImgRow = { image_url: string; is_primary: boolean }
            const imgs = product.product_images as ImgRow[] | null
            const thumb = imgs?.find(i => i.is_primary) || imgs?.[0]
            const cat = (product.category as unknown as { name: string } | null)
            return (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-cream/50 transition-colors">
                <div className="w-12 h-12 bg-cream-secondary rounded-sm overflow-hidden flex-shrink-0">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teak/30 text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-espresso truncate">{product.name}</p>
                  <p className="text-xs text-espresso/50">{cat?.name || 'No category'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-champagne-dark">{formatPrice(product.price)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${product.is_available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {product.is_available ? 'Available' : 'Hidden'}
                  </span>
                </div>
              </div>
            )
          })}
          {(!recentProducts || recentProducts.length === 0) && (
            <div className="p-8 text-center text-espresso/40">
              <p className="font-serif">No products yet.</p>
              <Link href="/admin/products/new" className="text-teak text-sm hover:text-champagne mt-2 inline-block">
                Add your first product →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
