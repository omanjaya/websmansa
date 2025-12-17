import {
  useAdminResource,
  useAdminResourceDetail,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useToggleResourceStatus,
} from './useAdminResource'

export interface Staff {
  id: number
  attributes: {
    name: string
    slug: string
    nip?: string
    position: string
    type: string
    department?: string
    email?: string
    phone?: string
    photo?: string
    photo_url?: string
    bio?: string
    education?: string[]
    experience?: number
    subjects?: string[]
    is_active: boolean
    is_featured: boolean
    order: number
    created_at: string
    updated_at: string
  }
  relationships?: {
    user?: any
  }
}

/**
 * Fetch all staff with optional filters
 */
export function useStaff(params?: {
  type?: string
  department?: string
  is_active?: boolean
  is_featured?: boolean
  limit?: number
  paginate?: boolean
}) {
  return useAdminResource<Staff>('staff', params)
}

/**
 * Fetch single staff by ID
 */
export function useStaffDetail(id: string | number | null) {
  return useAdminResourceDetail<Staff>('staff', id)
}

/**
 * Create new staff
 */
export function useCreateStaff() {
  return useCreateResource<Staff>('staff')
}

/**
 * Update existing staff
 */
export function useUpdateStaff() {
  return useUpdateResource<Staff>('staff')
}

/**
 * Delete staff
 */
export function useDeleteStaff() {
  return useDeleteResource('staff')
}

/**
 * Toggle staff active status
 */
export function useToggleStaffActive() {
  return useToggleResourceStatus('staff', 'active')
}

/**
 * Toggle staff featured status
 */
export function useToggleStaffFeatured() {
  return useToggleResourceStatus('staff', 'featured')
}
