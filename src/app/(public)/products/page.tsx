import { Metadata } from 'next'
import { getProducts, getCategories, getSiteSettings } from '@/lib/data'
import { ProductCard } from '@/components/ui/ProductCard'
import { Search } from 'lucide-react'

export const metadata: Metadata = { title: 'All Products' }

interface PageProps {
  searchParams?: { category?: string; search?: string }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = searchParams || {}
  const [products, categories, settings] = await Promise.all([
    getProducts({ categorySlug: params.category, search: params.search }),
    getCategories(),
    getSiteSettings(),
  ])

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <h1 className="font-serif text-3xl md:text-4xl text-espresso mb-2">Our Products</h1>
          <p className="text-espresso/60">Discover our complete range of handcrafted furniture and mattresses</p>
        </div>
      </div>
      <div className="section-container py-8">
        <div className="flex flex-wrap gap-3 mb-8 items-start">
          <form method="GET" className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
              <input name="search" defaultValue={params.search} placeholder="Search products..." className="admin-input pl-9" />
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">Search</button>
          </form>
          <div className="flex gap-2 flex-wrap">
            <a
              href="/products"
              className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${!params.category ? 'bg-espresso text-cream border-espresso' : 'border-cream-secondary text-espresso hover:border-teak'}`}
            >
              All
            </a>
            {categories.map(cat => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${params.category === cat.slug ? 'bg-espresso text-cream border-espresso' : 'border-cream-secondary text-espresso hover:border-teak'}`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-espresso/40 mb-2">No products found</p>
            <p className="text-espresso/30 text-sm">Try a different category or search term</p>
          </div>
        ) : (
          <>
            <p className="text-espresso/50 text-sm mb-6">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} whatsapp={settings.whatsapp} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
