'use client'

import { Gallery } from '@/lib/api'
import GalleryCard from './GalleryCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface GalleryGridProps {
    galleries: Gallery[]
    pagination: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

export default function GalleryGrid({
    galleries,
    pagination,
}: GalleryGridProps) {
    const searchParams = useSearchParams()
    const currentPage = pagination.current_page

    const buildPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        return `?${params.toString()}`
    }

    const pages = []
    const maxPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    const endPage = Math.min(pagination.last_page, startPage + maxPages - 1)

    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                    <GalleryCard key={gallery.id} gallery={gallery} />
                ))}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        {currentPage > 1 ? (
                            <Link
                                href={buildPageUrl(currentPage - 1)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </button>
                        )}

                        {/* Page Numbers */}
                        <div className="hidden md:flex items-center gap-2">
                            {startPage > 1 && (
                                <>
                                    <Link
                                        href={buildPageUrl(1)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        1
                                    </Link>
                                    {startPage > 2 && (
                                        <span className="px-2 text-gray-400">...</span>
                                    )}
                                </>
                            )}

                            {pages.map((page) => (
                                <Link
                                    key={page}
                                    href={buildPageUrl(page)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${page === currentPage
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </Link>
                            ))}

                            {endPage < pagination.last_page && (
                                <>
                                    {endPage < pagination.last_page - 1 && (
                                        <span className="px-2 text-gray-400">...</span>
                                    )}
                                    <Link
                                        href={buildPageUrl(pagination.last_page)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {pagination.last_page}
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Page Info */}
                        <div className="md:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg">
                            <span className="text-sm font-medium">
                                {currentPage} / {pagination.last_page}
                            </span>
                        </div>

                        {/* Next Button */}
                        {currentPage < pagination.last_page ? (
                            <Link
                                href={buildPageUrl(currentPage + 1)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="hidden sm:inline">Selanjutnya</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                            >
                                <span className="hidden sm:inline">Selanjutnya</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination Info */}
            <div className="mt-6 text-center text-sm text-gray-600">
                Menampilkan {galleries.length} dari {pagination.total} galeri
            </div>
        </div>
    )
}
