'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
    BookOpen,
    Users,
    Award,
    MapPin,
    Bell,
    Calendar,
    ChevronRight,
    Star,
    TrendingUp,
    Image as ImageIcon
} from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

// Mobile-optimized components
function MobileHero() {
    const { settings } = useSiteConfig()

    return (
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <Image
                    src="/hero-bg.png"
                    alt={settings.site_name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-blue-900/90" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-6 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Terakreditasi A
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                        {settings.site_short_name.split(' ').slice(0, -1).join(' ')}<br />{settings.site_short_name.split(' ').slice(-1)[0]}
                    </h1>

                    <p className="text-white/90 text-sm leading-relaxed mb-6">
                        {settings.site_tagline}
                    </p>

                    <div className="flex gap-3">
                        <Link
                            href="/tentang"
                            className="flex-1 px-4 py-2.5 bg-white text-blue-900 rounded-xl font-semibold text-sm text-center shadow-lg"
                        >
                            Profil Sekolah
                        </Link>
                        <Link
                            href="/kontak"
                            className="px-4 py-2.5 bg-white/20 backdrop-blur text-white rounded-xl font-semibold text-sm border border-white/30"
                        >
                            Kontak
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function StatItem({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    const { count, ref } = useCountUp(value, 2000)

    return (
        <div ref={ref} className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
                {count > 1000 ? `${(count / 1000).toFixed(0)}k` : count}+
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                {label}
            </div>
        </div>
    )
}

function MobileStats() {
    const stats = [
        { label: 'Siswa', value: 1200, icon: Users },
        { label: 'Guru', value: 120, icon: BookOpen },
        { label: 'Ekskul', value: 25, icon: Award },
        { label: 'Alumni', value: 50000, icon: TrendingUp },
    ]

    return (
        <div className="px-4 -mt-6 mb-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4"
            >
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatItem key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

function MobileQuickAccess() {
    const quickLinks = [
        { title: 'Pengumuman', icon: Bell, href: '/pengumuman', color: 'bg-red-500', count: 3 },
        { title: 'Akademik', icon: BookOpen, href: '/akademik', color: 'bg-blue-500' },
        { title: 'Galeri', icon: ImageIcon, href: '/galeri', color: 'bg-purple-500' },
        { title: 'Lokasi', icon: MapPin, href: '/kontak', color: 'bg-green-500' },
    ]

    return (
        <div className="px-4 mb-6">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Akses Cepat</h2>
            <div className="grid grid-cols-4 gap-3">
                {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="relative flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md active:scale-95 transition-transform"
                        >
                            {link.count && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {link.count}
                                </div>
                            )}
                            <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                                {link.title}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

function MobileNews({ posts }: { posts: any[] }) {
    return (
        <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Berita Terkini</h2>
                <Link href="/informasi" className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Lihat Semua
                </Link>
            </div>

            <div className="space-y-3">
                {posts.slice(0, 3).map((post) => (
                    <Link
                        key={post.id}
                        href={`/informasi/${post.attributes.slug}`}
                        className="block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-transform"
                    >
                        <div className="flex gap-3 p-3">
                            <div className="w-20 h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                                {post.attributes.featured_image ? (
                                    <Image
                                        src={post.attributes.featured_image}
                                        alt={post.attributes.title}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">
                                    {post.attributes.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {new Date(post.attributes.published_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 self-center" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function MobileAchievements() {
    const achievements = [
        {
            title: 'Juara 1 OSN Fisika',
            category: 'Akademik',
            year: '2025',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            title: 'Best Delegation MUN',
            category: 'Internasional',
            year: '2024',
            color: 'from-blue-400 to-purple-500',
        },
        {
            title: 'Juara Umum POPDA',
            category: 'Olahraga',
            year: '2025',
            color: 'from-green-400 to-cyan-500',
        },
    ]

    return (
        <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Prestasi</h2>
                <Link href="/prestasi" className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {achievements.map((achievement, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-48 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md"
                    >
                        <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">
                            {achievement.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] px-2 py-0">
                                {achievement.category}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{achievement.year}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function MobileCTA() {
    const { settings } = useSiteConfig()

    return (
        <div className="px-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center shadow-xl">
                <h2 className="text-xl font-bold mb-2">{settings.cta_title}</h2>
                <p className="text-blue-100 text-sm mb-4">
                    {settings.cta_subtitle}
                </p>
                <Link
                    href={settings.cta_button_link}
                    className="block w-full py-3 bg-white text-blue-600 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                    {settings.cta_button_text}
                </Link>
            </div>
        </div>
    )
}

interface MobileViewProps {
    posts: any[]
    announcements: any[]
    slides?: any[]
}

export function MobileView({ posts }: MobileViewProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <MobileHero />
            <MobileStats />
            <MobileQuickAccess />
            <MobileNews posts={posts} />
            <MobileAchievements />
            <MobileCTA />

            {/* Bottom Spacing */}
            <div className="h-20" />
        </div>
    )
}
