import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, r, g, b) {
  // Simple uncompressed/deflate RGBA PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with filter byte per scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.45;
  const innerR = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= innerR) {
        // App icon body: sleek dark navy with blue/gold badge
        const gradRatio = y / height;
        rawData[pxOffset] = Math.round(30 + gradRatio * 15);     // R
        rawData[pxOffset + 1] = Math.round(58 + gradRatio * 40); // G
        rawData[pxOffset + 2] = Math.round(138 + gradRatio * 60);// B
        rawData[pxOffset + 3] = 255;
      } else if (dist <= outerR) {
        // Subtle glow border
        rawData[pxOffset] = 59;
        rawData[pxOffset + 1] = 130;
        rawData[pxOffset + 2] = 246;
        rawData[pxOffset + 3] = 255;
      } else {
        // Background fill (for standalone icon / maskable safe zone)
        rawData[pxOffset] = 15;
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 192x192
const p192 = createPNG(192, 192, 37, 99, 235);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);

// 512x512
const p512 = createPNG(512, 512, 37, 99, 235);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), p512);

// 512x512 maskable
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), p512);

// Apple touch icon 180x180
const appleIcon = createPNG(180, 180, 37, 99, 235);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// Favicon
const fav = createPNG(64, 64, 37, 99, 235);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fav);

console.log('Successfully generated PWA PNG icon assets in public/');
