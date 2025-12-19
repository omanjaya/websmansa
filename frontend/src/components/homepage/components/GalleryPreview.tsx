'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Camera, Images, ZoomIn } from 'lucide-react'
import type { Gallery } from '@/lib/api'

interface GalleryImage {
    id: number
    src: string
    title: string
    category: string
}

// Default gallery data for fallback
const defaultGalleryImages: GalleryImage[] = [
    { id: 1, src: '/gallery/1.jpg', title: 'Kegiatan MPLS 2025', category: 'Kegiatan' },
    { id: 2, src: '/gallery/2.jpg', title: 'Lomba Sains', category: 'Prestasi' },
    { id: 3, src: '/gallery/3.jpg', title: 'Pentas Seni', category: 'Seni' },
    { id: 4, src: '/gallery/4.jpg', title: 'Olahraga', category: 'Ekstrakurikuler' },
    { id: 5, src: '/gallery/5.jpg', title: 'Wisuda', category: 'Kegiatan' },
    { id: 6, src: '/gallery/6.jpg', title: 'Praktikum', category: 'Akademik' },
    { id: 7, src: '/gallery/7.jpg', title: 'Study Tour', category: 'Kegiatan' },
    { id: 8, src: '/gallery/8.jpg', title: 'Kompetisi Robotika', category: 'Teknologi' },
]

interface GalleryPreviewProps {
    galleries?: Gallery[]
}

export function GalleryPreview({ galleries: propGalleries }: GalleryPreviewProps) {
    // Process gallery data from props or use defaults
    const galleryImages: GalleryImage[] = (propGalleries && propGalleries.length > 0)
        ? propGalleries.flatMap(gallery =>
            gallery.items?.map(item => ({
                id: item.id,
                src: item.media?.url || '/gallery/default.jpg',
                title: item.caption || gallery.title || 'Gallery Image',
                category: gallery.title || 'Gallery',
            })) || [{
                id: gallery.id,
                src: gallery.thumbnail_url || '/gallery/default.jpg',
                title: gallery.title || 'Gallery',
                category: 'Gallery',
            }]
        )
        : defaultGalleryImages

    const ITEMS_PER_PAGE = 6
    const totalPages = Math.ceil(galleryImages.length / ITEMS_PER_PAGE)

    const [currentPage, setCurrentPage] = useState(0)
    const [selectedImage, setSelectedImage] = useState<number | null>(null)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Get current page items
    const currentItems = galleryImages.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    const changePage = useCallback((newPage: number) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentPage(newPage)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning])

    // Auto-advance page
    useEffect(() => {
        if (selectedImage !== null || totalPages <= 1) return

        const timer = setInterval(() => {
            changePage((currentPage + 1) % totalPages)
        }, 6000)

        return () => clearInterval(timer)
    }, [selectedImage, totalPages, currentPage, changePage])

    const goToPage = (page: number) => {
        changePage(page)
    }

    const goToPrevPage = () => {
        changePage((currentPage - 1 + totalPages) % totalPages)
    }

    const goToNextPage = () => {
        changePage((currentPage + 1) % totalPages)
    }

    const openLightbox = (index: number) => {
        const globalIndex = currentPage * ITEMS_PER_PAGE + index
        setSelectedImage(globalIndex)
    }

    const closeLightbox = useCallback(() => {
        setSelectedImage(null)
    }, [])

    const goToPrevImage = useCallback(() => {
        if (selectedImage === null) return
        setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)
    }, [selectedImage, galleryImages.length])

    const goToNextImage = useCallback(() => {
        if (selectedImage === null) return
        setSelectedImage((selectedImage + 1) % galleryImages.length)
    }, [selectedImage, galleryImages.length])

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (selectedImage === null) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowLeft') goToPrevImage()
            if (e.key === 'ArrowRight') goToNextImage()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedImage, closeLightbox, goToPrevImage, goToNextImage])

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white
                dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
                >
                    <div>
                        {/* Section Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800/50 mb-4">
                            <Camera className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                            <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                                Dokumentasi Kegiatan
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Galeri{' '}
                            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                Foto
                            </span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg max-w-xl">
                            Dokumentasi kegiatan dan prestasi siswa SMAN 1 Denpasar
                        </p>
                    </div>

                    <Link
                        href="/galeri"
                        className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline group"
                    >
                        <Images className="w-4 h-4" />
                        Lihat Semua Galeri
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Gallery Grid with Page Navigation */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {totalPages > 1 && (
                        <>
                            <button
                                onClick={goToPrevPage}
                                disabled={isTransitioning}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-110 -ml-6 disabled:opacity-50"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={goToNextPage}
                                disabled={isTransitioning}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-110 -mr-6 disabled:opacity-50"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Gallery Grid - Fixed 6 items per page in 3x2 grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 min-h-[400px] md:min-h-[500px]"
                        >
                            {currentItems.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                                    onClick={() => openLightbox(index)}
                                >
                                    {/* Image or Placeholder */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 to-teal-600/30" />

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
                                        opacity-0 group-hover:opacity-100 transition-all duration-300" />

                                    {/* Content on hover */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="text-cyan-400 text-xs font-medium mb-1">{image.category}</span>
                                        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{image.title}</h3>
                                    </div>

                                    {/* Zoom icon on hover */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <ZoomIn className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="px-2 py-1 text-[10px] font-medium rounded-lg
                                            bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white border border-white/30">
                                            {image.category}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Page Indicators */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 mt-10">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    disabled={isTransitioning}
                                    className="relative transition-all duration-300 ease-out p-1 disabled:opacity-50"
                                    aria-label={`Go to page ${i + 1}`}
                                >
                                    <span
                                        className={`block rounded-full transition-all duration-300
                                            ${currentPage === i
                                                ? 'w-10 h-3 bg-gradient-to-r from-cyan-500 to-teal-500'
                                                : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/galeri"
                        className="inline-flex items-center gap-3 px-8 py-4
                            bg-gradient-to-r from-cyan-600 to-teal-600
                            hover:from-cyan-700 hover:to-teal-700
                            text-white rounded-2xl font-semibold
                            shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30
                            hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                        Lihat Semua Galeri
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full
                                flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToPrevImage()
                            }}
                            className="absolute left-4 z-50 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full
                                flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToNextImage()
                            }}
                            className="absolute right-4 z-50 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full
                                flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full max-w-5xl aspect-video"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full rounded-3xl overflow-hidden
                                bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm
                                border border-white/20 dark:border-slate-700/50 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-teal-600/20" />
                            </div>
                            <div className="mt-6 text-center">
                                <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                                    <p className="text-cyan-400 text-sm font-medium mb-1">
                                        {galleryImages[selectedImage].category}
                                    </p>
                                    <h3 className="text-xl font-bold text-white">
                                        {galleryImages[selectedImage].title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {selectedImage + 1} / {galleryImages.length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
