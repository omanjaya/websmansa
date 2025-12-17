'use client'

import { useIsMobile } from '@/hooks/useDeviceType'
import { MobileView } from './MobileView'
import { DesktopView } from './DesktopView'
import { useState, useEffect } from 'react'
import { Gallery } from '@/lib/api'
import { Camera, Image, Video } from 'lucide-react'

interface GaleriPageProps {
    galleries: Gallery[]
    stats: {
        total: number
        photo: number
        video: number
    }
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    search?: string
}

export function GaleriPage({ galleries, stats, meta, search }: GaleriPageProps) {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Build stats with icons in client component
    const desktopStats = [
        {
            icon: Image,
            label: 'Total Galeri',
            value: stats.total,
            color: 'text-blue-600',
        },
        {
            icon: Camera,
            label: 'Foto',
            value: stats.photo,
            color: 'text-green-600',
        },
        {
            icon: Video,
            label: 'Video',
            value: stats.video,
            color: 'text-purple-600',
        },
    ]

    const mobileStats = [
        {
            label: 'Total',
            value: stats.total,
            icon: Image,
        },
        {
            label: 'Foto',
            value: stats.photo,
            icon: Camera,
        },
        {
            label: 'Video',
            value: stats.video,
            icon: Video,
        },
    ]

    // Show loading during hydration
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    return isMobile ? (
        <MobileView galleries={galleries} stats={mobileStats} />
    ) : (
        <DesktopView galleries={galleries} stats={desktopStats} meta={meta} search={search} />
    )
}
