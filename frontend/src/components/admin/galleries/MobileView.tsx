'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/admin-api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Eye, Images } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Gallery {
    id: number
    uuid: string
    title: string
    slug: string
    description: string | null
    thumbnail: string | null
    thumbnail_url: string | null
    type: string
    event_date: string | null
    is_featured: boolean
    items_count: number
    items: Array<{
        id: number
        url: string
        caption: string | null
        is_featured: boolean
    }>
    created_at: string
    updated_at: string
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
        queryKey: ['admin-galleries'],
        queryFn: async () => {
            const response = await adminApi.get('/galleries', { per_page: 100 })
            return response.data as Gallery[]
        },
    })

    const filteredData = data?.filter((gallery) =>
        gallery.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const featuredCount = data?.filter(g => g.is_featured).length || 0
    const totalImages = data?.reduce((sum, g) => sum + (g.items_count || 0), 0) || 0

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header with sticky add button */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">Galeri</h1>
                        <p className="text-blue-100 text-sm">Kelola foto kegiatan</p>
                    </div>
                    <Button asChild size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                        <Link href="/admin/galleries/create">
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Cari galeri..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/95 dark:bg-slate-800/95 border-0"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-4 -mt-3 mb-6">
                <div className="grid grid-cols-3 gap-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total</p>
                            <p className="text-2xl font-bold">{data?.length || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Featured</p>
                            <p className="text-2xl font-bold text-green-600">{featuredCount}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Foto</p>
                            <p className="text-2xl font-bold">{totalImages}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Gallery Cards */}
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
                    {filteredData.map((gallery) => {
                        return (
                            <motion.div key={gallery.id} variants={item}>
                                <Card className="hover:shadow-md transition-all">
                                    <CardContent className="p-0">
                                        <div className="flex gap-3 p-4">
                                            {/* Image Preview */}
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                                                {gallery.thumbnail_url ? (
                                                    <Image
                                                        src={gallery.thumbnail_url}
                                                        alt={gallery.title}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <Images className="w-8 h-8 text-muted-foreground" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className="font-semibold text-sm line-clamp-1">
                                                        {gallery.title}
                                                    </h3>
                                                    <Badge
                                                        variant={gallery.is_featured ? 'default' : 'secondary'}
                                                        className="flex-shrink-0 text-xs"
                                                    >
                                                        {gallery.is_featured ? 'Featured' : 'Normal'}
                                                    </Badge>
                                                </div>

                                                {gallery.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                                                        {gallery.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Images className="h-3 w-3" />
                                                        <span>{gallery.items_count || 0} foto</span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {gallery.type === 'photo' ? '📷' : '🎬'} {gallery.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="border-t dark:border-slate-700 px-4 py-2 flex gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <Link href={`/admin/galleries/${gallery.uuid}`}>
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
                                                <Link href={`/admin/galleries/${gallery.uuid}/edit`}>
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
                    <Images className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {searchQuery ? 'Galeri tidak ditemukan' : 'Belum ada galeri'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        {searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan membuat galeri baru'}
                    </p>
                    {!searchQuery && (
                        <Button asChild>
                            <Link href="/admin/galleries/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Galeri
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
