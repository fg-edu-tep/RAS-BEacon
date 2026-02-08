'use client'

import { useState, useEffect } from 'react'
import { Printer, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function PrinterBooking() {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/printer/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!startTime || !endTime) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/printer/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime, endTime }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al reservar')
      }

      toast.success('¡Reserva creada! ¿Quieres encender un Beacon también?')
      setStartTime('')
      setEndTime('')
      fetchBookings()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-black/40 rounded-lg border border-beacon-orange/30">
      <h2 className="text-xl font-bold mb-4 text-beacon-orange flex items-center gap-2">
        <Printer size={24} />
        Reservar Impresora 3D
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Inicio</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 bg-black/60 border border-beacon-orange/30 rounded-lg focus:outline-none focus:border-beacon-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Fin</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 bg-black/60 border border-beacon-orange/30 rounded-lg focus:outline-none focus:border-beacon-orange"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-beacon-orange to-beacon-red text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'Reservando...' : 'Reservar Impresora'}
        </button>
      </form>

      {bookings.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Reservas Próximas</h3>
          <div className="space-y-2">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="p-2 bg-black/60 rounded text-sm"
              >
                <div className="font-semibold">{booking.user.name}</div>
                <div className="text-xs text-gray-400">
                  {format(new Date(booking.startTime), 'dd/MM HH:mm', { locale: es })} -{' '}
                  {format(new Date(booking.endTime), 'HH:mm', { locale: es })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
