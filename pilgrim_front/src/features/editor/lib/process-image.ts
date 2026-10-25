import type { Photo } from "@/shared/api/types";

const LARGE_SIDE = 1600;
const SMALL_SIDE = 760;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

type Encoded = {
  url: string;
  width: number;
  height: number;
};

function encode(bitmap: ImageBitmap, maxSide: number, quality: number): Encoded {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas недоступен");
  }

  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);

  const webp = canvas.toDataURL("image/webp", quality);
  // Старые Safari не кодируют WebP и молча отдают PNG — тогда берём JPEG.
  const url = webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", quality);

  return { url, width, height };
}

function captionFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

export async function processImage(file: File, author: string): Promise<Photo> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`«${file.name}» — не изображение`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`«${file.name}» больше 25 МБ`);
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`«${file.name}»: формат не поддерживается браузером, сохраните фото как JPEG`);
  }

  const large = encode(bitmap, LARGE_SIDE, 0.82);
  const small = encode(bitmap, SMALL_SIDE, 0.8);
  bitmap.close();

  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    src: large.url,
    thumbSrc: small.url,
    width: large.width,
    height: large.height,
    alt: captionFromFileName(file.name),
    credit: { author, license: "фото участника", sourceUrl: "" },
  };
}
