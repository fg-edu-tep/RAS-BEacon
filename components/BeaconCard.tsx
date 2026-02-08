'use client'

import { useState } from 'react'
import { Heart, Users, MapPin, Clock, Zap, Calendar, Check } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { generateICS, downloadICS } from '@/lib/calendar'
import CompleteBeaconModal from './CompleteBeaconModal'

interface BeaconCardProps {
  beacon: {
    id: string
    task: string
    collaborationMode: 'OPEN' | 'FOCUS'
    location: string
    startTime: string
    endTime: string | null
    user: {
      id: string
      name: string
      subTeam: string | null
    }
    _count: {
      likes: number
      joins: number
    }
    likes: Array<{ userId: string }>
    joins: Array<{ userId: string }>
  }
  currentUserId?: string
  onLike: (beaconId: string) => void
  onJoin: (beaconId: string) => void
  onComplete?: () => void
}

export default function BeaconCard({ beacon, currentUserId, onLike, onJoin, onComplete }: BeaconCardProps) {
  const [isLiked, setIsLiked] = useState(
    beacon.likes.some(like => like.userId === currentUserId)
  )
  const [isJoined, setIsJoined] = useState(
    beacon.joins.some(join => join.userId === currentUserId)
  )
  const [likesCount, setLikesCount] = useState(beacon._count.likes)
  const [joinsCount, setJoinsCount] = useState(beacon._count.joins)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  
  const isOwner = beacon.user.id === currentUserId

  const handleLike = () => {
    onLike(beacon.id)
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleJoin = () => {
    onJoin(beacon.id)
    setIsJoined(!isJoined)
    setJoinsCount(isJoined ? joinsCount - 1 : joinsCount + 1)
  }

  const modeColors = {
    OPEN: 'bg-beacon-yellow text-black',
    FOCUS: 'bg-beacon-purple text-white',
  }

  const modeGlow = {
    OPEN: 'glow-yellow',
    FOCUS: 'glow-purple',
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${modeColors[beacon.collaborationMode]} ${modeGlow[beacon.collaborationMode]} mb-4`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{beacon.task}</h3>
          <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
            <span className="font-semibold">{beacon.user.name}</span>
            {beacon.user.subTeam && (
              <span className="px-2 py-0.5 rounded bg-black/20 text-xs">
                {beacon.user.subTeam}
              </span>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          beacon.collaborationMode === 'OPEN' ? 'bg-black/20' : 'bg-white/20'
        }`}>
          {beacon.collaborationMode === 'OPEN' ? 'Abierto' : 'Enfoque'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{beacon.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>
            {format(new Date(beacon.startTime), 'HH:mm', { locale: es })}
            {beacon.endTime && ` - ${format(new Date(beacon.endTime), 'HH:mm', { locale: es })}`}
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {!isOwner && (
          <>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLiked
                  ? 'bg-beacon-red text-white'
                  : 'bg-black/20 hover:bg-black/30'
              }`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              {likesCount}
            </button>
            <button
              onClick={handleJoin}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isJoined
                  ? 'bg-beacon-orange text-white'
                  : 'bg-black/20 hover:bg-black/30'
              }`}
            >
              <Users size={16} />
              Unirse ({joinsCount})
            </button>
          </>
        )}
        <button
          onClick={() => {
            const ics = generateICS({
              task: beacon.task,
              location: beacon.location,
              startTime: new Date(beacon.startTime),
              endTime: beacon.endTime ? new Date(beacon.endTime) : null,
              user: beacon.user,
            })
            downloadICS(ics, `beacon-${beacon.id}.ics`)
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-black/20 hover:bg-black/30 transition-all"
          title="Agregar a calendario"
        >
          <Calendar size={16} />
        </button>
        {isOwner && (
          <button
            onClick={() => setShowCompleteModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-beacon-green text-white hover:opacity-90 transition-all"
          >
            <Check size={16} />
            Completar
          </button>
        )}
      </div>
      
      {showCompleteModal && (
        <CompleteBeaconModal
          beaconId={beacon.id}
          onClose={() => setShowCompleteModal(false)}
          onComplete={() => {
            setShowCompleteModal(false)
            onComplete?.()
          }}
        />
      )}
    </div>
  )
}
