'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface FilterOption {
    label: string
    value: string
    count?: number
}

interface FilterBarProps {
    filters: FilterOption[]
    currentFilter?: string
    onFilterChange: (value: string) => void
    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    showSearch?: boolean
    showAllOption?: boolean
    allLabel?: string
    className?: string
}

export function FilterBar({
    filters,
    currentFilter,
    onFilterChange,
    searchPlaceholder = 'Cari...',
    searchValue = '',
    onSearchChange,
    showSearch = true,
    showAllOption = true,
    allLabel = 'Semua',
    className = '',
}: FilterBarProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const allFilters = showAllOption
        ? [{ label: allLabel, value: '' }, ...filters]
        : filters

    return (
        <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-2 ${className}`}>
            <div className="flex items-center gap-2">
                {/* Filter Pills */}
                <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide py-1 px-1">
                    {allFilters.map((filter) => {
                        const isActive = currentFilter === filter.value || (!currentFilter && filter.value === '')
                        return (
                            <button
                                key={filter.value}
                                onClick={() => onFilterChange(filter.value)}
                                className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"
                                        transition={{ type: 'spring', duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {filter.label}
                                    {filter.count !== undefined && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive
                                            ? 'bg-white/20'
                                            : 'bg-slate-100 dark:bg-slate-700'
                                            }`}>
                                            {filter.count}
                                        </span>
                                    )}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Search Toggle/Input */}
                {showSearch && (
                    <div className="flex-shrink-0">
                        <AnimatePresence mode="wait">
                            {isSearchOpen ? (
                                <motion.div
                                    key="search-input"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 'auto', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden"
                                >
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => onSearchChange?.(e.target.value)}
                                        placeholder={searchPlaceholder}
                                        className="w-40 md:w-56 px-4 py-2 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            setIsSearchOpen(false)
                                            onSearchChange?.('')
                                        }}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        aria-label="Tutup pencarian"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="search-button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    aria-label="Buka pencarian"
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

// Simpler version for inline filters
interface InlineFilterProps {
    filters: FilterOption[]
    currentFilter?: string
    onFilterChange: (value: string) => void
    size?: 'sm' | 'md'
    className?: string
}

export function InlineFilter({
    filters,
    currentFilter,
    onFilterChange,
    size = 'md',
    className = '',
}: InlineFilterProps) {
    const sizeClasses = size === 'sm'
        ? 'px-3 py-1.5 text-xs'
        : 'px-4 py-2 text-sm'

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value
                return (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`${sizeClasses} rounded-full font-medium transition-all duration-300 ${isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {filter.label}
                    </button>
                )
            })}
        </div>
    )
}
