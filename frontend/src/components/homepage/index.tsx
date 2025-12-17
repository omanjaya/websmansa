'use client'

import { useIsMobile } from '@/hooks/useDeviceType'
import { MobileView } from './MobileView'
import { DesktopView } from './DesktopView'
import { useState, useEffect } from 'react'

interface HomePageProps {
    posts: any[]
    announcements: any[]
    slides?: any[]
    achievements?: any[]
    alumni?: any[]
    galleries?: any[]
}

// Skeleton Loading Component with Glassmorphism
function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 
            dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

            {/* Hero Skeleton */}
            <div className="relative h-[100dvh] bg-gradient-to-br from-slate-300 to-slate-400 
                dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer-effect" />

                {/* Content skeleton */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
                        {/* Badge skeleton */}
                        <div className="flex justify-center">
                            <div className="w-40 h-10 bg-white/20 dark:bg-slate-700/40 rounded-full animate-pulse" />
                        </div>
                        {/* Title skeleton */}
                        <div className="space-y-4">
                            <div className="w-3/4 h-16 bg-white/30 dark:bg-slate-700/50 rounded-2xl mx-auto animate-pulse" />
                            <div className="w-1/2 h-16 bg-white/20 dark:bg-slate-700/40 rounded-2xl mx-auto animate-pulse" />
                        </div>
                        {/* Subtitle skeleton */}
                        <div className="w-2/3 h-6 bg-white/20 dark:bg-slate-700/40 rounded-xl mx-auto animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Stats Section Skeleton */}
            <div className="container mx-auto px-4 -mt-16 relative z-10">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl 
                    border border-white/50 dark:border-slate-700/50 shadow-xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center space-y-3">
                                <div className="w-14 h-14 bg-slate-200/80 dark:bg-slate-700/60 rounded-2xl mx-auto animate-pulse" />
                                <div className="w-16 h-8 bg-slate-200/80 dark:bg-slate-700/60 rounded-lg mx-auto animate-pulse" />
                                <div className="w-20 h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded mx-auto animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section Skeleton */}
            <div className="container mx-auto px-4 py-20">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="w-40 h-8 bg-slate-200/80 dark:bg-slate-700/60 rounded-full mx-auto animate-pulse" />
                    <div className="w-64 h-12 bg-slate-200/80 dark:bg-slate-700/60 rounded-2xl mx-auto animate-pulse" />
                    <div className="w-96 h-6 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl mx-auto animate-pulse" />
                </div>

                {/* Cards Skeleton */}
                <div className="grid md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl 
                            border border-white/50 dark:border-slate-700/50 p-8 space-y-4">
                            <div className="w-16 h-16 bg-slate-200/80 dark:bg-slate-700/60 rounded-2xl animate-pulse" />
                            <div className="w-3/4 h-8 bg-slate-200/80 dark:bg-slate-700/60 rounded-lg animate-pulse" />
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                                <div className="w-5/6 h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Mobile Skeleton
function MobileSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 
            dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

            {/* Hero Skeleton */}
            <div className="relative h-[65vh] bg-gradient-to-br from-slate-300 to-slate-400 
                dark:from-slate-800 dark:to-slate-900">
                <div className="absolute inset-0 shimmer-effect" />
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 space-y-4">
                    <div className="w-32 h-8 bg-white/20 rounded-full animate-pulse" />
                    <div className="w-3/4 h-10 bg-white/30 rounded-2xl animate-pulse" />
                    <div className="w-full h-5 bg-white/20 rounded-lg animate-pulse" />
                    <div className="flex gap-3 pt-2">
                        <div className="flex-1 h-12 bg-white/40 rounded-2xl animate-pulse" />
                        <div className="w-24 h-12 bg-white/20 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="px-4 -mt-8">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl 
                    border border-white/50 dark:border-slate-700/50 p-5">
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto animate-pulse" />
                                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded mx-auto animate-pulse" />
                                <div className="w-12 h-3 bg-slate-200/60 dark:bg-slate-700/60 rounded mx-auto animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Access Skeleton */}
            <div className="px-4 py-6">
                <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse" />
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 space-y-2">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto animate-pulse" />
                            <div className="w-14 h-4 bg-slate-200/60 dark:bg-slate-700/60 rounded mx-auto animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* News Skeleton */}
            <div className="px-4 pb-6">
                <div className="w-28 h-6 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 flex gap-4">
                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="w-20 h-3 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function HomePage({ posts, announcements, slides, achievements, alumni, galleries }: HomePageProps) {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Show skeleton during hydration
    if (!mounted) {
        // Return mobile skeleton on smaller screens, desktop on larger
        // Using CSS media queries for initial render
        return (
            <>
                <div className="block md:hidden">
                    <MobileSkeleton />
                </div>
                <div className="hidden md:block">
                    <HomePageSkeleton />
                </div>
            </>
        )
    }

    return isMobile ? (
        <MobileView posts={posts} announcements={announcements} slides={slides} achievements={achievements} alumni={alumni} galleries={galleries} />
    ) : (
        <DesktopView posts={posts} announcements={announcements} slides={slides} achievements={achievements} alumni={alumni} galleries={galleries} />
    )
}
