import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { encryptFilename } from './hash'

export const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

export function parseForm(req: any) {
  const form = formidable({ multiples: true, uploadDir, keepExtensions: true })
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export function moveAndEncryptFile(file: any) {
  const original = file.filepath || file.path
  const newName = encryptFilename(file.originalFilename || path.basename(original))
  const ext = path.extname(file.originalFilename || original)
  const dest = path.join(uploadDir, newName + ext)
  fs.renameSync(original, dest)
  return dest
}
