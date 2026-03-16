import { Readable } from "stream";
import { randomUUID } from "crypto";
import ExifTransformer from "exif-be-gone";
import { fileTypeFromBuffer } from "file-type";

/** فرمت‌های مجاز با MIME types */
const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/** فرمت‌هایی که exif-be-gone متادیتا را حذف می‌کند (EXIF, XMP, GPS, …) */
const METADATA_STRIPPABLE = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "application/pdf",
]);

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/tiff": "tiff",
    "application/pdf": "pdf",
  };
  return map[mime] ?? "bin";
}

async function stripMetadata(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const input = Readable.from(buffer);
    const transformer = new ExifTransformer();

    input
      .pipe(transformer)
      .on("data", (chunk: Buffer) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });
}

export type ProcessResult =
  | { ok: true; buffer: Buffer; mime: string; ext: string; key: string }
  | { ok: false; error: string };

/**
 * اعتبارسنجی و پاک‌سازی متادیتای فایل را انجام می‌دهد.
 * - بررسی magic bytes (نه فقط پسوند)
 * - حذف EXIF, XMP, GPS و سایر متادیتا
 * - محدودیت حجم
 */
export async function processUploadedFile(
  buffer: Buffer,
  originalName: string,
): Promise<ProcessResult> {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "حداکثر حجم فایل ۱۰ مگابایت است" };
  }

  const ft = await fileTypeFromBuffer(buffer);
  if (!ft) {
    return { ok: false, error: "نوع فایل قابل تشخیص نیست" };
  }

  if (!ALLOWED_MIMES.has(ft.mime)) {
    return { ok: false, error: `فرمت غیرمجاز: ${ft.mime}` };
  }

  const ext = extFromMime(ft.mime);
  const key = `reports/${randomUUID()}.${ext}`;

  let outBuffer: Buffer;
  if (METADATA_STRIPPABLE.has(ft.mime)) {
    try {
      outBuffer = await stripMetadata(buffer);
    } catch {
      outBuffer = buffer;
    }
  } else {
    outBuffer = buffer;
  }

  return {
    ok: true,
    buffer: outBuffer,
    mime: ft.mime,
    ext,
    key,
  };
}
