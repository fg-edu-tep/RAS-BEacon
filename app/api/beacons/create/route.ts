import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const beaconSchema = z.object({
  task: z.string().min(1),
  collaborationMode: z.enum(['OPEN', 'FOCUS']),
  location: z.string().min(1),
  startTime: z.string(),
  endTime: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = beaconSchema.parse(body)

    const beacon = await prisma.beacon.create({
      data: {
        userId: session.user.id,
        task: data.task,
        collaborationMode: data.collaborationMode,
        location: data.location,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            subTeam: true,
          }
        }
      }
    })

    // Check for synergies
    const overlappingBeacons = await prisma.beacon.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: session.user.id },
        startTime: { lte: beacon.endTime || new Date() },
        OR: [
          { endTime: { gte: beacon.startTime } },
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
        }
      }
    })

    return NextResponse.json({ 
      beacon,
      synergies: overlappingBeacons 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear beacon' },
      { status: 500 }
    )
  }
}
