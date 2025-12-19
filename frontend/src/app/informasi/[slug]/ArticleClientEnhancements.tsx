'use client'

import {
    ReadingProgressBar,
    BackToTopButton,
    FloatingSocialShare,
} from '@/components/shared'

interface ArticleClientEnhancementsProps {
    title: string
}

export function ArticleClientEnhancements({ title }: ArticleClientEnhancementsProps) {
    return (
        <>
            <ReadingProgressBar />
            <FloatingSocialShare title={title} />
            <BackToTopButton />
        </>
    )
}
