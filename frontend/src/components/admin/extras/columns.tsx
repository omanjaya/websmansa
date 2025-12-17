'use client'

import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Extra } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Users, MapPin } from 'lucide-react'

export const extraColumns: Column<Extra>[] = [
    {
        key: 'name',
        label: 'Nama Ekskul',
        render: (extra) => (
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {extra.attributes.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {extra.attributes.short_description || extra.attributes.description}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: 'category',
        label: 'Kategori',
        render: (extra) => {
            const category = extra.attributes.category
            const colorMap: Record<string, string> = {
                'olahraga': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                'seni': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
                'sains': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                'bahasa': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                'keagamaan': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
            }
            return (
                <Badge variant="secondary" className={colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-700'}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
            )
        },
    },
    {
        key: 'coach',
        label: 'Pembina',
        render: (extra) => {
            const coach = extra.attributes.coach
            return coach ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {coach}
                </div>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            )
        },
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (extra) => {
            const location = extra.attributes.location
            return location ? (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {location}
                </div>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            )
        },
    },
    {
        key: 'member_count',
        label: 'Anggota',
        render: (extra) => {
            const memberCount = extra.attributes.member_count
            const quota = extra.attributes.quota

            return (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {memberCount}{quota ? ` / ${quota}` : ''}
                    </span>
                </div>
            )
        },
    },
    {
        key: 'is_active',
        label: 'Status',
        render: (extra) => {
            const isActive = extra.attributes.is_active
            return (
                <Badge
                    variant="secondary"
                    className={isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }
                >
                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
            )
        },
    },
]
