'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, LucideIcon } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href: string
}

interface StatItem {
    label: string
    value: string
}

interface BadgeProps {
    icon: LucideIcon
    label: string
    color: 'blue' | 'purple' | 'gold' | 'green' | 'red'
}

interface PageHeroProps {
    title: string
    subtitle?: string
    badge?: BadgeProps
    backgroundImage?: string
    stats?: StatItem[]
    breadcrumbs?: BreadcrumbItem[]
    height?: 'full' | 'large' | 'medium' | 'small'
    overlay?: 'dark' | 'gradient' | 'light'
    align?: 'left' | 'center'
    children?: React.ReactNode
}

const colorVariants = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-100 dark:border-blue-800/50',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        border: 'border-purple-100 dark:border-purple-800/50',
        text: 'text-purple-700 dark:text-purple-300',
        icon: 'text-purple-600 dark:text-purple-400',
    },
    gold: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/30',
        border: 'border-yellow-100 dark:border-yellow-800/50',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: 'text-yellow-600 dark:text-yellow-400',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        border: 'border-green-100 dark:border-green-800/50',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        border: 'border-red-100 dark:border-red-800/50',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400',
    },
}

const heightVariants = {
    full: 'min-h-screen',
    large: 'min-h-[70vh]',
    medium: 'min-h-[50vh]',
    small: 'min-h-[35vh]',
}

const overlayVariants = {
    dark: 'bg-black/60',
    gradient: 'bg-gradient-to-t from-black/80 via-black/40 to-black/10',
    light: 'bg-black/30',
}

export function PageHero({
    title,
    subtitle,
    badge,
    backgroundImage = '/hero-bg.png',
    stats,
    breadcrumbs,
    height = 'medium',
    overlay = 'gradient',
    align = 'center',
    children,
}: PageHeroProps) {
    const badgeColor = badge ? colorVariants[badge.color] : null
    const BadgeIcon = badge?.icon

    return (
        <section className={`relative ${heightVariants[height]} flex items-center overflow-hidden`}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay */}
                <div className={`absolute inset-0 ${overlayVariants[overlay]}`} />
            </div>

            {/* Content - pt-20 lg:pt-24 accounts for header height, pb-8 gives bottom space */}
            <div className={`relative z-10 w-full pt-20 lg:pt-24 pb-8 md:pb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <motion.nav
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`mb-6 ${align === 'center' ? 'flex justify-center' : ''}`}
                        >
                            <ol className="flex items-center gap-2 text-sm text-white/70">
                                <li>
                                    <Link href="/" className="hover:text-white transition-colors">
                                        Beranda
                                    </Link>
                                </li>
                                {breadcrumbs.map((crumb, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4" />
                                        {index === breadcrumbs.length - 1 ? (
                                            <span className="text-white font-medium">{crumb.label}</span>
                                        ) : (
                                            <Link href={crumb.href} className="hover:text-white transition-colors">
                                                {crumb.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </motion.nav>
                    )}

                    {/* Badge */}
                    {badge && badgeColor && BadgeIcon && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badgeColor.bg} border ${badgeColor.border} backdrop-blur-sm mb-4`}
                        >
                            <BadgeIcon className={`w-4 h-4 ${badgeColor.icon}`} />
                            <span className={`text-sm font-semibold ${badgeColor.text}`}>
                                {badge.label}
                            </span>
                        </motion.div>
                    )}

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                    >
                        {title}
                    </motion.h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className={`text-lg md:text-xl text-white/80 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {/* Custom Children */}
                    {children && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-6"
                        >
                            {children}
                        </motion.div>
                    )}

                    {/* Stats */}
                    {stats && stats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className={`mt-10 flex flex-wrap gap-4 md:gap-8 ${align === 'center' ? 'justify-center' : ''}`}
                        >
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 min-w-[120px]"
                                >
                                    <div className="text-2xl md:text-3xl font-bold text-white">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-white/70">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-20" />
        </section>
    )
}
