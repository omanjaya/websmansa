'use client'

import { useSiteConfig } from '@/contexts/SiteConfigContext'
import {
    SchoolJsonLd as BaseSchoolJsonLd,
    WebsiteJsonLd as BaseWebsiteJsonLd,
    LocalBusinessJsonLd as BaseLocalBusinessJsonLd
} from './JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

/**
 * Dynamic SchoolJsonLd that uses settings from SiteConfigContext
 */
export function DynamicSchoolJsonLd() {
    const { settings } = useSiteConfig()

    // Build social links from settings
    const sameAs = [
        settings.facebook_url,
        settings.instagram_url,
        settings.youtube_url,
        settings.tiktok_url,
        settings.twitter_url,
    ].filter(Boolean) as string[]

    return (
        <BaseSchoolJsonLd
            name={settings.site_name}
            url={BASE_URL}
            logo={settings.logo_url || `${BASE_URL}/logo.png`}
            description={settings.site_description}
            foundingDate={settings.founded_year}
            numberOfStudents={1200}
            address={{
                streetAddress: settings.address.split(',')[0] || settings.address,
                addressLocality: settings.city || 'Denpasar',
                addressRegion: settings.province || 'Bali',
                postalCode: settings.postal_code || '80231',
                addressCountry: 'ID',
            }}
            geo={{
                latitude: parseFloat(settings.latitude) || -8.6705,
                longitude: parseFloat(settings.longitude) || 115.2126,
            }}
            telephone={settings.phone}
            email={settings.email}
            sameAs={sameAs}
        />
    )
}

/**
 * Dynamic WebsiteJsonLd that uses settings from SiteConfigContext
 */
export function DynamicWebsiteJsonLd() {
    const { settings } = useSiteConfig()

    return (
        <BaseWebsiteJsonLd
            name={settings.site_name}
            url={BASE_URL}
            description={settings.meta_description || settings.site_description}
        />
    )
}

/**
 * Dynamic LocalBusinessJsonLd for contact pages
 */
export function DynamicLocalBusinessJsonLd() {
    const { settings } = useSiteConfig()

    // Parse opening hours from settings
    const openingHours = [
        `Mo-Fr ${settings.weekday_hours.replace(' WITA', '').replace(' WIB', '').replace(' - ', '-')}`,
        `Sa ${settings.saturday_hours.replace(' WITA', '').replace(' WIB', '').replace(' - ', '-')}`,
    ].filter((hours) => !hours.includes('Tutup'))

    return (
        <BaseLocalBusinessJsonLd
            name={settings.site_name}
            url={BASE_URL}
            telephone={settings.phone}
            email={settings.email}
            openingHours={openingHours}
        />
    )
}
