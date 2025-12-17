/**
 * Utility function to safely extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error
    }
  }
  
  return 'An error occurred'
}

/**
 * Type guard to check if value is an error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Safe localStorage operations with error handling
 */
export function safeLocalStorageGet(key: string): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeLocalStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function safeLocalStorageRemove(key: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
