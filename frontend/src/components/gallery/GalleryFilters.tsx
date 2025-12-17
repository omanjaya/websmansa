'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Camera, Video, Image } from 'lucide-react'
import { useState, useTransition } from 'react'

const typeOptions = [
    { value: '', label: 'Semua Tipe', icon: Image },
    { value: 'photo', label: 'Foto', icon: Camera },
    { value: 'video', label: 'Video', icon: Video },
]

export default function GalleryFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const currentType = searchParams.get('type') || ''

    const handleTypeChange = (type: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (type) {
            params.set('type', type)
        } else {
            params.delete('type')
        }
        params.delete('page') // Reset to page 1

        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())

        if (search.trim()) {
            params.set('search', search.trim())
        } else {
            params.delete('search')
        }
        params.delete('page') // Reset to page 1

        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    const handleClearSearch = () => {
        setSearch('')
        const params = new URLSearchParams(searchParams.toString())
        params.delete('search')
        params.delete('page')

        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari galeri..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Type Filter */}
                <div className="flex gap-2">
                    {typeOptions.map((option) => {
                        const Icon = option.icon
                        const isActive = currentType === option.value

                        return (
                            <button
                                key={option.value}
                                onClick={() => handleTypeChange(option.value)}
                                disabled={isPending}
                                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{option.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Active Filters Display */}
            {(search || currentType) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">Filter aktif:</span>
                        {search && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                Pencarian: &quot;{search}&quot;
                            </span>
                        )}
                        {currentType && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                Tipe:{' '}
                                {typeOptions.find((t) => t.value === currentType)?.label}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
