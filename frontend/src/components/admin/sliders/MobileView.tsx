'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface Slider {
    id: number
    title: string
    subtitle?: string
    image_url: string
    link?: string
    button_text?: string
    order: number
    is_active: boolean
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
    const [sliders, _setSliders] = useState<Slider[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        // TODO: Fetch sliders from API
        setLoading(false)
    }, [])

    const filteredSliders = sliders
        .filter((slider) =>
            slider.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.order - b.order)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header with sticky add button */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-green-600 to-green-800 px-4 py-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">Slider</h1>
                        <p className="text-green-100 text-sm">Kelola hero banner</p>
                    </div>
                    <Button asChild size="sm" className="bg-white text-green-600 hover:bg-green-50">
                        <Link href="/admin/sliders/create">
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Cari slider..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white/95 dark:bg-slate-800/95 border-0"
                    />
                </div>
            </div>

            {/* Sliders List */}
            {loading ? (
                <div className="px-4 py-12 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : filteredSliders.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="px-4 pt-4 space-y-3"
                >
                    {filteredSliders.map((slider) => (
                        <motion.div key={slider.id} variants={item}>
                            <Card className="hover:shadow-md transition-all overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Image */}
                                    <div className="relative w-full h-32 bg-gray-100">
                                        <Image
                                            src={slider.image_url}
                                            alt={slider.title}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Order Badge */}
                                        <div className="absolute top-2 left-2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                                            {slider.order}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-sm flex-1 line-clamp-2">
                                                {slider.title}
                                            </h3>
                                            <Badge
                                                variant={slider.is_active ? 'default' : 'secondary'}
                                                className="flex-shrink-0"
                                            >
                                                {slider.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </div>

                                        {slider.subtitle && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                {slider.subtitle}
                                            </p>
                                        )}

                                        {slider.link && (
                                            <p className="text-xs text-blue-600 truncate mb-3">
                                                {slider.link}
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
                                                <Link href={`/admin/sliders/${slider.id}/edit`}>
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {search ? 'Slider tidak ditemukan' : 'Belum ada slider'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        {search ? 'Coba kata kunci lain' : 'Mulai dengan membuat slider pertama'}
                    </p>
                    {!search && (
                        <Button asChild>
                            <Link href="/admin/sliders/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Slider
                            </Link>
                        </Button>
                    )}
                </div>
            )}

            {/* Info Box */}
            <div className="px-4 mt-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 <strong>Tips:</strong> Slider dengan nomor urut lebih kecil akan ditampilkan terlebih dahulu.
                    </p>
                </div>
            </div>
        </div>
    )
}
