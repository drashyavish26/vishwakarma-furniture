'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })
    if (resetError) { setError(resetError.message); setLoading(false); return }
    setResetSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-espresso mb-1">Shree Vishwakarma</h1>
          <p className="text-teak text-sm tracking-widest uppercase">Owner Dashboard</p>
        </div>

        <div className="bg-white rounded-sm shadow-lg p-8 border border-cream-secondary">
          {!forgotMode ? (
            <>
              <h2 className="font-serif text-2xl text-espresso mb-6">Sign In</h2>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-4 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="admin-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="owner@example.com"
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="admin-input pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <button
                onClick={() => setForgotMode(true)}
                className="text-teak text-sm mt-4 w-full text-center hover:text-champagne transition-colors"
              >
                Forgot your password?
              </button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl text-espresso mb-2">Reset Password</h2>
              {resetSent ? (
                <div className="text-center py-6">
                  <p className="text-espresso/70 mb-4">Password reset email sent! Check your inbox.</p>
                  <button
                    onClick={() => { setForgotMode(false); setResetSent(false) }}
                    className="btn-secondary text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-4 text-sm">
                      <AlertCircle className="w-4 h-4" />{error}
                    </div>
                  )}
                  <form onSubmit={handleForgot} className="space-y-4 mt-4">
                    <div>
                      <label className="admin-label">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="owner@example.com"
                        className="admin-input"
                      />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                      {loading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                  </form>
                  <button
                    onClick={() => setForgotMode(false)}
                    className="text-teak text-sm mt-4 w-full text-center hover:text-champagne transition-colors"
                  >
                    Back to Sign In
                  </button>
                </>
              )}
            </>
          )}
        </div>
        <p className="text-center text-xs text-espresso/30 mt-6">Owner access only. No public registration.</p>
      </div>
    </div>
  )
}
