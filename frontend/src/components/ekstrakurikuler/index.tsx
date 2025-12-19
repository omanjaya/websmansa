'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Users, Calendar, Trophy, Award, Star } from 'lucide-react'
import { Extra } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
    ConfettiTrigger,
    MedalShine,
} from '@/components/shared/Animations'
import {
    DotPattern,
    GlowSpot,
    Waves,
} from '@/components/shared/Decorations'

interface EkstrakurikulerPageProps {
    extras: Extra[]
    categories: string[]
    currentCategory?: string
}

const categoryLabels: Record<string, string> = {
    olahraga: 'Olahraga',
    seni: 'Seni & Budaya',
    akademik: 'Akademik',
    sosial: 'Sosial',
    teknologi: 'Teknologi',
    keagamaan: 'Keagamaan',
}

export function EkstrakurikulerPage({ extras, categories, currentCategory }: EkstrakurikulerPageProps) {
    const router = useRouter()

    // Convert categories to filter format
    const filterOptions = categories.map(cat => ({
        label: categoryLabels[cat] || cat,
        value: cat,
    }))

    // Handle filter change
    const handleFilterChange = (value: string) => {
        if (value) {
            router.push(`/ekstrakurikuler?category=${value}`)
        } else {
            router.push('/ekstrakurikuler')
        }
    }

    // Group by featured
    const featuredExtras = extras.filter(e => e.attributes?.is_featured)
    const regularExtras = extras.filter(e => !e.attributes?.is_featured)

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
                    title="Ekstrakurikuler"
                    subtitle="Wadah pengembangan bakat, minat, dan kreativitas siswa"
                    badge={{
                        icon: Sparkles,
                        label: 'Kegiatan Siswa',
                        color: 'purple',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Ekstrakurikuler', href: '/ekstrakurikuler' },
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
                            currentFilter={currentCategory}
                            onFilterChange={handleFilterChange}
                            searchPlaceholder="Cari ekstrakurikuler..."
                            showSearch={true}
                            showAllOption={true}
                            allLabel="Semua"
                        />
                    </FadeInOnScroll>

                    {/* Achievement Showcase Banner */}
                    {!currentCategory && (
                        <FadeInOnScroll delay={0.2} className="mb-10">
                            <ConfettiTrigger
                                trigger="hover"
                                colors={['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']}
                                particleCount={30}
                            >
                                <motion.div
                                    className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 md:p-8"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {/* Animated background patterns */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <motion.div
                                            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                                            transition={{ duration: 10, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 8, repeat: Infinity }}
                                        />
                                    </div>

                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        {/* Left - Trophy Icon */}
                                        <div className="flex items-center gap-4">
                                            <MedalShine>
                                                <motion.div
                                                    className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30"
                                                    animate={{
                                                        rotate: [0, -5, 5, -5, 0],
                                                    }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                >
                                                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                                </motion.div>
                                            </MedalShine>
                                            <div className="text-white">
                                                <h3 className="text-xl md:text-2xl font-bold mb-1">
                                                    Prestasi Ekstrakurikuler
                                                </h3>
                                                <p className="text-white/80 text-sm md:text-base">
                                                    Raih prestasi gemilang bersama ekskul unggulan kami
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right - Stats */}
                                        <div className="flex items-center gap-4 md:gap-8">
                                            <motion.div
                                                className="text-center"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <motion.div
                                                    className="text-2xl md:text-3xl font-bold text-white"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    50+
                                                </motion.div>
                                                <div className="text-xs md:text-sm text-white/70">Prestasi</div>
                                            </motion.div>
                                            <div className="w-px h-10 bg-white/20" />
                                            <motion.div
                                                className="text-center"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <motion.div
                                                    className="text-2xl md:text-3xl font-bold text-white"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    20+
                                                </motion.div>
                                                <div className="text-xs md:text-sm text-white/70">Ekskul</div>
                                            </motion.div>
                                            <div className="w-px h-10 bg-white/20 hidden md:block" />
                                            <motion.div
                                                className="text-center hidden md:block"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <motion.div
                                                    className="text-2xl md:text-3xl font-bold text-white"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    1000+
                                                </motion.div>
                                                <div className="text-xs md:text-sm text-white/70">Anggota</div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Stars decoration */}
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute text-white/20"
                                            style={{
                                                top: `${15 + i * 15}%`,
                                                left: `${10 + i * 20}%`,
                                            }}
                                            animate={{
                                                opacity: [0.2, 0.6, 0.2],
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 2 + i * 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                            }}
                                        >
                                            <Star className="w-4 h-4" fill="currentColor" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </ConfettiTrigger>
                        </FadeInOnScroll>
                    )}

                    {/* Featured Section */}
                    {featuredExtras.length > 0 && !currentCategory && (
                        <div className="mb-12">
                            <SectionTitle
                                badge={{ icon: Sparkles, label: 'Unggulan', color: 'gold' }}
                                title="Ekskul"
                                gradientText="Unggulan"
                                align="left"
                                className="mb-6"
                            />
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredExtras.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Link
                                            href={`/ekstrakurikuler/${item.attributes?.slug || item.slug}`}
                                            className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-700 hover:-translate-y-2"
                                        >
                                            {/* Image */}
                                            <div className="relative h-48 md:h-56 overflow-hidden">
                                                {item.attributes?.image ? (
                                                    <Image
                                                        src={item.attributes.image}
                                                        alt={item.attributes?.name || item.name || 'Ekstrakurikuler'}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                                                        <Sparkles className="w-16 h-16 text-purple-300 dark:text-purple-600" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                        {categoryLabels[item.attributes?.category || ''] || item.attributes?.category}
                                                    </span>
                                                </div>

                                                {/* Featured Badge */}
                                                <div className="absolute top-4 right-4">
                                                    <span className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        Unggulan
                                                    </span>
                                                </div>

                                                {/* Title on Image */}
                                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                                                        {item.attributes?.name || item.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-5">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                                    {item.attributes?.short_description || item.attributes?.description}
                                                </p>

                                                {/* Meta */}
                                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                                    {item.attributes?.member_count && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            {item.attributes.member_count} Anggota
                                                        </span>
                                                    )}
                                                    {item.attributes?.schedule && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {item.attributes.schedule}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Ekstrakurikuler Grid */}
                    <div>
                        {!currentCategory && regularExtras.length > 0 && featuredExtras.length > 0 && (
                            <SectionTitle
                                title="Semua"
                                gradientText="Ekstrakurikuler"
                                align="left"
                                className="mb-6"
                            />
                        )}

                        {(currentCategory ? extras : regularExtras).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {(currentCategory ? extras : regularExtras).map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.05 * (index % 8) }}
                                    >
                                        <Link
                                            href={`/ekstrakurikuler/${item.attributes?.slug || item.slug}`}
                                            className="group block bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1"
                                        >
                                            {/* Image */}
                                            <div className="relative h-36 md:h-44 overflow-hidden">
                                                {item.attributes?.image ? (
                                                    <Image
                                                        src={item.attributes.image}
                                                        alt={item.attributes?.name || item.name || 'Ekstrakurikuler'}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                                        <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                )}

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full shadow">
                                                        {categoryLabels[item.attributes?.category || ''] || item.attributes?.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                                                    {item.attributes?.name || item.name}
                                                </h3>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                                    {item.attributes?.short_description || item.attributes?.description}
                                                </p>

                                                {/* Meta */}
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
                                                    {item.attributes?.member_count && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {item.attributes.member_count}
                                                        </span>
                                                    )}
                                                    {item.attributes?.schedule && (
                                                        <span className="flex items-center gap-1 truncate">
                                                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="truncate">{item.attributes.schedule}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : extras.length === 0 ? (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Tidak ada data
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Belum ada ekstrakurikuler untuk kategori ini.
                                </p>
                                <Link
                                    href="/ekstrakurikuler"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Lihat Semua
                                </Link>
                            </motion.div>
                        ) : null}
                    </div>
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
