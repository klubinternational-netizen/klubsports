import ImageKit from 'imagekit';
import path from 'path';
import fs from 'fs/promises';

const hasImageKitConfig = Boolean(
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
);

let imagekitInstance: ImageKit | null = null;

if (hasImageKitConfig) {
  imagekitInstance = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
  });
}

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  provider: 'imagekit' | 'local';
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMediaFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: string = 'klub-sports'
): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}. Allowed formats: JPG, PNG, WEBP, SVG, AVIF.`);
  }

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 10MB limit.');
  }

  // If ImageKit credentials are provided and valid, upload to ImageKit
  if (imagekitInstance) {
    try {
      const response = await imagekitInstance.upload({
        file: buffer,
        fileName: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        folder: `/${folder}`,
        useUniqueFileName: true,
      });

      return {
        url: response.url,
        fileId: response.fileId,
        name: response.name,
        provider: 'imagekit',
      };
    } catch (err: any) {
      console.warn('ImageKit upload failed, falling back to local storage:', err?.message);
    }
  }

  // Safe fallback to local media directory in public/uploads/
  const cleanName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, cleanName);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${cleanName}`,
    fileId: `local-${cleanName}`,
    name: cleanName,
    provider: 'local',
  };
}

export function isImageKitConfigured(): boolean {
  return hasImageKitConfig;
}
