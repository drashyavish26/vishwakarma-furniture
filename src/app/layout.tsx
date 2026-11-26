import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Shree Vishwakarma Foam Mattress and Furniture',
    template: '%s | Shree Vishwakarma Furniture',
  },
  description: 'Discover beautifully crafted Sagwan (Teak Wood) furniture, sofas, beds, mattresses, and custom furniture.',
  keywords: ['furniture', 'sagwan', 'teak wood', 'sofa', 'beds', 'mattresses', 'custom furniture'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-cream text-espresso antialiased">
        {children}
      </body>
    </html>
  )
}
