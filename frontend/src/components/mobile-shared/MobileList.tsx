'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface MobileListItem {
    id: string | number
    title: string
    subtitle?: string
    description?: string
    icon?: ReactNode
    badge?: string
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
    href?: string
    onClick?: () => void
}

interface MobileListProps {
    items: MobileListItem[]
    variant?: 'default' | 'compact'
}

export function MobileList({
    items,
    variant = 'default'
}: MobileListProps) {
    const renderItem = (item: MobileListItem, index: number) => {
        const content = (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform flex items-center gap-3"
            >
                {/* Icon */}
                {item.icon && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {item.icon}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {item.title}
                        </h3>
                        {item.badge && (
                            <Badge variant={item.badgeVariant || 'default'} className="flex-shrink-0 text-xs">
                                {item.badge}
                            </Badge>
                        )}
                    </div>

                    {item.subtitle && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {item.subtitle}
                        </p>
                    )}

                    {item.description && variant !== 'compact' && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Chevron */}
                {(item.href || item.onClick) && (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
            </motion.div>
        )

        if (item.href) {
            return (
                <Link key={item.id} href={item.href}>
                    {content}
                </Link>
            )
        }

        if (item.onClick) {
            return (
                <button key={item.id} onClick={item.onClick} className="w-full">
                    {content}
                </button>
            )
        }

        return <div key={item.id}>{content}</div>
    }

    return (
        <div className="space-y-3">
            {items.map((item, index) => renderItem(item, index))}
        </div>
    )
}
