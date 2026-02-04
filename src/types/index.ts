/**
 * Common TypeScript types and interfaces
 */

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ErrorResponse {
  message: string
  code?: string
  details?: Record<string, unknown>
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface VehicleRegistrationData {
  vehicleNumber: string
  vehicleBrand: string
  vehicleModel: string
  vehicleColor: string
  vehicleType: 'car' | 'bike' | 'auto' | 'other'
  ownerName: string
  ownerMobile: string
  emergencyName: string
  emergencyMobile: string
  whatsappEnabled: boolean
  consent: boolean
}

/** Stored vehicle for profile card and edit vehicle page */
export interface VehicleData {
  make: string
  model: string
  licensePlate: string
  color: string
  phone?: string
}

// Utility types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type AsyncData<T> = {
  data: Nullable<T>
  loading: boolean
  error: Nullable<Error>
}
