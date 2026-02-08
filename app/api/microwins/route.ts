import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const microWins = await prisma.microWin.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            subTeam: true,
          }
        },
        beacon: {
          select: {
            task: true,
            location: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(microWins)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener micro-wins' },
      { status: 500 }
    )
  }
}
