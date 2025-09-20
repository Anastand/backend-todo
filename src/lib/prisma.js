// src/lib/prisma.js
import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}
// development clear all table -|
export const resetTodoDatabase = async () => {
  if (process.env.NODE_ENV === 'production') return
  try {
    await prisma.todo.deleteMany({})
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Todo'`
    console.log('🗑️ Todo Database reset - IDs will start from 1')
  } catch (error) {
    console.log('Reset failed:', error.message)
  }
}
export const resetUserDatabase = async () => {
  if (process.env.NODE_ENV_USER === 'production') return
  try {
    await prisma.user.deleteMany({})
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='User'`
    console.log('🗑️ User Database reset - IDs will start from 1')
  } catch (error) {
    console.log('Reset failed:', error.message)
  }
}
export default prisma
