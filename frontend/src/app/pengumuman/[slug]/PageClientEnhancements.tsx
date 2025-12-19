'use client'

import {
    ReadingProgressBar,
    BackToTopButton,
    FloatingSocialShare,
} from '@/components/shared'

interface PageClientEnhancementsProps {
    title: string
}

export function PageClientEnhancements({ title }: PageClientEnhancementsProps) {
    return (
        <>
            <ReadingProgressBar />
            <FloatingSocialShare title={title} />
            <BackToTopButton />
        </>
    )
}
