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
  VEHICLE_EDIT: '/profile/vehicle/edit',
  SETTINGS: '/settings',
  SUPPORT: '/support',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  CONTACT_OWNER: '/contact-owner',
  CONTACT_OWNER_VERIFY: '/contact-owner/verify',
  CONTACT_OWNER_CHOOSE_ACTION: '/contact-owner/choose-action',
  CONTACT_OWNER_SUCCESS: '/contact-owner/success',
} as const

// Touch target minimum size (for accessibility)
export const MIN_TOUCH_TARGET = 44 // pixels
