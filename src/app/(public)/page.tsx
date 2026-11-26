import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Hammer, Gem, Layers, Heart, Award } from 'lucide-react'
import { getSiteSettings, getCategories, getProducts, getProjects } from '@/lib/data'
import { ProductCard } from '@/components/ui/ProductCard'
import { CategoryCard } from '@/components/ui/CategoryCard'

export default async function HomePage() {
  const [settings, categories, featuredProducts, projects] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 6 }),
    getProjects(),
  ])

  const WHY_US = [
    { icon: Hammer, title: 'Quality Craftsmanship', desc: 'Every piece handcrafted by skilled artisans with decades of experience.' },
    { icon: Gem, title: 'Premium Materials', desc: 'Only the finest Sagwan (Teak Wood) and premium fabrics in every product.' },
    { icon: Layers, title: 'Custom Designs', desc: 'Bespoke furniture tailored to your exact specifications and preferences.' },
    { icon: Heart, title: 'Superior Comfort', desc: 'Ergonomically designed for maximum comfort and long-lasting durability.' },
    { icon: Award, title: 'Customer Satisfaction', desc: 'Hundreds of happy homes across the region. Your satisfaction is our pride.' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-espresso overflow-hidden">
        {/* Full-bleed background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="section-container relative z-10 py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl animate-fade-in">
            <p className="text-champagne text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3 font-medium">
              Premium Furniture Manufacturers
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream leading-tight mb-3 sm:mb-4 max-w-xl">
              {settings.hero_title}
            </h1>
            <p className="text-cream/80 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed max-w-lg">
              {settings.hero_description}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link href="/products" className="btn-primary text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-3.5">
                Explore Collection <ArrowRight className="w-4 h-4 sm:w-5 h-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-cream text-cream font-semibold px-6 py-3 sm:px-8 sm:py-3.5 rounded-sm hover:bg-cream hover:text-espresso transition-colors duration-200 text-sm sm:text-base">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-cream">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-champagne text-sm tracking-widest uppercase mb-2">Browse by Category</p>
            <h2 className="font-serif text-3xl md:text-4xl text-espresso">Our Collections</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-cream-secondary">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-champagne text-sm tracking-widest uppercase mb-2">Handpicked for You</p>
                <h2 className="font-serif text-3xl md:text-4xl text-espresso">Featured Products</h2>
              </div>
              <Link href="/products" className="hidden md:flex items-center gap-2 text-teak hover:text-champagne transition-colors font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} whatsapp={settings.whatsapp} />
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href="/products" className="btn-secondary">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="section-padding bg-espresso">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-champagne text-sm tracking-widest uppercase mb-2">Our Promise</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {WHY_US.map(item => (
              <div key={item.title} className="text-center group">
                <div className="w-14 h-14 bg-champagne/10 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-champagne/20 transition-colors">
                  <item.icon className="w-7 h-7 text-champagne" />
                </div>
                <h3 className="font-serif text-cream text-lg mb-2">{item.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work Preview */}
      {projects.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="section-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-champagne text-sm tracking-widest uppercase mb-2">Real Projects</p>
                <h2 className="font-serif text-3xl md:text-4xl text-espresso">Our Work</h2>
              </div>
              <Link href="/our-work" className="hidden md:flex items-center gap-2 text-teak hover:text-champagne transition-colors font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map(project => (
                <div key={project.id} className="group overflow-hidden rounded-sm bg-cream-secondary card-hover">
                  <div className="relative aspect-[4/3] bg-cream-secondary">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-teak/30 font-serif italic text-sm">No image</span>
                      </div>
                    )}
                    {project.category && (
                      <span className="absolute top-3 left-3 bg-champagne text-espresso text-xs px-2 py-1 rounded-sm">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-espresso text-lg group-hover:text-teak transition-colors">{project.title}</h3>
                    {project.description && (
                      <p className="text-espresso/60 text-sm mt-1 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-champagne py-16">
        <div className="section-container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-espresso mb-4">Looking for Custom Furniture?</h2>
          <p className="text-espresso/70 mb-8 max-w-xl mx-auto">
            We specialize in bespoke furniture crafted to your exact requirements. Get in touch for a personalized consultation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-secondary">Get a Quote</Link>
            <Link href="/categories/customized-furniture" className="bg-espresso text-cream font-semibold px-6 py-3 rounded-sm hover:bg-espresso-light transition-colors inline-flex items-center gap-2">
              View Custom Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
