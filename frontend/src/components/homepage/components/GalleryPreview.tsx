'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
    id: number
    url: string
    title: string
    category?: string
}

// Dummy data - will be replaced with real API data
const galleryImages: GalleryImage[] = [
    { id: 1, url: '/gallery/1.jpg', title: 'Kegiatan MPLS 2025', category: 'Kegiatan' },
    { id: 2, url: '/gallery/2.jpg', title: 'Lomba Sains', category: 'Prestasi' },
    { id: 3, url: '/gallery/3.jpg', title: 'Pentas Seni', category: 'Seni' },
    { id: 4, url: '/gallery/4.jpg', title: 'Olahraga', category: 'Ekstrakurikuler' },
    { id: 5, url: '/gallery/5.jpg', title: 'Wisuda', category: 'Kegiatan' },
    { id: 6, url: '/gallery/6.jpg', title: 'Praktikum', category: 'Akademik' },
]

export function GalleryPreview() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const openLightbox = (index: number) => {
        setSelectedImage(index)
    }

    const closeLightbox = () => {
        setSelectedImage(null)
    }

    const goToPrevious = () => {
        if (selectedImage === null) return
        setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)
    }

    const goToNext = () => {
        if (selectedImage === null) return
        setSelectedImage((selectedImage + 1) % galleryImages.length)
    }

    return (
        <section className="py-20 bg-white dark:bg-slate-950">
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
                        Galeri Kegiatan
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Dokumentasi kegiatan dan prestasi siswa SMAN 1 Denpasar
                    </p>
                </motion.div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                            onClick={() => openLightbox(index)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {image.category && (
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="text-xs px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-800 dark:text-slate-200 rounded-full font-medium">
                                        {image.category}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/galeri"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
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
                            className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToPrevious()
                            }}
                            className="absolute left-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToNext()
                            }}
                            className="absolute right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>

                        {/* Image */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full max-w-5xl aspect-video"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-xl font-bold text-white">
                                    {galleryImages[selectedImage].title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {selectedImage + 1} / {galleryImages.length}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
