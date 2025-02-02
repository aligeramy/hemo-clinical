import { getServerSession } from "next-auth"
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

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