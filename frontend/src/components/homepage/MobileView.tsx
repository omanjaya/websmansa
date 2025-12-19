'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
    Bell,
    BookOpen,
    Image as ImageIcon,
    MapPin,
    ChevronRight,
    Calendar
} from 'lucide-react'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { Post, Achievement, Alumni, Slider, Gallery } from '@/lib/api'
import { InfiniteMarqueeAchievements } from './components/InfiniteMarqueeAchievements'
import { InfiniteMarqueeAlumni } from './components/InfiniteMarqueeAlumni'

// Simplified announcement type for homepage display
interface HomeAnnouncement {
    id: number
    type: string
    attributes: {
        title: string
        slug: string
        type: string
        published_at: string
    }
}

// Mobile Hero - Clean & Minimal
function MobileHero() {
    const { settings } = useSiteConfig()
    const heroImage = settings.hero_image || '/hero-bg.png'

    return (
        <div className="relative h-[100dvh] overflow-hidden">
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
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md">
                        Terakreditasi A (Unggul)
                    </span>
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

// Quick Access - Simple Grid
function MobileQuickAccess() {
    const quickLinks = [
        { title: 'Pengumuman', icon: Bell, href: '/pengumuman', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
        { title: 'Akademik', icon: BookOpen, href: '/informasi', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { title: 'Galeri', icon: ImageIcon, href: '/galeri', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
        { title: 'Lokasi', icon: MapPin, href: '/kontak', color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    ]

    return (
        <div className="px-4 mb-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-3">Akses Cepat</h2>
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
        <div className="px-4 mb-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-3">Sambutan Kepala Sekolah</h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm"
            >
                {/* Image */}
                <div className="relative aspect-[2/1] bg-slate-100 dark:bg-slate-700">
                    <Image
                        src={settings.principal_photo || '/principal.png'}
                        alt={settings.principal_name}
                        fill
                        className="object-cover object-top"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-lg font-semibold text-white">
                            {settings.principal_name}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {settings.principal_title}
                        </p>
                    </div>
                </div>

                {/* Quote */}
                <div className="p-4">
                    <p className="font-display text-base italic text-slate-600 dark:text-slate-300 leading-relaxed">
                        &ldquo;{settings.principal_message}&rdquo;
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

// News Section - List Style
function MobileNews({ posts }: { posts: Post[] }) {
    return (
        <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Berita Terkini</h2>
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

// Achievements - Horizontal Scroll with Images
function MobileAchievements({ achievements }: { achievements?: Achievement[] }) {
    const defaultAchievements = [
        { title: 'Medali Emas OSN Fisika', image_url: '/achievements/osn-fisika.jpg' },
        { title: 'Juara 1 DBL Basketball', image_url: '/achievements/popda.jpg' },
        { title: 'Best Delegation MUN', image_url: '/achievements/mun.jpg' },
        { title: 'Juara 1 FLS2N Tari', image_url: '/achievements/choir.jpg' },
    ]

    const displayAchievements = achievements && achievements.length > 0
        ? achievements.slice(0, 6)
        : defaultAchievements.map((item, index) => ({
            id: index + 1,
            title: item.title,
            image_url: item.image_url,
        }))

    return (
        <div className="mb-6">
            <div className="px-4 flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Prestasi</h2>
                <Link href="/prestasi" className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    Semua <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
                {displayAchievements.map((achievement, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * index }}
                        className="flex-shrink-0 w-44"
                    >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md group">
                            <Image
                                src={achievement.image_url || '/achievements/default.jpg'}
                                alt={achievement.title}
                                fill
                                className="object-cover transition-transform duration-500 group-active:scale-110"
                                sizes="176px"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
                                    {achievement.title}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}


// Alumni - Cards with Photos
function MobileAlumni({ alumni }: { alumni?: Alumni[] }) {
    const defaultAlumni = [
        { name: 'Dr. I Wayan Sudana', occupation: 'Dokter Spesialis', year: 1985, photo_url: '/alumni/alumni-1.jpg' },
        { name: 'Ni Made Dewi', occupation: 'CEO Startup', year: 1992, photo_url: '/alumni/alumni-2.jpg' },
        { name: 'I Gede Putra', occupation: 'Diplomat', year: 2005, photo_url: '/alumni/alumni-3.jpg' },
        { name: 'Kadek Ayu', occupation: 'Data Scientist', year: 2010, photo_url: '/alumni/alumni-4.jpg' },
    ]

    const displayAlumni = alumni && alumni.length > 0
        ? alumni.slice(0, 4)
        : defaultAlumni.map((item, index) => ({
            id: index + 1,
            name: item.name,
            current_occupation: item.occupation,
            graduation_year: item.year,
            photo_url: item.photo_url,
        }))

    return (
        <div className="mb-6">
            <div className="px-4 flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Alumni</h2>
                <Link href="/alumni" className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    Semua <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
                {displayAlumni.map((person, index: number) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * index }}
                        className="flex-shrink-0 w-36"
                    >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md group">
                            <Image
                                src={person.photo_url || '/alumni/default.jpg'}
                                alt={person.name}
                                fill
                                className="object-cover object-top transition-transform duration-500 group-active:scale-110"
                                sizes="144px"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="font-semibold text-white text-sm leading-snug line-clamp-1">
                                    {person.name}
                                </h3>
                                <p className="text-xs text-gray-300 mt-0.5">
                                    Alumni {person.graduation_year}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

interface MobileViewProps {
    posts: Post[]
    announcements?: HomeAnnouncement[]
    slides?: Slider[]
    achievements?: Achievement[]
    alumni?: Alumni[]
    galleries?: Gallery[]
}

export function MobileView({ posts, achievements, alumni }: MobileViewProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <MobileHero />
            <MobileQuickAccess />
            <div className="section-divider" />
            <MobilePrincipal />
            <div className="section-divider" />
            <MobileNews posts={posts} />
            <div className="section-divider" />

            {/* Using unified spotlight carousel components */}
            <InfiniteMarqueeAchievements achievements={achievements} />
            <div className="section-divider" />
            <InfiniteMarqueeAlumni alumni={alumni} />

            {/* Bottom Spacing */}
            <div className="h-20" />
        </div>
    )
}
