'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Project } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function OurWorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      setProjects(data || [])
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <p className="text-champagne text-sm tracking-widest uppercase mb-2">Portfolio</p>
          <h1 className="font-serif text-3xl md:text-4xl text-espresso mb-2">Our Work</h1>
          <p className="text-espresso/60">Real projects, real craftsmanship — see what we&apos;ve built for our customers</p>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-sm rounded-sm border transition-colors capitalize ${
                filter === cat
                  ? 'bg-espresso text-cream border-espresso'
                  : 'border-cream-secondary text-espresso hover:border-teak'
              }`}
            >
              {cat === 'all' ? 'All Work' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[4/3] rounded-sm" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-espresso/40">No projects yet</p>
            <p className="text-espresso/30 text-sm mt-2">Check back soon — we&apos;re always working on something beautiful.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => (
              <div key={project.id} className="group overflow-hidden rounded-sm bg-white shadow-sm card-hover border border-cream-secondary">
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
                  <h3 className="font-serif text-espresso text-xl group-hover:text-teak transition-colors mb-1">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-espresso/60 text-sm leading-relaxed">{project.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
