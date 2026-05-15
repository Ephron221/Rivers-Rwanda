#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Additional sizes for better platform support
const additionalSizes = [
  {
    input: 'icon-design.svg',
    output: 'icon-512.png',
    size: 512,
    description: 'App icon - Large (512x512)'
  },
  {
    input: 'icon-design.svg',
    output: 'icon-256.png',
    size: 256,
    description: 'App icon - Medium (256x256)'
  },
  {
    input: 'icon-design.svg',
    output: 'icon-128.png',
    size: 128,
    description: 'App icon - Small (128x128)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-192.png',
    size: 192,
    description: 'Favicon - Android Chrome (192x192)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-180.png',
    size: 180,
    description: 'Favicon - Apple Touch Icon (180x180)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-160.png',
    size: 160,
    description: 'Favicon - Windows (160x160)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-96.png',
    size: 96,
    description: 'Favicon - Google TV (96x96)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-64.png',
    size: 64,
    description: 'Favicon - Medium (64x64)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-32.png',
    size: 32,
    description: 'Favicon - Standard (32x32)'
  },
  {
    input: 'favicon-design.svg',
    output: 'favicon-16.png',
    size: 16,
    description: 'Favicon - Tiny (16x16)'
  }
];

console.log('🎨 Creating additional icon sizes...\n');

Promise.all(additionalSizes.map(icon => {
  return sharp(path.join(assetsDir, icon.input))
    .resize(icon.size, icon.size, {
      fit: 'contain',
      background: { r: 15, g: 41, b: 77, alpha: 1 }
    })
    .png()
    .toFile(path.join(assetsDir, icon.output))
    .then(() => {
      console.log(`✅ ${icon.description}`);
    });
}))
.then(() => {
  console.log('\n✨ All additional sizes created successfully!');
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
