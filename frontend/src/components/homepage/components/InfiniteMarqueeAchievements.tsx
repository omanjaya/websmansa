'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy, ChevronRight, ChevronLeft } from 'lucide-react'
import type { Achievement } from '@/lib/api'

// Default achievements for fallback
const defaultAchievements = [
    { id: 1, title: 'Juara 1 OSN Fisika', image_url: '/achievements/osn-fisika.jpg' },
    { id: 2, title: 'Best Delegation MUN', image_url: '/achievements/mun.jpg' },
    { id: 3, title: 'Juara Umum POPDA', image_url: '/achievements/popda.jpg' },
    { id: 4, title: 'Gold Medal Choir', image_url: '/achievements/choir.jpg' },
    { id: 5, title: 'Medali Emas Robotika', image_url: '/achievements/robotics.jpg' },
]

interface InfiniteMarqueeAchievementsProps {
    achievements?: Achievement[]
}

export function InfiniteMarqueeAchievements({ achievements: propAchievements }: InfiniteMarqueeAchievementsProps) {
    const items = (propAchievements && propAchievements.length > 0)
        ? propAchievements.map(a => ({
            id: a.id,
            title: a.title,
            image_url: a.image_url || '/achievements/default.jpg',
        }))
        : defaultAchievements

    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStartX, setDragStartX] = useState(0)
    const [itemWidth, setItemWidth] = useState(320)
    const containerRef = useRef<HTMLDivElement>(null)
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const GAP = 24
    const AUTO_PLAY_INTERVAL = 4000 // 4 seconds per item

    // Set responsive item width
    useEffect(() => {
        const updateWidth = () => {
            setItemWidth(window.innerWidth < 768 ? 280 : 340)
        }
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    // Auto-play: advance one item at a time
    useEffect(() => {
        if (isPaused || isDragging) {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current)
            return
        }

        autoPlayRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % items.length)
        }, AUTO_PLAY_INTERVAL)

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current)
        }
    }, [isPaused, isDragging, items.length])

    // Navigate to specific index
    const goToIndex = useCallback((index: number) => {
        let newIndex = index
        if (newIndex < 0) newIndex = items.length - 1
        if (newIndex >= items.length) newIndex = 0
        setActiveIndex(newIndex)
    }, [items.length])

    // Handle drag
    const handleDragStart = (clientX: number) => {
        setIsDragging(true)
        setIsPaused(true)
        setDragStartX(clientX)
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }

    const handleDragEnd = (clientX: number) => {
        if (!isDragging) return
        const diff = dragStartX - clientX
        const threshold = 50 // minimum drag distance

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Dragged left - go to next
                goToIndex(activeIndex + 1)
            } else {
                // Dragged right - go to previous
                goToIndex(activeIndex - 1)
            }
        }

        setIsDragging(false)

        // Resume auto-play after 5 seconds
        resumeTimeoutRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 5000)
    }

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        handleDragStart(e.clientX)
    }
    const handleMouseUp = (e: React.MouseEvent) => handleDragEnd(e.clientX)
    const handleMouseLeave = (e: React.MouseEvent) => {
        if (isDragging) handleDragEnd(e.clientX)
    }

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX)
    const handleTouchEnd = (e: React.TouchEvent) => handleDragEnd(e.changedTouches[0].clientX)

    // Calculate style for each item based on distance from active
    const getItemStyle = (index: number): React.CSSProperties => {
        const distance = index - activeIndex
        const absDistance = Math.abs(distance)

        // Scale: active = 1, others shrink
        const scale = absDistance === 0 ? 1 : Math.max(0.75, 1 - absDistance * 0.12)

        // Opacity: active = 1, fade out as distance increases
        const opacity = absDistance === 0 ? 1 : Math.max(0.3, 1 - absDistance * 0.35)

        // Blur: active = 0, blur increases with distance
        const blur = absDistance === 0 ? 0 : Math.min(absDistance * 2, 4)

        // Z-index: active on top
        const zIndex = 10 - absDistance

        // Position: center the active item
        const translateX = distance * (itemWidth + GAP)

        return {
            transform: `translateX(${translateX}px) scale(${scale})`,
            opacity,
            filter: `blur(${blur}px)`,
            zIndex,
            transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }
    }

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 md:mb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/50 mb-3 md:mb-4">
                            <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-xs md:text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                Prestasi Membanggakan
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Prestasi{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                                Terkini
                            </span>
                        </h2>
                    </div>
                    <Link
                        href="/prestasi"
                        className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline group text-sm md:text-base"
                    >
                        Lihat Semua
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative">
                {/* Navigation Buttons */}
                <button
                    onClick={() => { goToIndex(activeIndex - 1); setIsPaused(true); }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={() => { goToIndex(activeIndex + 1); setIsPaused(true); }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
                    aria-label="Next"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Dissolve Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/90 dark:from-slate-950 dark:via-slate-950/90 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/90 dark:from-slate-950 dark:via-slate-950/90 to-transparent z-20 pointer-events-none" />

                {/* Carousel Track */}
                <div
                    ref={containerRef}
                    className="relative h-[280px] md:h-[320px] select-none overflow-hidden"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Center point */}
                    <div className="absolute left-1/2 top-0 h-full" style={{ width: itemWidth, marginLeft: -itemWidth / 2 }}>
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="absolute top-0 left-0 w-full h-full"
                                style={getItemStyle(index)}
                            >
                                <div
                                    className="relative h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                                    onClick={() => { goToIndex(index); setIsPaused(true); }}
                                >
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 280px, 340px"
                                        draggable={false}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Active glow */}
                                    {index === activeIndex && (
                                        <div className="absolute inset-0 ring-2 ring-yellow-400/50 rounded-xl md:rounded-2xl" />
                                    )}

                                    {/* Caption */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                                        <h3 className="font-bold text-white text-lg md:text-xl leading-snug line-clamp-2 drop-shadow-lg">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => { goToIndex(index); setIsPaused(true); }}
                            className={`transition-all duration-300 rounded-full ${index === activeIndex
                                    ? 'w-8 h-2.5 bg-gradient-to-r from-yellow-500 to-orange-500'
                                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
