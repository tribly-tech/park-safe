/**
 * API-specific types and interfaces
 */

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface RefreshTokenResponse {
  token: string
}

// Add more API-specific types as needed
