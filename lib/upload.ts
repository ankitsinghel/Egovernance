import formidable from "formidable";
import fs from "fs";
import path from "path";
import { encryptFilename } from "./hash";

export const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function parseForm(req: any) {
  // If this is a Web Request (has formData), parse it using the Web API
  if (req && typeof req.formData === "function") {
    const formData = await req.formData();
    const fields: any = {};
    const files: any = {};

    for (const entry of formData.entries()) {
      const [key, value] = entry as [string, any];
      // File/Blob entry
      if (typeof File !== "undefined" && value instanceof File) {
        const file: File = value;
        const filename = file.name || "file";
        const arrayBuffer = await file.arrayBuffer();
        const ext = path.extname(filename) || "";
        const tmpName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const filepath = path.join(uploadDir, tmpName + ext);
        fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
        const fileObj = {
          filepath,
          originalFilename: filename,
          mimetype: file.type,
        };
        if (files[key]) {
          if (Array.isArray(files[key])) files[key].push(fileObj);
          else files[key] = [files[key], fileObj];
        } else {
          files[key] = fileObj;
        }
      } else if (
        value &&
        typeof value === "object" &&
        value.constructor &&
        value.constructor.name === "Blob"
      ) {
        // Generic Blob (in some runtimes)
        const blob = value;
        const filename = (blob as any).name || "file";
        const arrayBuffer = await blob.arrayBuffer();
        const ext = path.extname(filename) || "";
        const tmpName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const filepath = path.join(uploadDir, tmpName + ext);
        fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
        const fileObj = {
          filepath,
          originalFilename: filename,
          mimetype: (blob as any).type,
        };
        if (files[key]) {
          if (Array.isArray(files[key])) files[key].push(fileObj);
          else files[key] = [files[key], fileObj];
        } else {
          files[key] = fileObj;
        }
      } else {
        const val = typeof value === "string" ? value : String(value);
        if (fields[key] !== undefined) {
          if (Array.isArray(fields[key])) fields[key].push(val);
          else fields[key] = [fields[key], val];
        } else {
          fields[key] = val;
        }
      }
    }

    return { fields, files };
  }

  // Fallback to formidable for Node IncomingMessage
  const form = formidable({ multiples: true, uploadDir, keepExtensions: true });
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export function moveAndEncryptFile(file: any) {
  const original = file.filepath || file.path;
  const newName = encryptFilename(
    file.originalFilename || path.basename(original)
  );
  const ext = path.extname(file.originalFilename || original);
  const dest = path.join(uploadDir, newName + ext);
  fs.renameSync(original, dest);
  return dest;
}
