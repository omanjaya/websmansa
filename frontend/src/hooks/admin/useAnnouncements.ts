import {
  useAdminResource,
  useAdminResourceDetail,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from './useAdminResource'

export interface Announcement {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt?: string
    content?: string
    type: string
    priority: string
    is_pinned: boolean
    is_active: boolean
    published_at?: string
    expires_at?: string
    created_at: string
    updated_at: string
  }
}

/**
 * Fetch all announcements with optional filters
 */
export function useAnnouncements(params?: {
  type?: string
  priority?: string
  is_pinned?: boolean
  is_active?: boolean
  search?: string
  sort?: string
  limit?: number
  paginate?: boolean
}) {
  return useAdminResource<Announcement>('announcements', params)
}

/**
 * Fetch single announcement by ID
 */
export function useAnnouncementDetail(id: string | number | null) {
  return useAdminResourceDetail<Announcement>('announcements', id)
}

/**
 * Create new announcement
 */
export function useCreateAnnouncement() {
  return useCreateResource<Announcement>('announcements')
}

/**
 * Update existing announcement
 */
export function useUpdateAnnouncement() {
  return useUpdateResource<Announcement>('announcements')
}

/**
 * Delete announcement
 */
export function useDeleteAnnouncement() {
  return useDeleteResource('announcements')
}
