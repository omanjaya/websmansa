import { notFound } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const ADMIN_API_BASE = API_BASE_URL.replace('/api/v1', '/api/admin/v1')

// ============ Auth Helper ============

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// ============ Auth Functions ============

/**
 * Login user and store token in localStorage
 */
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  const result = await response.json()
  const data = result.data || result

  // Store token and user in localStorage
  if (data.token) {
    localStorage.setItem('auth_token', data.token)
  }
  if (data.user) {
    localStorage.setItem('auth_user', JSON.stringify(data.user))
  }

  return data
}

/**
 * Logout user
 */
export async function logout() {
  const token = getAuthToken()

  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Clear local data
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')

  // Redirect to login
  window.location.href = '/admin/login'
}

/**
 * Check if user is authenticated
 */
export async function checkAuth(): Promise<boolean> {
  const token = getAuthToken()
  if (!token) return false

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get user data from localStorage
 */
export function getUser() {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('auth_user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Check if token exists in localStorage
 */
export function isAuthenticated() {
  return !!getAuthToken()
}

/**
 * Refresh authentication token
 */
export async function refreshToken() {
  const token = getAuthToken()
  if (!token) throw new Error('No token to refresh')

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  const result = await response.json()

  if (result.data?.token) {
    localStorage.setItem('auth_token', result.data.token)
  }

  return result
}

// ============ Types ============

export interface Post {
  id: number
  uuid: string
  type: string
  attributes: {
    title: string
    slug: string
    excerpt: string
    content?: string
    featured_image?: string
    status: string
    type: string
    views: number
    likes: number
    is_featured: boolean
    is_pinned: boolean
    published_at: string
    created_at: string
    updated_at: string
  }
  relationships: {
    author?: {
      id: number
      name: string
      avatar?: string
    }
    categories?: Category[]
  }
  meta: {
    excerpt_length: number
    reading_time: number
  }
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  order: number
  created_at?: string
  updated_at?: string
}

export interface Announcement {
  id: number
  type: string
  attributes: {
    title: string
    slug: string
    content: string
    excerpt?: string
    type: 'general' | 'academic' | 'event' | 'urgent'
    priority: number
    is_featured: boolean
    is_pinned: boolean
    start_date?: string
    end_date?: string
    attachment_url?: string
    published_at: string
    created_at: string
    updated_at: string
  }
}

export interface Extra {
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    description: string
    short_description?: string
    category: string
    schedule?: string
    location?: string
    coach?: string
    achievements?: string[]
    requirements?: string
    quota?: number
    member_count: number
    is_featured: boolean
    is_active: boolean
    image?: string
    created_at: string
    updated_at: string
  }
}

export interface Facility {
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    description: string
    short_description?: string
    category: string
    capacity?: number
    location?: string
    is_featured: boolean
    is_bookable: boolean
    is_active: boolean
    images?: string[]
    amenities?: string[]
    created_at: string
    updated_at: string
  }
}

export interface Staff {
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    nip?: string
    position: string
    type: 'principal' | 'vice_principal' | 'teacher' | 'admin' | 'staff' | 'headmaster' | 'vice_headmaster' | 'counselor' | 'librarian' | 'lab_assistant' | 'security' | 'cleaner' | 'cafeteria'
    department?: string
    subjects?: string[]
    education?: string
    email?: string
    phone?: string
    bio?: string
    photo?: string
    photo_url?: string
    is_featured: boolean
    is_active: boolean
    order: number
    created_at: string
    updated_at: string
  }
}

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

// ============ Helper Functions ============

interface FetchOptions extends RequestInit {
  revalidate?: number | false
}

async function fetchApi<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const { revalidate, ...restOptions } = options || {}

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...getAuthHeaders(),
        ...restOptions?.headers,
      },
      // Next.js caching - revalidate every 5 minutes by default for GET requests
      next: revalidate !== undefined
        ? { revalidate }
        : { revalidate: 300 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// ============ Posts API ============

export async function getPosts(params?: {
  category?: string
  page?: number
  per_page?: number
  search?: string
  featured?: boolean
}): Promise<ApiResponse<Post[]>> {
  const query = buildQueryString({
    category: params?.category,
    page: params?.page,
    per_page: params?.per_page,
    search: params?.search,
    featured: params?.featured,
  })

  return fetchApi<ApiResponse<Post[]>>(`/posts${query}`)
}

export async function getPost(slug: string): Promise<{ data: Post }> {
  return fetchApi<{ data: Post }>(`/posts/${slug}`)
}

export async function getFeaturedPosts(limit?: number): Promise<ApiResponse<Post[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Post[]>>(`/posts/featured${query}`)
}

export async function getLatestPosts(limit?: number): Promise<ApiResponse<Post[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Post[]>>(`/posts/latest${query}`)
}

// ============ Categories API ============

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return fetchApi<ApiResponse<Category[]>>('/categories')
}

export async function getCategory(slug: string): Promise<{ data: Category }> {
  return fetchApi<{ data: Category }>(`/categories/${slug}`)
}

export async function getCategoryTree(): Promise<ApiResponse<Category[]>> {
  return fetchApi<ApiResponse<Category[]>>('/categories/tree')
}

// ============ Announcements API ============

export async function getAnnouncements(params?: {
  type?: string
  page?: number
  per_page?: number
  featured?: boolean
}): Promise<ApiResponse<Announcement[]>> {
  const query = buildQueryString({
    type: params?.type,
    page: params?.page,
    per_page: params?.per_page,
    featured: params?.featured,
  })

  return fetchApi<ApiResponse<Announcement[]>>(`/announcements${query}`)
}

export async function getAnnouncement(slug: string): Promise<{ data: Announcement }> {
  return fetchApi<{ data: Announcement }>(`/announcements/${slug}`)
}

export async function getFeaturedAnnouncements(limit?: number): Promise<ApiResponse<Announcement[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Announcement[]>>(`/announcements/featured${query}`)
}

export async function getLatestAnnouncements(limit?: number): Promise<ApiResponse<Announcement[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Announcement[]>>(`/announcements/latest${query}`)
}

// ============ Extras (Extracurriculars) API ============

export async function getExtras(params?: {
  category?: string
  page?: number
  per_page?: number
  featured?: boolean
}): Promise<ApiResponse<Extra[]>> {
  const query = buildQueryString({
    category: params?.category,
    page: params?.page,
    per_page: params?.per_page,
    featured: params?.featured,
  })

  return fetchApi<ApiResponse<Extra[]>>(`/extras${query}`)
}

export async function getExtra(slug: string): Promise<{ data: Extra }> {
  return fetchApi<{ data: Extra }>(`/extras/${slug}`)
}

export async function getFeaturedExtras(limit?: number): Promise<ApiResponse<Extra[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Extra[]>>(`/extras/featured${query}`)
}

// ============ Facilities API ============

export async function getFacilities(params?: {
  category?: string
  page?: number
  per_page?: number
  featured?: boolean
  bookable?: boolean
}): Promise<ApiResponse<Facility[]>> {
  const query = buildQueryString({
    category: params?.category,
    page: params?.page,
    per_page: params?.per_page,
    featured: params?.featured,
    bookable: params?.bookable,
  })

  return fetchApi<ApiResponse<Facility[]>>(`/facilities${query}`)
}

export async function getFacility(slug: string): Promise<{ data: Facility }> {
  return fetchApi<{ data: Facility }>(`/facilities/${slug}`)
}

export async function getFeaturedFacilities(limit?: number): Promise<ApiResponse<Facility[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Facility[]>>(`/facilities/featured${query}`)
}

export async function getFacilityCategories(): Promise<ApiResponse<string[]>> {
  return fetchApi<ApiResponse<string[]>>('/facilities/categories')
}

// ============ Staff API ============

export async function getStaff(params?: {
  type?: string
  department?: string
  page?: number
  per_page?: number
  featured?: boolean
  image_size?: 'thumb' | 'medium' | 'large'
}): Promise<ApiResponse<Staff[]>> {
  const query = buildQueryString({
    type: params?.type,
    department: params?.department,
    page: params?.page,
    limit: params?.per_page, // Backend uses 'limit' not 'per_page'
    featured: params?.featured,
    image_size: params?.image_size,
  })

  return fetchApi<ApiResponse<Staff[]>>(`/staff${query}`)
}

export async function getStaffMember(slug: string): Promise<{ data: Staff }> {
  return fetchApi<{ data: Staff }>(`/staff/${slug}`)
}

export async function getFeaturedStaff(limit?: number): Promise<ApiResponse<Staff[]>> {
  const query = buildQueryString({ per_page: limit })
  return fetchApi<ApiResponse<Staff[]>>(`/staff/featured${query}`)
}

export async function getTeachers(params?: {
  department?: string
  page?: number
  per_page?: number
}): Promise<ApiResponse<Staff[]>> {
  const query = buildQueryString({
    department: params?.department,
    page: params?.page,
    per_page: params?.per_page,
  })

  return fetchApi<ApiResponse<Staff[]>>(`/staff/teachers${query}`)
}

export async function getStaffTypes(): Promise<ApiResponse<string[]>> {
  return fetchApi<ApiResponse<string[]>>('/staff/types')
}

export async function getDepartments(): Promise<ApiResponse<string[]>> {
  return fetchApi<ApiResponse<string[]>>('/staff/departments')
}

// ============ Galleries API ============

export interface GalleryItem {
  id: number
  gallery_id: number
  media_id: number
  caption?: string
  order: number
  created_at: string
  media: {
    id: number
    uuid: string
    name: string
    file_name: string
    mime_type: string
    path: string
    url: string
    width?: number
    height?: number
    alt_text?: string
  }
}

export interface Gallery {
  id: number
  uuid: string
  title: string
  slug: string
  description?: string
  thumbnail?: string
  thumbnail_url?: string
  type: 'photo' | 'video' | 'mixed'
  event_date?: string
  is_featured: boolean
  items_count: number
  created_at: string
  updated_at: string
  items?: GalleryItem[]
}

export interface GalleryListResponse {
  data: Gallery[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export async function getGalleries(params?: {
  type?: 'photo' | 'video' | 'mixed'
  featured?: boolean
  search?: string
  sort?: 'latest' | 'oldest' | 'title'
  page?: number
  per_page?: number
}): Promise<GalleryListResponse> {
  const query = buildQueryString({
    type: params?.type,
    featured: params?.featured,
    search: params?.search,
    sort: params?.sort,
    page: params?.page,
    per_page: params?.per_page,
  })

  return fetchApi<GalleryListResponse>(`/galleries${query}`)
}

export async function getGallery(slug: string): Promise<{ data: Gallery }> {
  return fetchApi<{ data: Gallery }>(`/galleries/${slug}`)
}

// ============ Sliders API ============

export interface Slider {
  id: number
  title: string
  subtitle?: string
  image: string
  image_url: string
  link?: string
  button_text?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getSliders(): Promise<{ data: Slider[] }> {
  return fetchApi<{ data: Slider[] }>('/sliders')
}

// ============ Admin API ============

/**
 * Fetch admin API with Bearer token authentication
 */
async function fetchAdminApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${ADMIN_API_BASE}${endpoint}`

  // Build headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...getAuthHeaders(),
    ...options?.headers as Record<string, string>,
  }

  // Add Content-Type for non-FormData requests
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Admin API should never be cached
      cache: 'no-store',
    })

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login'
        }
        throw new Error('Unauthorized')
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error && error.message !== 'Unauthorized') {
      console.error(`Error fetching ${endpoint}:`, error)
    }
    throw error
  }
}

// ============ Admin Staff API ============

export async function getAdminStaff(params?: {
  page?: number
  per_page?: number
  type?: string
  department?: string
  is_active?: boolean
  is_featured?: boolean
  search?: string
  sort?: string
}): Promise<ApiResponse<Staff[]>> {
  const query = buildQueryString({
    page: params?.page,
    per_page: params?.per_page,
    type: params?.type,
    department: params?.department,
    is_active: params?.is_active,
    is_featured: params?.is_featured,
    search: params?.search,
    sort: params?.sort,
  })
  return fetchAdminApi<ApiResponse<Staff[]>>(`/staff${query}`)
}

export async function getAdminStaffMember(id: string | number): Promise<{ data: Staff }> {
  return fetchAdminApi<{ data: Staff }>(`/staff/${id}`)
}

export async function createStaff(data: FormData): Promise<{ data: Staff; message: string }> {
  return fetchAdminApi<{ data: Staff; message: string }>('/staff', {
    method: 'POST',
    body: data,
  })
}

export async function updateStaff(id: string | number, data: FormData): Promise<{ data: Staff; message: string }> {
  return fetchAdminApi<{ data: Staff; message: string }>(`/staff/${id}`, {
    method: 'POST',
    body: data,
  })
}

export async function deleteStaff(id: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/staff/${id}`, {
    method: 'DELETE',
  })
}

export async function toggleStaffFeatured(id: string | number): Promise<{ data: Staff }> {
  return fetchAdminApi<{ data: Staff }>(`/staff/${id}/toggle-featured`, {
    method: 'POST',
  })
}

export async function toggleStaffActive(id: string | number): Promise<{ data: Staff }> {
  return fetchAdminApi<{ data: Staff }>(`/staff/${id}/toggle-active`, {
    method: 'POST',
  })
}

// ============ Admin Galleries API ============

export interface CreateGalleryData {
  title: string
  description?: string
  type: 'photo' | 'video' | 'mixed'
  event_date?: string
  is_featured?: boolean
}

export interface UpdateGalleryData {
  title?: string
  description?: string
  type?: 'photo' | 'video' | 'mixed'
  event_date?: string
  is_featured?: boolean
}

export interface AddGalleryItemData {
  media_id: number
  caption?: string
  order?: number
}

export async function getAdminGalleries(params?: {
  search?: string
  type?: 'photo' | 'video' | 'mixed'
  page?: number
  per_page?: number
}): Promise<GalleryListResponse> {
  const query = buildQueryString({
    search: params?.search,
    type: params?.type,
    page: params?.page,
    per_page: params?.per_page,
  })

  return fetchAdminApi<GalleryListResponse>(`/galleries${query}`)
}

export async function getAdminGallery(id: string | number): Promise<{ data: Gallery }> {
  return fetchAdminApi<{ data: Gallery }>(`/galleries/${id}`)
}

export async function createGallery(data: CreateGalleryData): Promise<{ data: Gallery }> {
  return fetchAdminApi<{ data: Gallery }>('/galleries', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateGallery(id: string | number, data: UpdateGalleryData): Promise<{ data: Gallery }> {
  return fetchAdminApi<{ data: Gallery }>(`/galleries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteGallery(id: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/galleries/${id}`, {
    method: 'DELETE',
  })
}

export async function addGalleryItems(galleryId: string | number, items: AddGalleryItemData[]): Promise<{ data: GalleryItem[] }> {
  return fetchAdminApi<{ data: GalleryItem[] }>(`/galleries/${galleryId}/items`, {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}

export async function removeGalleryItem(galleryId: string | number, itemId: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/galleries/${galleryId}/items/${itemId}`, {
    method: 'DELETE',
  })
}

export async function uploadMedia(file: File): Promise<{ data: { id: number; url: string; path: string } }> {
  const formData = new FormData()
  formData.append('file', file)

  return fetchAdminApi<{ data: { id: number; url: string; path: string } }>('/media/upload', {
    method: 'POST',
    body: formData,
  })
}

// ============ Admin Posts API ============

export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  type: string
  category_ids?: number[]
  featured_image?: string
  is_featured?: boolean
  is_pinned?: boolean
  status?: 'draft' | 'published' | 'archived'
  published_at?: string
}

export type UpdatePostData = Partial<CreatePostData>

export async function getAdminPosts(params?: {
  search?: string
  type?: string
  status?: string
  page?: number
  per_page?: number
}): Promise<ApiResponse<Post[]>> {
  const query = buildQueryString({
    search: params?.search,
    type: params?.type,
    status: params?.status,
    page: params?.page,
    per_page: params?.per_page,
  })

  return fetchAdminApi<ApiResponse<Post[]>>(`/posts${query}`)
}

export async function getAdminPost(id: string | number): Promise<{ data: Post }> {
  return fetchAdminApi<{ data: Post }>(`/posts/${id}`)
}

export async function createPost(data: FormData | CreatePostData): Promise<{ data: Post }> {
  return fetchAdminApi<{ data: Post }>('/posts', {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
}

export async function updatePost(id: string | number, data: FormData | UpdatePostData): Promise<{ data: Post }> {
  return fetchAdminApi<{ data: Post }>(`/posts/${id}`, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
}

export async function deletePost(id: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/posts/${id}`, {
    method: 'DELETE',
  })
}

// ============ Admin Extras API ============

export interface CreateExtraData {
  name: string
  description: string
  short_description?: string
  category: string
  schedule?: string
  location?: string
  coach?: string
  achievements?: string[]
  requirements?: string
  quota?: number
  image?: string
  is_featured?: boolean
  is_active?: boolean
}

export type UpdateExtraData = Partial<CreateExtraData>

export async function getAdminExtras(params?: {
  search?: string
  category?: string
  page?: number
  per_page?: number
}): Promise<ApiResponse<Extra[]>> {
  const query = buildQueryString({
    search: params?.search,
    category: params?.category,
    page: params?.page,
    per_page: params?.per_page,
  })

  return fetchAdminApi<ApiResponse<Extra[]>>(`/extras${query}`)
}

export async function getAdminExtra(id: string | number): Promise<{ data: Extra }> {
  return fetchAdminApi<{ data: Extra }>(`/extras/${id}`)
}

export async function createExtra(data: CreateExtraData): Promise<{ data: Extra }> {
  return fetchAdminApi<{ data: Extra }>('/extras', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateExtra(id: string | number, data: UpdateExtraData): Promise<{ data: Extra }> {
  return fetchAdminApi<{ data: Extra }>(`/extras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteExtra(id: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/extras/${id}`, {
    method: 'DELETE',
  })
}

// ============ Admin Facilities API ============

export interface CreateFacilityData {
  name: string
  description: string
  short_description?: string
  category: string
  capacity?: number
  location?: string
  images?: string[]
  amenities?: string[]
  is_featured?: boolean
  is_bookable?: boolean
  is_active?: boolean
}

export type UpdateFacilityData = Partial<CreateFacilityData>

export async function getAdminFacilities(params?: {
  search?: string
  category?: string
  page?: number
  per_page?: number
}): Promise<ApiResponse<Facility[]>> {
  const query = buildQueryString({
    search: params?.search,
    category: params?.category,
    page: params?.page,
    per_page: params?.per_page,
  })

  return fetchAdminApi<ApiResponse<Facility[]>>(`/facilities${query}`)
}

export async function getAdminFacility(id: string | number): Promise<{ data: Facility }> {
  return fetchAdminApi<{ data: Facility }>(`/facilities/${id}`)
}

export async function createFacility(data: CreateFacilityData): Promise<{ data: Facility }> {
  return fetchAdminApi<{ data: Facility }>('/facilities', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateFacility(id: string | number, data: UpdateFacilityData): Promise<{ data: Facility }> {
  return fetchAdminApi<{ data: Facility }>(`/facilities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteFacility(id: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/facilities/${id}`, {
    method: 'DELETE',
  })
}

// ============ Admin Sliders API ============

export async function getSlider(id: string | number): Promise<{ data: Slider }> {
  return fetchAdminApi<{ data: Slider }>(`/sliders/${id}`)
}

export async function createSlider(data: FormData): Promise<{ data: Slider; message: string }> {
  return fetchAdminApi<{ data: Slider; message: string }>('/sliders', {
    method: 'POST',
    body: data,
  })
}

export async function updateSlider(id: string | number, data: FormData): Promise<{ data: Slider; message: string }> {
  return fetchAdminApi<{ data: Slider; message: string }>(`/sliders/${id}`, {
    method: 'POST',
    body: data,
  })
}

export async function deleteSlider(id: string | number): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>(`/sliders/${id}`, {
    method: 'DELETE',
  })
}

export async function reorderSliders(sliders: Array<{ id: number; order: number }>): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>('/sliders/reorder', {
    method: 'POST',
    body: JSON.stringify({ sliders }),
  })
}

// ============ Public Settings API ============

import { SiteSettings, SettingItem } from '@/types/settings'

/**
 * Get all public settings (no auth required)
 */
export async function getPublicSettings(): Promise<{ data: Partial<SiteSettings> }> {
  return fetchApi<{ data: Partial<SiteSettings> }>('/settings')
}

/**
 * Get settings by group (no auth required)
 */
export async function getSettingsByGroup(group: string): Promise<{ data: Partial<SiteSettings> }> {
  return fetchApi<{ data: Partial<SiteSettings> }>(`/settings/group/${group}`)
}

/**
 * Get a single setting by key (no auth required)
 */
export async function getSettingByKey(key: string): Promise<{ data: { key: string; value: any; type: string } }> {
  return fetchApi<{ data: { key: string; value: any; type: string } }>(`/settings/${key}`)
}

// ============ Admin Settings API ============

/**
 * Get all settings including non-public (admin only)
 */
export async function getAdminSettings(): Promise<{
  data: SettingItem[];
  groups: string[];
  grouped: Record<string, SettingItem[]>
}> {
  return fetchAdminApi<{
    data: SettingItem[];
    groups: string[];
    grouped: Record<string, SettingItem[]>
  }>('/settings')
}

/**
 * Get list of setting groups (admin only)
 */
export async function getSettingGroups(): Promise<{ data: string[] }> {
  return fetchAdminApi<{ data: string[] }>('/settings/groups')
}

/**
 * Batch update multiple settings (admin only)
 */
export async function updateSettings(
  settings: Array<{ key: string; value: any; type?: string; group?: string }>
): Promise<{ message: string; data: any }> {
  return fetchAdminApi<{ message: string; data: any }>('/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  })
}

/**
 * Update a single setting (admin only)
 */
export async function updateSetting(
  key: string,
  value: any,
  type?: string,
  group?: string
): Promise<{ message: string; data: { key: string; value: any } }> {
  return fetchAdminApi<{ message: string; data: { key: string; value: any } }>(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value, type, group }),
  })
}

/**
 * Upload file for a setting (admin only)
 */
export async function uploadSettingFile(
  key: string,
  file: File
): Promise<{ message: string; data: { key: string; url: string } }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', key)

  return fetchAdminApi<{ message: string; data: { key: string; url: string } }>('/settings/upload', {
    method: 'POST',
    body: formData,
  })
}
