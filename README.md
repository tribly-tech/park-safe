# Park Safe - Mobile-First Next.js Application

A production-ready Next.js 16 mobile web application with modern best practices, TypeScript, Tailwind CSS, and PWA support.

## 🚀 Features

- ✅ **Next.js 16** with App Router and Turbopack
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS v4** for styling
- ✅ **shadcn/ui** component library
- ✅ **PWA Support** with offline capabilities
- ✅ **Mobile-First Design** with responsive breakpoints
- ✅ **Dark Mode** support with next-themes
- ✅ **Safe Area Insets** for notched devices
- ✅ **Custom Hooks** for responsive design
- ✅ **Form Validation** with react-hook-form and Zod
- ✅ **State Management** with Zustand
- ✅ **Data Fetching** with TanStack Query
- ✅ **Gesture Support** with @use-gesture/react
- ✅ **Virtual Lists** with @tanstack/react-virtual
- ✅ **Toast Notifications** with Sonner
- ✅ **Code Formatting** with Prettier

## 📁 Project Structure

```
park-safe/
├── src/
│   ├── app/                      # App Router pages
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/              # Main app route group
│   │   │   ├── home/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── api/                 # API routes
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── fonts.ts             # Font configuration
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn components
│   │   ├── layout/              # Layout components
│   │   ├── features/            # Feature-specific components
│   │   └── common/              # Shared components
│   │
│   ├── lib/                     # Utility functions
│   │   ├── utils.ts
│   │   ├── api.ts
│   │   └── constants.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useMediaQuery.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── types/                   # TypeScript types
│   ├── assets/                  # Static assets
│   └── styles/                  # Additional styles
│
├── public/                      # Public assets
│   ├── manifest.json           # PWA manifest
│   └── robots.txt
│
└── [config files]
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clash Grotesk font files (see `src/assets/fonts/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add Clash Grotesk font files to `src/assets/fonts/`:
   - ClashGrotesk-Regular.woff2
   - ClashGrotesk-Medium.woff2
   - ClashGrotesk-Semibold.woff2
   - ClashGrotesk-Bold.woff2

3. Create PWA icons in `public/`:
   - icon-192x192.png
   - icon-512x512.png

4. Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## 📱 Mobile-First Features

### Responsive Breakpoints

- **xs**: 375px (small phones)
- **sm**: 640px (large phones)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)

### Custom Hooks

```typescript
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks'

function MyComponent() {
  const isMobile = useIsMobile() // < 768px
  const isTablet = useIsTablet() // 768px - 1023px
  const isDesktop = useIsDesktop() // >= 1024px
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

### Safe Area Support

```tsx
// Use safe area utilities for notched devices
<div className="pt-safe pb-safe">
  Content respects notches and home indicators
</div>
```

### Touch-Friendly Components

All interactive elements meet the minimum 44x44px touch target size:

```tsx
<button className="min-touch">
  Touch-friendly button
</button>
```

## 🎨 Styling

### Tailwind CSS v4

This project uses Tailwind CSS v4 with CSS-based configuration. Theme customization is done in `src/app/globals.css`:

```css
@theme inline {
  --color-primary: oklch(...);
  --font-sans: var(--font-clash-grotesk), system-ui, sans-serif;
}
```

### Custom Utilities

- `touch-manipulation` - Improves touch response
- `hide-scrollbar` - Hides scrollbars
- `pb-safe`, `pt-safe`, `pl-safe`, `pr-safe` - Safe area padding
- `min-touch` - Minimum touch target size (44x44px)

## 🔧 Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 📦 Key Dependencies

### Production
- **next** - React framework
- **react** & **react-dom** - React library
- **next-themes** - Theme management
- **@tanstack/react-query** - Data fetching
- **zustand** - State management
- **next-pwa** - PWA support
- **react-hook-form** - Form handling
- **zod** - Schema validation
- **sonner** - Toast notifications
- **@use-gesture/react** - Gesture support
- **@tanstack/react-virtual** - Virtual scrolling

### Development
- **typescript** - Type checking
- **eslint** - Code linting
- **prettier** - Code formatting
- **tailwindcss** - Styling

## 🎯 Best Practices Implemented

### Performance
- ✅ Image optimization with next/image
- ✅ Font optimization with next/font
- ✅ Code splitting with dynamic imports
- ✅ PWA caching strategies
- ✅ Turbopack for faster builds

### Mobile UX
- ✅ Touch-friendly button sizes (min 44x44px)
- ✅ Safe area insets for notched devices
- ✅ Responsive design (mobile-first)
- ✅ Pull-to-refresh ready
- ✅ Smooth animations
- ✅ Gesture support

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast compliance

### Developer Experience
- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Prettier for formatting
- ✅ Component library (shadcn/ui)
- ✅ Custom hooks
- ✅ Organized folder structure

## 🔐 Environment Variables

See `.env.example` for required environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Park Safe
NEXT_PUBLIC_API_URL=
```

## 📱 PWA Configuration

The app is configured as a Progressive Web App:

- Service worker for offline support
- Install prompt for home screen
- App-like experience
- Optimized caching strategies

Make sure to add PWA icons (192x192 and 512x512) to the `public/` directory.

## 🎨 Custom Font Setup

This project uses Clash Grotesk as the primary font. To complete the setup:

1. Obtain Clash Grotesk font files (WOFF2 format)
2. Place them in `src/assets/fonts/`
3. Font configuration is in `src/app/fonts.ts`
4. Font is applied in `src/app/layout.tsx`

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for all new files
3. Follow mobile-first design principles
4. Ensure minimum touch target sizes
5. Test on multiple devices
6. Run linting and type checks before committing

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions, please contact the development team.

---

Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS
