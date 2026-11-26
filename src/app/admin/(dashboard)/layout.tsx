import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'owner') redirect('/admin/login')

  return (
    <div className="min-h-screen bg-cream-secondary flex">
      <AdminSidebar userEmail={user.email || ''} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
