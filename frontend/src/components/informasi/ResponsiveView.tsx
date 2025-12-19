'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Clock, Eye, ArrowRight, Calendar, TrendingUp } from 'lucide-react'
import type { Post, Category } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import {
    StaggerContainer,
    StaggerItem,
    FadeInOnScroll,
    HoverScale,
} from '@/components/shared/Animations'
import {
    CardSkeleton,
    ArticleListSkeleton,
} from '@/components/shared/Skeletons'
import {
    GradientBorderCard,
    AnimatedImageCard,
    FeatureCard,
} from '@/components/shared/EnhancedCards'
import {
    FloatingShapes,
    GradientOrbs,
    Waves,
    DotPattern,
    HexagonPattern,
    GlowSpot,
} from '@/components/shared/Decorations'
import {
    MobileFilterSheet,
} from '@/components/shared/MobileFilter'

interface ResponsiveViewProps {
    posts: Post[]
    categories: Category[]
    currentCategory?: string
}

// Format date helper
function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

// Featured Post Card Component
function FeaturedPostCard({ post, index }: { post: Post; index: number }) {
    const imageUrl = post.attributes.featured_image || '/placeholder.jpg'
    const category = post.relationships?.categories?.[0]?.name || 'Berita'

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={`/informasi/${post.attributes.slug}`}>
                <div className="relative aspect-[21/9] md:aspect-[21/8] rounded-2xl md:rounded-3xl overflow-hidden">
                    {/* Image with parallax effect */}
                    <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src={imageUrl}
                            alt={post.attributes.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 80vw"
                            priority
                        />
                    </motion.div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-10">
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TrendingUp className="w-3.5 h-3.5 text-white" />
                            <span className="text-xs font-bold text-white uppercase tracking-wide">
                                {category}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {post.attributes.title}
                        </motion.h2>

                        {/* Excerpt */}
                        <motion.p
                            className="text-sm md:text-base text-white/80 line-clamp-2 max-w-3xl mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {post.attributes.excerpt}
                        </motion.p>

                        {/* Meta */}
                        <motion.div
                            className="flex flex-wrap items-center gap-4 text-sm text-white/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.attributes.published_at)}</span>
                            </div>
                            {post.meta?.reading_time && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.meta.reading_time} menit</span>
                                </div>
                            )}
                            {post.attributes.views > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.attributes.views.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-blue-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="font-medium">Baca selengkapnya</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-2 ring-white/0 group-hover:ring-blue-500/50 transition-all duration-500" />
                </div>
            </Link>
        </motion.article>
    )
}

// Regular Post Card Component
function PostCard({ post, index }: { post: Post; index: number }) {
    const imageUrl = post.attributes.featured_image || '/placeholder.jpg'
    const category = post.relationships?.categories?.[0]?.name || 'Berita'

    return (
        <motion.article
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
                type: 'spring',
                stiffness: 100,
            }}
            className="group h-full"
        >
            <Link href={`/informasi/${post.attributes.slug}`} className="block h-full">
                <div className="relative h-full bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                        <motion.div
                            className="absolute inset-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                src={imageUrl}
                                alt={post.attributes.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </motion.div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-full">
                                {category}
                            </span>
                        </div>

                        {/* Quick read indicator */}
                        {post.meta?.reading_time && post.meta.reading_time <= 3 && (
                            <div className="absolute top-3 right-3">
                                <span className="px-2.5 py-1 bg-green-500/90 backdrop-blur-sm text-xs font-semibold text-white rounded-full">
                                    Quick Read
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-5">
                        {/* Title */}
                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.attributes.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                            {post.attributes.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{formatDate(post.attributes.published_at)}</span>
                                </div>
                                {post.meta?.reading_time && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{post.meta.reading_time}m</span>
                                    </div>
                                )}
                            </div>

                            {/* Arrow on hover */}
                            <div className="flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="font-medium">Baca</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom gradient line on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
            </Link>
        </motion.article>
    )
}

export function ResponsiveView({ posts, categories, currentCategory }: ResponsiveViewProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [isLoading, setIsLoading] = useState(false)

    // Convert categories to filter format - filter out any with empty names
    const filterOptions = categories
        .filter(cat => cat.name && cat.name.trim() !== '')
        .map(cat => ({
            label: cat.name,
            value: cat.slug,
        }))

    // Handle filter change with loading animation
    const handleFilterChange = (value: string) => {
        setIsLoading(true)
        if (value) {
            router.push(`/informasi?category=${value}`)
        } else {
            router.push('/informasi')
        }
        // Simulate loading state
        setTimeout(() => setIsLoading(false), 500)
    }

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (query) {
            router.push(`/informasi?search=${encodeURIComponent(query)}`)
        } else {
            router.push('/informasi')
        }
    }

    // Get featured post (first one if exists)
    const featuredPost = posts.find(p => p.attributes.is_featured) || posts[0]
    const otherPosts = posts.filter(p => p !== featuredPost)

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header so hero background shows behind it
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations - extends across entire page for seamless effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-blue-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-purple-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section with enhanced decorations */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Informasi"
                    subtitle="Berita dan informasi terbaru dari SMA Negeri 1 Denpasar"
                    badge={{
                        icon: Newspaper,
                        label: 'Berita & Artikel',
                        color: 'blue',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Informasi', href: '/informasi' },
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
                    {/* Filter Bar - Desktop */}
                    <FadeInOnScroll delay={0.2} className="mb-8 md:mb-10">
                        <div className="hidden md:block">
                            <FilterBar
                                filters={filterOptions}
                                currentFilter={currentCategory}
                                onFilterChange={handleFilterChange}
                                searchPlaceholder="Cari berita..."
                                searchValue={searchQuery}
                                onSearchChange={handleSearch}
                                showSearch={true}
                                showAllOption={true}
                                allLabel="Semua"
                            />
                        </div>

                        {/* Mobile Filter */}
                        <div className="md:hidden flex gap-3">
                            <MobileFilterSheet
                                filters={filterOptions}
                                currentFilter={currentCategory}
                                onFilterChange={handleFilterChange}
                                title="Kategori"
                                showSearch={true}
                                searchPlaceholder="Cari berita..."
                                searchValue={searchQuery}
                                onSearchChange={handleSearch}
                            />
                        </div>
                    </FadeInOnScroll>

                    {/* Posts Content with AnimatePresence for filter transitions */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                            >
                                {[...Array(6)].map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </motion.div>
                        ) : posts.length > 0 ? (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8 md:space-y-10"
                            >
                                {/* Featured Post */}
                                {featuredPost && (
                                    <FeaturedPostCard post={featuredPost} index={0} />
                                )}

                                {/* Section Title */}
                                {otherPosts.length > 0 && (
                                    <FadeInOnScroll delay={0.2}>
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                                Berita Lainnya
                                            </h2>
                                            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" />
                                        </div>
                                    </FadeInOnScroll>
                                )}

                                {/* Other Posts Grid with stagger animation */}
                                {otherPosts.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {otherPosts.map((post, index) => (
                                            <PostCard key={post.id} post={post} index={index} />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            // Empty State with enhanced design
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative text-center py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                            >
                                {/* Background decoration */}
                                <GradientOrbs className="opacity-20" />

                                <div className="relative z-10">
                                    <motion.div
                                        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity
                                        }}
                                    >
                                        <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        Tidak ada berita
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                        Belum ada berita untuk kategori ini. Silakan pilih kategori lain atau kembali lagi nanti.
                                    </p>
                                    <Link
                                        href="/informasi"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                                    >
                                        Lihat Semua Berita
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
