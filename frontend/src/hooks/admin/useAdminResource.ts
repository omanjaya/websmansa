import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api/admin/v1') || 'http://localhost:8000/api/admin/v1'

/**
 * Get auth token from localStorage
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Hook to check if we have an auth token
 */
function useHasAuthToken() {
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const checkToken = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      setHasToken(!!token)
    }

    checkToken()
    const handleStorage = () => checkToken()
    window.addEventListener('storage', handleStorage)
    const timeout = setTimeout(checkToken, 500)

    return () => {
      window.removeEventListener('storage', handleStorage)
      clearTimeout(timeout)
    }
  }, [])

  return hasToken
}

/**
 * Generic admin API client
 */
const adminApi = {
  async get(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  },

  async post(endpoint: string, data: Record<string, unknown>) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  },

  async put(endpoint: string, data: Record<string, unknown>) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  },
}

/**
 * Generic hook for fetching a list of resources
 */
export function useAdminResource<T>(
  resource: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const hasToken = useHasAuthToken()

  return useQuery({
    queryKey: ['admin', resource, params],
    queryFn: async () => {
      const response = await adminApi.get(`/${resource}`, params)
      return response.data as T[]
    },
    enabled: hasToken, // Only fetch when we have a token
  })
}

/**
 * Generic hook for fetching a single resource by ID
 */
export function useAdminResourceDetail<T>(
  resource: string,
  id: string | number | null
) {
  return useQuery({
    queryKey: ['admin', resource, id],
    queryFn: async () => {
      if (!id) return null
      const response = await adminApi.get(`/${resource}/${id}`)
      return response.data as T
    },
    enabled: !!id,
  })
}

/**
 * Generic hook for creating a resource
 */
export function useCreateResource<T>(resource: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const response = await adminApi.post(`/${resource}`, data)
      return response.data as T
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', resource] })
    },
  })
}

/**
 * Generic hook for updating a resource
 */
export function useUpdateResource<T>(resource: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<T> }) => {
      const response = await adminApi.put(`/${resource}/${id}`, data)
      return response.data as T
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', resource] })
      queryClient.invalidateQueries({ queryKey: ['admin', resource, variables.id] })
    },
  })
}

/**
 * Generic hook for deleting a resource
 */
export function useDeleteResource(resource: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      await adminApi.delete(`/${resource}/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', resource] })
    },
  })
}

/**
 * Generic hook for toggling resource status (active/featured)
 */
export function useToggleResourceStatus(resource: string, statusType: 'active' | 'featured') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await adminApi.post(`/${resource}/${id}/toggle-${statusType}`, {})
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', resource] })
      queryClient.invalidateQueries({ queryKey: ['admin', resource, id] })
    },
  })
}

export { adminApi }
