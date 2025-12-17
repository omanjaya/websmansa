import { cache } from 'react'
import { SiteSettings, defaultSettings } from '@/types/settings'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

/**
 * Server-side function to fetch site settings
 * Uses React's cache() to deduplicate requests within the same render pass
 * 
 * This function is designed for use in Server Components and should not be 
 * used in Client Components (use useSiteConfig() hook instead)
 */
export const getServerSettings = cache(async (): Promise<SiteSettings> => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            next: {
                revalidate: 300, // Cache for 5 minutes (ISR)
                tags: ['settings'] // For on-demand revalidation
            },
            headers: {
                'Accept': 'application/json',
            },
        })

        if (!response.ok) {
            console.warn(`Settings API returned ${response.status}, using defaults`)
            return defaultSettings
        }

        const result = await response.json()

        // Merge with defaults to ensure all keys exist
        return {
            ...defaultSettings,
            ...result.data,
            // Convert established_year to number if it's a string
            established_year: parseInt(result.data?.established_year) || defaultSettings.established_year,
        }
    } catch (error) {
        console.error('Failed to fetch server settings:', error)
        return defaultSettings
    }
})

/**
 * Server-side function to get settings by group
 */
export const getServerSettingsByGroup = cache(async (group: string): Promise<Partial<SiteSettings>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/group/${group}`, {
            next: {
                revalidate: 300,
                tags: ['settings', `settings-${group}`]
            },
            headers: {
                'Accept': 'application/json',
            },
        })

        if (!response.ok) {
            console.warn(`Settings group API returned ${response.status}`)
            return {}
        }

        const result = await response.json()
        return result.data || {}
    } catch (error) {
        console.error(`Failed to fetch settings for group ${group}:`, error)
        return {}
    }
})

/**
 * Helper to generate metadata from settings
 */
export async function getSettingsMetadata() {
    const settings = await getServerSettings()

    return {
        title: {
            default: settings.meta_title || settings.site_name,
            template: `%s | ${settings.site_short_name}`,
        },
        description: settings.meta_description,
        keywords: settings.meta_keywords.split(',').map(k => k.trim()),
        openGraph: {
            title: settings.meta_title || settings.site_name,
            description: settings.meta_description,
            images: settings.og_image ? [settings.og_image] : [],
            siteName: settings.site_name,
        },
        twitter: {
            card: 'summary_large_image',
            title: settings.meta_title || settings.site_name,
            description: settings.meta_description,
            images: settings.og_image ? [settings.og_image] : [],
        },
    }
}
