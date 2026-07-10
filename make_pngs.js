import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  const svgBuffer = fs.readFileSync('public/logo.svg');
  
  await sharp(svgBuffer).resize(32, 32).toFile('public/favicon.png');
  await sharp(svgBuffer).resize(32, 32).toFile('public/favicon.ico');
  await sharp(svgBuffer).resize(180, 180).toFile('public/apple-touch-icon.png');
  await sharp(svgBuffer).resize(1200, 630).toFile('public/og-image.png');
  await sharp(svgBuffer).resize(1000, 800).toFile('logo.png'); // root folder as requested
  
  console.log("Images generated!");
}

generate();
