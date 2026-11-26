import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getSiteSettings } from '@/lib/data'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { ProductGallery } from '@/components/ui/ProductGallery'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Phone, Package, Ruler, Palette, Wrench } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)
  return { title: product ? product.name : 'Product Not Found' }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()])
  if (!product) notFound()

  const images = [...(product.product_images || [])].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  return (
    <div className="bg-cream min-h-screen">
      <div className="section-container py-8 md:py-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-teak hover:text-champagne transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery images={images} productName={product.name} />

          <div>
            {product.category && typeof product.category === 'object' && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-teak text-sm hover:text-champagne transition-colors"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-serif text-3xl md:text-4xl text-espresso mt-2 mb-4">{product.name}</h1>

            {product.price ? (
              <p className="font-serif text-2xl text-champagne-dark font-semibold mb-6">{formatPrice(product.price)}</p>
            ) : (
              <p className="text-teak text-lg font-medium mb-6">Price on Request — Contact us for details</p>
            )}

            {product.description && (
              <p className="text-espresso/70 leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="space-y-4 mb-8">
              {product.material && (
                <div className="flex items-start gap-3 p-3 bg-cream-secondary rounded-sm">
                  <Package className="w-5 h-5 text-champagne mt-0.5" />
                  <div>
                    <p className="text-xs text-espresso/50 uppercase tracking-wide">Material</p>
                    <p className="text-espresso font-medium">{product.material}</p>
                  </div>
                </div>
              )}
              {product.sizes?.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-cream-secondary rounded-sm">
                  <Ruler className="w-5 h-5 text-champagne mt-0.5" />
                  <div>
                    <p className="text-xs text-espresso/50 uppercase tracking-wide">Available Sizes</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.sizes.map(s => (
                        <span key={s} className="text-xs bg-white border border-cream-secondary px-2 py-1 rounded-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {product.colors?.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-cream-secondary rounded-sm">
                  <Palette className="w-5 h-5 text-champagne mt-0.5" />
                  <div>
                    <p className="text-xs text-espresso/50 uppercase tracking-wide">Available Colors</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.colors.map(c => (
                        <span key={c} className="text-xs bg-white border border-cream-secondary px-2 py-1 rounded-sm">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {product.customization_available && (
                <div className="flex items-center gap-3 p-3 bg-champagne/10 border border-champagne/30 rounded-sm">
                  <Wrench className="w-5 h-5 text-champagne" />
                  <p className="text-espresso text-sm font-medium">Custom sizing &amp; designs available on request</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <WhatsAppButton
                whatsapp={settings.whatsapp}
                productName={product.name}
                className="flex-1 justify-center py-3"
              />
              <a href={`tel:${settings.phone}`} className="btn-secondary flex-1 justify-center py-3">
                <Phone className="w-4 h-4" /> Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
