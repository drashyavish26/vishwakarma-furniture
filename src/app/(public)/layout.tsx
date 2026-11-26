import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { getSiteSettings } from '@/lib/data'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <>
      <Navbar businessName={settings.business_name} whatsapp={settings.whatsapp} />
      <main className="pt-16 md:pt-20">{children}</main>
      <WhatsAppButton whatsapp={settings.whatsapp} variant="floating" />
      <Footer settings={settings} />
    </>
  )
}
