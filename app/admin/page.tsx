'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface PendingUser {
  id: string
  email: string
  name: string
  subTeam: string | null
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user.status !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user.status === 'ADMIN') {
      fetchPendingUsers()
    }
  }, [status, session])

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/users/pending')
      if (res.ok) {
        const data = await res.json()
        setPendingUsers(data)
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const res = await fetch('/api/users/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!res.ok) {
        throw new Error('Error al aprobar usuario')
      }

      toast.success('Usuario aprobado')
      fetchPendingUsers()
    } catch (error) {
      toast.error('Error al aprobar usuario')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-beacon-yellow">Cargando...</div>
      </div>
    )
  }

  if (!session || session.user.status !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-beacon-yellow mb-6">
          Panel de Administración
        </h1>

        <div className="bg-black/40 rounded-lg border border-beacon-purple/30 p-4">
          <h2 className="text-xl font-bold mb-4 text-beacon-purple">
            Usuarios Pendientes
          </h2>

          {pendingUsers.length === 0 ? (
            <p className="text-gray-400">No hay usuarios pendientes</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-black/60 rounded-lg border border-beacon-yellow/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-beacon-yellow">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      {user.subTeam && (
                        <p className="text-xs text-gray-500 mt-1">
                          Sub-equipo: {user.subTeam}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Registrado: {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="ml-4 p-2 bg-beacon-yellow text-black rounded-lg hover:opacity-90 transition-all"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
