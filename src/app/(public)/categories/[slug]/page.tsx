import { notFound } from 'next/navigation'
import { getCategoryBySlug, getProducts, getSiteSettings } from '@/lib/data'
import { ProductCard } from '@/components/ui/ProductCard'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const cat = await getCategoryBySlug(params.slug)
  return { title: cat ? cat.name : 'Category Not Found' }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params
  const [category, settings] = await Promise.all([getCategoryBySlug(slug), getSiteSettings()])
  if (!category) notFound()
  const products = await getProducts({ categorySlug: slug })

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <p className="text-teak text-sm mb-2">
            <Link href="/categories" className="hover:text-champagne transition-colors">Categories</Link>
            <span className="mx-2">/</span>{category.name}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-espresso mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-espresso/60 max-w-xl">{category.description}</p>
          )}
        </div>
      </div>
      <div className="section-container py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-espresso/40">No products in this category yet</p>
            <p className="text-espresso/30 text-sm mt-2">Check back soon or browse other categories.</p>
            <Link href="/categories" className="btn-primary mt-6 inline-flex">Browse Categories</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} whatsapp={settings.whatsapp} />)}
          </div>
        )}
      </div>
    </div>
  )
}
