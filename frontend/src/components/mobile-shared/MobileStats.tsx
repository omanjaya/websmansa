'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

export interface MobileStat {
    label: string
    value: string | number
    icon: LucideIcon
    color?: string
}

interface MobileStatsProps {
    stats: MobileStat[]
    layout?: '4-col' | '2x2'
}

export function MobileStats({
    stats,
    layout = '4-col'
}: MobileStatsProps) {
    const gridClass = layout === '4-col' ? 'grid-cols-4' : 'grid-cols-2'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4"
        >
            <div className={`grid ${gridClass} gap-4`}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    const isNumber = typeof stat.value === 'number'

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className={`w-10 h-10 rounded-xl ${stat.color || 'bg-blue-50 dark:bg-blue-900/20'} flex items-center justify-center mb-2`}>
                                <Icon className={`w-5 h-5 ${stat.color ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                            </div>

                            {isNumber ? (
                                <StatValue value={stat.value as number} />
                            ) : (
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {stat.value}
                                </div>
                            )}

                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {stat.label}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}

function StatValue({ value }: { value: number }) {
    const { count, ref } = useCountUp(value, 2000)

    return (
        <div ref={ref} className="text-lg font-bold text-slate-900 dark:text-white">
            {count.toLocaleString()}
        </div>
    )
}
