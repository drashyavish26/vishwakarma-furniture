import { Metadata } from 'next'
import { getCategories } from '@/lib/data'
import { CategoryCard } from '@/components/ui/CategoryCard'

export const metadata: Metadata = { title: 'Categories' }

export default async function CategoriesPage() {
  const categories = await getCategories()
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <h1 className="font-serif text-3xl md:text-4xl text-espresso mb-2">Categories</h1>
          <p className="text-espresso/60">Browse our complete range of furniture collections</p>
        </div>
      </div>
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      </div>
    </div>
  )
}
