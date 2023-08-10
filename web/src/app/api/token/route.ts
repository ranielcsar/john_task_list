import { NextResponse } from 'next/server'

export async function GET() {
  const response = await fetch('http://localhost:3333/token').then((res) => res.json())
  const data = response

  return NextResponse.json(data.token)
}