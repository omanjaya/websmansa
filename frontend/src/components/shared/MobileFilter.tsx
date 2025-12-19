'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Filter, ChevronDown, Search, Check } from 'lucide-react'

interface FilterOption {
    label: string
    value: string
    count?: number
}

interface MobileFilterSheetProps {
    filters: FilterOption[]
    currentFilter?: string
    onFilterChange: (value: string) => void
    title?: string
    showSearch?: boolean
    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    showAllOption?: boolean
    allLabel?: string
}

export function MobileFilterSheet({
    filters,
    currentFilter,
    onFilterChange,
    title = 'Filter',
    showSearch = false,
    searchPlaceholder = 'Cari...',
    searchValue = '',
    onSearchChange,
    showAllOption = true,
    allLabel = 'Semua',
}: MobileFilterSheetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [localSearch, setLocalSearch] = useState(searchValue)
    const dragControls = useDragControls()
    const sheetRef = useRef<HTMLDivElement>(null)

    // Get current filter label
    const currentLabel = currentFilter
        ? filters.find(f => f.value === currentFilter)?.label || currentFilter
        : allLabel

    // Handle filter selection
    const handleSelect = (value: string) => {
        onFilterChange(value)
        setIsOpen(false)
    }

    // Handle search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange?.(localSearch)
        }, 300)
        return () => clearTimeout(timer)
    }, [localSearch, onSearchChange])

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full"
            >
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="flex-1 text-left text-slate-700 dark:text-slate-300 font-medium">
                    {currentLabel}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Bottom Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            ref={sheetRef}
                            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 max-h-[80vh] md:hidden"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            drag="y"
                            dragControls={dragControls}
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 100) {
                                    setIsOpen(false)
                                }
                            }}
                        >
                            {/* Handle */}
                            <div
                                className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {title}
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    aria-label="Tutup filter"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Search */}
                            {showSearch && (
                                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={localSearch}
                                            onChange={(e) => setLocalSearch(e.target.value)}
                                            placeholder={searchPlaceholder}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Options */}
                            <div className="overflow-y-auto max-h-[50vh] p-3">
                                {showAllOption && (
                                    <button
                                        onClick={() => handleSelect('')}
                                        className={`flex items-center w-full px-4 py-3 rounded-xl text-left transition-colors ${!currentFilter
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="flex-1 font-medium">{allLabel}</span>
                                        {!currentFilter && (
                                            <Check className="w-5 h-5 text-blue-500" />
                                        )}
                                    </button>
                                )}

                                {filters.map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => handleSelect(filter.value)}
                                        className={`flex items-center w-full px-4 py-3 rounded-xl text-left transition-colors ${currentFilter === filter.value
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="flex-1 font-medium">{filter.label}</span>
                                        {filter.count !== undefined && (
                                            <span className="text-sm text-slate-500 mr-3">
                                                {filter.count}
                                            </span>
                                        )}
                                        {currentFilter === filter.value && (
                                            <Check className="w-5 h-5 text-blue-500" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Safe area */}
                            <div className="h-safe-bottom" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

// Multi-filter bottom sheet
interface MultiFilterOption {
    key: string
    label: string
    options: FilterOption[]
    currentValue?: string
}

interface MultiFilterSheetProps {
    filters: MultiFilterOption[]
    onFilterChange: (key: string, value: string) => void
    title?: string
}

export function MultiFilterSheet({
    filters,
    onFilterChange,
    title = 'Filter',
}: MultiFilterSheetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(filters[0]?.key)
    const dragControls = useDragControls()

    // Get active filter count
    const activeCount = filters.filter(f => f.currentValue).length

    // Get current active filter option
    const activeFilter = filters.find(f => f.key === activeTab)

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Filter
                </span>
                {activeCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Bottom Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 max-h-[85vh] md:hidden flex flex-col"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            drag="y"
                            dragControls={dragControls}
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 100) {
                                    setIsOpen(false)
                                }
                            }}
                        >
                            {/* Handle */}
                            <div
                                className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            filters.forEach(f => onFilterChange(f.key, ''))
                                        }}
                                        className="text-sm text-blue-500 font-medium"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        aria-label="Tutup filter"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setActiveTab(filter.key)}
                                        className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-colors relative ${activeTab === filter.key
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        {filter.label}
                                        {filter.currentValue && (
                                            <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                                        )}
                                        {activeTab === filter.key && (
                                            <motion.div
                                                layoutId="activeFilterTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Options */}
                            <div className="flex-1 overflow-y-auto p-3">
                                {activeFilter && (
                                    <>
                                        <button
                                            onClick={() => onFilterChange(activeFilter.key, '')}
                                            className={`flex items-center w-full px-4 py-3 rounded-xl text-left transition-colors ${!activeFilter.currentValue
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <span className="flex-1 font-medium">Semua</span>
                                            {!activeFilter.currentValue && (
                                                <Check className="w-5 h-5 text-blue-500" />
                                            )}
                                        </button>

                                        {activeFilter.options.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => onFilterChange(activeFilter.key, option.value)}
                                                className={`flex items-center w-full px-4 py-3 rounded-xl text-left transition-colors ${activeFilter.currentValue === option.value
                                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <span className="flex-1 font-medium">{option.label}</span>
                                                {option.count !== undefined && (
                                                    <span className="text-sm text-slate-500 mr-3">
                                                        {option.count}
                                                    </span>
                                                )}
                                                {activeFilter.currentValue === option.value && (
                                                    <Check className="w-5 h-5 text-blue-500" />
                                                )}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Apply Button */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
                                >
                                    Terapkan Filter
                                </button>
                            </div>

                            {/* Safe area */}
                            <div className="h-safe-bottom" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
