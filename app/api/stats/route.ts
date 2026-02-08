import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id }
    })

    if (!stats) {
      return NextResponse.json({
        totalBeacons: 0,
        totalHours: 0,
        currentStreak: 0,
        longestStreak: 0,
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
