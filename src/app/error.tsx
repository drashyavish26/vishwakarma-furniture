'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-sm border border-cream-secondary shadow-sm">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-espresso mb-2">Something Went Wrong</h1>
        <p className="text-espresso/60 text-sm mb-6 leading-relaxed">
          We encountered an unexpected error while processing your request. Please try again or return to our home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary justify-center text-sm px-5 py-2.5"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary justify-center text-sm px-5 py-2.5"
          >
            <Home className="w-4 h-4" /> Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
