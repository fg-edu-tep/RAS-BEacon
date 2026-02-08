import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const join = await prisma.join.upsert({
      where: {
        userId_beaconId: {
          userId: session.user.id,
          beaconId: params.id,
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        beaconId: params.id,
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

    return NextResponse.json(join)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al unirse' },
      { status: 500 }
    )
  }
}
