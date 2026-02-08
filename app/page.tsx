'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LightBeaconForm from '@/components/LightBeaconForm'
import BeaconCard from '@/components/BeaconCard'
import HeatMap from '@/components/HeatMap'
import StatsCard from '@/components/StatsCard'
import PrinterBooking from '@/components/PrinterBooking'
import MicroWinsFeed from '@/components/MicroWinsFeed'
import { Zap, Users, Calendar, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeBeacons, setActiveBeacons] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'pulse' | 'light' | 'printer' | 'stats'>('pulse')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user.status !== 'APPROVED') {
      router.push('/waiting')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user.status === 'APPROVED') {
      fetchActiveBeacons()
      const interval = setInterval(fetchActiveBeacons, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [status, session])

  const fetchActiveBeacons = async () => {
    try {
      const res = await fetch('/api/beacons/active')
      if (res.ok) {
        const data = await res.json()
        setActiveBeacons(data)
      }
    } catch (error) {
      console.error('Error fetching beacons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (beaconId: string) => {
    try {
      const res = await fetch(`/api/beacons/${beaconId}/like`, {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error('Error al dar like')
      }
    } catch (error) {
      toast.error('Error al dar like')
    }
  }

  const handleJoin = async (beaconId: string) => {
    try {
      const res = await fetch(`/api/beacons/${beaconId}/join`, {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error('Error al unirse')
      }
      toast.success('¡Te has unido a la sesión!')
    } catch (error) {
      toast.error('Error al unirse')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-beacon-yellow">Cargando...</div>
      </div>
    )
  }

  if (!session || session.user.status !== 'APPROVED') {
    return null
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-beacon-yellow/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-beacon-yellow mb-4">
            RAS Beacon
          </h1>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('pulse')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'pulse'
                  ? 'bg-beacon-yellow text-black'
                  : 'bg-black/60 border border-beacon-yellow/30'
              }`}
            >
              <Users size={16} className="mx-auto mb-1" />
              Pulso
            </button>
            <button
              onClick={() => setActiveTab('light')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'light'
                  ? 'bg-beacon-orange text-white'
                  : 'bg-black/60 border border-beacon-orange/30'
              }`}
            >
              <Zap size={16} className="mx-auto mb-1" />
              Encender
            </button>
            <button
              onClick={() => setActiveTab('printer')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'printer'
                  ? 'bg-beacon-red text-white'
                  : 'bg-black/60 border border-beacon-red/30'
              }`}
            >
              <Printer size={16} className="mx-auto mb-1" />
              Impresora
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-beacon-purple text-white'
                  : 'bg-black/60 border border-beacon-purple/30'
              }`}
            >
              <Calendar size={16} className="mx-auto mb-1" />
              Stats
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {activeTab === 'pulse' && (
          <div className="space-y-4">
            <HeatMap />
            <div>
              <h2 className="text-xl font-bold mb-4 text-beacon-yellow">
                Beacons Activos
              </h2>
              {activeBeacons.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No hay beacons activos en este momento
                </div>
              ) : (
                <div>
                  {activeBeacons.map((beacon) => (
                    <BeaconCard
                      key={beacon.id}
                      beacon={beacon}
                      currentUserId={session.user.id}
                      onLike={handleLike}
                      onJoin={handleJoin}
                      onComplete={fetchActiveBeacons}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'light' && (
          <LightBeaconForm onSuccess={() => {
            setActiveTab('pulse')
            fetchActiveBeacons()
          }} />
        )}

        {activeTab === 'printer' && <PrinterBooking />}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <StatsCard />
            <MicroWinsFeed />
          </div>
        )}
      </div>
    </div>
  )
}
