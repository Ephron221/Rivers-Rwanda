#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Try using sharp for SVG to PNG conversion
try {
  const sharp = require('sharp');
  
  const assetsDir = path.join(__dirname, 'assets');
  
  // Define icons to create with their sizes
  const icons = [
    {
      input: 'icon-design.svg',
      output: 'icon.png',
      size: 1024
    },
    {
      input: 'adaptive-icon-design.svg',
      output: 'adaptive-icon.png',
      size: 216
    },
    {
      input: 'splash-design.svg',
      output: 'splash-icon.png',
      size: 512
    },
    {
      input: 'favicon-design.svg',
      output: 'favicon.png',
      size: 192 // 32x32 is too small, using 192x192 for better clarity
    }
  ];
  
  console.log('🎨 Converting SVG icons to PNG...\n');
  
  Promise.all(icons.map(icon => {
    return sharp(path.join(assetsDir, icon.input))
      .resize(icon.size, icon.size, {
        fit: 'contain',
        background: { r: 15, g: 41, b: 77, alpha: 1 }
      })
      .png()
      .toFile(path.join(assetsDir, icon.output))
      .then(() => {
        console.log(`✅ Created: ${icon.output} (${icon.size}x${icon.size})`);
      });
  }))
  .then(() => {
    console.log('\n✨ All icons created successfully!');
  })
  .catch(err => {
    console.error('Error converting icons:', err);
    process.exit(1);
  });
  
} catch (err) {
  console.error('sharp module not found. Installing...');
  console.error('Run: npm install sharp');
  process.exit(1);
}
