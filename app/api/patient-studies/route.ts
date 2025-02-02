import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"

// Add proper singleton pattern for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL_POOL,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  const session = await getServerSession()
  
  if (!session) {
    return new NextResponse('Unauthorized', { 
      status: 401,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  }

  try {
    const studies = await prisma.patientStudy.findMany({
      orderBy: {
        studyDate: 'desc'
      }
    })

    return NextResponse.json(studies, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    return new NextResponse('Internal Server Error', { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  }
} 