const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7243'

const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '')

export const API_BASE_URL = normalizedApiBaseUrl
export const API_PREFIX = `${API_BASE_URL}/api`
export const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL || `${API_BASE_URL}/notification`

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_PREFIX}${normalizedPath}`
}
