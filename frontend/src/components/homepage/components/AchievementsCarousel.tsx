'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Award, Trophy, Star } from 'lucide-react'

interface Achievement {
    id: number
    title: string
    description: string
    category: string
    year: string
    icon: 'award' | 'trophy' | 'star'
    color: string
}

const achievements: Achievement[] = [
    {
        id: 1,
        title: 'Juara 1 Olimpiade Sains Nasional',
        description: 'Bidang Fisika tingkat Nasional',
        category: 'Akademik',
        year: '2025',
        icon: 'trophy',
        color: 'from-yellow-400 to-amber-500',
    },
    {
        id: 2,
        title: 'Juara Umum POPDA Provinsi Bali',
        description: 'Cabang Olahraga Atletik dan Basket',
        category: 'Olahraga',
        year: '2025',
        icon: 'award',
        color: 'from-blue-400 to-cyan-500',
    },
    {
        id: 3,
        title: 'Best Delegation Model United Nations',
        description: 'International MUN Conference Singapore',
        category: 'Internasional',
        year: '2024',
        icon: 'star',
        color: 'from-purple-400 to-pink-500',
    },
    {
        id: 4,
        title: 'Juara 1 Lomba Karya Ilmiah Remaja',
        description: 'Kategori Penelitian Sosial Humaniora',
        category: 'Penelitian',
        year: '2024',
        icon: 'trophy',
        color: 'from-green-400 to-emerald-500',
    },
    {
        id: 5,
        title: 'Medali Emas Kompetisi Robotika',
        description: 'Indonesia Robot Competition 2024',
        category: 'Teknologi',
        year: '2024',
        icon: 'award',
        color: 'from-red-400 to-rose-500',
    },
]

const iconComponents = {
    award: Award,
    trophy: Trophy,
    star: Star,
}

export function AchievementsCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start' },
        [Autoplay({ delay: 4000, stopOnInteraction: false })]
    )

    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

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

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Prestasi Terkini
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Pencapaian membanggakan siswa-siswi SMAN 1 Denpasar
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative px-6 md:px-8">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-6">
                            {achievements.map((achievement) => {
                                const IconComponent = iconComponents[achievement.icon]
                                return (
                                    <motion.div
                                        key={achievement.id}
                                        className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden group">
                                            {/* Background Gradient */}
                                            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${achievement.color} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />

                                            {/* Year Badge */}
                                            <div className="absolute top-6 right-6">
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-bold rounded-full">
                                                    {achievement.year}
                                                </span>
                                            </div>

                                            {/* Icon */}
                                            <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>

                                            {/* Category */}
                                            <div className="mb-3">
                                                <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                                                    {achievement.category}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white leading-tight">
                                                {achievement.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all border border-gray-200 dark:border-slate-700 group z-10"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all border border-gray-200 dark:border-slate-700 group z-10"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {achievements.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === selectedIndex
                                    ? 'bg-blue-600 w-8'
                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
                            }`}
                            onClick={() => emblaApi?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
