import formidable from "formidable";
import fs from "fs";
import path from "path";
import { encryptFilename } from "./hash";
import type {
  FieldsT,
  FilesT,
  UploadedFileT,
  FileLikeT,
  JSONValueT,
} from "./types";

export const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function parseForm(req: Request | import("http").IncomingMessage) {
  // If this is a Web Request (has formData), parse it using the Web API
  if (typeof (req as Request).formData === "function") {
    const r = req as Request;
    const formData = await r.formData();
    const fields: FieldsT = {};
    const files: FilesT = {};

    for (const entry of formData as unknown as Iterable<
      [string, FormDataEntryValue]
    >) {
      const [key, value] = entry;
      // File/Blob entry
      if (typeof File !== "undefined" && value instanceof File) {
        const file: File = value;
        const filename = file.name || "file";
        const arrayBuffer = await file.arrayBuffer();
        const ext = path.extname(filename) || "";
        const tmpName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const filepath = path.join(uploadDir, tmpName + ext);
        fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
        const fileObj: UploadedFileT = {
          filepath,
          originalFilename: filename,
          mimetype: file.type || null,
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
        const blob = value as Blob & { name?: string; type?: string };
        const filename = blob.name || "file";
        const arrayBuffer = await blob.arrayBuffer();
        const ext = path.extname(filename) || "";
        const tmpName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const filepath = path.join(uploadDir, tmpName + ext);
        fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
        const fileObj: UploadedFileT = {
          filepath,
          originalFilename: filename,
          mimetype: blob.type || null,
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
  return new Promise<{ fields: FieldsT; files: FilesT }>((resolve, reject) => {
    // `form.parse` expects a Node IncomingMessage
    form.parse(
      req as import("http").IncomingMessage,
      (err, fieldsRaw: unknown, filesRaw: unknown) => {
        if (err) return reject(err);
        // formidable returns fields: Record<string, string | string[]>
        const f = (fieldsRaw as FieldsT) || ({} as FieldsT);
        // filesRaw can be complex; treat as unknown and normalize safely
        const normalizedFiles: FilesT = {};
        const filesObj = (filesRaw as Record<string, unknown>) || {};
        for (const key of Object.keys(filesObj)) {
          const entry = filesObj[key];
          if (Array.isArray(entry)) {
            normalizedFiles[key] = entry.map((e) => {
              const er = e as Record<string, unknown>;
              const filepath =
                (er.filepath as string) || (er.path as string) || "";
              const originalFilename =
                (er.originalFilename as string) ||
                (er.name as string) ||
                path.basename(filepath || "");
              const mimetype =
                (er.mimetype as string) || (er.type as string) || null;
              return { filepath, originalFilename, mimetype } as UploadedFileT;
            });
          } else if (entry) {
            const er = entry as Record<string, unknown>;
            const filepath =
              (er.filepath as string) || (er.path as string) || "";
            const originalFilename =
              (er.originalFilename as string) ||
              (er.name as string) ||
              path.basename(filepath || "");
            const mimetype =
              (er.mimetype as string) || (er.type as string) || null;
            normalizedFiles[key] = {
              filepath,
              originalFilename,
              mimetype,
            } as UploadedFileT;
          }
        }
        resolve({ fields: f, files: normalizedFiles });
      }
    );
  });
}

export function moveAndEncryptFile(file: FileLikeT | UploadedFileT) {
  const f = file as FileLikeT;
  const originalRaw = f.filepath ?? f.path;
  const original =
    typeof originalRaw === "string" ? originalRaw : String(originalRaw ?? "");
  const originalFilename = f.originalFilename ?? path.basename(original);
  const newName = encryptFilename(originalFilename);
  const ext = path.extname(originalFilename || original);
  const dest = path.join(uploadDir, newName + ext);
  if (!original)
    throw new Error("moveAndEncryptFile: no original filepath provided");
  fs.renameSync(original, dest);
  return dest;
}
