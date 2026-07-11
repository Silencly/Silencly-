import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const srcPath = 'silencly-logo (1).png';
  
  if (!fs.existsSync(srcPath)) {
    console.error(`File not found: ${srcPath}`);
    return;
  }
  
  const sharpInstance = sharp(srcPath);
  
  await sharpInstance.clone().png().toFile('public/logo.png');
  await sharpInstance.clone().resize(32, 32).png().toFile('public/favicon.png');
  await sharpInstance.clone().resize(32, 32).png().toFile('public/favicon.ico');
  await sharpInstance.clone().resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharpInstance.clone().resize(192, 192).png().toFile('public/icon-192.png');
  await sharpInstance.clone().resize(512, 512).png().toFile('public/icon-512.png');
  
  await sharpInstance.clone().resize(1200, 630, { fit: 'contain', background: {r:255,g:255,b:255,alpha:1} })
    .png()
    .toFile('public/og-image.png');
    
  await sharpInstance.clone().png().toFile('logo.png');
  
  console.log("Uploaded logo copied to all formats!");
}

generate().catch(console.error);
