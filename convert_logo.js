import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  const inputBuffer = fs.readFileSync('public/new-logo.png');
  
  await sharp(inputBuffer).resize(32, 32).png().toFile('public/favicon.png');
  await sharp(inputBuffer).resize(32, 32).png().toFile('public/favicon.ico');
  await sharp(inputBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(inputBuffer).resize(1200, 630, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } }).png().toFile('public/og-image.png');
  await sharp(inputBuffer).png().toFile('logo.png'); // root folder as requested
  
  // also create the ones used in App.tsx if any?
  // Let's replace public/logo.svg with this logo? Actually if it's used as SVG, we might need a transparent version or we can just change the image src.
  
  console.log("Images converted!");
}

generate();
