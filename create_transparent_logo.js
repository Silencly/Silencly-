import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  const srcPath = 'src/assets/images/silencly_logo_white_blue_1783663235075.jpg';
  
  // 1. Get raw pixels of the source image
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  
  // 2. Automatically detect center of circle
  let sumX = 0, sumY = 0, count = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      // Purple/blue pixels have low green compared to red/blue
      if (r < 180 && g < 180 && b > 80) {
        sumX += x;
        sumY += y;
        count++;
      }
    }
  }
  
  if (count === 0) {
    throw new Error("Could not detect any dark pixels for the circle.");
  }
  
  const cx = Math.round(sumX / count);
  const cy = Math.round(sumY / count);
  console.log(`Detected center: ${cx}, ${cy}`);
  
  // Find max radius of circle
  let maxDistSq = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      if (r < 180 && g < 180 && b > 80) {
        const distSq = (x - cx) ** 2 + (y - cy) ** 2;
        if (distSq > maxDistSq) maxDistSq = distSq;
      }
    }
  }
  
  // We use radius = 385 to ensure we capture the whole circle cleanly without getting white paper edge artifacts
  const radius = Math.round(Math.sqrt(maxDistSq)) - 8; 
  console.log(`Using radius: ${radius} (Max detected: ${Math.round(Math.sqrt(maxDistSq))})`);
  
  // 3. Create a cropped square canvas centered at (cx, cy)
  // Size of the square canvas
  const size = radius * 2 + 10;
  const halfSize = Math.floor(size / 2);
  
  // Create an RGBA buffer for the square cropped image
  const rgbaBuffer = Buffer.alloc(size * size * 4);
  
  for (let dy = -halfSize; dy < halfSize; dy++) {
    const srcY = cy + dy;
    const destY = dy + halfSize;
    
    for (let dx = -halfSize; dx < halfSize; dx++) {
      const srcX = cx + dx;
      const destX = dx + halfSize;
      
      const destIdx = (destY * size + destX) * 4;
      
      // Check if source coordinates are within bounds
      if (srcY >= 0 && srcY < info.height && srcX >= 0 && srcX < info.width) {
        const srcIdx = (srcY * info.width + srcX) * 3;
        const r = data[srcIdx];
        const g = data[srcIdx+1];
        const b = data[srcIdx+2];
        
        // Calculate distance from center of circle
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Anti-aliasing alpha calculations
        let alpha = 255;
        if (dist > radius + 1.5) {
          alpha = 0;
        } else if (dist > radius - 1.5) {
          const t = (dist - (radius - 1.5)) / 3.0;
          alpha = Math.round(255 * (1 - t));
        }
        
        rgbaBuffer[destIdx] = r;
        rgbaBuffer[destIdx+1] = g;
        rgbaBuffer[destIdx+2] = b;
        rgbaBuffer[destIdx+3] = alpha;
      } else {
        // Out of bounds is transparent
        rgbaBuffer[destIdx] = 0;
        rgbaBuffer[destIdx+1] = 0;
        rgbaBuffer[destIdx+2] = 0;
        rgbaBuffer[destIdx+3] = 0;
      }
    }
  }
  
  // 4. Save the generated logo as transparent PNG to public/logo.png and other places
  const sharpInstance = sharp(rgbaBuffer, {
    raw: {
      width: size,
      height: size,
      channels: 4
    }
  });
  
  // Save different sizes as requested!
  await sharpInstance.clone().png().toFile('public/logo.png');
  await sharpInstance.clone().png().toFile('public/new-logo.png');
  await sharpInstance.clone().resize(32, 32).png().toFile('public/favicon.png');
  await sharpInstance.clone().resize(32, 32).png().toFile('public/favicon.ico');
  await sharpInstance.clone().resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharpInstance.clone().resize(192, 192).png().toFile('public/icon-192.png');
  await sharpInstance.clone().resize(512, 512).png().toFile('public/icon-512.png');
  
  // OG image: 1200x630, fit inside on transparent or dark background
  await sharpInstance.clone().resize(600, 600, { fit: 'contain' })
    .extend({
      top: 15,
      bottom: 15,
      left: 300,
      right: 300,
      background: { r: 9, g: 9, b: 11, alpha: 1 } // zinc-950 color matching dark theme!
    })
    .png()
    .toFile('public/og-image.png');
    
  // Copy to root logo.png
  await sharpInstance.clone().png().toFile('logo.png');
  
  console.log("All logo files generated successfully from source!");
}

generate().catch(console.error);
