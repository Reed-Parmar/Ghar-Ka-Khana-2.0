import { NextResponse } from 'next/server';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Ghar Ka Khana API',
    version: '1.0.0'
  });
}