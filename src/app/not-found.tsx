import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center px-4">
        <p className="font-serif text-9xl text-champagne/40 font-bold mb-4">404</p>
        <h1 className="font-serif text-3xl text-espresso mb-4">Page Not Found</h1>
        <p className="text-espresso/60 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/products" className="btn-secondary">View Products</Link>
        </div>
      </div>
    </div>
  )
}
