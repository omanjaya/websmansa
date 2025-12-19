'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Calendar, ChevronRight, Pin, AlertTriangle, ChevronLeft, CalendarDays } from 'lucide-react'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import { GlassCard } from '@/components/shared/cards/GlassCard'
import {
    FadeInOnScroll,
    UrgentBanner,
    CountdownTimer,
    PulseAlert,
} from '@/components/shared/Animations'
import {
    DotPattern,
    GlowSpot,
    Waves,
} from '@/components/shared/Decorations'

interface Announcement {
    id: number
    type: string
    attributes: {
        title: string
        slug: string
        content: string
        excerpt?: string
        type: string
        priority: number
        is_featured: boolean
        is_pinned: boolean
        published_at: string
        created_at: string
        updated_at: string
    }
}

interface PengumumanPageProps {
    announcements: Announcement[]
    types: string[]
    typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'>
    typeLabels: Record<string, string>
    currentType?: string
}

const colorClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-cyan-500',
}

const colorTextClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-cyan-600 dark:text-cyan-400',
}

const colorBgClasses = {
    primary: 'bg-blue-50 dark:bg-blue-900/30',
    success: 'bg-green-50 dark:bg-green-900/30',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30',
    danger: 'bg-red-50 dark:bg-red-900/30',
    info: 'bg-cyan-50 dark:bg-cyan-900/30',
}

// Calendar View Component
interface CalendarViewProps {
    announcements: Announcement[]
    typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'>
}

function CalendarView({ announcements, typeColors }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

    // Group announcements by date
    const announcementsByDate = announcements.reduce((acc, ann) => {
        const date = new Date(ann.attributes.published_at).toDateString()
        if (!acc[date]) acc[date] = []
        acc[date].push(ann)
        return acc
    }, {} as Record<string, Announcement[]>)

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        setSelectedDate(null)
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        setSelectedDate(null)
    }

    const getAnnouncementsForDay = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
        return announcementsByDate[date] || []
    }

    const selectedAnnouncements = selectedDate
        ? announcementsByDate[selectedDate.toDateString()] || []
        : []

    return (
        <motion.div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={prevMonth}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                        aria-label="Bulan sebelumnya"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <p className="text-white/70 text-sm">Kalender Pengumuman</p>
                    </div>
                    <button
                        onClick={nextMonth}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                        aria-label="Bulan selanjutnya"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-4 md:p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before first of month */}
                    {[...Array(firstDayOfMonth)].map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Days */}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1
                        const dayAnnouncements = getAnnouncementsForDay(day)
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
                        const isSelected = selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                        return (
                            <motion.button
                                key={day}
                                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${isSelected
                                    ? 'bg-blue-600 text-white'
                                    : isToday
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="font-medium text-sm">{day}</span>
                                {dayAnnouncements.length > 0 && (
                                    <div className="flex gap-0.5 mt-1">
                                        {dayAnnouncements.slice(0, 3).map((ann, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full ${colorClasses[typeColors[ann.attributes.type] || 'primary']}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.button>
                        )
                    })}
                </div>

                {/* Selected Date Announcements */}
                <AnimatePresence>
                    {selectedDate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4"
                        >
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                            </h4>
                            {selectedAnnouncements.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedAnnouncements.map(ann => (
                                        <Link
                                            key={ann.id}
                                            href={`/pengumuman/${ann.attributes.slug}`}
                                            className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 mt-2 rounded-full ${colorClasses[typeColors[ann.attributes.type] || 'primary']}`} />
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                                                        {ann.attributes.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        {ann.attributes.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                                    Tidak ada pengumuman
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export function PengumumanPage({
    announcements,
    types,
    typeColors,
    typeLabels,
    currentType,
}: PengumumanPageProps) {
    const router = useRouter()

    // Convert types to filter format
    const filterOptions = types.map(type => ({
        label: typeLabels[type] || type,
        value: type,
    }))

    // Handle filter change
    const handleFilterChange = (value: string) => {
        if (value) {
            router.push(`/pengumuman?type=${value}`)
        } else {
            router.push('/pengumuman')
        }
    }

    // Separate pinned announcements
    const pinnedAnnouncements = announcements.filter(a => a.attributes.is_pinned)
    const regularAnnouncements = announcements.filter(a => !a.attributes.is_pinned)

    // Filter urgent announcements (type === 'urgent' or priority > 8)
    const urgentAnnouncements = announcements.filter(
        a => a.attributes.type === 'urgent' || a.attributes.priority > 8
    )

    // Example deadline for demo - in production this would come from the announcement data
    const getDeadline = (announcement: Announcement) => {
        // If announcement has deadline field, use it. Otherwise create a demo deadline
        const daysFromNow = Math.floor(Math.random() * 7) + 1
        const deadline = new Date()
        deadline.setDate(deadline.getDate() + daysFromNow)
        return deadline
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-red-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-orange-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Pengumuman"
                    subtitle="Informasi penting dan pengumuman resmi dari SMA Negeri 1 Denpasar"
                    badge={{
                        icon: Bell,
                        label: 'Informasi Resmi',
                        color: 'red',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Pengumuman', href: '/pengumuman' },
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
                    {/* Calendar View - Show when no filter active */}
                    {!currentType && announcements.length > 0 && (
                        <FadeInOnScroll delay={0.1} className="mb-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <SectionTitle
                                        badge={{ icon: CalendarDays, label: 'Kalender', color: 'blue' }}
                                        title="Kalender"
                                        gradientText="Pengumuman"
                                        subtitle="Lihat pengumuman berdasarkan tanggal"
                                        align="left"
                                    />
                                </div>
                                <CalendarView announcements={announcements} typeColors={typeColors} />
                            </div>
                        </FadeInOnScroll>
                    )}

                    {/* Filter Bar */}
                    <FadeInOnScroll delay={0.1} className="mb-8 md:mb-10">
                        <FilterBar
                            filters={filterOptions}
                            currentFilter={currentType}
                            onFilterChange={handleFilterChange}
                            searchPlaceholder="Cari pengumuman..."
                            showSearch={true}
                            showAllOption={true}
                            allLabel="Semua"
                        />
                    </FadeInOnScroll>

                    {/* Urgent Announcements Banner */}
                    {urgentAnnouncements.length > 0 && !currentType && (
                        <div className="mb-8">
                            {urgentAnnouncements.slice(0, 1).map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/pengumuman/${item.attributes.slug}`}
                                    className="block"
                                >
                                    <UrgentBanner variant="danger" pulse>
                                        <div className="p-4 md:p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                {/* Left content */}
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                        <AlertTriangle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <PulseAlert color="yellow" size="sm" />
                                                            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                                                                Pengumuman Penting
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg md:text-xl font-bold text-white line-clamp-2">
                                                            {item.attributes.title}
                                                        </h3>
                                                        <p className="text-sm text-white/70 mt-1 line-clamp-1">
                                                            {item.attributes.excerpt || item.attributes.content}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Countdown Timer */}
                                                <div className="flex-shrink-0">
                                                    <div className="text-xs text-white/70 mb-2 text-center md:text-right">
                                                        Batas Waktu:
                                                    </div>
                                                    <CountdownTimer
                                                        targetDate={getDeadline(item)}
                                                        size="sm"
                                                        showSeconds={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </UrgentBanner>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pinned Announcements */}
                    {pinnedAnnouncements.length > 0 && !currentType && (
                        <div className="mb-10">
                            <SectionTitle
                                badge={{ icon: Pin, label: 'Disematkan', color: 'red' }}
                                title="Pengumuman"
                                gradientText="Penting"
                                align="left"
                                className="mb-6"
                            />
                            <div className="space-y-4">
                                {pinnedAnnouncements.map((item, index) => {
                                    const color = typeColors[item.attributes.type] || 'primary'
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <Link
                                                href={`/pengumuman/${item.attributes.slug}`}
                                                className="group block"
                                            >
                                                <GlassCard
                                                    padding="large"
                                                    glow
                                                    glowColor={color === 'danger' ? 'red' : 'blue'}
                                                    className={`border-l-4 transition-all duration-300 hover:shadow-xl ${color === 'danger' ? 'border-l-red-500' : color === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                                        {/* Icon */}
                                                        <div className={`flex-shrink-0 w-12 h-12 ${colorBgClasses[color]} rounded-xl flex items-center justify-center`}>
                                                            {item.attributes.type === 'urgent' ? (
                                                                <AlertTriangle className={`w-6 h-6 ${colorTextClasses[color]}`} />
                                                            ) : (
                                                                <Bell className={`w-6 h-6 ${colorTextClasses[color]}`} />
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                <span className={`px-2.5 py-1 ${colorClasses[color]} text-white text-xs font-bold rounded-full`}>
                                                                    {typeLabels[item.attributes.type] || item.attributes.type}
                                                                </span>
                                                                <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full flex items-center gap-1">
                                                                    <Pin className="w-3 h-3" />
                                                                    Disematkan
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {item.attributes.title}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                                                {item.attributes.excerpt || item.attributes.content}
                                                            </p>
                                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {formatDate(item.attributes.published_at)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Arrow */}
                                                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 group-hover:text-blue-600 group-hover:translate-x-1 transition-all hidden md:block" />
                                                    </div>
                                                </GlassCard>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Regular Announcements */}
                    <div>
                        {!currentType && regularAnnouncements.length > 0 && pinnedAnnouncements.length > 0 && (
                            <SectionTitle
                                title="Semua"
                                gradientText="Pengumuman"
                                align="left"
                                className="mb-6"
                            />
                        )}

                        {(currentType ? announcements : regularAnnouncements).length > 0 ? (
                            <div className="space-y-4">
                                {(currentType ? announcements : regularAnnouncements).map((item, index) => {
                                    const color = typeColors[item.attributes.type] || 'primary'
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.05 * (index % 10) }}
                                        >
                                            <Link
                                                href={`/pengumuman/${item.attributes.slug}`}
                                                className="group block bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Date Badge */}
                                                    <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex-shrink-0">
                                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                                            {new Date(item.attributes.published_at).getDate()}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                                            {new Date(item.attributes.published_at).toLocaleDateString('id-ID', { month: 'short' })}
                                                        </span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-2.5 py-1 ${colorClasses[color]} text-white text-xs font-bold rounded-full`}>
                                                                {typeLabels[item.attributes.type] || item.attributes.type}
                                                            </span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
                                                                {formatDate(item.attributes.published_at)}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                            {item.attributes.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                            {item.attributes.excerpt || item.attributes.content}
                                                        </p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : announcements.length === 0 ? (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Bell className="w-8 h-8 md:w-10 md:h-10 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Tidak ada pengumuman
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Belum ada pengumuman untuk kategori ini.
                                </p>
                                <Link
                                    href="/pengumuman"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Lihat Semua Pengumuman
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
