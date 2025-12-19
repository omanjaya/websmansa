'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Star, Crown, Award, ChevronLeft, ChevronRight, Sparkles, Clock } from 'lucide-react'
import { Achievement } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
    MedalShine,
    ConfettiTrigger,
    AnimatedCounter,
} from '@/components/shared/Animations'
import {
    DotPattern,
    GlowSpot,
    Waves,
} from '@/components/shared/Decorations'

interface PrestasiPageProps {
    achievements: Achievement[]
    categories: string[]
    years: number[]
    levels: string[]
    currentCategory?: string
    currentYear?: number
    currentLevel?: string
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

const categoryLabels: Record<string, string> = {
    akademik: 'Akademik',
    olahraga: 'Olahraga',
    seni: 'Seni & Budaya',
    teknologi: 'Teknologi',
    keagamaan: 'Keagamaan',
}

const levelLabels: Record<string, string> = {
    school: 'Sekolah',
    regional: 'Regional',
    national: 'Nasional',
    international: 'Internasional',
}

const medalIcons: Record<string, React.ReactNode> = {
    gold: <Crown className="w-5 h-5 text-yellow-500" />,
    silver: <Medal className="w-5 h-5 text-gray-400" />,
    bronze: <Medal className="w-5 h-5 text-amber-600" />,
    winner: <Trophy className="w-5 h-5 text-yellow-500" />,
    finalist: <Star className="w-5 h-5 text-blue-500" />,
}

const medalColors: Record<string, string> = {
    gold: 'from-yellow-400 to-amber-500',
    silver: 'from-gray-300 to-gray-400',
    bronze: 'from-amber-500 to-orange-600',
    winner: 'from-yellow-400 to-amber-500',
    finalist: 'from-blue-400 to-blue-600',
}

// Trophy Cabinet 3D Component
interface TrophyCabinet3DProps {
    achievements: Achievement[]
}

function TrophyCabinet3D({ achievements }: TrophyCabinet3DProps) {
    const [selectedTrophy, setSelectedTrophy] = useState<number | null>(null)
    const [isRotating, setIsRotating] = useState(true)
    const [rotationAngle, setRotationAngle] = useState(0)

    // Count achievements by medal type
    const goldCount = achievements.filter(a => a.medal_type === 'gold' || a.medal_type === 'winner').length
    const silverCount = achievements.filter(a => a.medal_type === 'silver').length
    const bronzeCount = achievements.filter(a => a.medal_type === 'bronze').length
    const otherCount = achievements.length - goldCount - silverCount - bronzeCount

    // Auto rotation
    useEffect(() => {
        if (!isRotating) return
        const interval = setInterval(() => {
            setRotationAngle(prev => (prev + 0.5) % 360)
        }, 50)
        return () => clearInterval(interval)
    }, [isRotating])

    const displayAchievements = achievements.slice(0, 5)

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsRotating(false)}
            onMouseLeave={() => setIsRotating(true)}
        >
            {/* Glass Cabinet Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-yellow-900/80 to-amber-950/95" />

            {/* Shelf Reflections */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400/60 rounded-full"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: '100%',
                            opacity: 0
                        }}
                        animate={{
                            y: '-10%',
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg"
                            animate={{ rotateY: rotationAngle }}
                            transition={{ duration: 0 }}
                        >
                            <Trophy className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white">Lemari Piala</h3>
                            <p className="text-yellow-300/70 text-sm">Koleksi piala kebanggaan</p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                </div>

                {/* 3D Trophy Display */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {displayAchievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            className="relative cursor-pointer group"
                            whileHover={{ scale: 1.1, y: -10 }}
                            onClick={() => setSelectedTrophy(selectedTrophy === index ? null : index)}
                        >
                            {/* Trophy Pedestal */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-amber-800 to-amber-700 rounded-sm" />

                            {/* Trophy */}
                            <motion.div
                                className="relative z-10 w-16 h-20 mx-auto flex items-end justify-center"
                                animate={{
                                    rotateY: selectedTrophy === index ? 360 : 0,
                                }}
                                transition={{ duration: 1 }}
                            >
                                <div className={`w-10 h-14 rounded-t-full bg-gradient-to-b ${medalColors[achievement.medal_type || 'gold']} shadow-lg relative`}>
                                    {/* Trophy Handles */}
                                    <div className="absolute -left-2 top-4 w-2 h-4 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-l-full" />
                                    <div className="absolute -right-2 top-4 w-2 h-4 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-r-full" />
                                    {/* Trophy Star */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                        <Star className="w-4 h-4 text-white" fill="currentColor" />
                                    </div>
                                </div>
                                {/* Trophy Base */}
                                <div className="absolute bottom-0 w-8 h-3 bg-gradient-to-b from-amber-700 to-amber-900 rounded-sm" />
                            </motion.div>

                            {/* Glow Effect */}
                            <motion.div
                                className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl -z-10"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            />

                            {/* Tooltip */}
                            <AnimatePresence>
                                {selectedTrophy === index && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl z-20"
                                    >
                                        <p className="font-medium text-slate-900 text-sm line-clamp-2">{achievement.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{achievement.year}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Emas', count: goldCount, color: 'from-yellow-400 to-amber-500', icon: Crown },
                        { label: 'Perak', count: silverCount, color: 'from-gray-300 to-gray-400', icon: Medal },
                        { label: 'Perunggu', count: bronzeCount, color: 'from-amber-500 to-orange-600', icon: Medal },
                        { label: 'Lainnya', count: otherCount, color: 'from-blue-400 to-blue-600', icon: Star },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white">
                                <AnimatedCounter value={stat.count} duration={2} />
                            </div>
                            <p className="text-xs text-white/70">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

// Achievement Timeline Component
interface AchievementTimelineProps {
    achievements: Achievement[]
}

function AchievementTimeline({ achievements }: AchievementTimelineProps) {
    const [expandedYear, setExpandedYear] = useState<number | null>(null)

    // Group achievements by year
    const achievementsByYear = achievements.reduce((acc, achievement) => {
        const year = achievement.year
        if (!acc[year]) acc[year] = []
        acc[year].push(achievement)
        return acc
    }, {} as Record<number, Achievement[]>)

    const years = Object.keys(achievementsByYear)
        .map(Number)
        .sort((a, b) => b - a)
        .slice(0, 5) // Show last 5 years

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-amber-500 to-orange-500" />

            {/* Year Entries */}
            <div className="space-y-4">
                {years.map((year, yearIndex) => (
                    <motion.div
                        key={year}
                        className="relative pl-12 md:pl-20"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: yearIndex * 0.1 }}
                    >
                        {/* Year Marker */}
                        <motion.button
                            className="absolute left-0 md:left-4 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                        >
                            {year.toString().slice(-2)}
                        </motion.button>

                        {/* Year Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            {/* Header */}
                            <button
                                onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">{year}</span>
                                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                                        {achievementsByYear[year].length} prestasi
                                    </span>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedYear === year ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                                </motion.div>
                            </button>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expandedYear === year && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-slate-100 dark:border-slate-700"
                                    >
                                        <div className="p-4 space-y-3">
                                            {achievementsByYear[year].slice(0, 5).map((achievement, idx) => (
                                                <motion.div
                                                    key={achievement.id}
                                                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${medalColors[achievement.medal_type || 'gold']} flex items-center justify-center flex-shrink-0`}>
                                                        {achievement.medal_type === 'gold' || achievement.medal_type === 'winner' ? (
                                                            <Crown className="w-4 h-4 text-white" />
                                                        ) : (
                                                            <Medal className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-slate-900 dark:text-white line-clamp-1">
                                                            {achievement.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {levelLabels[achievement.level] || achievement.level} •{' '}
                                                            {categoryLabels[achievement.category] || achievement.category}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {achievementsByYear[year].length > 5 && (
                                                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                                                    +{achievementsByYear[year].length - 5} prestasi lainnya
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export function PrestasiPage({
    achievements,
    categories,
    years,
    levels,
    currentCategory,
    currentYear,
    currentLevel,
    meta,
}: PrestasiPageProps) {
    const router = useRouter()
    const [activeFilter, setActiveFilter] = useState<'category' | 'year' | 'level'>('category')

    // Build filters
    const categoryFilters = categories.map(cat => ({
        label: categoryLabels[cat] || cat,
        value: cat,
    }))

    const yearFilters = years.map(year => ({
        label: year.toString(),
        value: year.toString(),
    }))

    const levelFilters = levels.map(level => ({
        label: levelLabels[level] || level,
        value: level,
    }))

    // Handle filter change
    const buildUrl = (category?: string, year?: string, level?: string) => {
        const params = new URLSearchParams()
        if (category) params.set('category', category)
        if (year) params.set('year', year)
        if (level) params.set('level', level)
        return `/prestasi${params.toString() ? '?' + params.toString() : ''}`
    }

    const handleCategoryChange = (value: string) => {
        router.push(buildUrl(value, currentYear?.toString(), currentLevel))
    }

    const handleYearChange = (value: string) => {
        router.push(buildUrl(currentCategory, value, currentLevel))
    }

    const handleLevelChange = (value: string) => {
        router.push(buildUrl(currentCategory, currentYear?.toString(), value))
    }

    // Group featured achievements
    const featuredAchievements = achievements.filter(a => a.is_featured).slice(0, 3)
    const regularAchievements = achievements.filter(a => !featuredAchievements.includes(a))

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header so hero background shows behind it
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations - extends across entire page for seamless effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-yellow-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-amber-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Prestasi Siswa"
                    subtitle="Pencapaian gemilang siswa SMA Negeri 1 Denpasar di berbagai kompetisi"
                    badge={{
                        icon: Trophy,
                        label: 'Prestasi',
                        color: 'gold',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Prestasi', href: '/prestasi' },
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
                    {/* Trophy Cabinet 3D - Show when no filters active */}
                    {!currentCategory && !currentYear && !currentLevel && achievements.length > 0 && (
                        <FadeInOnScroll delay={0.1} className="mb-10">
                            <TrophyCabinet3D achievements={achievements} />
                        </FadeInOnScroll>
                    )}

                    {/* Achievement Timeline - Show when no filters active */}
                    {!currentCategory && !currentYear && !currentLevel && achievements.length > 0 && (
                        <FadeInOnScroll delay={0.2} className="mb-10">
                            <SectionTitle
                                badge={{ icon: Clock, label: 'Timeline', color: 'gold' }}
                                title="Perjalanan"
                                gradientText="Prestasi"
                                subtitle="Riwayat prestasi tahun ke tahun"
                                align="center"
                            />
                            <AchievementTimeline achievements={achievements} />
                        </FadeInOnScroll>
                    )}

                    {/* Filter Tabs */}
                    <FadeInOnScroll delay={0.1} className="mb-6">
                        <div className="flex gap-2 mb-4">
                            {[
                                { key: 'category', label: 'Kategori' },
                                { key: 'year', label: 'Tahun' },
                                { key: 'level', label: 'Tingkat' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key as 'category' | 'year' | 'level')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeFilter === tab.key
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Active Filter Bar */}
                        {activeFilter === 'category' && (
                            <FilterBar
                                filters={categoryFilters}
                                currentFilter={currentCategory}
                                onFilterChange={handleCategoryChange}
                                showSearch={false}
                                showAllOption={true}
                                allLabel="Semua Kategori"
                            />
                        )}
                        {activeFilter === 'year' && (
                            <FilterBar
                                filters={yearFilters}
                                currentFilter={currentYear?.toString()}
                                onFilterChange={handleYearChange}
                                showSearch={false}
                                showAllOption={true}
                                allLabel="Semua Tahun"
                            />
                        )}
                        {activeFilter === 'level' && (
                            <FilterBar
                                filters={levelFilters}
                                currentFilter={currentLevel}
                                onFilterChange={handleLevelChange}
                                showSearch={false}
                                showAllOption={true}
                                allLabel="Semua Tingkat"
                            />
                        )}
                    </FadeInOnScroll>

                    {/* Featured Achievements */}
                    {featuredAchievements.length > 0 && !currentCategory && !currentYear && !currentLevel && (
                        <FadeInOnScroll delay={0.2} className="mb-12">
                            <SectionTitle
                                badge={{ icon: Trophy, label: 'Unggulan', color: 'gold' }}
                                title="Prestasi"
                                gradientText="Terbaik"
                                align="left"
                                className="mb-6"
                            />
                            <StaggerContainer className="grid md:grid-cols-3 gap-6">
                                {featuredAchievements.map((item) => (
                                    <StaggerItem key={item.id}>
                                        <ConfettiTrigger
                                            className="block"
                                            colors={
                                                item.medal_type === 'gold' ? ['#FFD700', '#FFA500', '#FFFF00'] :
                                                    item.medal_type === 'silver' ? ['#C0C0C0', '#B8B8B8', '#D3D3D3'] :
                                                        item.medal_type === 'bronze' ? ['#CD7F32', '#B87333', '#A0522D'] :
                                                            ['#FFD700', '#FFA500', '#C0C0C0', '#FF6B6B', '#4ECDC4']
                                            }
                                            particleCount={item.medal_type ? 30 : 20}
                                            spread={item.medal_type ? 45 : 60}
                                        >
                                            <Link
                                                href={`/prestasi/${item.slug}`}
                                                className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-700 hover:-translate-y-2"
                                            >
                                                {/* Image */}
                                                <div className="relative h-48 overflow-hidden">
                                                    {(item.image_url || item.image) ? (
                                                        <Image
                                                            src={item.image_url || item.image || ''}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                            sizes="(max-width: 768px) 100vw, 33vw"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center">
                                                            <Trophy className="w-16 h-16 text-yellow-400 dark:text-yellow-600" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                                    {/* Medal Badge */}
                                                    {item.medal_type && (
                                                        <div className="absolute top-4 right-4">
                                                            <MedalShine className="rounded-full">
                                                                <div className={`px-3 py-1.5 bg-gradient-to-r ${medalColors[item.medal_type] || 'from-yellow-400 to-amber-500'} rounded-full shadow-lg flex items-center gap-1`}>
                                                                    {medalIcons[item.medal_type]}
                                                                    <span className="text-xs font-bold text-white capitalize">
                                                                        {item.medal_type === 'gold' ? 'Emas' : item.medal_type === 'silver' ? 'Perak' : item.medal_type === 'bronze' ? 'Perunggu' : item.medal_type}
                                                                    </span>
                                                                </div>
                                                            </MedalShine>
                                                        </div>
                                                    )}

                                                    {/* Level Badge */}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                                            {levelLabels[item.level] || item.level}
                                                        </span>
                                                    </div>

                                                    {/* Year */}
                                                    <div className="absolute bottom-4 left-4">
                                                        <span className="text-3xl font-bold text-white/80">{item.year}</span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    {item.organizer && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                            {item.organizer}
                                                        </p>
                                                    )}
                                                    {item.participants && item.participants.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <Award className="w-4 h-4 text-yellow-500" />
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {item.participants.slice(0, 2).join(', ')}
                                                                {item.participants.length > 2 && ` +${item.participants.length - 2}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </ConfettiTrigger>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </FadeInOnScroll>
                    )}

                    {/* All Achievements Grid */}
                    <div>
                        {regularAchievements.length > 0 && featuredAchievements.length > 0 && !currentCategory && !currentYear && !currentLevel && (
                            <SectionTitle
                                title="Semua"
                                gradientText="Prestasi"
                                align="left"
                                className="mb-6"
                            />
                        )}

                        {(currentCategory || currentYear || currentLevel ? achievements : regularAchievements).length > 0 ? (
                            <>
                                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {(currentCategory || currentYear || currentLevel ? achievements : regularAchievements).map((item) => (
                                        <StaggerItem key={item.id}>
                                            <ConfettiTrigger
                                                className="block"
                                                colors={
                                                    item.medal_type === 'gold' ? ['#FFD700', '#FFA500', '#FFFF00'] :
                                                        item.medal_type === 'silver' ? ['#C0C0C0', '#B8B8B8', '#D3D3D3'] :
                                                            item.medal_type === 'bronze' ? ['#CD7F32', '#B87333', '#A0522D'] :
                                                                ['#FFD700', '#FFA500', '#C0C0C0', '#FF6B6B', '#4ECDC4']
                                                }
                                                particleCount={item.medal_type ? 20 : 15}
                                                spread={item.medal_type ? 40 : 50}
                                            >
                                                <Link
                                                    href={`/prestasi/${item.slug}`}
                                                    className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1"
                                                >
                                                    {/* Image */}
                                                    <div className="relative h-36 overflow-hidden">
                                                        {(item.image_url || item.image) ? (
                                                            <Image
                                                                src={item.image_url || item.image || ''}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                                                <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                                            </div>
                                                        )}

                                                        {/* Medal Badge */}
                                                        {item.medal_type && (
                                                            <div className="absolute top-2 right-2">
                                                                <MedalShine className="rounded-full">
                                                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${medalColors[item.medal_type] || 'from-yellow-400 to-amber-500'} flex items-center justify-center shadow`}>
                                                                        {medalIcons[item.medal_type]}
                                                                    </div>
                                                                </MedalShine>
                                                            </div>
                                                        )}

                                                        {/* Year */}
                                                        <div className="absolute bottom-2 left-2">
                                                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded">
                                                                {item.year}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded">
                                                                {levelLabels[item.level] || item.level}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded">
                                                                {categoryLabels[item.category] || item.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                        {item.organizer && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                                {item.organizer}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            </ConfettiTrigger>
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
                                                    if (currentCategory) params.set('category', currentCategory)
                                                    if (currentYear) params.set('year', currentYear.toString())
                                                    if (currentLevel) params.set('level', currentLevel)
                                                    params.set('page', (meta.current_page - 1).toString())
                                                    router.push(`/prestasi?${params.toString()}`)
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
                                                    if (currentCategory) params.set('category', currentCategory)
                                                    if (currentYear) params.set('year', currentYear.toString())
                                                    if (currentLevel) params.set('level', currentLevel)
                                                    params.set('page', (meta.current_page + 1).toString())
                                                    router.push(`/prestasi?${params.toString()}`)
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
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Tidak ada prestasi
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Belum ada prestasi untuk filter ini.
                                </p>
                                <Link
                                    href="/prestasi"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Lihat Semua Prestasi
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
