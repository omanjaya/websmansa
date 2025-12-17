'use client'

import { useIsMobile } from '@/hooks/useDeviceType'
import { MobileView } from './MobileView'
import { DesktopView } from './DesktopView'
import { useState, useEffect } from 'react'

export function StaffPage({ staff, categories, currentCategory }: { 
    staff: Staff[] 
    categories: string[] 
    currentCategory?: string 
}) {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

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
        <MobileView staff={staff} categories={categories} currentCategory={currentCategory} />
    ) : (
        <DesktopView staff={staff} categories={categories} currentCategory={currentCategory} />
    )
}
