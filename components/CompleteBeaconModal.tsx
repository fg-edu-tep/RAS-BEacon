'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface CompleteBeaconModalProps {
  beaconId: string
  onClose: () => void
  onComplete: () => void
}

export default function CompleteBeaconModal({
  beaconId,
  onClose,
  onComplete,
}: CompleteBeaconModalProps) {
  const [microWin, setMicroWin] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/beacons/${beaconId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          microWin: microWin || undefined,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al completar beacon')
      }

      toast.success('¡Beacon completado!')
      onComplete()
      onClose()
    } catch (error) {
      toast.error('Error al completar beacon')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-beacon-yellow rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-beacon-yellow">
            Completar Beacon
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Micro-Win (opcional)
            </label>
            <textarea
              value={microWin}
              onChange={(e) => setMicroWin(e.target.value)}
              placeholder="Ej: ¡Código compilado! Sensor calibrado correctamente."
              className="w-full px-4 py-2 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-black/60 border border-gray-600 rounded-lg hover:bg-black/80 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-beacon-yellow to-beacon-orange text-black font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {loading ? 'Completando...' : 'Completar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
