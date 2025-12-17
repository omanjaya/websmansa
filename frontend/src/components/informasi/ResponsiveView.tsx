'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Post, Category } from '@/lib/api'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

interface ResponsiveViewProps {
    posts: Post[]
    categories: Category[]
    currentCategory?: string
}

export function ResponsiveView({ posts, categories, currentCategory }: ResponsiveViewProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section - Enhanced */}
            <section className="relative -mt-16 lg:-mt-20 pt-28 lg:pt-32 pb-16 md:pb-24 hero-gradient overflow-hidden">
                {/* Decorative Elements */}
                <div className="hero-pattern" />
                <div className="decorative-grid" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                <div className="relative container mx-auto px-4">
                    <div className="max-w-3xl">
                        <span className="text-primary-200 font-bold tracking-wider uppercase text-sm flex items-center gap-2 mb-4">
                            <span className="w-10 h-[2px] bg-primary-300"></span>
                            Berita & Artikel
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Informasi
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            Berita dan informasi terbaru dari SMA Negeri 1 Denpasar
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Category Filter - Enhanced */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <Link
                                href="/informasi"
                                className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                                    !currentCategory
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                }`}
                            >
                                Semua
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/informasi?category=${category.slug}`}
                                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                                        currentCategory === category.slug
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Posts Grid - Enhanced */}
                    {posts.length > 0 ? (
                        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {posts.map((post, index) => (
                                <StaggerItem
                                    key={post.id}
                                    className={index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
                                >
                                    <Link
                                        href={`/informasi/${post.attributes.slug}`}
                                        className="group block h-full glass-card overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                    >
                                    {/* Image */}
                                    <div className={`relative overflow-hidden ${index === 0 ? 'h-48 sm:h-64 lg:h-80' : 'h-40 md:h-52'}`}>
                                        {post.attributes.featured_image ? (
                                            <Image
                                                src={post.attributes.featured_image}
                                                alt={post.attributes.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                                                <svg className="w-12 h-12 md:w-16 md:h-16 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                        {/* Category Badge */}
                                        {post.relationships.categories && post.relationships.categories[0] && (
                                            <div className="absolute top-3 left-3 md:top-4 md:left-4">
                                                <span className="px-3 py-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur text-blue-600 dark:text-blue-400 text-xs md:text-sm font-bold rounded-full shadow-lg">
                                                    {post.relationships.categories[0].name}
                                                </span>
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {post.attributes.is_featured && (
                                            <div className="absolute top-3 right-3 md:top-4 md:right-4">
                                                <span className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="hidden md:inline">Unggulan</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 md:p-6">
                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(post.attributes.published_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </div>

                                        {/* Title */}
                                        <h3 className={`font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3 ${
                                            index === 0 ? 'text-lg md:text-2xl' : 'text-base md:text-lg'
                                        }`}>
                                            {post.attributes.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className={`text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-3 mb-4 ${
                                            index === 0 ? 'text-sm md:text-base' : 'text-xs md:text-sm'
                                        }`}>
                                            {post.attributes.excerpt}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                                            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {post.attributes.views}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {post.attributes.likes}
                                                </span>
                                            </div>
                                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs md:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Baca
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    ) : (
                        // Empty State - Enhanced
                        <div className="text-center py-20 glass-card-strong">
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Tidak ada berita
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                Belum ada berita untuk kategori ini. Silakan pilih kategori lain atau kembali lagi nanti.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Spacing */}
            <div className="h-12 md:h-20" />
        </div>
    )
}
