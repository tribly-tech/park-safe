import localFont from 'next/font/local'

export const clashGrotesk = localFont({
  src: [
    {
      path: '../assets/fonts/ClashGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/ClashGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/ClashGrotesk-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/ClashGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-grotesk',
})
