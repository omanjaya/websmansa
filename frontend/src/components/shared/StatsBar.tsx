'use client'

import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatItemProps {
    value: number
    label: string
    suffix?: string
    icon?: LucideIcon
    delay?: number
}

function StatItem({ value, label, suffix = '+', icon: Icon, delay = 0 }: StatItemProps) {
    const { count, ref } = useCountUp(value, 2000)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="flex-1 text-center px-4 md:px-8 py-4"
        >
            <div className="flex flex-col items-center gap-2">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                )}
                <span className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white">
                    {count > 1000 ? `${(count / 1000).toFixed(0)}k` : count}{suffix}
                </span>
                <span className="text-xs md:text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {label}
                </span>
            </div>
        </motion.div>
    )
}

interface StatsBarProps {
    stats: Array<{
        value: number
        label: string
        suffix?: string
        icon?: LucideIcon
    }>
    variant?: 'floating' | 'inline' | 'card'
    className?: string
}

export function StatsBar({ stats, variant = 'floating', className }: StatsBarProps) {
    const variantClasses = {
        floating: 'floating-stats-bar py-6 md:py-8',
        inline: 'bg-transparent',
        card: 'bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg py-6 md:py-8'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(variantClasses[variant], className)}
        >
            <div className="flex flex-wrap justify-center divide-x divide-slate-200 dark:divide-slate-700">
                {stats.map((stat, index) => (
                    <StatItem
                        key={stat.label}
                        value={stat.value}
                        label={stat.label}
                        suffix={stat.suffix}
                        icon={stat.icon}
                        delay={index * 0.1}
                    />
                ))}
            </div>
        </motion.div>
    )
}
