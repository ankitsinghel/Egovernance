import bcrypt from 'bcrypt'
import crypto from 'crypto'

export async function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateTrackingId() {
  const payload = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`
  return crypto.createHash('sha256').update(payload).digest('hex')
}

export function encryptFilename(filename: string) {
  // simple deterministic obfuscation using HMAC - filenames stored are not the file content
  const key = process.env.EVIDENCE_HMAC_KEY || 'dev-secret-key'
  return crypto.createHmac('sha256', key).update(filename + Date.now().toString()).digest('hex')
}
