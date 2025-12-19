'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Slider } from '@/lib/api'

interface HeroSectionProps {
    slides?: Slider[]
}

// Default slides - digunakan jika tidak ada data dari API
const defaultSlides: Slider[] = [
    {
        id: 1,
        title: 'SMA Negeri 1 Denpasar',
        subtitle: 'Unggul dalam Prestasi, Berkarakter Pancasila',
        image: '/hero-bg.png',
        image_url: '/hero-bg.png',
        order: 1,
        is_active: true,
        created_at: '',
        updated_at: '',
    },
]

export function HeroSection({ slides }: HeroSectionProps) {
    // Use provided slides or fallback to default
    const activeSlides = slides && slides.length > 0 ? slides : defaultSlides
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    )
    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    )

    return (
        <section className="relative w-full h-[100dvh]">
            {/* Background Slider - full viewport behind header */}
            <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                    {activeSlides.map((slide) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                            <Image
                                src={slide.image_url || slide.image}
                                alt={slide.title || 'Hero background'}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                priority
                                quality={90}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Terakreditasi A Unggul
                        </motion.div>

                        <motion.h1
                            key={`title-${selectedIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight drop-shadow-lg"
                        >
                            {activeSlides[selectedIndex]?.title || 'SMA Negeri 1'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                                Denpasar
                            </span>
                        </motion.h1>

                        <motion.p
                            key={`subtitle-${selectedIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-light"
                        >
                            {activeSlides[selectedIndex]?.subtitle || 'Unggul dalam Prestasi, Berkarakter Pancasila, dan Berwawasan Global'}
                        </motion.p>

                        {/* Optional CTA Button from slider */}
                        {activeSlides[selectedIndex]?.link && activeSlides[selectedIndex]?.button_text && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Link
                                    href={activeSlides[selectedIndex].link!}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
                                >
                                    {activeSlides[selectedIndex].button_text}
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Slide Indicators - only show if more than 1 slide */}
            {activeSlides.length > 1 && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`transition-all duration-300 rounded-full ${index === selectedIndex
                                    ? 'w-10 h-3 bg-white'
                                    : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50 cursor-pointer z-20"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.div>
        </section>
    )
}
