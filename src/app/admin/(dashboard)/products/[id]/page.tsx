import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'

interface PageProps {
  params: { id: string }
}

export const metadata: Metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({ params }: PageProps) {
  const { id } = params
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .single()

  if (error || !product) notFound()

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-espresso mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}
