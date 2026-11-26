'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Package, Tags, Image, Settings,
  LogOut, Menu, X, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/projects', label: 'Our Work', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-cream-secondary">
        <p className="font-serif text-espresso text-lg font-semibold">Admin Panel</p>
        <p className="text-xs text-espresso/50 truncate mt-0.5">{userEmail}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors',
              isActive(item.href, item.exact)
                ? 'bg-espresso text-cream'
                : 'text-espresso hover:bg-cream-secondary'
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-cream-secondary space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-sm text-espresso/60 hover:text-espresso hover:bg-cream-secondary rounded-sm transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> View Website
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50 rounded-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-sm shadow-md border border-cream-secondary"
      >
        <Menu className="w-5 h-5 text-espresso" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="bg-black/40 absolute inset-0" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-64 h-full shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1">
              <X className="w-5 h-5 text-espresso" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-cream-secondary min-h-screen flex-shrink-0">
        <SidebarContent />
      </div>
    </>
  )
}
