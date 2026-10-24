import jsQR from "jsqr";

const VIDEO_FRAME_SIZE = 720;
const PHOTO_SIZES = [1200, 2000];

type Inversion = "dontInvert" | "attemptBoth";

function decodeSource(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  maxSize: number,
  canvas: HTMLCanvasElement,
  inversion: Inversion,
) {
  const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(source, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  return jsQR(data, width, height, { inversionAttempts: inversion })?.data ?? null;
}

export function decodeVideoFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  if (!video.videoWidth || !video.videoHeight) return null;
  return decodeSource(video, video.videoWidth, video.videoHeight, VIDEO_FRAME_SIZE, canvas, "dontInvert");
}

export async function decodePhoto(file: File) {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    for (const size of PHOTO_SIZES) {
      const text = decodeSource(bitmap, bitmap.width, bitmap.height, size, canvas, "attemptBoth");
      if (text) return text;
    }
    return null;
  } finally {
    bitmap.close();
  }
}
