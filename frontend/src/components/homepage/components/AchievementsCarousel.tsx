'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, Trophy } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/Motion'
import { Badge } from '@/components/ui'
import type { Achievement } from '@/lib/api'

// Default achievements for fallback
const defaultAchievements = [
    {
        id: 1,
        title: 'Juara 1 OSN Fisika',
        category: 'Akademik',
        year: 2025,
        description: 'Bidang Fisika tingkat Nasional',
        color: 'from-yellow-400 to-orange-500',
        glow_color: 'rgba(251, 191, 36, 0.4)',
        image_url: '/achievements/osn-fisika.jpg',
    },
    {
        id: 2,
        title: 'Best Delegation MUN',
        category: 'Internasional',
        year: 2024,
        description: 'International MUN Conference Singapore',
        color: 'from-blue-400 to-purple-500',
        glow_color: 'rgba(96, 165, 250, 0.4)',
        image_url: '/achievements/mun.jpg',
    },
    {
        id: 3,
        title: 'Juara Umum POPDA',
        category: 'Olahraga',
        year: 2025,
        description: 'Cabang Olahraga Atletik dan Basket',
        color: 'from-green-400 to-cyan-500',
        glow_color: 'rgba(74, 222, 128, 0.4)',
        image_url: '/achievements/popda.jpg',
    },
    {
        id: 4,
        title: 'Gold Medal Choir',
        category: 'Seni',
        year: 2024,
        description: 'Kompetisi Paduan Suara Internasional',
        color: 'from-pink-400 to-rose-500',
        glow_color: 'rgba(251, 113, 133, 0.4)',
        image_url: '/achievements/choir.jpg',
    },
    {
        id: 5,
        title: 'Medali Emas Robotika',
        category: 'Teknologi',
        year: 2024,
        description: 'Indonesia Robot Competition 2024',
        color: 'from-red-400 to-rose-500',
        glow_color: 'rgba(239, 68, 68, 0.4)',
        image_url: '/achievements/robotics.jpg',
    },
]

interface AchievementsCarouselProps {
    achievements?: Achievement[]
}

// Achievements Carousel for Desktop - Same style as Mobile
export function AchievementsCarousel({ achievements: propAchievements }: AchievementsCarouselProps) {
    // Use prop achievements if provided and has data, otherwise use defaults
    const originalAchievements = (propAchievements && propAchievements.length > 0)
        ? propAchievements.map(a => ({
            id: a.id,
            title: a.title,
            category: a.category,
            year: a.year,
            description: a.description || '',
            color: a.color,
            glow_color: a.glow_color,
            image_url: a.image_url || '/achievements/default.jpg',
        }))
        : defaultAchievements

    // Clone items 3 times for infinite loop
    const achievements = [...originalAchievements, ...originalAchievements, ...originalAchievements]
    const LOOP_START_INDEX = originalAchievements.length
    const LOOP_END_INDEX = originalAchievements.length * 2
    const ITEM_WIDTH = 600
    const GAP_WIDTH = 32

    const [activeIndex, setActiveIndex] = useState(LOOP_START_INDEX)
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const isAutoScrolling = useRef(false)
    const isResetting = useRef(false)

    const getOriginalIndex = (index: number) => {
        return index % originalAchievements.length
    }

    // Initial Scroll Position Setup
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2
            container.scrollLeft = (LOOP_START_INDEX * totalItemWidth) - centerOffset
        }
    }, [LOOP_START_INDEX])

    // Auto scroll timer
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            isAutoScrolling.current = true
            setActiveIndex((prev) => prev + 1)
        }, 3500)

        return () => clearInterval(interval)
    }, [isPaused])

    // Scroll Logic & Infinite Loop Reset
    useEffect(() => {
        if (isResetting.current) return

        if (scrollRef.current && isAutoScrolling.current && !isPaused) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

            container.scrollTo({
                left: (activeIndex * totalItemWidth) - centerOffset,
                behavior: 'smooth'
            })

            if (activeIndex >= LOOP_END_INDEX) {
                setTimeout(() => {
                    isResetting.current = true
                    const resetIndex = activeIndex - originalAchievements.length

                    setActiveIndex(resetIndex)
                    container.scrollLeft = (resetIndex * totalItemWidth) - centerOffset

                    isAutoScrolling.current = false
                    setTimeout(() => { isResetting.current = false }, 50)
                }, 400)
            } else {
                setTimeout(() => {
                    isAutoScrolling.current = false
                }, 400)
            }
        }
    }, [activeIndex, isPaused, originalAchievements.length, LOOP_END_INDEX])

    const handleInteractionStart = () => {
        setIsPaused(true)
        isAutoScrolling.current = false
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    const handleInteractionEnd = () => {
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 3000)
    }

    const handleScroll = () => {
        if (!scrollRef.current || isResetting.current) return

        const container = scrollRef.current
        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

        const scrollPos = container.scrollLeft + centerOffset
        const newIndex = Math.round(scrollPos / totalItemWidth)

        if (newIndex >= 0 && newIndex < achievements.length && newIndex !== activeIndex) {
            if (!isAutoScrolling.current) {
                setActiveIndex(newIndex)
            }
        }
    }

    const handleTouchEndReset = () => {
        handleInteractionEnd()

        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = scrollRef.current ? (scrollRef.current.clientWidth - ITEM_WIDTH) / 2 : 0

        if (activeIndex >= LOOP_END_INDEX) {
            const resetIndex = activeIndex - originalAchievements.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
        if (activeIndex < LOOP_START_INDEX) {
            const resetIndex = activeIndex + originalAchievements.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
    }

    const navigateToIndex = (originalIndex: number) => {
        const targetIndex = LOOP_START_INDEX + originalIndex
        setIsPaused(true)
        isAutoScrolling.current = true
        setActiveIndex(targetIndex)

        if (scrollRef.current) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2
            container.scrollTo({
                left: (targetIndex * totalItemWidth) - centerOffset,
                behavior: 'smooth'
            })
        }

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
            isAutoScrolling.current = false
        }, 3000)
    }

    const goToPrev = () => {
        if (!scrollRef.current) return

        const newIndex = activeIndex - 1
        setActiveIndex(newIndex)
        setIsPaused(true)

        const container = scrollRef.current
        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

        container.scrollTo({
            left: (newIndex * totalItemWidth) - centerOffset,
            behavior: 'smooth'
        })

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 3000)
    }

    const goToNext = () => {
        if (!scrollRef.current) return

        const newIndex = activeIndex + 1
        setActiveIndex(newIndex)
        setIsPaused(true)

        const container = scrollRef.current
        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

        container.scrollTo({
            left: (newIndex * totalItemWidth) - centerOffset,
            behavior: 'smooth'
        })

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 3000)
    }

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/50 dark:bg-orange-900/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal>
                    {/* Header */}
                    <div className="text-center mb-16">
                        {/* Section Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/50 mb-4">
                            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                Prestasi Membanggakan
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Prestasi{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                                Terkini
                            </span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-xl">
                            Pencapaian membanggakan siswa-siswi SMAN 1 Denpasar di berbagai bidang
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* Carousel Container - Full Width */}
            <div className="relative w-full">
                {/* Navigation Buttons */}
                <button
                    onClick={goToPrev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-110"
                    aria-label="Next"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>

                {/* Carousel Track */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto py-12 px-4 scrollbar-hide w-full"
                    style={{ scrollSnapType: 'x mandatory' }}
                    onScroll={handleScroll}
                    onTouchStart={handleInteractionStart}
                    onTouchEnd={handleTouchEndReset}
                    onMouseEnter={handleInteractionStart}
                    onMouseLeave={handleInteractionEnd}
                >
                    {achievements.map((achievement, index) => {
                        const isActive = index === activeIndex
                        return (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[85vw] md:w-[600px] snap-center transition-all duration-500 ease-out cursor-pointer"
                                style={{
                                    transform: isActive ? 'scale(1)' : 'scale(0.9)',
                                    opacity: isActive ? 1 : 0.4,
                                    filter: isActive ? 'blur(0px)' : 'blur(2px)',
                                    zIndex: isActive ? 10 : 0,
                                }}
                                onClick={() => navigateToIndex(getOriginalIndex(index))}
                            >
                                <div
                                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden transition-all duration-500 border border-slate-100 dark:border-slate-700 h-full"
                                    style={{
                                        boxShadow: isActive
                                            ? `0 30px 60px -12px ${achievement.glow_color}, 0 16px 32px -12px rgba(0, 0, 0, 0.2)`
                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        transform: isActive ? 'translateY(-16px)' : 'translateY(0)',
                                    }}
                                >
                                    {/* Achievement Image */}
                                    <div className="relative w-full h-[280px] md:h-[350px] overflow-hidden">
                                        <Image
                                            src={achievement.image_url}
                                            alt={achievement.title}
                                            fill
                                            className="object-cover transition-transform duration-700"
                                            style={{
                                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                            }}
                                            sizes="(max-width: 768px) 85vw, 600px"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${achievement.color} opacity-40 mix-blend-multiply`} />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

                                        {/* Year Badge */}
                                        <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 shadow-lg">
                                            <span className="text-base font-bold text-white tracking-wide">{achievement.year}</span>
                                        </div>

                                        {/* Icon Badge */}
                                        <div
                                            className={`absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl
                                                flex items-center justify-center shadow-lg transition-all duration-300 border border-white/20`}
                                            style={{
                                                transform: isActive ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                                                boxShadow: isActive ? `0 8px 20px -4px ${achievement.glow_color}` : undefined
                                            }}
                                        >
                                            <Star className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 md:p-10 relative">
                                        <div className="absolute top-0 right-10 -translate-y-1/2">
                                            <Badge className={`text-sm px-4 py-1.5 shadow-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-none`}>
                                                {achievement.category}
                                            </Badge>
                                        </div>

                                        <h3 className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white mb-3 leading-tight">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 mt-8">
                {/* Dots Indicator */}
                <div className="flex justify-center gap-3">
                    {originalAchievements.map((achievement, i) => {
                        const isActiveDot = getOriginalIndex(activeIndex) === i
                        return (
                            <button
                                key={i}
                                onClick={() => navigateToIndex(i)}
                                className="relative transition-all duration-300 ease-out p-2"
                                aria-label={`Go to ${achievement.title}`}
                            >
                                <span
                                    className={`block rounded-full transition-all duration-500
                                        ${isActiveDot
                                            ? 'w-12 h-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-orange-500/30'
                                            : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                                        }`}
                                />
                            </button>
                        )
                    })}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/prestasi"
                        className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold text-lg hover:underline group"
                    >
                        Lihat Semua Prestasi
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
