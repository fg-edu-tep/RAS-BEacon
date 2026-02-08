'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Clock, Zap, Flame } from 'lucide-react'

interface Stats {
  totalBeacons: number
  totalHours: number
  currentStreak: number
  longestStreak: number
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-4 text-center">Cargando estadísticas...</div>
  }

  if (!stats) {
    return null
  }

  const statItems = [
    {
      label: 'Beacons Totales',
      value: stats.totalBeacons,
      icon: Zap,
      color: 'text-beacon-yellow',
    },
    {
      label: 'Horas Totales',
      value: Math.round(stats.totalHours * 10) / 10,
      icon: Clock,
      color: 'text-beacon-orange',
    },
    {
      label: 'Racha Actual',
      value: stats.currentStreak,
      icon: Flame,
      color: 'text-beacon-red',
    },
    {
      label: 'Racha Más Larga',
      value: stats.longestStreak,
      icon: TrendingUp,
      color: 'text-beacon-purple',
    },
  ]

  return (
    <div className="p-4 bg-black/40 rounded-lg border border-beacon-purple/30">
      <h3 className="text-lg font-bold mb-4 text-beacon-purple">Tus Estadísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="text-center">
              <Icon size={24} className={`mx-auto mb-2 ${item.color}`} />
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs text-gray-400 mt-1">{item.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
