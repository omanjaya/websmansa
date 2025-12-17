'use client'

import { useIsMobile } from '@/hooks/useDeviceType'
import { useState, useEffect } from 'react'
import { MobileView } from './MobileView'
import { DesktopView } from './DesktopView'
import { Skeleton } from '@/components/ui/skeleton'

export function AnnouncementCreateForm() {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return isMobile ? <MobileView /> : <DesktopView />
}
