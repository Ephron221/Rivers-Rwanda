# Rivers Rwanda App Icons - Complete Documentation

## Overview

This document provides a comprehensive guide to the Rivers Rwanda app icon system and assets.

## Icon Design Philosophy

The Rivers Rwanda icons feature:
- **Water/Rivers Element**: Flowing rivers representing Rwanda's natural beauty and the app's name
- **Green Landscape**: Mountains and hills representing Rwanda's terrain
- **Accommodation Buildings**: Houses/lodges representing the travel services offered
- **Color Scheme**:
  - Primary Blue: #0f294d (dark blue - main background)
  - Water Blue: #4fb3d9 to #0f7ba2 (gradient for rivers)
  - Green: #2ecc71 to #27ae60 (landscape and nature)
  - Warm Tones: #e8a87c to #d9976b (buildings/hospitality)

## Icon Sizes & Usage

### Application Icons

| File | Size | Purpose | Platform |
|------|------|---------|----------|
| `icon.png` | 1024×1024 | Primary app icon | General |
| `icon-512.png` | 512×512 | Large display icon | Android, Web |
| `icon-256.png` | 256×256 | Medium display icon | Web, Tablets |
| `icon-128.png` | 128×128 | Small display icon | Desktop, Menus |
| `adaptive-icon.png` | 216×216 | Android Adaptive Icon | Android 8+ |

### Favicon Set

| File | Size | Purpose |
|------|------|---------|
| `favicon-16.png` | 16×16 | Browser tabs (legacy) |
| `favicon-32.png` | 32×32 | Browser tabs, bookmarks |
| `favicon-64.png` | 64×64 | Medium favicons |
| `favicon-96.png` | 96×96 | Google TV |
| `favicon-160.png` | 160×160 | Windows tiles |
| `favicon-180.png` | 180×180 | Apple Touch Icon (iOS) |
| `favicon-192.png` | 192×192 | Android Chrome home screen |

### Splash Screen

| File | Size | Purpose |
|------|------|---------|
| `splash-icon.png` | 512×512 | App launch splash screen |

## Current Configuration

### Expo Configuration (app.json)

```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash-icon.png",
    "backgroundColor": "#0f294d"
  },
  "ios": {
    "bundleIdentifier": "com.riversrwanda.app"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#0f294d"
    },
    "package": "com.riversrwanda.app"
  },
  "web": {
    "favicon": "./assets/favicon.png"
  }
}
```

### Web Manifest Configuration

A `manifest.json` is provided for PWA (Progressive Web App) support with:
- Multiple icon sizes for different devices
- Theme colors and splash screens
- App metadata (name, description, categories)
- Maskable icon support for modern Android devices

## File Structure

```
mobile/
├── assets/
│   ├── icon.png (1024×1024)
│   ├── icon-512.png (512×512)
│   ├── icon-256.png (256×256)
│   ├── icon-128.png (128×128)
│   ├── adaptive-icon.png (216×216)
│   ├── splash-icon.png (512×512)
│   ├── favicon.png (192×192)
│   ├── favicon-192.png (192×192)
│   ├── favicon-180.png (180×180)
│   ├── favicon-160.png (160×160)
│   ├── favicon-96.png (96×96)
│   ├── favicon-64.png (64×64)
│   ├── favicon-32.png (32×32)
│   ├── favicon-16.png (16×16)
│   └── [SVG source files]
└── public/
    └── manifest.json
```

## Design Variations

All icons are available as:
- **SVG Source Files** (for editing and scaling)
  - `icon-design.svg` - Main app icon source
  - `adaptive-icon-design.svg` - Android adaptive icon source
  - `splash-design.svg` - Splash screen source
  - `favicon-design.svg` - Favicon source

- **PNG Export Files** (for production use)
  - Various sizes as listed above

## Customization Guide

To modify the icons:

1. **Edit SVG files**: Open the SVG source files in any vector editor (Figma, Illustrator, Inkscape, etc.)
2. **Update colors**: Modify the gradient definitions and fill colors as needed
3. **Regenerate PNGs**: 
   ```bash
   npm install sharp --save-dev
   node convert-icons.js
   node create-additional-sizes.js
   ```

## Platform-Specific Implementation

### iOS (Native)

- Uses `icon.png` (1024×1024)
- Should be square with no transparency
- Will be automatically scaled by iOS
- Rounded automatically by iOS

### Android

- Uses `adaptive-icon.png` (216×216 with safe zone)
- Foreground layer can extend beyond safe zone
- Background color: #0f294d
- Icon may be masked into various shapes (circle, rounded square, etc.)

### Web & PWA

- Uses `favicon.png` and sizes from manifest.json
- Supports multiple formats for different devices
- Maskable icons for modern Android
- Theme colors for browser UI

### Windows

- Uses `favicon-160.png` and higher for tiles
- Can create Windows tile with theme color

## Best Practices

1. **Always use the highest resolution available** for the platform and scale down
2. **Test on actual devices** to see how icons appear with different launchers/browsers
3. **Ensure sufficient contrast** for accessibility (>4.5:1 ratio)
4. **Use the adaptive icon safe zone** (66px radius for 216×216) for Android
5. **Consider dark mode** - these icons work well in both light and dark themes

## Version History

- **v1.0** (May 2024): Initial icon set created
  - River/landscape/accommodation design
  - All required sizes for iOS, Android, Web, and PWA
  - Color scheme aligned with brand guidelines

## Future Enhancements

- [ ] Create dark mode variant icons
- [ ] Add animated splash screen option
- [ ] Create platform-specific variants (iOS rounded, Android adaptive shapes)
- [ ] Generate icon variants for different app themes
- [ ] Create icon guidelines document for team consistency

## Support & Usage

For questions or to request icon modifications:
1. Edit the SVG source files
2. Regenerate PNG sizes using the conversion scripts
3. Test across platforms before deployment
4. Update this documentation if making significant changes
