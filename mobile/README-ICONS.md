# 🎨 Rivers Rwanda Icon System - Quick Start

## What's Included

✅ **Complete Icon Set**
- 1024×1024 main app icon
- 5 different app icon sizes (128–1024px)
- 10 favicon sizes (16–192px)
- Splash screen icon (512×512)
- Android adaptive icon (216×216)

✅ **All Source Files**
- 4 SVG source files for full customization
- PNG exports ready for production
- Perfect for iOS, Android, Web, and PWA

✅ **Complete Documentation**
- Technical icon documentation
- Brand and design guidelines
- Implementation examples
- Customization instructions

## Quick Start

### 1. View All Icons
Open `icon-preview.html` in your browser to see a visual gallery of all icons at different sizes.

### 2. Regenerate Icons (if you edit SVG files)
```bash
# Regenerate main icons
npm run icons:convert

# Regenerate all icons including additional sizes
npm run icons:all
```

### 3. Check Current Status
Current location: `mobile/assets/`
- ✅ icon.png (1024×1024)
- ✅ icon-512.png, icon-256.png, icon-128.png
- ✅ adaptive-icon.png (Android)
- ✅ splash-icon.png
- ✅ favicon.png + 9 additional favicon sizes
- ✅ All SVG source files

## Configuration

### Expo Configuration
Icons are already configured in `app.json`:
```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash-icon.png",
    "backgroundColor": "#0f294d"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#0f294d"
    }
  },
  "web": {
    "favicon": "./assets/favicon.png"
  }
}
```

### Web/PWA Configuration
PWA manifest available at: `public/manifest.json`
- Includes all favicon sizes
- Theme color settings
- App metadata

## File Structure

```
mobile/
├── assets/
│   ├── *.png (generated PNG files - 19 total)
│   └── *-design.svg (4 editable SVG source files)
├── public/
│   └── manifest.json (PWA configuration)
├── icon-preview.html (Visual preview gallery)
├── ICON_DOCUMENTATION.md (Full technical docs)
├── BRANDING_GUIDE.md (Design system & guidelines)
├── convert-icons.js (Main conversion script)
├── create-additional-sizes.js (Additional sizes script)
└── README.md (This file)
```

## Design System

**Brand Colors**
- Primary Blue: `#0f294d`
- Water Gradient: `#4fb3d9` → `#0f7ba2`
- Land Gradient: `#2ecc71` → `#27ae60`
- Accent: `#e8a87c` → `#d9976b`

**Design Elements**
- 🌊 Flowing rivers (main feature)
- ⛰️ Rwanda landscape/mountains
- 🏠 Accommodation/hospitality buildings
- 🎨 Professional gradients and colors

## Common Tasks

### I want to change colors
1. Open SVG files in `assets/` (icon-design.svg, etc.)
2. Edit gradient definitions (look for `#4fb3d9`, `#0f294d`, etc.)
3. Save SVG files
4. Run: `npm run icons:all`
5. Verify in `icon-preview.html`

### I want to add/modify design elements
1. Edit SVG files in vector editor (Figma, Illustrator, etc.)
2. Modify paths, shapes, or add new elements
3. Save and regenerate: `npm run icons:all`
4. Test on actual devices

### I want to create a variant (dark mode, etc.)
1. Duplicate SVG file: `cp icon-design.svg icon-design-dark.svg`
2. Modify colors/design in new file
3. Create conversion script for new variant
4. Test and integrate

### I want to use icons in my documentation
- Use PNG files from `assets/` folder
- Use specific sizes appropriate for your needs
- Reference `icon-preview.html` as visual guide

## Platform Requirements

✅ **iOS** (11+)
- Uses: icon.png (1024×1024)
- Format: PNG with no transparency (iOS handles styling)

✅ **Android** (5+)
- Uses: icon.png + adaptive-icon.png
- Format: PNG with transparency
- Adaptive icon supports masking on Android 8+

✅ **Web** (All modern browsers)
- Uses: favicon.png + manifest.json
- Format: PNG with multiple sizes
- PWA support included

## Tools Used

- **Expo Framework**: App packaging and deployment
- **Sharp**: Image processing and SVG-to-PNG conversion
- **Node.js**: Build scripting and automation
- **SVG/CSS**: Scalable icon design

## Documentation

📖 **For Technical Details**: See `ICON_DOCUMENTATION.md`
🎨 **For Design Guidelines**: See `BRANDING_GUIDE.md`
👁️ **For Visual Preview**: Open `icon-preview.html`

## Support

### Troubleshooting

**Icons not showing in app**
- Verify app.json icon paths
- Check that PNG files exist in assets/
- Rebuild app: `npm start --reset-cache`

**Regeneration failed**
- Ensure sharp is installed: `npm install sharp --save-dev`
- Check SVG file syntax
- Verify file paths in conversion scripts

**Icons look blurry**
- Use highest resolution size available
- Don't scale down from larger sizes
- Verify image viewer settings

### Getting Help

1. Check `ICON_DOCUMENTATION.md` for technical details
2. Review `BRANDING_GUIDE.md` for design questions
3. View `icon-preview.html` for size reference
4. Run `npm run icons:all` to regenerate all sizes

## Version History

- **v1.0** (May 2024)
  - Initial complete icon system created
  - All platform sizes generated
  - Full documentation and guides included
  - SVG source files for customization
  - PWA manifest included
  - npm scripts for easy regeneration

## Next Steps

✨ **To Deploy:**
1. Verify icons in `icon-preview.html`
2. Test app on iOS/Android devices
3. Check web in different browsers
4. Commit to version control
5. Push to app stores

🎨 **To Customize:**
1. Edit SVG files in `assets/`
2. Run `npm run icons:all`
3. Test changes
4. Update documentation if needed

---

**Status**: ✅ Complete and Ready for Production  
**Last Updated**: May 2024  
**Maintained By**: Rivers Rwanda Development Team
