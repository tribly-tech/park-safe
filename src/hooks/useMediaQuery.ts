'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to detect if a media query matches
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    // Create listener
    const listener = () => setMatches(media.matches)
    
    // Add listener
    media.addEventListener('change', listener)
    
    // Cleanup
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

/**
 * Hook to detect if the viewport is mobile-sized (< 768px)
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

/**
 * Hook to detect if the viewport is tablet-sized (768px - 1023px)
 */
export const useIsTablet = () =>
  useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

/**
 * Hook to detect if the viewport is desktop-sized (>= 1024px)
 */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')

/**
 * Hook to detect if the device prefers reduced motion
 */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')
