'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, GraduationCap, ChevronLeft } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/Motion'
import type { Alumni } from '@/lib/api'

// Default alumni for fallback
const defaultAlumni = [
    {
        id: 1,
        name: 'Dr. I Wayan Sudana',
        graduation_year: 1985,
        current_occupation: 'Dokter Spesialis Jantung',
        quote: 'Tiga tahun bukanlah waktu yang singkat buat saya untuk menjadi bagian dari keluarga besar SMA Negeri 1 Denpasar. Selama menempuh pendidikan di sekolah ini, saya mendapatkan banyak pengalaman berharga untuk membentuk karakter dan memperluas wawasan.',
        category: 'Kedokteran',
        current_institution: 'RSUP Sanglah',
        photo_url: '/alumni/alumni-1.jpg',
        color: 'from-red-400 to-rose-500',
        glow_color: 'rgba(251, 113, 133, 0.4)',
    },
    {
        id: 2,
        name: 'Ni Made Dewi Lestari',
        graduation_year: 1992,
        current_occupation: 'CEO & Founder',
        quote: 'Terima kasih kepada para guru atas dedikasi dan ilmu yang telah diberikan, serta kepada teman-teman atas kebersamaan yang hangat. Semoga semua kenangan ini menjadi pijakan untuk meraih masa depan yang lebih baik.',
        category: 'Entrepreneur',
        current_institution: 'Tech Startup Bali',
        photo_url: '/alumni/alumni-2.jpg',
        color: 'from-purple-400 to-violet-500',
        glow_color: 'rgba(167, 139, 250, 0.4)',
    },
    {
        id: 3,
        name: 'I Gede Putra Wijaya',
        graduation_year: 2005,
        current_occupation: 'Diplomat',
        quote: 'SMANSA mengajarkan saya tentang pentingnya integritas, kerja keras, dan semangat pantang menyerah. Pengalaman organisasi dan lomba debat di sini sangat membantu karir diplomatik saya di kancah internasional.',
        category: 'Diplomat',
        current_institution: 'Kementerian Luar Negeri RI',
        photo_url: '/alumni/alumni-3.jpg',
        color: 'from-blue-400 to-cyan-500',
        glow_color: 'rgba(96, 165, 250, 0.4)',
    },
    {
        id: 4,
        name: 'Kadek Ayu Pratiwi',
        graduation_year: 2010,
        current_occupation: 'Data Scientist',
        quote: 'Guru-guru SMANSA mengajarkan saya untuk selalu curious dan never stop learning. Fondasi keilmuan yang kuat dari sekolah ini membawa saya hingga ke perusahaan teknologi terbesar di dunia.',
        category: 'Teknologi',
        current_institution: 'Google Singapore',
        photo_url: '/alumni/alumni-4.jpg',
        color: 'from-green-400 to-emerald-500',
        glow_color: 'rgba(74, 222, 128, 0.4)',
    },
]

interface AlumniCarouselProps {
    alumni?: Alumni[]
}

// Alumni Carousel for Desktop - Same style as Achievements
export function AlumniCarousel({ alumni: propAlumni }: AlumniCarouselProps) {
    // Use prop alumni if provided and has data, otherwise use defaults
    const originalAlumni = (propAlumni && propAlumni.length > 0)
        ? propAlumni.map(a => ({
            id: a.id,
            name: a.name,
            graduation_year: a.graduation_year,
            current_occupation: a.current_occupation || '',
            quote: a.quote || '',
            category: a.category || '',
            current_institution: a.current_institution || '',
            photo_url: a.photo_url || '/alumni/default.jpg',
            color: a.color,
            glow_color: a.glow_color,
        }))
        : defaultAlumni

    // Clone items 3 times for infinite loop
    const alumni = [...originalAlumni, ...originalAlumni, ...originalAlumni]
    const LOOP_START_INDEX = originalAlumni.length
    const LOOP_END_INDEX = originalAlumni.length * 2
    const ITEM_WIDTH = 380
    const GAP_WIDTH = 24

    const [activeIndex, setActiveIndex] = useState(LOOP_START_INDEX)
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const isAutoScrolling = useRef(false)
    const isResetting = useRef(false)

    const getOriginalIndex = (index: number) => {
        return index % originalAlumni.length
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
        }, 4000)

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
                    const resetIndex = activeIndex - originalAlumni.length

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
    }, [activeIndex, isPaused, originalAlumni.length, LOOP_END_INDEX])

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

        if (newIndex >= 0 && newIndex < alumni.length && newIndex !== activeIndex) {
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
            const resetIndex = activeIndex - originalAlumni.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
        if (activeIndex < LOOP_START_INDEX) {
            const resetIndex = activeIndex + originalAlumni.length
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
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100/50 dark:bg-pink-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                            <span className="text-purple-600 font-bold tracking-wider uppercase text-sm flex items-center gap-2 mb-3">
                                <span className="w-10 h-[2px] bg-purple-600"></span>
                                Tentang Alumni
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Berprestasi</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-xl">
                                Kisah inspiratif dari para alumni yang telah berhasil di berbagai bidang
                            </p>
                        </div>
                        <Link
                            href="/alumni"
                            className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2 hover:underline group"
                        >
                            Lihat Semua Alumni
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-110 -ml-6"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-110 -mr-6"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Carousel */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto py-8 scrollbar-hide"
                        style={{ scrollSnapType: 'x mandatory' }}
                        onScroll={handleScroll}
                        onTouchStart={handleInteractionStart}
                        onTouchEnd={handleTouchEndReset}
                        onMouseEnter={handleInteractionStart}
                        onMouseLeave={handleInteractionEnd}
                    >
                        {alumni.map((person, index) => {
                            const isActive = index === activeIndex
                            return (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-[380px] snap-center transition-all duration-500 ease-out cursor-pointer"
                                    style={{
                                        transform: isActive ? 'scale(1)' : 'scale(0.9)',
                                        opacity: isActive ? 1 : 0.5,
                                        filter: isActive ? 'blur(0px)' : 'blur(2px)',
                                    }}
                                    onClick={() => navigateToIndex(getOriginalIndex(index))}
                                >
                                    <div
                                        className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden transition-all duration-500 border border-slate-100 dark:border-slate-700"
                                        style={{
                                            boxShadow: isActive
                                                ? `0 25px 50px -12px ${person.glow_color}, 0 12px 24px -8px rgba(0, 0, 0, 0.15)`
                                                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            transform: isActive ? 'translateY(-12px)' : 'translateY(0)',
                                        }}
                                    >
                                        {/* Alumni Photo */}
                                        <div className="relative w-full h-64 overflow-hidden">
                                            <Image
                                                src={person.photo_url}
                                                alt={person.name}
                                                fill
                                                className="object-cover object-top transition-transform duration-700"
                                                style={{
                                                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                                }}
                                                sizes="380px"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-t ${person.color} opacity-20`} />

                                            {/* Year Badge */}
                                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <span className="text-sm font-bold text-white">Alumni {person.graduation_year}</span>
                                            </div>

                                            {/* Category Badge */}
                                            <div
                                                className={`absolute bottom-4 left-4 px-3 py-1.5 bg-gradient-to-br ${person.color} rounded-xl
                                                    flex items-center gap-2 shadow-lg transition-all duration-300`}
                                                style={{
                                                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                                    boxShadow: isActive ? `0 8px 20px -4px ${person.glow_color}` : undefined
                                                }}
                                            >
                                                <GraduationCap className="w-4 h-4 text-white" />
                                                <span className="text-sm font-bold text-white">{person.category}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="mb-4">
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">
                                                    {person.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {person.current_occupation} • {person.current_institution}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                                <p className="text-base text-gray-600 dark:text-gray-300 italic leading-relaxed line-clamp-4">
                                                    "{person.quote}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-3 mt-8">
                    {originalAlumni.map((person, i) => {
                        const isActiveDot = getOriginalIndex(activeIndex) === i
                        return (
                            <button
                                key={i}
                                onClick={() => navigateToIndex(i)}
                                className="relative transition-all duration-300 ease-out"
                                aria-label={`Go to ${person.name}`}
                            >
                                <span
                                    className={`block rounded-full transition-all duration-300
                                        ${isActiveDot
                                            ? 'w-10 h-3 bg-gradient-to-r from-purple-500 to-pink-500'
                                            : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                        }`}
                                />
                                {isActiveDot && (
                                    <span
                                        className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping"
                                        style={{ animationDuration: '1.5s' }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
