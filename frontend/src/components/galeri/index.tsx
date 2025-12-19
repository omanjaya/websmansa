'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Image as ImageIcon, Play, ChevronLeft, ChevronRight, X, Maximize2, ZoomIn, Download, Pause } from 'lucide-react'
import { Gallery } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
    TiltCard,
} from '@/components/shared/Animations'
import {
    DotPattern,
    FloatingShapes,
    GlowSpot,
    Waves,
    HexagonPattern,
} from '@/components/shared/Decorations'

interface GaleriPageProps {
    galleries: Gallery[]
    stats: {
        total: number
        photo: number
        video: number
    }
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    search?: string
}

// Fullscreen Lightbox Component
interface FullscreenLightboxProps {
    images: { src: string; title: string }[]
    currentIndex: number
    isOpen: boolean
    onClose: () => void
    onNavigate: (index: number) => void
}

function FullscreenLightbox({ images, currentIndex, isOpen, onClose, onNavigate }: FullscreenLightboxProps) {
    const [isZoomed, setIsZoomed] = useState(false)
    const [isAutoPlaying, setIsAutoPlaying] = useState(false)

    const nextImage = useCallback(() => {
        onNavigate((currentIndex + 1) % images.length)
        setIsZoomed(false)
    }, [currentIndex, images.length, onNavigate])

    const prevImage = useCallback(() => {
        onNavigate((currentIndex - 1 + images.length) % images.length)
        setIsZoomed(false)
    }, [currentIndex, images.length, onNavigate])

    // Auto-play slideshow
    useEffect(() => {
        if (!isOpen || !isAutoPlaying || images.length <= 1) return
        const interval = setInterval(nextImage, 4000)
        return () => clearInterval(interval)
    }, [isOpen, isAutoPlaying, nextImage, images.length])

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') nextImage()
            if (e.key === 'ArrowLeft') prevImage()
            if (e.key === ' ') { e.preventDefault(); setIsAutoPlaying(p => !p) }
        }

        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, nextImage, prevImage, onClose])

    if (!isOpen || images.length === 0) return null

    const currentImage = images[currentIndex]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                    <div className="text-white">
                        <h3 className="font-medium text-lg">{currentImage.title}</h3>
                        <p className="text-white/60 text-sm">{currentIndex + 1} / {images.length}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying) }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${isAutoPlaying ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'
                                }`}
                            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        >
                            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed) }}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Toggle zoom"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <a
                            href={currentImage.src}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Download gambar"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Tutup lightbox"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Image */}
                <div
                    className="absolute inset-0 flex items-center justify-center p-16"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <Image
                                src={currentImage.src}
                                alt={currentImage.title}
                                width={isZoomed ? 1920 : 1200}
                                height={isZoomed ? 1080 : 800}
                                className={`object-contain max-h-[80vh] w-auto transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                                    }`}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage() }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Gambar sebelumnya"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage() }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Gambar selanjutnya"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-4xl mx-auto pb-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); onNavigate(index); setIsZoomed(false) }}
                                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${index === currentIndex
                                        ? 'ring-2 ring-white scale-110'
                                        : 'opacity-50 hover:opacity-80'
                                        }`}
                                    aria-label={`Lihat gambar ${index + 1}`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.title}
                                        width={64}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

export function GaleriPage({ galleries, stats, meta, search }: GaleriPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(search || '')
    const [currentType, setCurrentType] = useState(searchParams.get('type') || '')

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    // Prepare images for lightbox
    const lightboxImages = galleries
        .filter(g => g.type === 'photo')
        .map(g => ({
            src: g.thumbnail_url || g.thumbnail || '/hero-bg.png',
            title: g.title
        }))

    // Filter options
    const filterOptions = [
        { label: 'Foto', value: 'photo', count: stats.photo },
        { label: 'Video', value: 'video', count: stats.video },
    ]

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setCurrentType(value)
        const params = new URLSearchParams()
        if (value) params.set('type', value)
        if (searchQuery) params.set('search', searchQuery)
        router.push(`/galeri${params.toString() ? '?' + params.toString() : ''}`)
    }

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        const params = new URLSearchParams()
        if (currentType) params.set('type', currentType)
        if (query) params.set('search', query)
        router.push(`/galeri${params.toString() ? '?' + params.toString() : ''}`)
    }

    // Stats with icons
    const heroStats = [
        { label: 'Total Galeri', value: stats.total.toString() },
        { label: 'Foto', value: stats.photo.toString() },
        { label: 'Video', value: stats.video.toString() },
    ]

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-purple-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-pink-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Galeri Sekolah"
                    subtitle="Dokumentasi kegiatan dan momen berharga di SMA Negeri 1 Denpasar"
                    badge={{
                        icon: Camera,
                        label: 'Dokumentasi',
                        color: 'purple',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    stats={heroStats}
                    breadcrumbs={[
                        { label: 'Galeri', href: '/galeri' },
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
                    {/* Filter Bar */}
                    <FadeInOnScroll delay={0.1} className="mb-8 md:mb-10">
                        <FilterBar
                            filters={filterOptions}
                            currentFilter={currentType}
                            onFilterChange={handleFilterChange}
                            searchPlaceholder="Cari galeri..."
                            searchValue={searchQuery}
                            onSearchChange={handleSearch}
                            showSearch={true}
                            showAllOption={true}
                            allLabel="Semua"
                        />
                    </FadeInOnScroll>

                    {/* Gallery Grid */}
                    {galleries.length > 0 ? (
                        <>
                            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {galleries.map((gallery) => (
                                    <StaggerItem key={gallery.id}>
                                        <TiltCard intensity={0.15} className="block">
                                            <Link
                                                href={`/galeri/${gallery.slug}`}
                                                className="group block"
                                            >
                                                <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                    {(gallery.thumbnail_url || gallery.thumbnail) ? (
                                                        <Image
                                                            src={gallery.thumbnail_url || gallery.thumbnail || ''}
                                                            alt={gallery.title}
                                                            fill
                                                            className="object-cover transition-all duration-500 group-hover:scale-110"
                                                            sizes="(max-width: 768px) 50vw, 25vw"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                                                            <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                                        </div>
                                                    )}

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                                    {/* Video indicator */}
                                                    {gallery.type === 'video' && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                                                <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-1" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Item count */}
                                                    {gallery.items_count && gallery.items_count > 1 && (
                                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full">
                                                            <ImageIcon className="w-3 h-3 text-white" />
                                                            <span className="text-xs font-medium text-white">{gallery.items_count}</span>
                                                        </div>
                                                    )}

                                                    {/* Title */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                                        <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2 drop-shadow-lg group-hover:text-blue-200 transition-colors">
                                                            {gallery.title}
                                                        </h3>
                                                    </div>

                                                    {/* Hover glow */}
                                                    <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/30 rounded-xl md:rounded-2xl transition-all duration-300" />
                                                </div>
                                            </Link>
                                        </TiltCard>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            {/* Pagination */}
                            {meta.last_page > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-10">
                                    {/* Prev */}
                                    <button
                                        onClick={() => {
                                            if (meta.current_page > 1) {
                                                const params = new URLSearchParams(searchParams.toString())
                                                params.set('page', (meta.current_page - 1).toString())
                                                router.push(`/galeri?${params.toString()}`)
                                            }
                                        }}
                                        disabled={meta.current_page === 1}
                                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        aria-label="Halaman sebelumnya"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {/* Pages */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                                            .filter(page => {
                                                // Show first, last, and pages around current
                                                if (page === 1 || page === meta.last_page) return true
                                                if (Math.abs(page - meta.current_page) <= 1) return true
                                                return false
                                            })
                                            .map((page, index, arr) => {
                                                // Add ellipsis
                                                const showEllipsisBefore = index > 0 && page > arr[index - 1] + 1
                                                return (
                                                    <div key={page} className="flex items-center">
                                                        {showEllipsisBefore && (
                                                            <span className="px-2 text-slate-400">...</span>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                const params = new URLSearchParams(searchParams.toString())
                                                                params.set('page', page.toString())
                                                                router.push(`/galeri?${params.toString()}`)
                                                            }}
                                                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === meta.current_page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                    </div>

                                    {/* Next */}
                                    <button
                                        onClick={() => {
                                            if (meta.current_page < meta.last_page) {
                                                const params = new URLSearchParams(searchParams.toString())
                                                params.set('page', (meta.current_page + 1).toString())
                                                router.push(`/galeri?${params.toString()}`)
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
                                <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Galeri Tidak Ditemukan
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                {search
                                    ? `Tidak ada galeri yang cocok dengan pencarian "${search}"`
                                    : 'Belum ada galeri yang ditambahkan'}
                            </p>
                            <Link
                                href="/galeri"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                Lihat Semua Galeri
                            </Link>
                        </motion.div>
                    )}
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />

            {/* Fullscreen Lightbox */}
            <FullscreenLightbox
                images={lightboxImages}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={setLightboxIndex}
            />

            {/* Fullscreen Mode Button - Fixed Bottom Right */}
            {lightboxImages.length > 0 && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => { setLightboxOpen(true); setLightboxIndex(0) }}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                    aria-label="Mode layar penuh"
                >
                    <Maximize2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Layar Penuh</span>
                </motion.button>
            )}
        </div>
    )
}
