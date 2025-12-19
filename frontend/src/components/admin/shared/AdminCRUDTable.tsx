'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Trash2, Eye, Edit, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'

export interface Column<T> {
    key: string
    label: string
    render?: (item: T) => React.ReactNode
    sortable?: boolean
    width?: string
}

export interface StatConfig<T> {
    label: string
    value: (data: T[]) => number | string
    icon?: React.ReactNode
    color?: string
}

interface AdminCRUDTableProps<T> {
    // Data
    data: T[]
    isLoading?: boolean
    error?: Error | null

    // Columns
    columns: Column<T>[]

    // Actions
    onDelete?: (id: number | string) => Promise<void>
    onBulkDelete?: (ids: (number | string)[]) => Promise<void>
    onRefresh?: () => void

    // URLs
    createUrl?: string
    detailUrl?: (id: number | string) => string
    editUrl?: (id: number | string) => string

    // Search & Filter
    searchKey?: string
    searchPlaceholder?: string
    onSearch?: (query: string) => void

    // Stats
    statsConfig?: StatConfig<T>[]

    // UI
    title: string
    description?: string
    emptyMessage?: string

    // ID extractor
    getId: (item: T) => number | string
}

export function AdminCRUDTable<T>({
    data,
    isLoading,
    error,
    columns,
    onDelete,
    onBulkDelete,
    onRefresh,
    createUrl,
    detailUrl,
    editUrl,
    searchKey,
    searchPlaceholder = 'Cari...',
    onSearch,
    statsConfig,
    title,
    description,
    emptyMessage = 'Tidak ada data',
    getId,
}: AdminCRUDTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())
    const [isDeleting, setIsDeleting] = useState(false)

    // Filter data based on search
    const filteredData = searchQuery && searchKey
        ? data.filter((item) => {
            const value = searchKey.split('.').reduce<unknown>((obj, key) => {
                if (obj && typeof obj === 'object' && key in obj) {
                    return (obj as Record<string, unknown>)[key]
                }
                return undefined
            }, item as unknown)
            return typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
        })
        : data

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        onSearch?.(query)
    }

    // Handle select all
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredData.map(getId)))
        } else {
            setSelectedIds(new Set())
        }
    }

    // Handle select one
    const handleSelectOne = (id: number | string, checked: boolean) => {
        const newSelected = new Set(selectedIds)
        if (checked) {
            newSelected.add(id)
        } else {
            newSelected.delete(id)
        }
        setSelectedIds(newSelected)
    }

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (!onBulkDelete || selectedIds.size === 0) return

        if (!confirm(`Hapus ${selectedIds.size} item yang dipilih?`)) return

        setIsDeleting(true)
        try {
            await onBulkDelete(Array.from(selectedIds))
            setSelectedIds(new Set())
        } catch {
            alert('Gagal menghapus data')
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle delete single
    const handleDelete = async (id: number | string) => {
        if (!onDelete) return

        if (!confirm('Yakin ingin menghapus item ini?')) return

        setIsDeleting(true)
        try {
            await onDelete(id)
        } catch {
            alert('Gagal menghapus data')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    {description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    {onRefresh && (
                        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    )}
                    {createUrl && (
                        <Link href={createUrl}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Baru
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            {statsConfig && statsConfig.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsConfig.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stat.value(data)}
                                    </p>
                                </div>
                                {stat.icon && (
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color || 'bg-blue-100 text-blue-600'}`}>
                                        {stat.icon}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                {/* Search */}
                {searchKey && (
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Bulk Actions */}
                {selectedIds.size > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedIds.size} dipilih
                        </span>
                        {onBulkDelete && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                {error ? (
                    <div className="p-8 text-center text-red-600 dark:text-red-400">
                        Error: {error.message}
                    </div>
                ) : isLoading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    {(onBulkDelete || onDelete) && (
                                        <th className="w-12 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.size === filteredData.length}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                className="rounded border-gray-300"
                                            />
                                        </th>
                                    )}
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                            style={{ width: column.width }}
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                    {(detailUrl || editUrl || onDelete) && (
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredData.map((item) => {
                                    const id = getId(item)
                                    return (
                                        <tr key={id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                            {(onBulkDelete || onDelete) && (
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(id)}
                                                        onChange={(e) => handleSelectOne(id, e.target.checked)}
                                                        className="rounded border-gray-300"
                                                    />
                                                </td>
                                            )}
                                            {columns.map((column) => (
                                                <td key={column.key} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                                                    {column.render
                                                        ? column.render(item)
                                                        : String((item as Record<string, unknown>)[column.key] ?? '-')}
                                                </td>
                                            ))}
                                            {(detailUrl || editUrl || onDelete) && (
                                                <td className="px-4 py-3 text-right text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {detailUrl && (
                                                            <Link href={detailUrl(id)}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {editUrl && (
                                                            <Link href={editUrl(id)}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {onDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(id)}
                                                                disabled={isDeleting}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            {!isLoading && !error && filteredData.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Menampilkan {filteredData.length} dari {data.length} data
                </div>
            )}
        </div>
    )
}
