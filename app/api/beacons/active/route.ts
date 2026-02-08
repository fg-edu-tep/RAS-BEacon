import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const activeBeacons = await prisma.beacon.findMany({
      where: {
        status: 'ACTIVE',
        startTime: { lte: new Date() },
        OR: [
          { endTime: { gte: new Date() } },
          { endTime: null }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            subTeam: true,
          }
        },
        likes: {
          select: {
            userId: true,
          }
        },
        joins: {
          select: {
            userId: true,
          }
        },
        _count: {
          select: {
            likes: true,
            joins: true,
          }
        }
      },
      orderBy: { startTime: 'desc' }
    })

    return NextResponse.json(activeBeacons)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener beacons activos' },
      { status: 500 }
    )
  }
}
