import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bookingSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  beaconId: z.string().optional(),
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
    const data = bookingSchema.parse(body)

    const startTime = new Date(data.startTime)
    const endTime = new Date(data.endTime)

    // Check for conflicts
    const conflicts = await prisma.printerBooking.findMany({
      where: {
        OR: [
          {
            startTime: { lte: endTime },
            endTime: { gte: startTime },
          }
        ]
      }
    })

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Ya hay una reserva en ese horario' },
        { status: 400 }
      )
    }

    const booking = await prisma.printerBooking.create({
      data: {
        userId: session.user.id,
        startTime,
        endTime,
        beaconId: data.beaconId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al reservar impresora' },
      { status: 500 }
    )
  }
}
