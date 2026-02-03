/**
 * Indian mobile number validation (10 digits, starting with 6-9)
 */
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/

export function sanitizeIndianPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10)
}

export function isValidIndianPhone(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(value)
}

export function getIndianPhoneError(value: string): string | null {
  if (!value || value.length < 10) {
    return 'Please enter a valid 10-digit phone number'
  }
  if (!isValidIndianPhone(value)) {
    return 'Indian mobile numbers must start with 6, 7, 8, or 9'
  }
  return null
}
