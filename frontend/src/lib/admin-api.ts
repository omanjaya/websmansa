const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api/admin/v1') || 'http://localhost:8000/api/admin/v1'

function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
}

class AdminAPI {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    private async request(endpoint: string, options?: RequestInit) {
        const url = `${this.baseURL}${endpoint}`

        // Build headers
        const headers: Record<string, string> = {
            'Accept': 'application/json',
        }

        const token = getAuthToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // Add Content-Type for non-FormData requests
        if (!(options?.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json'
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options?.headers,
            },
        })

        if (!response.ok) {
            // Handle 401 Unauthorized - redirect to login
            if (response.status === 401) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login'
                }
                throw new Error('Unauthorized')
            }

            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || `HTTP Error: ${response.status}`)
        }

        return response.json()
    }

    async get(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
        const searchParams = new URLSearchParams()
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value))
                }
            })
        }
        const queryString = searchParams.toString()
        return this.request(`${endpoint}${queryString ? '?' + queryString : ''}`, { method: 'GET' })
    }

    async post(endpoint: string, data?: unknown) {
        return this.request(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
        })
    }

    async put(endpoint: string, data?: unknown) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        })
    }

    async patch(endpoint: string, data?: unknown) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data instanceof FormData ? data : JSON.stringify(data),
        })
    }

    async delete(endpoint: string) {
        return this.request(endpoint, { method: 'DELETE' })
    }
}

export const adminApi = new AdminAPI(API_BASE_URL)
