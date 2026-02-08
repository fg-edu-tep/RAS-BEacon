'use client'

import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface MicroWin {
  id: string
  message: string
  createdAt: string
  user: {
    name: string
    subTeam: string | null
  }
  beacon: {
    task: string
    location: string
  }
}

export default function MicroWinsFeed() {
  const [microWins, setMicroWins] = useState<MicroWin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMicroWins()
    const interval = setInterval(fetchMicroWins, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const fetchMicroWins = async () => {
    try {
      const res = await fetch('/api/microwins?limit=10')
      if (res.ok) {
        const data = await res.json()
        setMicroWins(data)
      }
    } catch (error) {
      console.error('Error fetching micro-wins:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Cargando micro-wins...</div>
  }

  return (
    <div className="p-4 bg-black/40 rounded-lg border border-beacon-purple/30">
      <h3 className="text-lg font-bold mb-4 text-beacon-purple flex items-center gap-2">
        <Trophy size={20} />
        Micro-Wins
      </h3>
      {microWins.length === 0 ? (
        <p className="text-gray-400 text-sm">Aún no hay micro-wins</p>
      ) : (
        <div className="space-y-3">
          {microWins.map((win) => (
            <div
              key={win.id}
              className="p-3 bg-black/60 rounded-lg border border-beacon-purple/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-beacon-yellow">
                    {win.user.name}
                    {win.user.subTeam && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({win.user.subTeam})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {win.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {win.beacon.task} • {win.beacon.location}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(win.createdAt), 'dd/MM HH:mm', { locale: es })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
