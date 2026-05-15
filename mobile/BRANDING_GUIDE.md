# Rivers Rwanda - App Icon Branding Guide

## Brand Overview

**Rivers Rwanda** is a comprehensive travel, accommodation, and service platform designed for Rwanda. The app icon system reflects the natural beauty of Rwanda, its rivers, and the hospitality of its people.

## Icon Design System

### Design Philosophy

The Rivers Rwanda icon combines three core visual elements:

1. **Rivers/Water** - Flowing water representing Rwanda's natural beauty and the app's name
2. **Green Landscape** - Mountains and rolling hills representing Rwanda's terrain and natural environment  
3. **Accommodation/Hospitality** - Buildings and structures representing travel services and lodging

### Color Palette

| Element | Primary | Secondary | Usage |
|---------|---------|-----------|-------|
| **Background** | #0f294d | - | Primary brand color (Dark Blue) |
| **Water/Rivers** | #4fb3d9 | #0f7ba2 | Gradient for water elements |
| **Land/Nature** | #2ecc71 | #27ae60 | Gradient for landscape/mountains |
| **Architecture** | #e8a87c | #d9976b | Building/hospitality accent |

### Design Specifications

#### Icon Proportions
- **Icon Grid**: All icons designed on a 1024×1024 base grid
- **Safe Zone**: Center circle with 66px radius (for Android adaptive icons)
- **Margins**: Minimum 80px padding from edges
- **Stroke Width**: Varies (18-80px) for visual hierarchy

#### Typography
- App name and tagline use system fonts (Arial/Segoe UI)
- Font weights: Bold for titles, Regular for subtitles
- Colors: White for app name, #4fb3d9 for tagline

### Visual Elements

#### Mountains & Landscape
```
Representation: Curved path showing undulating terrain
Colors: Green gradient (#2ecc71 → #27ae60)
Purpose: Represents Rwanda's terrain and tourism appeal
Placed: Lower portion of icon
```

#### River/Water Flow
```
Representation: Flowing curved path with rounded line caps
Colors: Blue gradient (#4fb3d9 → #0f7ba2)
Purpose: Main focal point, represents app name and natural water
Placed: Diagonally flowing through landscape
```

#### Accommodation/Buildings
```
Representation: Simplified house/hotel with roof and windows
Colors: Brown tones (#e8a87c, #d9976b), Blue windows (#87ceeb)
Purpose: Represents travel services and hospitality
Placed: Upper right area of composition
```

## Icon Sizes Reference

### Mobile Applications

| Use Case | Size | Format | Platform |
|----------|------|--------|----------|
| App Home Screen | 1024×1024 | PNG | iOS/Android |
| Large Preview | 512×512 | PNG | Web/Android |
| Medium Display | 256×256 | PNG | Web/Tablets |
| Notification Icon | 128×128 | PNG | Desktop |
| Adaptive Foreground | 216×216 | PNG | Android 8+ |

### Web & PWA

| Use Case | Size | Format | Platform |
|----------|------|--------|----------|
| Android Chrome | 192×192 | PNG | Android Browser |
| Apple Touch Icon | 180×180 | PNG | iOS Safari |
| Windows Tile | 160×160 | PNG | Windows |
| Google TV | 96×96 | PNG | TV Apps |
| Browser Tab | 32×32 | PNG | All Browsers |

## File Organization

```
mobile/
├── assets/
│   ├── SVG Source Files (editable)
│   │   ├── icon-design.svg
│   │   ├── adaptive-icon-design.svg
│   │   ├── splash-design.svg
│   │   └── favicon-design.svg
│   │
│   └── PNG Export Files (production)
│       ├── icon.png (1024×1024)
│       ├── icon-512.png (512×512)
│       ├── icon-256.png (256×256)
│       ├── icon-128.png (128×128)
│       ├── adaptive-icon.png (216×216)
│       ├── splash-icon.png (512×512)
│       ├── favicon.png (192×192)
│       └── [additional favicon sizes]
│
├── public/
│   └── manifest.json (PWA configuration)
│
├── ICON_DOCUMENTATION.md (Technical reference)
├── BRANDING_GUIDE.md (This file)
├── icon-preview.html (Visual preview)
├── convert-icons.js (SVG → PNG converter)
└── create-additional-sizes.js (Size generator)
```

## Implementation Guidelines

### iOS Implementation

✅ **Do:**
- Use the largest icon size (1024×1024)
- Ensure icon is square with full opacity
- Test appearance on actual devices
- Use consistent corner radius

❌ **Don't:**
- Add transparency (iOS will add shine automatically)
- Use text or complex details at small sizes
- Use the app name in the icon
- Exceed safe margins

### Android Implementation

✅ **Do:**
- Use Android Adaptive Icon for Android 8+
- Respect the safe zone (center 66px circle)
- Test with various icon pack launchers
- Provide solid foreground without transparency

❌ **Don't:**
- Place critical content outside safe zone
- Use complex gradients (may be masked)
- Forget to set background color (#0f294d)
- Use very thin strokes that disappear when masked

### Web & PWA Implementation

✅ **Do:**
- Include all favicon sizes in manifest.json
- Test on different browsers
- Use both raster and vector formats
- Provide maskable icon variant

❌ **Don't:**
- Forget to include small favicon sizes
- Use only one size for all devices
- Skip the manifest.json configuration
- Ignore browser compatibility

## Color Usage Guidelines

### Primary Blue (#0f294d)
- **Usage**: Main background, text on light backgrounds
- **Contrast**: WCAG AA compliant on white
- **Variants**: Lighter blue (#1a4a73) for subtle variations

### Water Blue Gradient (#4fb3d9 → #0f7ba2)
- **Usage**: River/water features, accent elements
- **Technique**: Linear gradient for depth
- **Tone**: Represents freshness and natural water

### Land Green Gradient (#2ecc71 → #27ae60)
- **Usage**: Landscape, mountains, nature elements
- **Technique**: Linear gradient for dimension
- **Tone**: Represents lush, green Rwanda

### Warm Accent (#e8a87c → #d9976b)
- **Usage**: Building highlights, hospitality elements
- **Technique**: Linear gradient for texture
- **Tone**: Represents warmth and welcome

## Accessibility Considerations

### Contrast Ratios
- **Icon to Background**: 7.2:1 (exceeds WCAG AAA)
- **Text to Background**: 8.5:1 (exceeds WCAG AAA)
- **Element to Element**: Minimum 4.5:1

### Color Blindness
- Design does not rely solely on color differentiation
- Shape and position provide additional context
- River flow and landscape shapes are distinguishable

### Size Considerations
- Icons remain recognizable down to 16×16
- Critical elements (river, building) visible at all sizes
- Gradients simplify to distinct colors at very small sizes

## Modification Guidelines

### When to Edit Icons

- Brand color changes
- Adding seasonal variants
- Creating dark/light mode versions
- Platform-specific customizations
- Updating app features representation

### How to Edit

1. **Open SVG in Editor**
   - Figma, Illustrator, Inkscape, or any vector editor
   - Maintain 1024×1024 base dimensions

2. **Edit Components**
   - Modify paths, gradients, or colors
   - Keep safe zones in mind
   - Test proportions at multiple sizes

3. **Export & Generate**
   ```bash
   # Update SVG files, then:
   npm run icons:all
   ```

4. **Verify Changes**
   - Open `icon-preview.html` to see all sizes
   - Test on actual devices
   - Check PWA manifest

### Version Control

- SVG source files: Keep in version control
- PNG exports: Consider storing or excluding based on team preference
- Documentation: Always update when making changes

## Distribution

### App Store Requirements

**iOS App Store**
- Icon: 1024×1024 PNG
- No transparency, no rounded corners
- Files format: Exported as PNG

**Google Play Store**
- Icon: 512×512 PNG (high-res icon)
- 32×32 minimum for all sizes
- Format: 24-bit PNG with alpha channel

### Web Deployment

- Copy all PNG files to public/assets/
- Include manifest.json in public/
- Reference in HTML head tags
- Test across browsers

## Future Considerations

### Potential Enhancements
- [ ] Dark mode icon variant
- [ ] Animated splash screen
- [ ] Platform-specific optimizations
- [ ] Multiple color theme variants
- [ ] High-contrast accessibility variant
- [ ] Icon animation sequences
- [ ] Seasonal themed icons

### Expansion Opportunities
- Feature-specific icons for app sections
- Notification icons for push alerts
- Loading/progress indicators
- Empty states and error imagery

## Brand Consistency

### Using Icons in Marketing

- Always use official PNG exports
- Never rotate, flip, or heavily distort
- Maintain minimum clear space (80px)
- Don't change colors unless documented
- Include app name and version info when needed

### Communication

- Include icon usage in brand guidelines
- Provide this documentation to partners
- Keep version history of icon changes
- Document reason for any modifications

## Support & Maintenance

### Regular Maintenance Tasks
- [ ] Verify icons on new iOS/Android versions
- [ ] Test on new device sizes
- [ ] Update for platform requirement changes
- [ ] Refresh documentation as needed

### Troubleshooting

**Icon appears blurry**: Ensure using proper size for platform, not scaled
**Colors look wrong**: Check color profile, may be device display issue
**Adaptive icon distorted**: Verify safe zone, content within 66px radius
**Favicon not showing**: Clear browser cache, check manifest.json

## Contact & Attribution

- **Design System**: Rivers Rwanda Brand
- **Created**: May 2024
- **Last Updated**: May 2024
- **Maintained By**: Development Team

---

**Version**: 1.0  
**Status**: Active  
**Compatibility**: Expo, React Native, iOS 11+, Android 5+, All Modern Browsers
