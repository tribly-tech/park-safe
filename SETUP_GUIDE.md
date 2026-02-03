# Setup Guide

This guide will help you complete the final setup steps for your Park Safe mobile web app.

## ✅ Completed Setup

The following have been configured and are ready to use:

- [x] Next.js 16 with App Router and TypeScript
- [x] Tailwind CSS v4 with mobile-first configuration
- [x] shadcn/ui component library
- [x] PWA configuration with next-pwa
- [x] Theme provider with dark mode support
- [x] Custom hooks (useMediaQuery, useLocalStorage)
- [x] Common components (LoadingSpinner, ErrorBoundary, Header, MobileNav)
- [x] API utilities and constants
- [x] TypeScript types
- [x] Environment variables template
- [x] Prettier and ESLint configuration
- [x] Safe area insets for notched devices
- [x] Mobile-specific utilities

## 🔧 Required Manual Steps

### 1. Add Clash Grotesk Font Files

You need to add the Clash Grotesk font files to complete the typography setup:

**Location:** `src/assets/fonts/`

**Required files:**
- ClashGrotesk-Regular.woff2
- ClashGrotesk-Medium.woff2
- ClashGrotesk-Semibold.woff2
- ClashGrotesk-Bold.woff2

**Where to get Clash Grotesk:**
- [Indian Type Foundry](https://www.indiantypefoundry.com/) (Official, paid)
- [FontShare](https://www.fontshare.com/fonts/clash-grotesk) (Free alternative)

**Alternative:** If you prefer a different font, you can:
1. Replace the font files in `src/assets/fonts/`
2. Update `src/app/fonts.ts` with your font configuration
3. Update the CSS variable in `src/app/globals.css`

### 2. Create PWA Icons

Generate and add PWA icons for the best install experience:

**Location:** `public/`

**Required icons:**
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)

**Recommended additional icons:**
- `apple-touch-icon.png` (180x180 pixels)
- `favicon.ico`

**Tools to generate icons:**

Using PWA Asset Generator:
```bash
# Install
npm install -g pwa-asset-generator

# Generate (replace logo.png with your logo)
pwa-asset-generator logo.png ./public --icon-only --favicon
```

Online tools:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
NEXT_PUBLIC_APP_NAME=Park Safe
NEXT_PUBLIC_API_URL=https://your-api.com   # Your API endpoint
```

### 4. Update Branding

Update the following files with your branding:

**App Name:**
- `src/app/layout.tsx` - Update metadata
- `public/manifest.json` - Update name and short_name
- `src/lib/constants.ts` - Update APP_NAME

**Theme Colors:**
- `public/manifest.json` - Update theme_color and background_color
- `src/app/layout.tsx` - Update themeColor in viewport config
- `src/app/globals.css` - Customize color variables

**Description:**
- `src/app/layout.tsx` - Update metadata description
- `public/manifest.json` - Update description
- `README.md` - Update project description

### 5. Test the Application

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Test checklist:**
- [ ] Application loads without errors
- [ ] Fonts display correctly
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] PWA manifest is accessible at `/manifest.json`
- [ ] Service worker registers (in production build)

### 6. Build for Production

When ready, create a production build:

```bash
npm run build
npm start
```

Test the production build:
- [ ] No build errors
- [ ] Application works in production mode
- [ ] PWA features work (offline, install prompt)
- [ ] Performance is optimized

## 🎨 Customization

### Add New Pages

Create new pages in the appropriate route group:

```typescript
// src/app/(main)/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

### Add New Components

Follow the established structure:

```
src/components/
├── ui/          # shadcn components (auto-generated)
├── layout/      # Layout-related components
├── features/    # Feature-specific components
└── common/      # Shared components
```

### Add New Hooks

Create custom hooks in `src/hooks/`:

```typescript
// src/hooks/useCustomHook.ts
export function useCustomHook() {
  // Your hook logic
}

// Export from index
export * from './useCustomHook'
```

### Modify Styles

Customize theme in `src/app/globals.css`:

```css
:root {
  --primary: oklch(...);  /* Update primary color */
  /* Update other color variables */
}
```

## 📱 Mobile Testing

Test on real devices or use browser dev tools:

### Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or customize viewport
4. Test touch interactions
5. Check responsive design

### Testing PWA Features
1. Build for production: `npm run build`
2. Serve: `npm start`
3. Open in Chrome/Edge
4. Check for install prompt
5. Install and test offline functionality

### Safe Area Testing
Test on devices with notches (iPhone X and newer):
- Header should respect top notch
- Bottom navigation should respect home indicator
- Content should not be cut off

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Railway
- Self-hosted

Make sure to:
- Set environment variables
- Configure build command: `npm run build`
- Configure start command: `npm start`
- Set Node.js version: 18+

## 📝 Next Steps

1. Complete the manual setup steps above
2. Implement your application features
3. Add authentication (consider NextAuth.js)
4. Connect to your backend API
5. Add analytics (Vercel Analytics, Google Analytics)
6. Set up error tracking (Sentry)
7. Add tests (Jest, React Testing Library)
8. Set up CI/CD
9. Optimize for performance
10. Deploy to production

## 🆘 Troubleshooting

### Fonts not loading
- Check font files are in `src/assets/fonts/`
- Verify font paths in `src/app/fonts.ts`
- Check console for font loading errors

### PWA not working
- PWA only works in production mode
- Check service worker registration in browser
- Verify manifest.json is accessible
- Check icons are present

### Build errors
- Run `npm run type-check` to find TypeScript errors
- Run `npm run lint:fix` to fix linting issues
- Check all imports are correct
- Verify environment variables are set

### Styling issues
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Check for conflicting CSS
- Verify Tailwind classes are valid

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the README.md
3. Check the Next.js documentation
4. Contact the development team

---

Happy coding! 🎉
