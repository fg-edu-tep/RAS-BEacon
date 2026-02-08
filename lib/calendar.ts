export function generateICS(beacon: {
  task: string
  location: string
  startTime: Date
  endTime: Date | null
  user: { name: string }
}): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const start = formatDate(beacon.startTime)
  const end = beacon.endTime ? formatDate(beacon.endTime) : formatDate(new Date(beacon.startTime.getTime() + 2 * 60 * 60 * 1000))

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RAS Beacon//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${beacon.task}`,
    `LOCATION:${beacon.location}`,
    `DESCRIPTION:Beacon de ${beacon.user.name}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return ics
}

export function downloadICS(ics: string, filename: string) {
  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
