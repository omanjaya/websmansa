import {
  useAdminResource,
  useAdminResourceDetail,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from './useAdminResource'

export interface Slider {
  id: number
  attributes: {
    title: string
    subtitle?: string
    image_url: string
    link?: string
    button_text?: string
    order: number
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

/**
 * Fetch all sliders with optional filters
 */
export function useSliders(params?: {
  is_active?: boolean
  search?: string
  sort?: string
  limit?: number
  paginate?: boolean
}) {
  return useAdminResource<Slider>('sliders', params)
}

/**
 * Fetch single slider by ID
 */
export function useSliderDetail(id: string | number | null) {
  return useAdminResourceDetail<Slider>('sliders', id)
}

/**
 * Create new slider
 */
export function useCreateSlider() {
  return useCreateResource<Slider>('sliders')
}

/**
 * Update existing slider
 */
export function useUpdateSlider() {
  return useUpdateResource<Slider>('sliders')
}

/**
 * Delete slider
 */
export function useDeleteSlider() {
  return useDeleteResource('sliders')
}
