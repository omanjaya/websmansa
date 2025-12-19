'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    glow?: boolean
    glowColor?: 'blue' | 'purple' | 'gold' | 'green' | 'red'
    padding?: 'none' | 'small' | 'medium' | 'large'
    rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    animate?: boolean
    onClick?: () => void
}

const glowColors = {
    blue: 'hover:ring-blue-400/30',
    purple: 'hover:ring-purple-400/30',
    gold: 'hover:ring-yellow-400/30',
    green: 'hover:ring-green-400/30',
    red: 'hover:ring-red-400/30',
}

const paddingVariants = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
}

const roundedVariants = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
}

export function GlassCard({
    children,
    className = '',
    hover = true,
    glow = false,
    glowColor = 'blue',
    padding = 'medium',
    rounded = '2xl',
    animate = false,
    onClick,
}: GlassCardProps) {
    const baseClasses = `
        bg-white/80 dark:bg-slate-800/80
        backdrop-blur-md
        border border-white/20 dark:border-slate-700/50
        shadow-lg
        ${roundedVariants[rounded]}
        ${paddingVariants[padding]}
    `

    const hoverClasses = hover
        ? `
            transition-all duration-300
            hover:shadow-xl 
            hover:border-white/40 dark:hover:border-slate-600/50
            hover:-translate-y-1
            ${glow ? `hover:ring-2 ${glowColors[glowColor]}` : ''}
        `
        : ''

    const clickClasses = onClick ? 'cursor-pointer' : ''

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
                onClick={onClick}
            >
                {children}
            </motion.div>
        )
    }

    return (
        <div
            className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

// Solid card variant (no glassmorphism)
interface SolidCardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    padding?: 'none' | 'small' | 'medium' | 'large'
    rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    onClick?: () => void
}

export function SolidCard({
    children,
    className = '',
    hover = true,
    padding = 'medium',
    rounded = '2xl',
    onClick,
}: SolidCardProps) {
    const baseClasses = `
        bg-white dark:bg-slate-800
        border border-slate-100 dark:border-slate-700
        shadow-lg
        ${roundedVariants[rounded]}
        ${paddingVariants[padding]}
    `

    const hoverClasses = hover
        ? `
            transition-all duration-300
            hover:shadow-xl
            hover:border-slate-200 dark:hover:border-slate-600
            hover:-translate-y-1
        `
        : ''

    const clickClasses = onClick ? 'cursor-pointer' : ''

    return (
        <div
            className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
