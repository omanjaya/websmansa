'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/admin-api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Eye, Pin, Megaphone } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Announcement {
    id: number
    attributes: {
        title: string
        slug: string
        excerpt: string | null
        type: string
        priority: string
        is_pinned: boolean
        is_active: boolean
        published_at: string | null
        expires_at: string | null
        created_at: string
    }
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export function MobileView() {
    const [searchQuery, setSearchQuery] = useState('')

    const { data, isLoading } = useQuery({
        queryKey: ['admin-announcements'],
        queryFn: async () => {
            const response = await adminApi.get('/announcements', { per_page: 100 })
            return response.data as Announcement[]
        },
    })

    const filteredData = data?.filter((announcement) =>
        announcement.attributes.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeCount = data?.filter(a => a.attributes.is_active).length || 0
    const pinnedCount = data?.filter(a => a.attributes.is_pinned).length || 0
    const expiredCount = data?.filter(a => {
        const expiresAt = a.attributes.expires_at
        return expiresAt && new Date(expiresAt) < new Date()
    }).length || 0

    const priorityLabels: Record<string, string> = {
        low: 'Rendah',
        medium: 'Sedang',
        high: 'Tinggi',
        urgent: 'Mendesak',
    }

    const priorityColors: Record<string, string> = {
        low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header with sticky add button */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-yellow-500 to-yellow-700 px-4 py-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">Pengumuman</h1>
                        <p className="text-yellow-100 text-sm">Kelola informasi penting</p>
                    </div>
                    <Button asChild size="sm" className="bg-white text-yellow-600 hover:bg-yellow-50">
                        <Link href="/admin/announcements/create">
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Cari pengumuman..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/95 dark:bg-slate-800/95 border-0"
                    />
                </div>
            </div>

            {/* Stats Grid - 2x2 */}
            <div className="px-4 -mt-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total</p>
                            <p className="text-2xl font-bold">{data?.length || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Aktif</p>
                            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Pinned</p>
                            <p className="text-2xl font-bold text-blue-600">{pinnedCount}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Kadaluarsa</p>
                            <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Announcement Cards */}
            {isLoading ? (
                <div className="px-4 py-12 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : filteredData && filteredData.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="px-4 space-y-3"
                >
                    {filteredData.map((announcement) => {
                        const isExpired = announcement.attributes.expires_at
                            ? new Date(announcement.attributes.expires_at) < new Date()
                            : false

                        return (
                            <motion.div key={announcement.id} variants={item}>
                                <Card className="hover:shadow-md transition-all">
                                    <CardContent className="p-4">
                                        {/* Title and Pin */}
                                        <div className="flex items-start gap-2 mb-2">
                                            {announcement.attributes.is_pinned && (
                                                <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                            )}
                                            <h3 className="font-semibold text-sm flex-1 line-clamp-2">
                                                {announcement.attributes.title}
                                            </h3>
                                        </div>

                                        {/* Excerpt */}
                                        {announcement.attributes.excerpt && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                                {announcement.attributes.excerpt}
                                            </p>
                                        )}

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            <Badge
                                                variant="secondary"
                                                className={priorityColors[announcement.attributes.priority] || priorityColors.medium}
                                            >
                                                {priorityLabels[announcement.attributes.priority] || announcement.attributes.priority}
                                            </Badge>
                                            <Badge
                                                variant={announcement.attributes.is_active ? 'default' : 'secondary'}
                                            >
                                                {announcement.attributes.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                            {isExpired && (
                                                <Badge variant="destructive" className="text-xs">
                                                    Kadaluarsa
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Date Info */}
                                        {announcement.attributes.published_at && (
                                            <p className="text-xs text-muted-foreground mb-3">
                                                {new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="border-t dark:border-slate-700 -mx-4 px-4 pt-3 flex gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <Link href={`/admin/announcements/${announcement.id}`}>
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Detail
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {searchQuery ? 'Pengumuman tidak ditemukan' : 'Belum ada pengumuman'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        {searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan membuat pengumuman baru'}
                    </p>
                    {!searchQuery && (
                        <Button asChild>
                            <Link href="/admin/announcements/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Pengumuman
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
