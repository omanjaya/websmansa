// ============ Base API Types ============

export interface ApiResponse<T> {
  data: T
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta?: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

// ============ Success Response Types ============

export interface SuccessResponse {
  message: string
  data?: unknown
}

export interface CreatedResponse<T> {
  message: string
  data: T
}

export interface UpdatedResponse<T> {
  message: string
  data: T
}

export interface DeletedResponse {
  message: string
}

export interface ToggleResponse<T> {
  data: T
}

// ============ Setting Types ============

export interface SettingValue {
  key: string
  value: unknown
  type?: string
  group?: string
}

export interface SettingResponse {
  data: SettingValue
}

export interface SettingsListResponse {
  data: SettingValue[]
  groups: string[]
  grouped: Record<string, SettingValue[]>
}

// ============ Upload Types ============

export interface UploadResponse {
  data: {
    id: number
    url: string
    path: string
  }
}

// ============ Analytics Types ============

export interface AnalyticsStats {
  page_views: number
  unique_visitors: number
  popular_pages: Array<{
    path: string
    views: number
  }>
  referrers: Array<{
    source: string
    count: number
  }>
  device_types: Array<{
    type: string
    count: number
  }>
  browsers: Array<{
    name: string
    count: number
  }>
}

export interface DailyTrend {
  date: string
  page_views: number
  unique_visitors: number
}

// ============ Error Types ============

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// ============ Type Guards ============

export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'message' in response
  )
}

export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return (
    'meta' in response &&
    typeof response.meta === 'object' &&
    response.meta !== null &&
    'total' in response.meta &&
    Array.isArray(response.data)
  )
}
