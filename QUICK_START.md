# Quick Start Guide

Get your Park Safe app running in minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Add Font Files (Optional but Recommended)

Download Clash Grotesk and add to `src/assets/fonts/`:
- ClashGrotesk-Regular.woff2
- ClashGrotesk-Medium.woff2
- ClashGrotesk-Semibold.woff2
- ClashGrotesk-Bold.woff2

**Get fonts from:**
- [FontShare](https://www.fontshare.com/fonts/clash-grotesk) (Free)
- [Indian Type Foundry](https://www.indiantypefoundry.com/) (Premium)

> ⏭️ **Skip for now?** The app will work without custom fonts, using system fonts as fallback.

### 2. Add PWA Icons (Optional but Recommended)

Create and add to `public/`:
- icon-192x192.png (192x192 pixels)
- icon-512x512.png (512x512 pixels)

**Quick generate:**
```bash
# If you have a logo.png
npx pwa-asset-generator logo.png ./public --icon-only
```

Or use: [RealFaviconGenerator](https://realfavicongenerator.net/)

> ⏭️ **Skip for now?** PWA will still work, but won't have custom icons.

### 3. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

## 🎯 What to Explore

### Available Pages
- **/** - Landing page with feature showcase
- **/login** - Login form example
- **/register** - Registration form example
- **/home** - Main app page with mobile nav
- **/profile** - User profile page
- **/settings** - Settings with theme toggle

### Test Features

#### 1. Responsive Design
- Resize browser window
- Test on different devices
- Check mobile/tablet/desktop views

#### 2. Dark Mode
- Go to `/settings`
- Toggle between Light/Dark/Auto
- See instant theme changes

#### 3. Mobile Navigation
- Visit `/home`, `/profile`, or `/settings`
- See bottom navigation on mobile
- Tap icons to navigate

#### 4. Touch Targets
- All buttons are touch-friendly (min 44x44px)
- Test on mobile device or browser touch mode

#### 5. PWA Features (Production Only)
```bash
npm run build
npm start
```
- Visit http://localhost:3000
- Look for install prompt
- Test offline functionality

## 📝 Start Building

### Add a New Page

```typescript
// src/app/my-page/page.tsx
export default function MyPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">My New Page</h1>
    </div>
  )
}
```

Visit: http://localhost:3000/my-page

### Add a New Component

```typescript
// src/components/common/MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>
}
```

### Use Custom Hooks

```typescript
'use client'
import { useIsMobile } from '@/hooks'

export function MyComponent() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileView /> : <DesktopView />
}
```

### Use API Client

```typescript
import { api } from '@/lib/api'

// GET request
const data = await api.get('/endpoint')

// POST request
const result = await api.post('/endpoint', { data: 'value' })
```

### Add Form Validation

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* form fields */}
  </form>
}
```

## 🎨 Customize

### Change Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.5 0.2 250);  /* Your color */
}
```

### Change Font

Edit `src/app/fonts.ts`:

```typescript
import { Inter } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
```

Then update `src/app/layout.tsx` to use `inter` instead of `clashGrotesk`.

### Add Components

```bash
# Browse available components
npx shadcn@latest add

# Add specific component
npx shadcn@latest add dropdown-menu
```

## 🚀 Deploy

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Deploy (automatic)

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Railway

## ⚙️ Configuration

### Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://your-api.com
```

### App Metadata

Edit `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your description',
}
```

### PWA Settings

Edit `public/manifest.json`:

```json
{
  "name": "Your App Name",
  "theme_color": "#000000"
}
```

## 📚 Learn More

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Complete feature list
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🆘 Troubleshooting

### Fonts not showing
- Check files are in `src/assets/fonts/`
- Restart dev server

### Build errors
```bash
npm run type-check  # Check TypeScript
npm run lint:fix    # Fix linting
rm -rf .next        # Clear cache
```

### PWA not working
- Only works in production build
- Requires HTTPS (except localhost)

### Styling issues
```bash
rm -rf .next        # Clear Next.js cache
npm run dev         # Restart server
```

## ✅ Checklist

- [ ] Dependencies installed (`npm install` - already done!)
- [ ] Development server running (`npm run dev`)
- [ ] Visited http://localhost:3000
- [ ] Tested dark mode toggle
- [ ] Checked mobile responsive design
- [ ] Explored all sample pages
- [ ] Type checking passes (`npm run type-check`)
- [ ] Ready to build features! 🎉

## 🎉 You're Ready!

Start building your features:
1. Explore the sample pages
2. Modify existing components
3. Add new pages and features
4. Connect to your backend API
5. Deploy to production

Happy coding! 🚀

---

Need help? Check the other documentation files or Next.js documentation.
