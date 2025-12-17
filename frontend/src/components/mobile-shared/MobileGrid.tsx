'use client'

import { ReactNode } from 'react'

interface MobileGridProps {
    children: ReactNode
    columns?: 1 | 2 | 4
    gap?: 2 | 3 | 4
    className?: string
}

export function MobileGrid({
    children,
    columns = 2,
    gap = 3,
    className = ''
}: MobileGridProps) {
    const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        4: 'grid-cols-4'
    }

    const gapClasses = {
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4'
    }

    return (
        <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}>
            {children}
        </div>
    )
}
