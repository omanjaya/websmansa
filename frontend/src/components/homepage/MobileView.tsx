'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
    Users,
    GraduationCap,
    Award,
    TrendingUp,
    Bell,
    BookOpen,
    Image as ImageIcon,
    MapPin,
    ChevronRight,
    Calendar,
    ArrowRight
} from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { Post, Slider, Achievement, Alumni, Gallery } from '@/lib/api'
import { Badge } from '@/components/ui/badge'

// Mobile Hero - Clean & Minimal
function MobileHero() {
    const { settings } = useSiteConfig()
    const heroImage = (settings as any).hero_image || '/hero-bg.png'

    return (
        <div className="relative h-[85vh] overflow-hidden -mt-16">
            {/* Background */}
            <div className="absolute inset-0">
                <Image
                    src={heroImage}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-slate-900/60 dark:from-slate-950 dark:via-slate-950/20 dark:to-slate-900/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md">
                        Terakreditasi A (Unggul)
                    </Badge>
                    <h1 className="font-display text-4xl font-semibold text-white leading-tight">
                        {settings.site_name}
                    </h1>
                    <p className="text-white/80 text-base max-w-sm">
                        {settings.site_tagline}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

// Stats - Compact Grid
function StatItem({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
    const { count, ref } = useCountUp(value, 2000)

    return (
        <div ref={ref} className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                {count > 1000 ? `${(count / 1000).toFixed(0)}k` : count}+
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </div>
        </div>
    )
}

function MobileStats() {
    const { settings } = useSiteConfig()

    const stats = [
        { label: 'Siswa', value: parseInt(settings.total_students) || 1200, icon: Users },
        { label: 'Guru', value: parseInt(settings.total_teachers) || 120, icon: GraduationCap },
        { label: 'Ekskul', value: 45, icon: Award },
        { label: 'Alumni', value: parseInt(settings.total_alumni) || 50000, icon: TrendingUp },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4 -mt-10 mb-8 relative z-10"
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-5">
                <div className="grid grid-cols-4 gap-2">
                    {stats.map((stat) => (
                        <StatItem key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

// Quick Access - Simple Grid
function MobileQuickAccess() {
    const quickLinks = [
        { title: 'Pengumuman', icon: Bell, href: '/pengumuman', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
        { title: 'Akademik', icon: BookOpen, href: '/informasi', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { title: 'Galeri', icon: ImageIcon, href: '/galeri', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
        { title: 'Lokasi', icon: MapPin, href: '/kontak', color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    ]

    return (
        <div className="px-4 mb-8">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-4 gap-3">
                {quickLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                        <motion.div
                            key={link.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <Link
                                href={link.href}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {link.title}
                                </span>
                            </Link>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

// Principal Section - Compact
function MobilePrincipal() {
    const { settings } = useSiteConfig()

    return (
        <div className="px-4 mb-8">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Sambutan Kepala Sekolah</h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm"
            >
                {/* Image */}
                <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-700">
                    <Image
                        src={settings.principal_photo || '/principal.png'}
                        alt={settings.principal_name}
                        fill
                        className="object-cover object-top"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-xl font-semibold text-white">
                            {settings.principal_name}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {settings.principal_title}
                        </p>
                    </div>
                </div>

                {/* Quote */}
                <div className="p-5">
                    <p className="font-display text-lg italic text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{settings.principal_message}"
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

// News Section - List Style
function MobileNews({ posts }: { posts: Post[] }) {
    return (
        <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Berita Terkini</h2>
                <Link href="/informasi" className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Semua <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3">
                {posts.slice(0, 3).map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Link
                            href={`/informasi/${post.attributes.slug}`}
                            className="flex gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors"
                        >
                            <div className="w-20 h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                                {post.attributes.featured_image ? (
                                    <Image
                                        src={post.attributes.featured_image}
                                        alt={post.attributes.title}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2">
                                    {post.attributes.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {new Date(post.attributes.published_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Achievements - Horizontal Scroll
function MobileAchievements({ achievements }: { achievements?: Achievement[] }) {
    const defaultAchievements = [
        { title: 'Medali Emas OSN Fisika', category: 'Akademik', level: 'Nasional' },
        { title: 'Juara 1 DBL Basketball', category: 'Olahraga', level: 'Provinsi' },
        { title: 'Best Delegation MUN', category: 'Internasional', level: 'Internasional' },
        { title: 'Juara 1 FLS2N Tari', category: 'Seni', level: 'Provinsi' },
    ]

    const displayAchievements = achievements && achievements.length > 0
        ? achievements.slice(0, 6)
        : defaultAchievements

    return (
        <div className="mb-8">
            <div className="px-4 flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Prestasi</h2>
                <Link href="/prestasi" className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Semua <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {displayAchievements.map((achievement: Achievement, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        className="flex-shrink-0 w-64"
                    >
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {achievement.level || achievement.category}
                                </Badge>
                            </div>
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                                {achievement.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Alumni - Testimonial Cards
function MobileAlumni({ alumni }: { alumni?: Alumni[] }) {
    const defaultAlumni = [
        { name: 'Dr. I Wayan Sudana', profession: 'Dokter Spesialis', year: '2008', quote: 'SMANSA mengajarkan saya untuk selalu berpikir kritis.' },
        { name: 'Ni Made Dewi', profession: 'CEO Startup', year: '2012', quote: 'Fondasi yang kuat untuk meraih mimpi besar.' },
    ]

    const displayAlumni = alumni && alumni.length > 0 ? alumni.slice(0, 4) : defaultAlumni

    return (
        <div className="mb-8">
            <div className="px-4 flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Alumni</h2>
                <Link href="/alumni" className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Semua <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {displayAlumni.map((person: Alumni, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        className="flex-shrink-0 w-72"
                    >
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                                        {person.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {person.current_occupation || person.profession} • Alumni {person.graduation_year || person.year}
                                    </p>
                                </div>
                            </div>
                            <p className="font-display text-sm italic text-slate-600 dark:text-slate-300">
                                "{person.quote}"
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// CTA Section
function MobileCTA() {
    const { settings } = useSiteConfig()

    return (
        <div className="px-4 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl text-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative">
                    <h3 className="font-display text-2xl font-semibold text-white mb-2">
                        Bergabung Bersama Kami
                    </h3>
                    <p className="text-slate-300 text-sm mb-6">
                        Jadilah bagian dari keluarga besar {settings.site_short_name}
                    </p>
                    <Link
                        href="/ppdb"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-semibold text-sm hover:bg-slate-100 transition-colors"
                    >
                        Info Pendaftaran
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

interface MobileViewProps {
    posts: any[]
    announcements: any[]
    slides?: any[]
    achievements?: any[]
    alumni?: any[]
    galleries?: any[]
}

export function MobileView({ posts, achievements, alumni }: MobileViewProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <MobileHero />
            <MobileStats />
            <MobileQuickAccess />
            <MobilePrincipal />
            <MobileNews posts={posts} />
            <MobileAchievements achievements={achievements} />
            <MobileAlumni alumni={alumni} />
            <MobileCTA />

            {/* Bottom Spacing */}
            <div className="h-20" />
        </div>
    )
}
