'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionProps {
    children: ReactNode
    background?: 'white' | 'slate' | 'gradient' | 'transparent'
    className?: string
    containerClassName?: string
    showDivider?: boolean
    dividerPosition?: 'top' | 'bottom' | 'both'
    padding?: 'none' | 'small' | 'medium' | 'large'
    animate?: boolean
    id?: string
}

const backgroundVariants = {
    white: 'bg-white dark:bg-slate-950',
    slate: 'bg-slate-50 dark:bg-slate-900',
    gradient: 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900',
    transparent: 'bg-transparent',
}

const paddingVariants = {
    none: '',
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-16',
    large: 'py-16 md:py-24',
}

export function Section({
    children,
    background = 'white',
    className = '',
    containerClassName = '',
    showDivider = false,
    dividerPosition = 'bottom',
    padding = 'medium',
    animate = true,
    id,
}: SectionProps) {
    const Wrapper = animate ? motion.section : 'section'
    const animationProps = animate
        ? {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-100px' },
            transition: { duration: 0.6, ease: 'easeOut' as const },
        }
        : {}

    return (
        <>
            {showDivider && (dividerPosition === 'top' || dividerPosition === 'both') && (
                <div className="section-divider" />
            )}
            <Wrapper
                id={id}
                className={`${backgroundVariants[background]} ${paddingVariants[padding]} ${className}`}
                {...animationProps}
            >
                <div className={`container mx-auto px-4 ${containerClassName}`}>
                    {children}
                </div>
            </Wrapper>
            {showDivider && (dividerPosition === 'bottom' || dividerPosition === 'both') && (
                <div className="section-divider" />
            )}
        </>
    )
}

// Section Header sub-component for consistency
interface SectionTitleProps {
    badge?: {
        icon: React.ElementType
        label: string
        color?: 'blue' | 'purple' | 'gold' | 'green' | 'red'
    }
    title: string
    gradientText?: string
    subtitle?: string
    align?: 'left' | 'center'
    className?: string
}

const badgeColorVariants = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-100 dark:border-blue-800/50',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'text-blue-600 dark:text-blue-400',
        gradient: 'from-blue-600 to-cyan-500',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        border: 'border-purple-100 dark:border-purple-800/50',
        text: 'text-purple-700 dark:text-purple-300',
        icon: 'text-purple-600 dark:text-purple-400',
        gradient: 'from-purple-500 to-pink-500',
    },
    gold: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/30',
        border: 'border-yellow-100 dark:border-yellow-800/50',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: 'text-yellow-600 dark:text-yellow-400',
        gradient: 'from-yellow-500 to-orange-500',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        border: 'border-green-100 dark:border-green-800/50',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400',
        gradient: 'from-green-500 to-emerald-500',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        border: 'border-red-100 dark:border-red-800/50',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400',
        gradient: 'from-red-500 to-rose-500',
    },
}

export function SectionTitle({
    badge,
    title,
    gradientText,
    subtitle,
    align = 'center',
    className = '',
}: SectionTitleProps) {
    const color = badge?.color || 'blue'
    const colors = badgeColorVariants[color]
    const BadgeIcon = badge?.icon

    return (
        <div className={`mb-10 md:mb-12 ${align === 'center' ? 'text-center' : ''} ${className}`}>
            {badge && BadgeIcon && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border} mb-4`}>
                    <BadgeIcon className={`w-4 h-4 ${colors.icon}`} />
                    <span className={`text-sm font-semibold ${colors.text}`}>
                        {badge.label}
                    </span>
                </div>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {title}{' '}
                {gradientText && (
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient}`}>
                        {gradientText}
                    </span>
                )}
            </h2>
            {subtitle && (
                <p className={`mt-4 text-lg text-slate-600 dark:text-slate-400 ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}
