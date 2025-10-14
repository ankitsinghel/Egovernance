import { NextResponse } from 'next/server'
import { parse } from 'cookie'
import { verifyToken } from '../../../../lib/auth'

export async function GET(req: Request) {
  // development-only debug endpoint to see cookies server receives
  const cookieHeader = req.headers.get('cookie') || ''
  const cookies = parse(cookieHeader || '')
  const token = cookies['egov_token']
  const payload = token ? verifyToken(token) : null
  return NextResponse.json({ ok: true, cookieHeader, cookies, token: !!token, payload })
}
