'use client'

import { motion } from 'framer-motion'

// Base shimmer animation
const shimmerAnimation = {
    x: ['-100%', '100%'],
}

const shimmerTransition = {
    duration: 1.5,
    repeat: Infinity,
    ease: 'linear' as const,
}

// Shimmer overlay component
function ShimmerOverlay() {
    return (
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
            animate={shimmerAnimation}
            transition={shimmerTransition}
        />
    )
}

// Card Skeleton
interface CardSkeletonProps {
    variant?: 'default' | 'horizontal' | 'compact'
}

export function CardSkeleton({ variant = 'default' }: CardSkeletonProps) {
    if (variant === 'horizontal') {
        return (
            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                {/* Image */}
                <div className="relative w-32 h-24 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                    <ShimmerOverlay />
                </div>
                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="relative h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    <div className="relative h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="relative h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                            <ShimmerOverlay />
                        </div>
                        <div className="relative h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                            <ShimmerOverlay />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
            {/* Image */}
            <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <ShimmerOverlay />
            </div>
            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="flex gap-2">
                    <div className="relative h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    <div className="relative h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                </div>
                <div className="relative h-6 w-full bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <ShimmerOverlay />
                </div>
                <div className="relative h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <ShimmerOverlay />
                </div>
                <div className="relative h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <ShimmerOverlay />
                </div>
            </div>
        </div>
    )
}

// Profile Card Skeleton
export function ProfileSkeleton() {
    return (
        <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <ShimmerOverlay />
            </div>
            {/* Name */}
            <div className="relative h-5 w-3/4 mx-auto bg-slate-200 dark:bg-slate-700 rounded overflow-hidden mb-2">
                <ShimmerOverlay />
            </div>
            {/* Role */}
            <div className="relative h-4 w-1/2 mx-auto bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                <ShimmerOverlay />
            </div>
        </div>
    )
}

// Gallery Skeleton
export function GallerySkeleton() {
    return (
        <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
            <ShimmerOverlay />
            {/* Overlay indicator */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="relative h-5 w-3/4 bg-slate-300/50 dark:bg-slate-600/50 rounded overflow-hidden">
                    <ShimmerOverlay />
                </div>
            </div>
        </div>
    )
}

// Achievement Skeleton
export function AchievementSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
            {/* Image */}
            <div className="relative h-36 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <ShimmerOverlay />
                {/* Medal badge */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 overflow-hidden">
                    <ShimmerOverlay />
                </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-2">
                <div className="flex gap-2">
                    <div className="relative h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    <div className="relative h-5 w-20 bg-yellow-100 dark:bg-yellow-900/30 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                </div>
                <div className="relative h-5 w-full bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <ShimmerOverlay />
                </div>
                <div className="relative h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <ShimmerOverlay />
                </div>
            </div>
        </div>
    )
}

// Hero Skeleton
export function HeroSkeleton() {
    return (
        <div className="relative h-[50vh] min-h-[400px] bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <ShimmerOverlay />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                    {/* Badge */}
                    <div className="relative h-8 w-32 mx-auto bg-slate-300/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    {/* Title */}
                    <div className="relative h-12 w-64 mx-auto bg-slate-300/50 dark:bg-slate-700/50 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    {/* Subtitle */}
                    <div className="relative h-6 w-80 mx-auto bg-slate-300/50 dark:bg-slate-700/50 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Filter Bar Skeleton
export function FilterBarSkeleton() {
    return (
        <div className="flex flex-wrap gap-2 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="relative h-10 px-6 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden"
                    style={{ width: `${60 + i * 10}px` }}
                >
                    <ShimmerOverlay />
                </div>
            ))}
        </div>
    )
}

// Page Skeleton - combines hero + filter + grid
interface PageSkeletonProps {
    gridCols?: 2 | 3 | 4 | 5
    cardCount?: number
    cardVariant?: 'default' | 'profile' | 'gallery' | 'achievement'
}

export function PageSkeleton({
    gridCols = 4,
    cardCount = 8,
    cardVariant = 'default'
}: PageSkeletonProps) {
    const gridClasses = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    }

    const CardComponent = {
        default: CardSkeleton,
        profile: ProfileSkeleton,
        gallery: GallerySkeleton,
        achievement: AchievementSkeleton,
    }[cardVariant]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <HeroSkeleton />

            {/* Content */}
            <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
                {/* Filter */}
                <div className="mb-8">
                    <FilterBarSkeleton />
                </div>

                {/* Grid */}
                <div className={`grid ${gridClasses[gridCols]} gap-4 md:gap-6`}>
                    {Array.from({ length: cardCount }).map((_, i) => (
                        <CardComponent key={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// Article List Skeleton
export function ArticleListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} variant="horizontal" />
            ))}
        </div>
    )
}

// Stats Skeleton
export function StatsSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="flex gap-4 justify-center">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl"
                >
                    <div className="relative h-8 w-16 mx-auto bg-white/20 rounded mb-2 overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                    <div className="relative h-4 w-20 mx-auto bg-white/20 rounded overflow-hidden">
                        <ShimmerOverlay />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Inline loading spinner with gradient
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }

    return (
        <div className={`${sizes[size]} relative`}>
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="absolute inset-1 rounded-full border-2 border-transparent border-b-cyan-400 border-l-pink-400"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    )
}

// Full page loading
export function FullPageLoading() {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <motion.p
                    className="mt-4 text-slate-600 dark:text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Memuat...
                </motion.p>
            </div>
        </div>
    )
}
