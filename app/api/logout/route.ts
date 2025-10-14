import { NextResponse } from 'next/server'
import { clearAuthCookie } from '../../../lib/auth'

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', clearAuthCookie())
    return res
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
