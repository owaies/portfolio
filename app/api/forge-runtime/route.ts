import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.info('[Forge runtime audit]', payload)
  } catch {
    console.warn('[Forge runtime audit] invalid payload')
  }
  return new NextResponse(null, { status: 204 })
}
