'use client'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhatsAppButtonProps {
  whatsapp: string
  productName?: string
  className?: string
  variant?: 'default' | 'floating'
}

export function WhatsAppButton({ whatsapp, productName, className, variant = 'default' }: WhatsAppButtonProps) {
  const number = whatsapp.replace(/\D/g, '')
  const message = productName
    ? `Hello, I am interested in ${productName}. Please share more details and pricing.`
    : `Hello, I would like to know more about your furniture collection.`
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110',
          className
        )}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" fill="white" />
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('btn-whatsapp', className)}
    >
      <MessageCircle className="w-4 h-4" />
      WhatsApp Inquiry
    </a>
  )
}
