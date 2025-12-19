'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Glass Card with gradient border
interface GradientBorderCardProps {
    children: ReactNode
    className?: string
    gradientFrom?: string
    gradientTo?: string
    gradientVia?: string
    hoverGlow?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
    onClick?: () => void
    href?: string
}

export function GradientBorderCard({
    children,
    className = '',
    gradientFrom = 'from-blue-500',
    gradientTo = 'to-purple-500',
    gradientVia,
    hoverGlow = true,
    padding = 'md',
    onClick,
    href,
}: GradientBorderCardProps) {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4 md:p-5',
        lg: 'p-5 md:p-6',
    }

    const gradientClass = gradientVia
        ? `${gradientFrom} ${gradientVia} ${gradientTo}`
        : `${gradientFrom} ${gradientTo}`

    const content = (
        <motion.div
            className={`relative group ${className}`}
            whileHover={hoverGlow ? { scale: 1.02, y: -5 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onClick}
        >
            {/* Gradient border */}
            <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${gradientClass} opacity-50 group-hover:opacity-100 transition-opacity duration-300 blur-[1px]`} />

            {/* Glow effect on hover */}
            {hoverGlow && (
                <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl`} />
            )}

            {/* Content */}
            <div className={`relative bg-white dark:bg-slate-900 rounded-2xl ${paddingClasses[padding]} border border-transparent`}>
                {children}
            </div>
        </motion.div>
    )

    if (href) {
        return <Link href={href} className="block">{content}</Link>
    }

    return content
}

// Featured Card with spotlight effect
interface SpotlightCardProps {
    children: ReactNode
    className?: string
    color?: 'blue' | 'purple' | 'gold' | 'green' | 'red'
}

export function SpotlightCard({
    children,
    className = '',
    color = 'blue'
}: SpotlightCardProps) {
    const colorVariants = {
        blue: 'from-blue-500/20 via-cyan-500/10 to-transparent',
        purple: 'from-purple-500/20 via-pink-500/10 to-transparent',
        gold: 'from-yellow-500/20 via-orange-500/10 to-transparent',
        green: 'from-green-500/20 via-emerald-500/10 to-transparent',
        red: 'from-red-500/20 via-rose-500/10 to-transparent',
    }

    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 ${className}`}
            whileHover="hover"
            initial="initial"
        >
            {/* Spotlight effect */}
            <motion.div
                className={`absolute inset-0 bg-gradient-radial ${colorVariants[color]}`}
                variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    hover: { opacity: 1, scale: 1.5 },
                }}
                transition={{ duration: 0.5 }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}

// Image Card with overlay gradient and animations
interface AnimatedImageCardProps {
    image: string
    title: string
    subtitle?: string
    badge?: string
    badgeColor?: 'blue' | 'purple' | 'gold' | 'green' | 'red'
    href?: string
    aspectRatio?: 'square' | '4/3' | '16/9' | '3/4'
    overlay?: 'gradient' | 'dark' | 'light'
    className?: string
}

export function AnimatedImageCard({
    image,
    title,
    subtitle,
    badge,
    badgeColor = 'blue',
    href,
    aspectRatio = '4/3',
    overlay = 'gradient',
    className = '',
}: AnimatedImageCardProps) {
    const aspectClasses = {
        square: 'aspect-square',
        '4/3': 'aspect-[4/3]',
        '16/9': 'aspect-video',
        '3/4': 'aspect-[3/4]',
    }

    const overlayClasses = {
        gradient: 'bg-gradient-to-t from-black/80 via-black/30 to-transparent',
        dark: 'bg-black/50',
        light: 'bg-white/50',
    }

    const badgeColors = {
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500',
        gold: 'from-yellow-500 to-orange-500',
        green: 'from-green-500 to-emerald-500',
        red: 'from-red-500 to-rose-500',
    }

    const content = (
        <motion.div
            className={`relative ${aspectClasses[aspectRatio]} rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Image */}
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayClasses[overlay]} opacity-70 group-hover:opacity-90 transition-opacity duration-300`} />

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />

            {/* Badge */}
            {badge && (
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${badgeColors[badgeColor]} shadow-lg`}>
                        {badge}
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <motion.h3
                    className="text-lg md:text-xl font-bold text-white drop-shadow-lg mb-1 line-clamp-2"
                    variants={{
                        initial: { y: 0 },
                        hover: { y: -5 },
                    }}
                >
                    {title}
                </motion.h3>
                {subtitle && (
                    <motion.p
                        className="text-sm text-white/80 line-clamp-1"
                        initial={{ opacity: 0.8, y: 0 }}
                        whileHover={{ opacity: 1, y: -3 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {/* Hover ring */}
            <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/50 rounded-xl md:rounded-2xl transition-all duration-300" />
        </motion.div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return content
}

// Stats Card with animated number
interface AnimatedStatCardProps {
    value: string | number
    label: string
    icon?: ReactNode
    color?: 'blue' | 'purple' | 'gold' | 'green' | 'red'
    className?: string
}

export function AnimatedStatCard({
    value,
    label,
    icon,
    color = 'blue',
    className = '',
}: AnimatedStatCardProps) {
    const colorVariants = {
        blue: {
            bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-600 dark:text-blue-400',
            icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
        },
        purple: {
            bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
            border: 'border-purple-200 dark:border-purple-800',
            text: 'text-purple-600 dark:text-purple-400',
            icon: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
        },
        gold: {
            bg: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-600 dark:text-yellow-400',
            icon: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
        },
        green: {
            bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-600 dark:text-green-400',
            icon: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
        },
        red: {
            bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-600 dark:text-red-400',
            icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
        },
    }

    const colors = colorVariants[color]

    return (
        <motion.div
            className={`relative p-5 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} overflow-hidden ${className}`}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="80" cy="20" r="40" fill="currentColor" className={colors.text} />
                </svg>
            </div>

            <div className="relative flex items-center gap-4">
                {icon && (
                    <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
                        {icon}
                    </div>
                )}
                <div>
                    <motion.p
                        className={`text-3xl font-bold ${colors.text}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        {value}
                    </motion.p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {label}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// Floating Action Card
interface FloatingCardProps {
    children: ReactNode
    className?: string
    floatDistance?: number
    floatDuration?: number
}

export function FloatingCard({
    children,
    className = '',
    floatDistance = 10,
    floatDuration = 4,
}: FloatingCardProps) {
    return (
        <motion.div
            className={`${className}`}
            animate={{
                y: [0, -floatDistance, 0],
            }}
            transition={{
                duration: floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    )
}

// Feature Card with icon
interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
    color?: 'blue' | 'purple' | 'gold' | 'green' | 'red'
    className?: string
}

export function FeatureCard({
    icon,
    title,
    description,
    color = 'blue',
    className = '',
}: FeatureCardProps) {
    const colorVariants = {
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500',
        gold: 'from-yellow-500 to-orange-500',
        green: 'from-green-500 to-emerald-500',
        red: 'from-red-500 to-rose-500',
    }

    return (
        <motion.div
            className={`relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden group ${className}`}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Gradient glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorVariants[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorVariants[color]} flex items-center justify-center mb-4 text-white shadow-lg`}>
                {icon}
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {description}
            </p>

            {/* Bottom gradient line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorVariants[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </motion.div>
    )
}
