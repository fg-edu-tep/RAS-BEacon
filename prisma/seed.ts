import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ras.com' },
    update: {},
    create: {
      email: 'admin@ras.com',
      name: 'Administrador',
      password: hashedPassword,
      status: 'ADMIN',
    },
  })

  // Create initial stats for admin
  await prisma.userStats.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
    },
  })

  console.log('Database seeded!')
  console.log('Admin credentials:')
  console.log('Email: admin@ras.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
