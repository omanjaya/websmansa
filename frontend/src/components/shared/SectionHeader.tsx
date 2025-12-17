'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
    label?: string
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right'
    className?: string
    titleClassName?: string
    dark?: boolean
}

export function SectionHeader({
    label,
    title,
    subtitle,
    align = 'center',
    className,
    titleClassName,
    dark = false
}: SectionHeaderProps) {
    const alignmentClasses = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className={cn(
                'flex flex-col mb-12 md:mb-16',
                alignmentClasses[align],
                className
            )}
        >
            {label && (
                <div className={cn(
                    'inline-flex items-center gap-3 mb-4',
                    align === 'center' && 'justify-center'
                )}>
                    <span className="w-8 h-[1px] bg-slate-300 dark:bg-slate-600" />
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">
                        {label}
                    </span>
                    <span className="w-8 h-[1px] bg-slate-300 dark:bg-slate-600" />
                </div>
            )}

            <h2 className={cn(
                'font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight',
                dark ? 'text-white' : 'text-slate-900 dark:text-white',
                titleClassName
            )}>
                {title}
            </h2>

            {subtitle && (
                <p className={cn(
                    'mt-4 text-lg max-w-2xl',
                    dark ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400',
                    align === 'center' && 'mx-auto'
                )}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    )
}
