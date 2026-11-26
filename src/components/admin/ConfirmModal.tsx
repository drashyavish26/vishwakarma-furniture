'use client'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmModal({ title, message, onConfirm, onCancel, loading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-sm shadow-xl p-6 max-w-md w-full border border-cream-secondary">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg text-espresso mb-1">{title}</h3>
            <p className="text-espresso/60 text-sm">{message}</p>
          </div>
          <button onClick={onCancel} className="p-1 text-espresso/40 hover:text-espresso">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm px-4 py-2">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-sm hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
