'use client'

import { useIsMobile } from '@/hooks/useDeviceType'
import { MobileView } from './MobileView'
import { DesktopView } from './DesktopView'
import { useState, useEffect } from 'react'

type Announcement = {
    id: number
    type: string
    attributes: {
        title: string
        slug: string
        content: string
        excerpt?: string
        type: string
        priority: number
        is_featured: boolean
        is_pinned: boolean
        published_at: string
        created_at: string
        updated_at: string
    }
}

interface PengumumanPageProps {
    announcements: Announcement[]
    types: string[]
    typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'>
    typeLabels: Record<string, string>
    currentType?: string
}

export function PengumumanPage({
    announcements,
    types,
    typeColors,
    typeLabels,
    currentType
}: PengumumanPageProps) {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

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
        <MobileView
            announcements={announcements}
            types={types}
            typeLabels={typeLabels}
            currentType={currentType}
        />
    ) : (
        <DesktopView
            announcements={announcements}
            types={types}
            typeColors={typeColors}
            typeLabels={typeLabels}
            currentType={currentType}
        />
    )
}
