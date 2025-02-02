import { NextResponse } from 'next/server'

// This prevents browsers from repeatedly requesting the service worker
export async function GET() {
  return new NextResponse(null, {
    status: 204,  // No Content
    headers: {
      'Cache-Control': 'public, max-age=31536000',  // Cache for 1 year
    },
  })
} 