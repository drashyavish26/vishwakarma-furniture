import { Metadata } from 'next'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'New Product — Admin' }

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-espresso mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
