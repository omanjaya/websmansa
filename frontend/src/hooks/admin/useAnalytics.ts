'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/admin-api'
import { useState, useEffect } from 'react'

export interface VisitorStats {
    total_visitors: number
    total_page_views: number
    growth_percentage: number
    today_visitors: number
    today_page_views: number
}

export interface DailyTrend {
    date: string
    day: string
    visitors: number
    page_views: number
}

// Hook to check if we have an auth token
function useHasAuthToken() {
    const [hasToken, setHasToken] = useState(false)

    useEffect(() => {
        // Check immediately
        const checkToken = () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
            setHasToken(!!token)
        }

        checkToken()

        // Also listen for storage changes (in case token is set after initial check)
        const handleStorage = () => checkToken()
        window.addEventListener('storage', handleStorage)

        // Re-check after a short delay (in case login just happened)
        const timeout = setTimeout(checkToken, 500)

        return () => {
            window.removeEventListener('storage', handleStorage)
            clearTimeout(timeout)
        }
    }, [])

    return hasToken
}

export function useVisitorStats(days: number = 30) {
    const hasToken = useHasAuthToken()

    return useQuery({
        queryKey: ['visitor-stats', days],
        queryFn: async (): Promise<VisitorStats> => {
            try {
                const response = await adminApi.get(`/analytics/stats?days=${days}`)
                return response.data || {
                    total_visitors: 0,
                    total_page_views: 0,
                    growth_percentage: 0,
                    today_visitors: 0,
                    today_page_views: 0,
                }
            } catch {
                // Return default values if API fails
                return {
                    total_visitors: 0,
                    total_page_views: 0,
                    growth_percentage: 0,
                    today_visitors: 0,
                    today_page_views: 0,
                }
            }
        },
        enabled: hasToken,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    })
}

export function useDailyTrend(days: number = 7) {
    const hasToken = useHasAuthToken()

    return useQuery({
        queryKey: ['daily-trend', days],
        queryFn: async (): Promise<DailyTrend[]> => {
            try {
                const response = await adminApi.get(`/analytics/daily-trend?days=${days}`)
                return response.data?.data || []
            } catch {
                // Return empty array if API fails
                return []
            }
        },
        enabled: hasToken,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    })
}
