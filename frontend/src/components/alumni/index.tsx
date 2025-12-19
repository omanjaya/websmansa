'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Briefcase, Quote, ChevronLeft, ChevronRight, Users, Star, Sparkles, ArrowRight } from 'lucide-react'
import { Alumni } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import { GlassCard } from '@/components/shared/cards/GlassCard'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
    TypewriterText,
    Parallax,
} from '@/components/shared/Animations'
import {
    DotPattern,
    FloatingShapes,
    GlowSpot,
    Waves,
    HexagonPattern,
} from '@/components/shared/Decorations'

interface AlumniPageProps {
    alumni: Alumni[]
    years: number[]
    categories: string[]
    currentYear?: number
    currentCategory?: string
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

const categoryLabels: Record<string, string> = {
    success_story: 'Kisah Sukses',
    entrepreneur: 'Pengusaha',
    professional: 'Profesional',
    academic: 'Akademisi',
    public_figure: 'Tokoh Publik',
}

// Success Story Slider Component
interface SuccessStorySliderProps {
    stories: Alumni[]
}

function SuccessStorySlider({ stories }: SuccessStorySliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % stories.length)
    }, [stories.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
    }, [stories.length])

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying || stories.length <= 1) return
        const interval = setInterval(nextSlide, 5000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, nextSlide, stories.length])

    if (stories.length === 0) return null

    const currentStory = stories[currentIndex]

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800" />

            {/* Animated background patterns */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                        </motion.div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Kisah Sukses Alumni</h3>
                            <p className="text-white/70 text-sm">Inspirasi dari lulusan terbaik</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                            aria-label="Kisah sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                            aria-label="Kisah selanjutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Story Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/30">
                                    {(currentStory.photo_url || currentStory.photo) ? (
                                        <Image
                                            src={currentStory.photo_url || currentStory.photo || ''}
                                            alt={currentStory.name}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center">
                                            <GraduationCap className="w-12 h-12 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-xl md:text-2xl font-bold text-white mb-1">
                                    {currentStory.name}
                                </h4>
                                <p className="text-yellow-300 font-medium mb-2">
                                    Angkatan {currentStory.graduation_year}
                                </p>
                                {(currentStory.current_occupation || currentStory.current_institution) && (
                                    <div className="flex items-center gap-2 justify-center md:justify-start text-white/80 mb-3">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-sm">
                                            {currentStory.current_occupation}
                                            {currentStory.current_institution && ` di ${currentStory.current_institution}`}
                                        </span>
                                    </div>
                                )}
                                {currentStory.quote && (
                                    <div className="relative">
                                        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-white/30" />
                                        <p className="text-white/90 italic pl-6 text-sm md:text-base line-clamp-3">
                                            &quot;{currentStory.quote}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots Indicator */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {stories.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all ${index === currentIndex
                                ? 'w-8 h-2 bg-white rounded-full'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                                }`}
                            aria-label={`Lihat kisah ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <motion.div
                        className="h-full bg-white/50"
                        initial={{ width: '0%' }}
                        animate={{ width: isAutoPlaying ? '100%' : '0%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                        key={`${currentIndex}-${isAutoPlaying}`}
                    />
                </div>
            </div>
        </motion.div>
    )
}

export function AlumniPage({
    alumni,
    years,
    categories,
    currentYear,
    currentCategory,
    meta,
}: AlumniPageProps) {
    const router = useRouter()
    const [activeFilter, setActiveFilter] = useState<'year' | 'category'>('year')

    // Build filters
    const yearFilters = years.map(year => ({
        label: `Angkatan ${year}`,
        value: year.toString(),
    }))

    const categoryFilters = categories.map(cat => ({
        label: categoryLabels[cat] || cat,
        value: cat,
    }))

    // Handle filter change
    const buildUrl = (year?: string, category?: string) => {
        const params = new URLSearchParams()
        if (year) params.set('year', year)
        if (category) params.set('category', category)
        return `/alumni${params.toString() ? '?' + params.toString() : ''}`
    }

    const handleYearChange = (value: string) => {
        router.push(buildUrl(value, currentCategory))
    }

    const handleCategoryChange = (value: string) => {
        router.push(buildUrl(currentYear?.toString(), value))
    }

    // Group featured alumni
    const featuredAlumni = alumni.filter(a => a.is_featured).slice(0, 4)
    const regularAlumni = alumni.filter(a => !featuredAlumni.includes(a))

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header so hero background shows behind it
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations - extends across entire page for seamless effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-purple-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-pink-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Alumni"
                    subtitle="Kebanggaan SMA Negeri 1 Denpasar yang sukses di berbagai bidang"
                    badge={{
                        icon: GraduationCap,
                        label: 'Lulusan',
                        color: 'purple',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Alumni', href: '/alumni' },
                    ]}
                />

                {/* Wave divider */}
                <Waves
                    color="fill-white dark:fill-slate-950"
                    position="bottom"
                    className="absolute bottom-0 z-20"
                />
            </div>

            {/* Content Section */}
            <Section background="white" padding="large" className="relative z-10">
                <div className="relative z-10">
                    {/* Success Story Slider - Only show when no filters active */}
                    {!currentYear && !currentCategory && featuredAlumni.length > 0 && (
                        <FadeInOnScroll delay={0.1} className="mb-10">
                            <SuccessStorySlider stories={featuredAlumni} />
                        </FadeInOnScroll>
                    )}

                    {/* Filter Tabs */}
                    <FadeInOnScroll delay={0.1} className="mb-6">
                        <div className="flex gap-2 mb-4">
                            {[
                                { key: 'year', label: 'Angkatan' },
                                ...(categories.length > 0 ? [{ key: 'category', label: 'Kategori' }] : []),
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key as 'year' | 'category')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeFilter === tab.key
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Active Filter Bar */}
                        {activeFilter === 'year' && (
                            <FilterBar
                                filters={yearFilters}
                                currentFilter={currentYear?.toString()}
                                onFilterChange={handleYearChange}
                                showSearch={true}
                                searchPlaceholder="Cari alumni..."
                                showAllOption={true}
                                allLabel="Semua Angkatan"
                            />
                        )}
                        {activeFilter === 'category' && categoryFilters.length > 0 && (
                            <FilterBar
                                filters={categoryFilters}
                                currentFilter={currentCategory}
                                onFilterChange={handleCategoryChange}
                                showSearch={true}
                                searchPlaceholder="Cari alumni..."
                                showAllOption={true}
                                allLabel="Semua Kategori"
                            />
                        )}
                    </FadeInOnScroll>

                    {/* Featured Alumni */}
                    {featuredAlumni.length > 0 && !currentYear && !currentCategory && (
                        <FadeInOnScroll delay={0.2} className="mb-12">
                            <SectionTitle
                                badge={{ icon: GraduationCap, label: 'Unggulan', color: 'purple' }}
                                title="Alumni"
                                gradientText="Inspiratif"
                                align="left"
                                className="mb-6"
                            />
                            <StaggerContainer className="grid md:grid-cols-2 gap-6">
                                {featuredAlumni.map((person, index) => (
                                    <StaggerItem key={person.id}>
                                        <Parallax speed={index % 2 === 0 ? 0.3 : -0.3} className="h-full">
                                            <GlassCard padding="large" glow glowColor="purple" className="h-full">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Photo */}
                                                    <div className="flex-shrink-0">
                                                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden mx-auto md:mx-0">
                                                            {(person.photo_url || person.photo) ? (
                                                                <Image
                                                                    src={person.photo_url || person.photo || ''}
                                                                    alt={person.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="128px"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                                                                    <GraduationCap className="w-12 h-12 text-purple-400 dark:text-purple-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 text-center md:text-left">
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                                            {person.name}
                                                        </h3>
                                                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                                                            Angkatan {person.graduation_year}
                                                        </p>
                                                        {(person.current_occupation || person.current_institution) && (
                                                            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                                                                <Briefcase className="w-4 h-4 text-slate-400" />
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {person.current_occupation}
                                                                    {person.current_institution && ` di ${person.current_institution}`}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {person.quote && (
                                                            <div className="relative">
                                                                <Quote className="absolute -top-1 -left-1 w-5 h-5 text-purple-300 dark:text-purple-700" />
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 italic pl-5 line-clamp-3">
                                                                    &quot;<TypewriterText
                                                                        text={person.quote}
                                                                        speed={30}
                                                                        delay={0.5}
                                                                        cursor={false}
                                                                    />&quot;
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </Parallax>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </FadeInOnScroll>
                    )}

                    {/* All Alumni Grid */}
                    <div>
                        {regularAlumni.length > 0 && featuredAlumni.length > 0 && !currentYear && !currentCategory && (
                            <SectionTitle
                                title="Semua"
                                gradientText="Alumni"
                                align="left"
                                className="mb-6"
                            />
                        )}

                        {(currentYear || currentCategory ? alumni : regularAlumni).length > 0 ? (
                            <>
                                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                    {(currentYear || currentCategory ? alumni : regularAlumni).map((person) => (
                                        <StaggerItem key={person.id}>
                                            <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1 text-center p-4">
                                                {/* Photo */}
                                                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-purple-400 transition-all">
                                                    {(person.photo_url || person.photo) ? (
                                                        <Image
                                                            src={person.photo_url || person.photo || ''}
                                                            alt={person.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="80px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                                            <GraduationCap className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                    {person.name}
                                                </h4>
                                                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                                                    Angkatan {person.graduation_year}
                                                </p>
                                                {person.current_occupation && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        {person.current_occupation}
                                                    </p>
                                                )}
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>

                                {/* Pagination */}
                                {meta.last_page > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-10">
                                        <button
                                            onClick={() => {
                                                if (meta.current_page > 1) {
                                                    const params = new URLSearchParams()
                                                    if (currentYear) params.set('year', currentYear.toString())
                                                    if (currentCategory) params.set('category', currentCategory)
                                                    params.set('page', (meta.current_page - 1).toString())
                                                    router.push(`/alumni?${params.toString()}`)
                                                }
                                            }}
                                            disabled={meta.current_page === 1}
                                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            aria-label="Halaman sebelumnya"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                                            Halaman {meta.current_page} dari {meta.last_page}
                                        </span>

                                        <button
                                            onClick={() => {
                                                if (meta.current_page < meta.last_page) {
                                                    const params = new URLSearchParams()
                                                    if (currentYear) params.set('year', currentYear.toString())
                                                    if (currentCategory) params.set('category', currentCategory)
                                                    params.set('page', (meta.current_page + 1).toString())
                                                    router.push(`/alumni?${params.toString()}`)
                                                }
                                            }}
                                            disabled={meta.current_page === meta.last_page}
                                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            aria-label="Halaman selanjutnya"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Tidak ada alumni
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Belum ada data alumni untuk filter ini.
                                </p>
                                <Link
                                    href="/alumni"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Lihat Semua Alumni
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
