import sharp from 'sharp';
import fs from 'fs';

const src = 'icon-2048.png';
const out = 'public';

fs.mkdirSync(out, { recursive: true });

const icons = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

for (const icon of icons) {
  await sharp(src)
    .resize(icon.size, icon.size)
    .png({ compressionLevel: 9 })
    .toFile(`${out}/${icon.name}`);
}

console.log('✅ Icons generated');
