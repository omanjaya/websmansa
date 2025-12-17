'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export interface MobileFilterOption {
    label: string
    value: string
    count?: number
    href?: string
}

interface MobileFilterProps {
    options: MobileFilterOption[]
    selected?: string
    onChange?: (value: string) => void
    baseUrl?: string
}

export function MobileFilter({
    options,
    selected,
    onChange,
    baseUrl
}: MobileFilterProps) {
    const renderFilterChip = (option: MobileFilterOption, index: number) => {
        const isSelected = selected === option.value || (!selected && option.value === 'all')

        const className = `
            flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
            ${isSelected
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
            }
            active:scale-95
        `

        const content = (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={className}
            >
                <span>{option.label}</span>
                {option.count !== undefined && (
                    <span className={`ml-1.5 ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        ({option.count})
                    </span>
                )}
            </motion.div>
        )

        if (option.href || baseUrl) {
            const href = option.href || (baseUrl ? `${baseUrl}${option.value !== 'all' ? `?category=${option.value}` : ''}` : '#')
            return (
                <Link key={option.value} href={href}>
                    {content}
                </Link>
            )
        }

        if (onChange) {
            return (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className="focus:outline-none"
                >
                    {content}
                </button>
            )
        }

        return <div key={option.value}>{content}</div>
    }

    return (
        <div className="-mx-4 px-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {options.map((option, index) => renderFilterChip(option, index))}
            </div>
        </div>
    )
}
