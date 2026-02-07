/**
 * Application-wide constants
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Park Safe'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Breakpoints (matches Tailwind config)
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

// API endpoints
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
  },
} as const

// Storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  PROFILE: 'park_safe_profile',
  VEHICLE: 'park_safe_vehicle',
  REPORT_ACTIVITY: 'park_safe_report_activity',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_VEHICLE: '/register-vehicle',
  REGISTER_VEHICLE_SUCCESS: '/register-vehicle/success',
  DASHBOARD: '/home',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_REPORTS: '/profile/reports',
  VEHICLE_EDIT: '/profile/vehicle/edit',
  SUPPORT: '/support',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  CONTACT_OWNER: '/contact-owner',
  CONTACT_OWNER_VERIFY: '/contact-owner/verify',
  CONTACT_OWNER_CHOOSE_ACTION: '/contact-owner/choose-action',
  CONTACT_OWNER_SUCCESS: '/contact-owner/success',
} as const

/** Default vehicle slug when navigating to /contact-owner without an id (e.g. legacy links). */
export const DEFAULT_CONTACT_OWNER_SLUG = 'k7m9x2p5'

/** Build contact-owner routes for a given vehicle id (unique URL per vehicle). */
export function getContactOwnerRoutes(vehicleId: string) {
  const base = `/contact-owner/${encodeURIComponent(vehicleId)}`
  return {
    base,
    verify: `${base}/verify`,
    chooseAction: `${base}/choose-action`,
    success: `${base}/success`,
  }
}

// Touch target minimum size (for accessibility)
export const MIN_TOUCH_TARGET = 44 // pixels
