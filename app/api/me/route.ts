import { NextResponse } from 'next/server'
import { verifyToken, getAdminFromToken } from '../../../lib/auth'

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/egov_token=([^;]+)/)
    const token = match?.[1]
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ ok: true, user: null })
    const user = await getAdminFromToken(token)
    // return minimal safe user shape
    return NextResponse.json({ ok: true, user: user ? { id: user.id, name: user.name, role: (user as any).role || 'Admin' } : null })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
