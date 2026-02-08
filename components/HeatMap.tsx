'use client'

import { useEffect, useState } from 'react'

interface HeatMapProps {
  date?: string
}

export default function HeatMap({ date }: HeatMapProps) {
  const [heatMap, setHeatMap] = useState<number[]>(Array(24).fill(0))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeatMap = async () => {
      try {
        const dateParam = date || new Date().toISOString().split('T')[0]
        const res = await fetch(`/api/heatmap?date=${dateParam}`)
        const data = await res.json()
        setHeatMap(data)
      } catch (error) {
        console.error('Error fetching heat map:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeatMap()
    const interval = setInterval(fetchHeatMap, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [date])

  const maxValue = Math.max(...heatMap, 1)
  const getIntensity = (value: number) => {
    if (value === 0) return 0
    return Math.min((value / maxValue) * 100, 100)
  }

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-black'
    if (intensity < 25) return 'bg-beacon-purple/20'
    if (intensity < 50) return 'bg-beacon-purple/40'
    if (intensity < 75) return 'bg-beacon-orange/60'
    return 'bg-beacon-yellow'
  }

  if (loading) {
    return <div className="p-4 text-center">Cargando mapa de calor...</div>
  }

  return (
    <div className="p-4 bg-black/40 rounded-lg border border-beacon-purple/30">
      <h3 className="text-lg font-bold mb-4 text-beacon-yellow">Mapa de Calor del Día</h3>
      <div className="grid grid-cols-12 gap-1">
        {heatMap.map((value, hour) => {
          const intensity = getIntensity(value)
          return (
            <div key={hour} className="flex flex-col items-center">
              <div
                className={`w-full h-8 rounded ${getColor(intensity)} transition-all`}
                style={{ opacity: intensity > 0 ? 0.3 + (intensity / 100) * 0.7 : 0.1 }}
                title={`${hour}:00 - ${value} beacons`}
              />
              <span className="text-xs text-gray-400 mt-1">{hour}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>Baja actividad</span>
        <span>Alta actividad</span>
      </div>
    </div>
  )
}
