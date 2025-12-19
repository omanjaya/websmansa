'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { SiteSettings, defaultSettings } from '@/types/settings'
import { getPublicSettings } from '@/lib/api'

interface SiteConfigContextType {
    settings: SiteSettings
    isLoading: boolean
    error: Error | null
    refetch: () => Promise<void>
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null)

interface SiteConfigProviderProps {
    children: ReactNode
    initialSettings?: Partial<SiteSettings>
}

export function SiteConfigProvider({
    children,
    initialSettings
}: SiteConfigProviderProps) {
    const [settings, setSettings] = useState<SiteSettings>({
        ...defaultSettings,
        ...initialSettings,
    })
    const [isLoading, setIsLoading] = useState(!initialSettings)
    const [error, setError] = useState<Error | null>(null)

    const fetchSettings = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await getPublicSettings()
            setSettings({
                ...defaultSettings,
                ...response.data,
            })
        } catch (err) {
            console.error('Failed to fetch site settings:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch settings'))
            // Keep using default or initial settings on error
        } finally {
            setIsLoading(false)
        }
    }

    // Only fetch if we don't have initial settings
    useEffect(() => {
        if (!initialSettings) {
            fetchSettings()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const refetch = async () => {
        await fetchSettings()
    }

    return (
        <SiteConfigContext.Provider value={{ settings, isLoading, error, refetch }}>
            {children}
        </SiteConfigContext.Provider>
    )
}

/**
 * Hook to access site configuration settings
 * 
 * @returns SiteConfigContextType with settings, loading state, error, and refetch function
 * @throws Error if used outside of SiteConfigProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { settings, isLoading } = useSiteConfig()
 *   
 *   if (isLoading) return <Skeleton />
 *   
 *   return <h1>{settings.site_name}</h1>
 * }
 * ```
 */
export function useSiteConfig() {
    const context = useContext(SiteConfigContext)
    if (!context) {
        throw new Error('useSiteConfig must be used within SiteConfigProvider')
    }
    return context
}

/**
 * Get a specific setting value with type safety
 * 
 * @param key - The setting key to retrieve
 * @returns The setting value
 * 
 * @example
 * ```tsx
 * const { getSetting } = useSiteConfig()
 * const siteName = getSetting('site_name')
 * ```
 */
export function useSettingValue<K extends keyof SiteSettings>(key: K): SiteSettings[K] {
    const { settings } = useSiteConfig()
    return settings[key]
}
