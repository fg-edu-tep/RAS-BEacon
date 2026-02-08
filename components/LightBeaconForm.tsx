'use client'

import { useState } from 'react'
import { Zap, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface LightBeaconFormProps {
  onSuccess: () => void
}

export default function LightBeaconForm({ onSuccess }: LightBeaconFormProps) {
  const [task, setTask] = useState('')
  const [collaborationMode, setCollaborationMode] = useState<'OPEN' | 'FOCUS'>('OPEN')
  const [location, setLocation] = useState('')
  const [startTime, setStartTime] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!task || !location) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/beacons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          collaborationMode,
          location,
          startTime,
          endTime: endTime || undefined,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al crear beacon')
      }

      const data = await res.json()
      
      if (data.synergies && data.synergies.length > 0) {
        toast.success(
          `¡Sinergia detectada! ${data.synergies.length} persona(s) también estarán en el lab`,
          { duration: 5000 }
        )
      } else {
        toast.success('¡Beacon encendido!')
      }

      setTask('')
      setLocation('')
      setEndTime('')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-black/40 rounded-lg border border-beacon-yellow/30">
      <h2 className="text-xl font-bold mb-4 text-beacon-yellow flex items-center gap-2">
        <Zap size={24} />
        Encender Beacon
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            ¿Qué estás haciendo?
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Ej: Depurar sistema de conducción"
            className="w-full px-4 py-2 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Modo de Colaboración
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCollaborationMode('OPEN')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                collaborationMode === 'OPEN'
                  ? 'bg-beacon-yellow text-black'
                  : 'bg-black/60 border border-beacon-yellow/30'
              }`}
            >
              Abierto
            </button>
            <button
              type="button"
              onClick={() => setCollaborationMode('FOCUS')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                collaborationMode === 'FOCUS'
                  ? 'bg-beacon-purple text-white'
                  : 'bg-black/60 border border-purple/30'
              }`}
            >
              Enfoque
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Estación de trabajo 4, Banco de electrónica"
            className="w-full px-4 py-2 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Clock size={16} />
              Inicio
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Fin (opcional)
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-beacon-yellow to-beacon-orange text-black font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'Encendiendo...' : '¡Encender Beacon!'}
        </button>
      </div>
    </form>
  )
}
