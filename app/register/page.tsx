'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    subTeam: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subTeam: formData.subTeam || undefined,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al registrar')
      }

      toast.success('¡Registro exitoso! Espera la aprobación del administrador.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Zap size={48} className="mx-auto mb-4 text-beacon-yellow" />
          <h1 className="text-3xl font-bold text-beacon-yellow mb-2">
            Registrarse
          </h1>
          <p className="text-gray-400">Únete a RAS Beacon</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Sub-equipo (opcional)
            </label>
            <input
              type="text"
              value={formData.subTeam}
              onChange={(e) => setFormData({ ...formData, subTeam: e.target.value })}
              placeholder="Ej: Visión, Mecánica, Software"
              className="w-full px-4 py-3 bg-black/60 border border-beacon-yellow/30 rounded-lg focus:outline-none focus:border-beacon-yellow"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-beacon-yellow to-beacon-orange text-black font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-beacon-yellow hover:underline text-sm"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
