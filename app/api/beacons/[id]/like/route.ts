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

    const like = await prisma.like.upsert({
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
      }
    })

    return NextResponse.json(like)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al dar like' },
      { status: 500 }
    )
  }
}
