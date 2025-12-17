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
    Image as ImageIcon,
    Building,
    GraduationCap
} from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

// Mobile-optimized// Hero Section for Mobile
function MobileHero() {
    const { settings } = useSiteConfig()

    // Use hero-bg.png as consistent fallback if settings.hero_image is missing
    const heroImage = (settings as any).hero_image || '/hero-bg.png'

    return (
        <div className="relative h-screen overflow-hidden -mt-20">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={heroImage}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/60 dark:from-[#111827] dark:via-transparent dark:to-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md shadow-lg">
                        Terakreditasi A (Unggul)
                    </Badge>
                    <h1 className="text-4xl font-bold leading-tight mb-4 text-shadow-lg drop-shadow-md">
                        {settings.site_name}
                    </h1>
                    <p className="text-lg text-white/90 mb-8 max-w-sm leading-relaxed text-shadow drop-shadow-md">
                        {settings.site_tagline}
                    </p>
                </motion.div>

                {/* Scroll Indicator - Adapted color for visibility on blending background */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
                    <div className="w-8 h-12 border-2 border-slate-400/50 dark:border-white/30 rounded-full flex justify-center pt-2 backdrop-blur-sm">
                        <div className="w-1.5 h-3 bg-slate-400 dark:bg-white rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Stats with Glassmorphism
function StatItem({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
    const { count, ref } = useCountUp(value, 2000)

    return (
        <div ref={ref} className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center 
                dark:from-blue-500/30 dark:to-purple-500/30 dark:border-white/10">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
                {count > 1000 ? `${(count / 1000).toFixed(0)}k` : count}+
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wide">
                {label}
            </div>
        </div>
    )
}

function MobileStats() {
    const { settings } = useSiteConfig()

    // Use dynamic stats from settings with fallback
    const stats = [
        { label: 'Siswa', value: parseInt(settings.total_students) || 1200, icon: Users },
        { label: 'Guru', value: parseInt(settings.total_teachers) || 120, icon: GraduationCap },
        { label: 'Ekskul', value: 25, icon: Award }, // Hardcoded as no setting exists
        { label: 'Alumni', value: parseInt(settings.total_alumni) || 50000, icon: TrendingUp },
    ]

    return (
        <div className="px-4 -mt-8 mb-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-morphism-strong p-5"
            >
                <div className="grid grid-cols-4 gap-3">
                    {stats.map((stat) => (
                        <StatItem key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

// Quick Access with Glassmorphism
function MobileQuickAccess() {
    const quickLinks = [
        { title: 'Pengumuman', icon: Bell, href: '/pengumuman', color: 'from-red-500 to-rose-600', count: 3 },
        { title: 'Akademik', icon: BookOpen, href: '/informasi', color: 'from-blue-500 to-blue-600' },
        { title: 'Galeri', icon: ImageIcon, href: '/galeri', color: 'from-purple-500 to-violet-600' },
        { title: 'Lokasi', icon: MapPin, href: '/kontak', color: 'from-green-500 to-emerald-600' },
    ]

    return (
        <div className="px-4 mb-6">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Akses Cepat</h2>
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
                                className="relative flex flex-col items-center gap-2 p-4 
                                    glass-morphism hover:-translate-y-1 active:scale-95 transition-all duration-300"
                            >
                                {link.count && (
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 
                                        text-white text-[10px] font-bold rounded-full flex items-center 
                                        justify-center shadow-lg animate-pulse">
                                        {link.count}
                                    </div>
                                )}
                                <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl 
                                    flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
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

// Mobile Principal Section matching MobileStaffCard style
function MobilePrincipal() {
    const { settings } = useSiteConfig()

    return (
        <div className="px-4 mb-8 mt-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
            >
                {/* Card Container similar to MobileStaffCard */}
                <div
                    className="relative rounded-[24px] overflow-hidden"
                    style={{
                        boxShadow: '0 15px 50px rgba(0,0,0,0.1), 0 5px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Background for Light Mode (Warm Beige Original) */}
                    <div
                        className="absolute inset-0 dark:hidden"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,243,0.95) 100%)',
                        }}
                    />

                    {/* Background for Dark Mode (Dark Slate Gradient) */}
                    <div
                        className="absolute inset-0 hidden dark:block"
                        style={{
                            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', // Slate-800 to Slate-900
                        }}
                    />

                    {/* Gradient border effect */}
                    <div
                        className="absolute inset-0 rounded-[24px] pointer-events-none border border-white/50 dark:border-slate-700/50"
                        style={{
                            padding: '1px',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            opacity: 0.5
                        }}
                    />

                    <div className="relative p-2 pb-5">
                        {/* Image Container */}
                        <div className="rounded-[20px] overflow-hidden relative bg-gray-100 aspect-[4/3] mb-4 shadow-sm">
                            <Image
                                src={settings.principal_photo || '/principal.png'}
                                alt={settings.principal_name}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Image overlay gradient */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 100%)' }}
                            />
                            {/* Badge Label */}
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Kepala Sekolah</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-2 text-center">
                            {/* Name Row */}
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight" style={{ letterSpacing: '-0.3px' }}>
                                    {settings.principal_name}
                                </h2>
                                {/* Verified Badge from Staff Card */}
                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                        <path
                                            d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z"
                                            stroke="#888"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6" style={{ letterSpacing: '0.1px' }}>
                                {settings.principal_title}
                            </p>

                            {/* Quote Section */}
                            <div className="relative bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-white/40 dark:border-slate-700/50 mx-2">
                                <div className="text-3xl text-gray-300 dark:text-gray-600 absolute -top-3 -left-1 font-serif leading-none">"</div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed relative z-10 font-light">
                                    {settings.principal_message}
                                </p>
                                <div className="text-3xl text-gray-300 dark:text-gray-600 absolute -bottom-5 -right-1 font-serif leading-none">"</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// News Section with Glassmorphism
function MobileNews({ posts }: { posts: any[] }) {
    return (
        <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Berita Terkini</h2>
                <Link href="/informasi" className="text-sm font-semibold text-blue-600 dark:text-blue-400 
                    flex items-center gap-1">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-3">
                {posts.slice(0, 3).map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Link
                            href={`/informasi/${post.attributes.slug}`}
                            className="block glass-morphism p-4 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                        >
                            <div className="flex gap-4">
                                <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 
                                    dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden">
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
                                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2">
                                        {post.attributes.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
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
                                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 self-center" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Achievements with Glassmorphism
import { useState, useRef, useEffect } from 'react'
// ... imports

// Achievements with Infinite Auto-Scroll, Highlight Effect & Pause
function MobileAchievements() {
    // Original items
    const originalAchievements = [
        {
            title: 'Juara 1 OSN Fisika',
            category: 'Akademik',
            year: '2025',
            color: 'from-yellow-400 to-orange-500',
            glowColor: 'rgba(251, 191, 36, 0.4)',
            image: '/achievements/osn-fisika.jpg',
        },
        {
            title: 'Best Delegation MUN',
            category: 'Internasional',
            year: '2024',
            color: 'from-blue-400 to-purple-500',
            glowColor: 'rgba(96, 165, 250, 0.4)',
            image: '/achievements/mun.jpg',
        },
        {
            title: 'Juara Umum POPDA',
            category: 'Olahraga',
            year: '2025',
            color: 'from-green-400 to-cyan-500',
            glowColor: 'rgba(74, 222, 128, 0.4)',
            image: '/achievements/popda.jpg',
        },
        {
            title: 'Gold Medal Choir',
            category: 'Seni',
            year: '2024',
            color: 'from-pink-400 to-rose-500',
            glowColor: 'rgba(251, 113, 133, 0.4)',
            image: '/achievements/choir.jpg',
        },
    ]

    // Clone items 3 times for infinite loop: [Set1, Set2(Active), Set3]
    const achievements = [...originalAchievements, ...originalAchievements, ...originalAchievements]
    const LOOP_START_INDEX = originalAchievements.length // 4
    const LOOP_END_INDEX = originalAchievements.length * 2 // 8
    const ITEM_WIDTH = 192 // w-48 = 12rem = 192px
    const GAP_WIDTH = 16 // gap-4 = 1rem = 16px

    // Start at the beginning of the middle set
    const [activeIndex, setActiveIndex] = useState(LOOP_START_INDEX)
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const isAutoScrolling = useRef(false)
    const isResetting = useRef(false)

    // Get the mapped original index for dots indicator
    const getOriginalIndex = (index: number) => {
        return index % originalAchievements.length
    }

    // Initial Scroll Position Setup
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2
            // Instant scroll to start index
            container.scrollLeft = (LOOP_START_INDEX * totalItemWidth) - centerOffset
        }
    }, [])

    // Auto scroll timer
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            isAutoScrolling.current = true
            setActiveIndex((prev) => prev + 1)
        }, 3000)

        return () => clearInterval(interval)
    }, [isPaused])

    // Scroll Logic & Infinite Loop Reset
    useEffect(() => {
        // Prevent scrollTo during reset phase
        if (isResetting.current) return

        if (scrollRef.current && isAutoScrolling.current && !isPaused) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

            container.scrollTo({
                left: (activeIndex * totalItemWidth) - centerOffset,
                behavior: 'smooth'
            })

            // Check if we need to loop reset
            if (activeIndex >= LOOP_END_INDEX) {
                setTimeout(() => {
                    isResetting.current = true
                    const resetIndex = activeIndex - originalAchievements.length

                    setActiveIndex(resetIndex)
                    container.scrollLeft = (resetIndex * totalItemWidth) - centerOffset

                    isAutoScrolling.current = false
                    setTimeout(() => { isResetting.current = false }, 50)
                }, 400)
            } else {
                setTimeout(() => {
                    isAutoScrolling.current = false
                }, 400)
            }
        }
    }, [activeIndex, isPaused, originalAchievements.length])

    // Handler for User Interaction (Pause & Resume)
    const handleInteractionStart = () => {
        setIsPaused(true)
        isAutoScrolling.current = false
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    const handleInteractionEnd = () => {
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 3000)
    }

    // Sync activeIndex during manual scroll
    const handleScroll = () => {
        if (!scrollRef.current || isResetting.current) return

        const container = scrollRef.current
        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

        const scrollPos = container.scrollLeft + centerOffset
        const newIndex = Math.round(scrollPos / totalItemWidth)

        if (newIndex >= 0 && newIndex < achievements.length && newIndex !== activeIndex) {
            if (!isAutoScrolling.current) {
                setActiveIndex(newIndex)
            }
        }
    }

    // Correction on TouchEnd for manual infinite loop
    const handleTouchEndReset = () => {
        handleInteractionEnd()

        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = scrollRef.current ? (scrollRef.current.clientWidth - ITEM_WIDTH) / 2 : 0

        // If user manually scrolled to boundary, simplify jump logic
        if (activeIndex >= LOOP_END_INDEX) {
            const resetIndex = activeIndex - originalAchievements.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
        if (activeIndex < LOOP_START_INDEX) {
            const resetIndex = activeIndex + originalAchievements.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
    }

    // Navigate to specific original index
    const navigateToIndex = (originalIndex: number) => {
        const targetIndex = LOOP_START_INDEX + originalIndex
        setIsPaused(true)
        isAutoScrolling.current = true
        setActiveIndex(targetIndex)

        if (scrollRef.current) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2
            container.scrollTo({
                left: (targetIndex * totalItemWidth) - centerOffset,
                behavior: 'smooth'
            })
        }

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
            isAutoScrolling.current = false
        }, 3000)
    }

    return (
        <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Prestasi</h2>
                <Link href="/prestasi" className="text-sm font-semibold text-blue-600 dark:text-blue-400
                    flex items-center gap-1">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto py-6 -mx-4 px-4 scrollbar-hide"
                style={{ scrollSnapType: 'x mandatory' }}
                onScroll={handleScroll}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleTouchEndReset}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
            >
                {achievements.map((achievement, index) => {
                    const isActive = index === activeIndex
                    return (
                        <div
                            key={index}
                            className="flex-shrink-0 w-48 snap-center transition-all duration-300 ease-out"
                            style={{
                                transform: isActive ? 'scale(1)' : 'scale(0.88)',
                                opacity: isActive ? 1 : 0.45,
                                filter: isActive ? 'blur(0px)' : 'blur(2px)',
                            }}
                            onClick={() => navigateToIndex(getOriginalIndex(index))}
                        >
                            <div
                                className="glass-achievement-card h-full transition-all duration-300 overflow-hidden"
                                style={{
                                    boxShadow: isActive
                                        ? `0 15px 35px -10px ${achievement.glowColor}, 0 8px 20px -5px rgba(0, 0, 0, 0.15)`
                                        : 'none',
                                    transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                                    padding: 0,
                                }}
                            >
                                {/* Achievement Image */}
                                <div className="relative w-full h-24 overflow-hidden">
                                    <Image
                                        src={achievement.image}
                                        alt={achievement.title}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                        style={{
                                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                        sizes="192px"
                                    />
                                    {/* Gradient Overlay */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t ${achievement.color} opacity-30`}
                                    />
                                    {/* Icon Badge */}
                                    <div
                                        className={`absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br ${achievement.color} rounded-lg 
                                            flex items-center justify-center shadow-lg transition-all duration-300`}
                                        style={{
                                            transform: isActive ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                                            boxShadow: isActive ? `0 4px 12px -2px ${achievement.glowColor}` : undefined
                                        }}
                                    >
                                        <Star className="w-4 h-4 text-white" />
                                    </div>
                                    {/* Year Badge */}
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <span className="text-[10px] font-bold text-white">{achievement.year}</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-3">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2">
                                        {achievement.title}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px] px-2 py-0.5"
                                    >
                                        {achievement.category}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Dots Indicator - Synced to ORIGINAL array index */}
            <div className="flex justify-center gap-2 mt-3">
                {originalAchievements.map((achievement, i) => {
                    const isActiveDot = getOriginalIndex(activeIndex) === i
                    return (
                        <button
                            key={i}
                            onClick={() => navigateToIndex(i)}
                            className="relative transition-all duration-300 ease-out"
                            aria-label={`Go to ${achievement.title}`}
                        >
                            <span
                                className={`block rounded-full transition-all duration-300
                                    ${isActiveDot
                                        ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-blue-600'
                                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                            />
                            {isActiveDot && (
                                <span
                                    className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"
                                    style={{ animationDuration: '1.5s' }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// Alumni Berprestasi Section - Same style as MobileAchievements
function MobileAlumniBerprestasi() {
    // Alumni berprestasi - nantinya akan diambil dari API/admin
    const originalAlumni = [
        {
            id: 1,
            name: 'Dr. I Wayan Sudana',
            year: '1985',
            profession: 'Dokter Spesialis Jantung',
            achievement: 'Tiga tahun bukanlah waktu yang singkat buat saya untuk menjadi bagian dari keluarga besar SMA Negeri 1 Denpasar. Selama menempuh pendidikan di sekolah ini, saya mendapatkan banyak pengalaman berharga untuk membentuk karakter dan memperluas wawasan.',
            category: 'Kedokteran',
            institution: 'RSUP Sanglah',
            photo: '/alumni/alumni-1.jpg',
            color: 'from-red-400 to-rose-500',
            glowColor: 'rgba(251, 113, 133, 0.4)',
        },
        {
            id: 2,
            name: 'Ni Made Dewi Lestari',
            year: '1992',
            profession: 'CEO & Founder',
            achievement: 'Terima kasih kepada para guru atas dedikasi dan ilmu yang telah diberikan, serta kepada teman-teman atas kebersamaan yang hangat. Semoga semua kenangan ini menjadi pijakan untuk meraih masa depan yang lebih baik.',
            category: 'Entrepreneur',
            institution: 'Tech Startup Bali',
            photo: '/alumni/alumni-2.jpg',
            color: 'from-purple-400 to-violet-500',
            glowColor: 'rgba(167, 139, 250, 0.4)',
        },
        {
            id: 3,
            name: 'I Gede Putra Wijaya',
            year: '2005',
            profession: 'Diplomat',
            achievement: 'SMANSA mengajarkan saya tentang pentingnya integritas, kerja keras, dan semangat pantang menyerah. Pengalaman organisasi dan lomba debat di sini sangat membantu karir diplomatik saya di kancah internasional.',
            category: 'Diplomat',
            institution: 'Kementerian Luar Negeri RI',
            photo: '/alumni/alumni-3.jpg',
            color: 'from-blue-400 to-cyan-500',
            glowColor: 'rgba(96, 165, 250, 0.4)',
        },
        {
            id: 4,
            name: 'Kadek Ayu Pratiwi',
            year: '2010',
            profession: 'Data Scientist',
            achievement: 'Guru-guru SMANSA mengajarkan saya untuk selalu curious dan never stop learning. Fondasi keilmuan yang kuat dari sekolah ini membawa saya hingga ke perusahaan teknologi terbesar di dunia.',
            category: 'Teknologi',
            institution: 'Google Singapore',
            photo: '/alumni/alumni-4.jpg',
            color: 'from-green-400 to-emerald-500',
            glowColor: 'rgba(74, 222, 128, 0.4)',
        },
    ]

    // Clone items 3 times for infinite loop: [Set1, Set2(Active), Set3]
    const alumni = [...originalAlumni, ...originalAlumni, ...originalAlumni]
    const LOOP_START_INDEX = originalAlumni.length // 4
    const LOOP_END_INDEX = originalAlumni.length * 2 // 8
    const ITEM_WIDTH = 280 // w-[280px]
    const GAP_WIDTH = 16 // gap-4

    const [activeIndex, setActiveIndex] = useState(LOOP_START_INDEX)
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const isAutoScrolling = useRef(false)
    const isResetting = useRef(false)

    // Get the mapped original index for dots indicator
    const getOriginalIndex = (index: number) => {
        return index % originalAlumni.length
    }

    // Initial Scroll Position Setup
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2
            container.scrollLeft = (LOOP_START_INDEX * totalItemWidth) - centerOffset
        }
    }, [])

    // Auto scroll timer
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            isAutoScrolling.current = true
            setActiveIndex((prev) => prev + 1)
        }, 3500)

        return () => clearInterval(interval)
    }, [isPaused])

    // Scroll Logic & Infinite Loop Reset
    useEffect(() => {
        if (isResetting.current) return

        if (scrollRef.current && isAutoScrolling.current && !isPaused) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

            container.scrollTo({
                left: (activeIndex * totalItemWidth) - centerOffset,
                behavior: 'smooth'
            })

            if (activeIndex >= LOOP_END_INDEX) {
                setTimeout(() => {
                    isResetting.current = true
                    const resetIndex = activeIndex - originalAlumni.length

                    setActiveIndex(resetIndex)
                    container.scrollLeft = (resetIndex * totalItemWidth) - centerOffset

                    isAutoScrolling.current = false
                    setTimeout(() => { isResetting.current = false }, 50)
                }, 400)
            } else {
                setTimeout(() => {
                    isAutoScrolling.current = false
                }, 400)
            }
        }
    }, [activeIndex, isPaused, originalAlumni.length])

    // Handler for User Interaction
    const handleInteractionStart = () => {
        setIsPaused(true)
        isAutoScrolling.current = false
        if (timerRef.current) clearTimeout(timerRef.current)
    }

    const handleInteractionEnd = () => {
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 3000)
    }

    // Sync activeIndex during manual scroll
    const handleScroll = () => {
        if (!scrollRef.current || isResetting.current) return

        const container = scrollRef.current
        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2

        const scrollPos = container.scrollLeft + centerOffset
        const newIndex = Math.round(scrollPos / totalItemWidth)

        if (newIndex >= 0 && newIndex < alumni.length && newIndex !== activeIndex) {
            if (!isAutoScrolling.current) {
                setActiveIndex(newIndex)
            }
        }
    }

    // Correction on TouchEnd for manual infinite loop
    const handleTouchEndReset = () => {
        handleInteractionEnd()

        const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
        const centerOffset = scrollRef.current ? (scrollRef.current.clientWidth - ITEM_WIDTH) / 2 : 0

        if (activeIndex >= LOOP_END_INDEX) {
            const resetIndex = activeIndex - originalAlumni.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
        if (activeIndex < LOOP_START_INDEX) {
            const resetIndex = activeIndex + originalAlumni.length
            setActiveIndex(resetIndex)
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = (resetIndex * totalItemWidth) - centerOffset
            }
        }
    }

    // Navigate to specific original index
    const navigateToIndex = (originalIndex: number) => {
        const targetIndex = LOOP_START_INDEX + originalIndex
        setIsPaused(true)
        isAutoScrolling.current = true
        setActiveIndex(targetIndex)

        if (scrollRef.current) {
            const container = scrollRef.current
            const totalItemWidth = ITEM_WIDTH + GAP_WIDTH
            const centerOffset = (container.clientWidth - ITEM_WIDTH) / 2
            container.scrollTo({
                left: (targetIndex * totalItemWidth) - centerOffset,
                behavior: 'smooth'
            })
        }

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(false)
            isAutoScrolling.current = false
        }, 3000)
    }

    return (
        <div className="px-4 mb-4 mt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tentang Alumni</h2>
                <Link href="/alumni" className="text-sm font-semibold text-blue-600 dark:text-blue-400
                    flex items-center gap-1">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Carousel - Same style as Achievements */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto py-6 -mx-4 px-4 scrollbar-hide"
                style={{ scrollSnapType: 'x mandatory' }}
                onScroll={handleScroll}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleTouchEndReset}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
            >
                {alumni.map((person, index) => {
                    const isActive = index === activeIndex
                    return (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[280px] snap-center transition-all duration-300 ease-out"
                            style={{
                                transform: isActive ? 'scale(1)' : 'scale(0.88)',
                                opacity: isActive ? 1 : 0.45,
                                filter: isActive ? 'blur(0px)' : 'blur(2px)',
                            }}
                            onClick={() => navigateToIndex(getOriginalIndex(index))}
                        >
                            <div
                                className="glass-achievement-card h-full transition-all duration-300 overflow-hidden"
                                style={{
                                    boxShadow: isActive
                                        ? `0 15px 35px -10px ${person.glowColor}, 0 8px 20px -5px rgba(0, 0, 0, 0.15)`
                                        : 'none',
                                    transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                                    padding: 0,
                                }}
                            >
                                {/* Alumni Photo */}
                                <div className="relative w-full h-52 overflow-hidden">
                                    <Image
                                        src={person.photo}
                                        alt={person.name}
                                        fill
                                        className="object-cover object-top transition-transform duration-500"
                                        style={{
                                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                        sizes="200px"
                                    />
                                    {/* Gradient Overlay */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t ${person.color} opacity-30`}
                                    />
                                    {/* Year Badge */}
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <span className="text-[10px] font-bold text-white">Alumni {person.year}</span>
                                    </div>
                                    {/* Category Badge */}
                                    <div
                                        className={`absolute bottom-2 left-2 px-2 py-1 bg-gradient-to-br ${person.color} rounded-lg 
                                            flex items-center gap-1 shadow-lg transition-all duration-300`}
                                        style={{
                                            transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: isActive ? `0 4px 12px -2px ${person.glowColor}` : undefined
                                        }}
                                    >
                                        <GraduationCap className="w-3 h-3 text-white" />
                                        <span className="text-[9px] font-bold text-white">{person.category}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 m-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 line-clamp-1">
                                        {person.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        {person.profession} • {person.institution}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                        "{person.achievement}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Dots Indicator - Synced to ORIGINAL array index */}
            <div className="flex justify-center gap-2 mt-3">
                {originalAlumni.map((person, i) => {
                    const isActiveDot = getOriginalIndex(activeIndex) === i
                    return (
                        <button
                            key={i}
                            onClick={() => navigateToIndex(i)}
                            className="relative transition-all duration-300 ease-out"
                            aria-label={`Go to ${person.name}`}
                        >
                            <span
                                className={`block rounded-full transition-all duration-300
                                    ${isActiveDot
                                        ? 'w-6 h-2 bg-gradient-to-r from-purple-500 to-pink-500'
                                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                            />
                            {isActiveDot && (
                                <span
                                    className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping"
                                    style={{ animationDuration: '1.5s' }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
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

export function MobileView({ posts, achievements, alumni, galleries }: MobileViewProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 
            dark:from-[#111827] dark:via-[#111827] dark:to-[#111827]">
            <MobileHero />
            <div className="mt-8"></div>
            <MobilePrincipal />
            <MobileAchievements />
            <MobileNews posts={posts} />
            <MobileAlumniBerprestasi />

            {/* Bottom Spacing for mobile nav */}
            <div className="h-20" />
        </div>
    )
}
