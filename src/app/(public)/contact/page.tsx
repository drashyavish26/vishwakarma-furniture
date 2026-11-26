import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/data'
import { ContactContent } from '@/components/contact/ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Shree Vishwakarma Furniture for custom furniture inquiries, mattress requirements, or showroom visits.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return <ContactContent settings={settings} />
}
