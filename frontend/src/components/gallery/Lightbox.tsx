'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LightboxImage {
    id: number
    url: string
    caption?: string
    alt: string
    width?: number
    height?: number
}

interface LightboxProps {
    images: LightboxImage[]
    galleryTitle: string
}

export default function Lightbox({ images, galleryTitle }: LightboxProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [zoom, setZoom] = useState(1)

    const openLightbox = (index: number) => {
        setSelectedIndex(index)
        setZoom(1)
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = () => {
        setSelectedIndex(null)
        setZoom(1)
        document.body.style.overflow = 'auto'
    }

    const goToPrevious = useCallback(() => {
        if (selectedIndex === null) return
        setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
        setZoom(1)
    }, [selectedIndex, images.length])

    const goToNext = useCallback(() => {
        if (selectedIndex === null) return
        setSelectedIndex((selectedIndex + 1) % images.length)
        setZoom(1)
    }, [selectedIndex, images.length])

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.5, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.5, 0.5))
    }

    const handleDownload = () => {
        if (selectedIndex === null) return
        const image = images[selectedIndex]
        const link = document.createElement('a')
        link.href = image.url
        link.download = `${galleryTitle}-${selectedIndex + 1}.jpg`
        link.click()
    }

    // Keyboard navigation
    useEffect(() => {
        if (selectedIndex === null) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    closeLightbox()
                    break
                case 'ArrowLeft':
                    goToPrevious()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
                case '+':
                case '=':
                    handleZoomIn()
                    break
                case '-':
                    handleZoomOut()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedIndex, goToPrevious, goToNext])

    const selectedImage = selectedIndex !== null ? images[selectedIndex] : null

    return (
        <>
            {/* Masonry Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="break-inside-avoid group cursor-pointer"
                        onClick={() => openLightbox(index)}
                    >
                        <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300">
                            <div className="relative aspect-auto">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={image.width || 800}
                                    height={image.height || 600}
                                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    {image.caption && (
                                        <p className="text-white text-sm font-medium line-clamp-2">
                                            {image.caption}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center justify-center">
                                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                            <ZoomIn className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && selectedIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
                    {/* Controls Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
                        <div className="container mx-auto flex items-center justify-between">
                            {/* Counter */}
                            <div className="text-white font-medium">
                                {selectedIndex + 1} / {images.length}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Zoom Out (-)"
                                >
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Zoom In (+)"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={closeLightbox}
                                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                    title="Close (Esc)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div
                            className="relative max-w-7xl max-h-full overflow-auto"
                            style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s' }}
                        >
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.alt}
                                width={selectedImage.width || 1920}
                                height={selectedImage.height || 1080}
                                className="max-w-full max-h-[90vh] object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors z-10"
                        title="Previous (←)"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors z-10"
                        title="Next (→)"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Caption */}
                    {selectedImage.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="container mx-auto text-center">
                                <p className="text-white text-lg">{selectedImage.caption}</p>
                            </div>
                        </div>
                    )}

                    {/* Thumbnails */}
                    <div className="absolute bottom-20 left-0 right-0 overflow-x-auto">
                        <div className="flex gap-2 px-4 pb-4 justify-center">
                            {images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => {
                                        setSelectedIndex(index)
                                        setZoom(1)
                                    }}
                                    className={cn(
                                        'relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                                        index === selectedIndex
                                            ? 'border-white scale-110'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    )}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
