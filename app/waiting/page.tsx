'use client'

import { useSession } from 'next-auth/react'
import { Zap } from 'lucide-react'

export default function WaitingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md text-center">
        <Zap size={64} className="mx-auto mb-6 text-beacon-yellow animate-pulse" />
        <h1 className="text-3xl font-bold text-beacon-yellow mb-4">
          Esperando Aprobación
        </h1>
        <p className="text-gray-400 mb-2">
          Hola {session?.user?.name},
        </p>
        <p className="text-gray-400">
          Tu cuenta está pendiente de aprobación por un administrador.
          Te notificaremos cuando tu cuenta sea aprobada.
        </p>
      </div>
    </div>
  )
}
