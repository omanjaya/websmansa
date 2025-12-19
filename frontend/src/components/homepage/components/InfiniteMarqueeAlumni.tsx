'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, ChevronRight, ChevronLeft, Quote } from 'lucide-react'
import type { Alumni } from '@/lib/api'

// Default alumni for fallback
const defaultAlumni = [
    {
        id: 1,
        name: 'Dr. I Wayan Sudana',
        graduation_year: 1985,
        photo_url: '/alumni/alumni-1.jpg',
        quote: 'Tiga tahun di SMANSA mengajarkan saya nilai-nilai kehidupan yang tidak ternilai harganya. Selama menempuh pendidikan di sekolah ini, saya mendapatkan banyak pengalaman berharga untuk membentuk karakter dan memperluas wawasan. Guru-guru yang berdedikasi tinggi selalu menginspirasi kami untuk terus belajar dan berkembang.',
    },
    {
        id: 2,
        name: 'Ni Made Dewi Lestari',
        graduation_year: 1992,
        photo_url: '/alumni/alumni-2.jpg',
        quote: 'Terima kasih kepada para guru atas dedikasi dan ilmu yang telah diberikan, serta kepada teman-teman atas kebersamaan yang hangat. SMANSA bukan sekadar tempat belajar, tapi juga rumah kedua yang membentuk jati diri saya. Semoga semua kenangan ini menjadi pijakan untuk meraih masa depan yang lebih baik.',
    },
    {
        id: 3,
        name: 'I Gede Putra Wijaya',
        graduation_year: 2005,
        photo_url: '/alumni/alumni-3.jpg',
        quote: 'SMANSA mengajarkan saya tentang pentingnya integritas, kerja keras, dan semangat pantang menyerah. Pengalaman organisasi dan lomba debat di sini sangat membantu karir diplomatik saya di kancah internasional. Saya bangga menjadi bagian dari keluarga besar SMANSA yang selalu mendukung mimpi-mimpi besar kami.',
    },
    {
        id: 4,
        name: 'Kadek Ayu Pratiwi',
        graduation_year: 2010,
        photo_url: '/alumni/alumni-4.jpg',
        quote: 'Guru-guru SMANSA mengajarkan saya untuk selalu curious dan never stop learning. Fondasi keilmuan yang kuat dari sekolah ini membawa saya hingga ke perusahaan teknologi terbesar di dunia. Nilai-nilai disiplin, kerja sama tim, dan kreativitas yang ditanamkan di sini masih saya terapkan hingga sekarang.',
    },
]

interface InfiniteMarqueeAlumniProps {
    alumni?: Alumni[]
}

export function InfiniteMarqueeAlumni({ alumni: propAlumni }: InfiniteMarqueeAlumniProps) {
    const items = (propAlumni && propAlumni.length > 0)
        ? propAlumni.map(a => ({
            id: a.id,
            name: a.name,
            graduation_year: a.graduation_year,
            photo_url: a.photo_url || '/alumni/default.jpg',
            quote: a.quote || '',
        }))
        : defaultAlumni

    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStartX, setDragStartX] = useState(0)
    const [itemWidth, setItemWidth] = useState(380)
    const containerRef = useRef<HTMLDivElement>(null)
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const GAP = 24
    const AUTO_PLAY_INTERVAL = 5000 // 5 seconds per item (slower than achievements)

    // Set responsive item width
    useEffect(() => {
        const updateWidth = () => {
            setItemWidth(window.innerWidth < 768 ? 300 : 380)
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
        const threshold = 50

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToIndex(activeIndex + 1)
            } else {
                goToIndex(activeIndex - 1)
            }
        }

        setIsDragging(false)

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

    // Calculate style for each item
    const getItemStyle = (index: number): React.CSSProperties => {
        const distance = index - activeIndex
        const absDistance = Math.abs(distance)

        const scale = absDistance === 0 ? 1 : Math.max(0.78, 1 - absDistance * 0.1)
        const opacity = absDistance === 0 ? 1 : Math.max(0.35, 1 - absDistance * 0.3)
        const blur = absDistance === 0 ? 0 : Math.min(absDistance * 1.5, 3)
        const zIndex = 10 - absDistance
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
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 md:mb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 mb-3 md:mb-4">
                            <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-300">
                                Tentang Alumni
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Alumni{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                                Berprestasi
                            </span>
                        </h2>
                    </div>
                    <Link
                        href="/alumni"
                        className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline group text-sm md:text-base"
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
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 via-slate-50/90 dark:from-slate-900 dark:via-slate-900/90 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 via-slate-50/90 dark:from-slate-900 dark:via-slate-900/90 to-transparent z-20 pointer-events-none" />

                {/* Carousel Track */}
                <div
                    ref={containerRef}
                    className="relative h-[420px] md:h-[480px] select-none overflow-hidden"
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
                                    className="h-full bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 cursor-pointer"
                                    onClick={() => { goToIndex(index); setIsPaused(true); }}
                                >
                                    {/* Photo Section */}
                                    <div className="relative h-[160px] md:h-[200px] overflow-hidden">
                                        <Image
                                            src={item.photo_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 768px) 300px, 380px"
                                            draggable={false}
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Active glow */}
                                        {index === activeIndex && (
                                            <div className="absolute inset-0 ring-2 ring-purple-400/50" />
                                        )}

                                        {/* Year Badge */}
                                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30">
                                            <span className="text-xs md:text-sm font-bold text-white">Alumni {item.graduation_year}</span>
                                        </div>

                                        {/* Name on photo */}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h3 className="font-bold text-white text-lg md:text-xl leading-snug drop-shadow-lg">
                                                {item.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Quote Section - taller to fit longer text */}
                                    <div className="p-4 md:p-6 relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 h-[calc(100%-160px)] md:h-[calc(100%-200px)] overflow-hidden">
                                        <Quote className="absolute top-3 left-3 w-6 h-6 md:w-8 md:h-8 text-purple-200 dark:text-purple-800/50" />
                                        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base italic leading-relaxed pl-6 md:pl-10 line-clamp-6 md:line-clamp-none">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
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
                                ? 'w-8 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500'
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
