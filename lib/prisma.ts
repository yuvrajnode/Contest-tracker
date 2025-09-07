import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

// Helper function to check if Prisma can connect to the database
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    return true
  } catch (error) {
    console.error("Failed to connect to database:", error)
    return false
  }
}

