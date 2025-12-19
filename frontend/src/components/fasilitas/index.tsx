'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, MapPin, Users, Eye, ChevronLeft, ChevronRight, X, Compass, Info, ArrowRight } from 'lucide-react'
import { Facility } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
} from '@/components/shared/Animations'
import {
    DotPattern,
    FloatingShapes,
    GlowSpot,
    Waves,
    HexagonPattern,
} from '@/components/shared/Decorations'

interface FasilitasPageProps {
    facilities: Facility[]
    categories: string[]
    currentCategory?: string
}

const categoryLabels: Record<string, string> = {
    pembelajaran: 'Pembelajaran',
    olahraga: 'Olahraga',
    laboratorium: 'Laboratorium',
    pendukung: 'Pendukung',
    ibadah: 'Ibadah',
}

// Virtual Tour Component
interface VirtualTourProps {
    facilities: Facility[]
}

function VirtualTour({ facilities }: VirtualTourProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [showInfo, setShowInfo] = useState(false)

    const nextFacility = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % facilities.length)
    }, [facilities.length])

    const prevFacility = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + facilities.length) % facilities.length)
    }, [facilities.length])

    // Auto-advance
    useEffect(() => {
        if (!isAutoPlaying || facilities.length <= 1) return
        const interval = setInterval(nextFacility, 5000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, nextFacility, facilities.length])

    if (facilities.length === 0) return null

    const current = facilities[currentIndex]

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Main Image with 360 effect simulation */}
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        {current.attributes?.images?.[0] ? (
                            <Image
                                src={current.attributes.images[0]}
                                alt={current.attributes?.name || 'Fasilitas'}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-teal-600" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* 360 Rotation Indicator */}
                <motion.div
                    className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                    <Compass className="w-4 h-4 text-white" />
                </motion.div>
                <span className="absolute top-4 left-16 text-white/80 text-sm font-medium">Virtual Tour</span>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`info-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 rounded-full text-white font-medium text-sm mb-3">
                            <Building2 className="w-4 h-4" />
                            {categoryLabels[current.attributes?.category || ''] || current.attributes?.category}
                        </span>
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
                            {current.attributes?.name}
                        </h3>
                        <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-2">
                            {current.attributes?.description?.slice(0, 150)}...
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    {/* Dots */}
                    <div className="flex items-center gap-2">
                        {facilities.slice(0, 8).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all ${index === currentIndex
                                    ? 'w-10 h-2 bg-blue-500 rounded-full'
                                    : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                                    }`}
                                aria-label={`Lihat fasilitas ${index + 1}`}
                            />
                        ))}
                        {facilities.length > 8 && (
                            <span className="text-white/60 text-sm ml-2">+{facilities.length - 8}</span>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${showInfo ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'
                                }`}
                            aria-label="Tampilkan info"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                        <button
                            onClick={prevFacility}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                            aria-label="Fasilitas sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextFacility}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                            aria-label="Fasilitas selanjutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <Link
                            href={`/fasilitas/${current.attributes?.slug || current.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-colors"
                        >
                            Lihat <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute top-16 right-4 w-72 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4"
                    >
                        <h4 className="font-bold text-slate-900 mb-2">{current.attributes?.name}</h4>
                        <p className="text-sm text-slate-600 mb-3">{current.attributes?.description?.slice(0, 200)}...</p>
                        {current.attributes?.capacity && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Users className="w-4 h-4" />
                                Kapasitas: {current.attributes.capacity} orang
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: isAutoPlaying ? '100%' : '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    key={`${currentIndex}-${isAutoPlaying}`}
                />
            </div>
        </motion.div>
    )
}

export function FasilitasPage({ facilities, categories, currentCategory }: FasilitasPageProps) {
    const router = useRouter()

    // Convert categories to filter format
    const filterOptions = Object.entries(categoryLabels).map(([value, label]) => ({
        label,
        value,
    }))

    // Handle filter change
    const handleFilterChange = (value: string) => {
        if (value) {
            router.push(`/fasilitas?category=${value}`)
        } else {
            router.push('/fasilitas')
        }
    }

    const filteredFacilities = currentCategory
        ? facilities.filter((f) => f.attributes?.category === currentCategory)
        : facilities

    // Group facilities
    const featuredFacilities = filteredFacilities.filter((f) => f.attributes?.is_featured)
    const regularFacilities = filteredFacilities.filter((f) => !f.attributes?.is_featured)

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-blue-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-teal-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Fasilitas"
                    subtitle="Sarana dan prasarana modern untuk mendukung proses pembelajaran"
                    badge={{
                        icon: Building2,
                        label: 'Sarana Prasarana',
                        color: 'blue',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Fasilitas', href: '/fasilitas' },
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
                    {/* Virtual Tour - Show when no filter active */}
                    {!currentCategory && facilities.length > 0 && (
                        <FadeInOnScroll delay={0.1} className="mb-10">
                            <SectionTitle
                                badge={{ icon: Eye, label: 'Virtual Tour', color: 'blue' }}
                                title="Jelajahi"
                                gradientText="Fasilitas"
                                subtitle="Tur virtual untuk melihat fasilitas sekolah secara interaktif"
                                align="center"
                            />
                            <VirtualTour facilities={facilities.slice(0, 10)} />
                        </FadeInOnScroll>
                    )}

                    {/* Filter Bar */}
                    <FadeInOnScroll delay={0.1} className="mb-8 md:mb-10">
                        <FilterBar
                            filters={filterOptions}
                            currentFilter={currentCategory}
                            onFilterChange={handleFilterChange}
                            showSearch={false}
                            showAllOption={true}
                            allLabel="Semua"
                        />
                    </FadeInOnScroll>

                    {/* Featured Facilities */}
                    {featuredFacilities.length > 0 && !currentCategory && (
                        <div className="mb-12">
                            <SectionTitle
                                badge={{ icon: Building2, label: 'Unggulan', color: 'gold' }}
                                title="Fasilitas"
                                gradientText="Unggulan"
                                align="left"
                                className="mb-6"
                            />
                            <div className="grid md:grid-cols-2 gap-6">
                                {featuredFacilities.slice(0, 2).map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Link
                                            href={`/fasilitas/${item.attributes?.slug || item.slug}`}
                                            className="group relative block bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-700 hover:-translate-y-2"
                                        >
                                            {/* Image */}
                                            <div className="relative h-56 md:h-72 overflow-hidden">
                                                {item.attributes?.images?.[0] ? (
                                                    <Image
                                                        src={item.attributes.images[0]}
                                                        alt={item.attributes?.name || item.name || 'Fasilitas'}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                                                        <Building2 className="w-16 h-16 text-blue-300 dark:text-blue-600" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                        {categoryLabels[item.attributes?.category || ''] || item.attributes?.category}
                                                    </span>
                                                </div>

                                                {/* Content Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                                                        {item.attributes?.name || item.name}
                                                    </h3>
                                                    <p className="text-white/80 text-sm md:text-base line-clamp-2">
                                                        {item.attributes?.short_description || item.attributes?.description}
                                                    </p>

                                                    {/* Amenities */}
                                                    {item.attributes?.amenities && item.attributes.amenities.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {item.attributes.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                                                <span key={idx} className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                            {item.attributes.amenities.length > 3 && (
                                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                                    +{item.attributes.amenities.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular Facilities Grid */}
                    <div>
                        {!currentCategory && regularFacilities.length > 0 && (
                            <SectionTitle
                                title="Semua"
                                gradientText="Fasilitas"
                                align="left"
                                className="mb-6"
                            />
                        )}

                        {(currentCategory ? filteredFacilities : regularFacilities).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {(currentCategory ? filteredFacilities : regularFacilities).map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.05 * (index % 6) }}
                                    >
                                        <Link
                                            href={`/fasilitas/${item.attributes?.slug || item.slug}`}
                                            className="group block bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1"
                                        >
                                            {/* Image */}
                                            <div className="relative h-40 md:h-48 overflow-hidden">
                                                {item.attributes?.images?.[0] ? (
                                                    <Image
                                                        src={item.attributes.images[0]}
                                                        alt={item.attributes?.name || item.name || 'Fasilitas'}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                                        <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                )}

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full shadow">
                                                        {categoryLabels[item.attributes?.category || ''] || item.attributes?.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 md:p-5">
                                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {item.attributes?.name || item.name}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                                    {item.attributes?.short_description || item.attributes?.description}
                                                </p>

                                                {/* Meta */}
                                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                                    {item.attributes?.capacity && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            {item.attributes.capacity}
                                                        </span>
                                                    )}
                                                    {item.attributes?.location && (
                                                        <span className="flex items-center gap-1 truncate">
                                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                                            <span className="truncate">{item.attributes.location}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Building2 className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Tidak ada fasilitas
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Belum ada fasilitas untuk kategori ini.
                                </p>
                                <Link
                                    href="/fasilitas"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Lihat Semua Fasilitas
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
