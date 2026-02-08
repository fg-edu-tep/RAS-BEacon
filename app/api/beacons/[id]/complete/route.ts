import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const completeSchema = z.object({
  microWin: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = completeSchema.parse(body)

    const beacon = await prisma.beacon.findUnique({
      where: { id: params.id },
    })

    if (!beacon || beacon.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Beacon no encontrado' },
        { status: 404 }
      )
    }

    const completedBeacon = await prisma.beacon.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
      }
    })

    // Create micro-win if provided
    if (data.microWin) {
      await prisma.microWin.create({
        data: {
          beaconId: params.id,
          userId: session.user.id,
          message: data.microWin,
        }
      })
    }

    // Update user stats
    const duration = completedBeacon.endTime 
      ? (completedBeacon.endTime.getTime() - completedBeacon.startTime.getTime()) / (1000 * 60 * 60)
      : 0

    const stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id }
    })

    if (stats) {
      const lastBeaconDate = stats.lastBeaconDate
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const lastDate = lastBeaconDate ? new Date(lastBeaconDate) : null
      lastDate?.setHours(0, 0, 0, 0)
      
      const isNewDay = !lastDate || lastDate.getTime() !== today.getTime()
      const isConsecutive = lastDate && 
        (today.getTime() - lastDate.getTime()) === (24 * 60 * 60 * 1000)

      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          totalBeacons: { increment: 1 },
          totalHours: { increment: duration },
          currentStreak: isConsecutive 
            ? { increment: 1 }
            : isNewDay 
              ? 1 
              : stats.currentStreak,
          longestStreak: isConsecutive && stats.currentStreak + 1 > stats.longestStreak
            ? stats.currentStreak + 1
            : stats.longestStreak,
          lastBeaconDate: new Date(),
        }
      })
    }

    return NextResponse.json(completedBeacon)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al completar beacon' },
      { status: 500 }
    )
  }
}
