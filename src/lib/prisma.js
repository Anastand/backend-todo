// src/lib/prisma.js
import { PrismaClient } from '@prisma/client'

// Singleton pattern to avoid multiple Prisma instances
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // In development, use global to persist across hot reloads
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
