import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface WatermarkOptions {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity?: number; // 0.1 to 1.0 (default 0.95)
  scaleRatio?: number; // ratio of image width, default 0.22 (22%)
  paddingRatio?: number; // ratio of minimum dimension, default 0.025 (2.5%)
  logoPath?: string;
}

/**
 * Applies the logo watermark to an image buffer using Sharp.
 * If the image cannot be processed or is unsupported, throws an error so caller can handle or fallback.
 */
export async function applyWatermark(
  imageBuffer: Buffer,
  options: WatermarkOptions = {}
): Promise<{ buffer: Buffer; format: string; width: number; height: number; mimeType: string }> {
  const {
    position = 'bottom-right',
    opacity = 0.95,
    scaleRatio = 0.22,
    paddingRatio = 0.025,
    logoPath = path.join(process.cwd(), 'public', 'logo.png'),
  } = options;

  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found at: ${logoPath}`);
  }

  // Auto-rotate base image according to EXIF data
  const baseImageInstance = sharp(imageBuffer).rotate();
  const baseMeta = await baseImageInstance.metadata();

  const imgWidth = baseMeta.width;
  const imgHeight = baseMeta.height;

  if (!imgWidth || !imgHeight) {
    throw new Error('Unable to determine image dimensions');
  }

  // Load and trim logo to remove excess transparent padding
  const trimmedLogoBuffer = await sharp(logoPath).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuffer).metadata();
  const logoAspect = (trimmedMeta.width || 1224) / (trimmedMeta.height || 761);

  // Determine watermark width (proportional to image width)
  let wmWidth = Math.round(imgWidth * scaleRatio);
  wmWidth = Math.max(70, Math.min(380, wmWidth));
  if (wmWidth > imgWidth * 0.40) {
    wmWidth = Math.round(imgWidth * 0.40);
  }

  // Ensure height does not exceed 35% of image height
  const estimatedHeight = Math.round(wmWidth / logoAspect);
  if (estimatedHeight > imgHeight * 0.35) {
    wmWidth = Math.round(imgHeight * 0.35 * logoAspect);
  }

  // Resize logo keeping aspect ratio
  let logoSharp = sharp(trimmedLogoBuffer).resize({
    width: wmWidth,
    fit: 'inside',
    withoutEnlargement: false,
  });

  // Apply opacity if < 1
  if (opacity < 1 && opacity > 0) {
    const alphaValue = Math.round(255 * opacity);
    logoSharp = logoSharp.ensureAlpha().composite([
      {
        input: Buffer.from([255, 255, 255, alphaValue]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: 'dest-in',
      },
    ]);
  }

  const processedLogoBuffer = await logoSharp.toBuffer();
  const logoMeta = await sharp(processedLogoBuffer).metadata();
  const actualLogoWidth = logoMeta.width || wmWidth;
  const actualLogoHeight = logoMeta.height || Math.round(wmWidth / logoAspect);

  // Calculate padding based on smaller image dimension
  const padding = Math.max(10, Math.round(Math.min(imgWidth, imgHeight) * paddingRatio));

  let left = 0;
  let top = 0;

  switch (position) {
    case 'top-left':
      left = padding;
      top = padding;
      break;
    case 'top-right':
      left = Math.max(0, imgWidth - actualLogoWidth - padding);
      top = padding;
      break;
    case 'bottom-left':
      left = padding;
      top = Math.max(0, imgHeight - actualLogoHeight - padding);
      break;
    case 'center':
      left = Math.max(0, Math.round((imgWidth - actualLogoWidth) / 2));
      top = Math.max(0, Math.round((imgHeight - actualLogoHeight) / 2));
      break;
    case 'bottom-right':
    default:
      left = Math.max(0, imgWidth - actualLogoWidth - padding);
      top = Math.max(0, imgHeight - actualLogoHeight - padding);
      break;
  }

  // Composite the logo onto the base image
  const watermarkedBuffer = await baseImageInstance
    .composite([
      {
        input: processedLogoBuffer,
        left,
        top,
      },
    ])
    .toBuffer();

  const finalMeta = await sharp(watermarkedBuffer).metadata();
  const format = finalMeta.format || baseMeta.format || 'jpeg';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;

  return {
    buffer: watermarkedBuffer,
    format,
    width: finalMeta.width || imgWidth,
    height: finalMeta.height || imgHeight,
    mimeType,
  };
}

