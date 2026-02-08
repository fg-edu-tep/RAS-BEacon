import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const beacons = await prisma.beacon.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ['ACTIVE', 'COMPLETED'] }
      },
      select: {
        startTime: true,
        endTime: true,
      }
    })

    // Create hourly heat map (0-23)
    const heatMap = Array(24).fill(0)
    
    beacons.forEach(beacon => {
      const start = new Date(beacon.startTime)
      const end = beacon.endTime ? new Date(beacon.endTime) : new Date()
      
      const startHour = start.getHours()
      const endHour = Math.min(end.getHours(), 23)
      
      for (let hour = startHour; hour <= endHour; hour++) {
        heatMap[hour]++
      }
    })

    return NextResponse.json(heatMap)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener heat map' },
      { status: 500 }
    )
  }
}
