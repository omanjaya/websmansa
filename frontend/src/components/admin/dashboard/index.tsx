'use client'

import { useIsMobile } from '@/hooks/useDeviceType'
import { useState, useEffect } from 'react'
import { MobileView } from './MobileView'
import { DesktopView } from './DesktopView'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminDashboard() {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        )
    }

    return isMobile ? <MobileView /> : <DesktopView />
}
