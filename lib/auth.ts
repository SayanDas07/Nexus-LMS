import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null
  
  const user = await Prisma.user.findUnique({
    where: { clerkId: userId }
  })
  return user
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}
