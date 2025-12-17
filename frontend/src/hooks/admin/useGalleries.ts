import {
  useAdminResource,
  useAdminResourceDetail,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from './useAdminResource'

export interface Gallery {
  id: number
  attributes: {
    title: string
    slug: string
    description?: string
    type: string
    date?: string
    location?: string
    is_featured: boolean
    order: number
    thumbnail?: string
    media_count?: number
    created_at: string
    updated_at: string
  }
  relationships?: {
    media?: any[]
  }
}

/**
 * Fetch all galleries with optional filters
 */
export function useGalleries(params?: {
  type?: string
  is_featured?: boolean
  search?: string
  sort?: string
  limit?: number
  paginate?: boolean
}) {
  return useAdminResource<Gallery>('galleries', params)
}

/**
 * Fetch single gallery by ID
 */
export function useGalleryDetail(id: string | number | null) {
  return useAdminResourceDetail<Gallery>('galleries', id)
}

/**
 * Create new gallery
 */
export function useCreateGallery() {
  return useCreateResource<Gallery>('galleries')
}

/**
 * Update existing gallery
 */
export function useUpdateGallery() {
  return useUpdateResource<Gallery>('galleries')
}

/**
 * Delete gallery
 */
export function useDeleteGallery() {
  return useDeleteResource('galleries')
}
