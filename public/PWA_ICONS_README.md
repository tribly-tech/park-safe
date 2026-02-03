# PWA Icons Required

To complete the PWA setup, please add the following icon files to this `/public` directory:

## Required Icons

- **icon-192x192.png** - 192x192 pixels
- **icon-512x512.png** - 512x512 pixels

## Additional Recommended Icons

For better cross-platform support, consider adding:

- **apple-touch-icon.png** - 180x180 pixels (for iOS home screen)
- **favicon.ico** - Multi-size favicon
- **favicon-16x16.png** - 16x16 pixels
- **favicon-32x32.png** - 32x32 pixels

## Icon Design Guidelines

1. **Simple and Recognizable**: Icons should be clear at small sizes
2. **Safe Zone**: Keep important content within the center 80% of the icon
3. **Maskable**: Design with safe zones for adaptive icons on Android
4. **Background**: Use a solid background color that matches your brand
5. **Format**: Use PNG format for web icons

## Tools for Icon Generation

- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## Example using PWA Asset Generator

```bash
npx pwa-asset-generator logo.png ./public/icons --icon-only --favicon
```
