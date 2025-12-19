'use client'

import {
    Image,
    FileText,
    Megaphone,
    Users,
    Eye,
    Calendar,
    Activity,
    Building2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useDashboardStats } from '@/hooks/admin/useDashboardStats'
import { useRecentActivities } from '@/hooks/admin/useRecentActivities'
import { useVisitorStats } from '@/hooks/admin/useAnalytics'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { VisitorChart } from '@/components/admin/charts/VisitorChart'
import { ContentDistributionChart } from '@/components/admin/charts/ContentDistributionChart'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function MobileView() {
    const { data: stats, isLoading } = useDashboardStats()
    const { data: recentActivities, isLoading: isLoadingActivities } = useRecentActivities(3)
    const { data: visitorStats, isLoading: isLoadingVisitors } = useVisitorStats(30)

    const getActivityIcon = (icon: string) => {
        switch (icon) {
            case 'image':
                return Image
            case 'file-text':
                return FileText
            case 'megaphone':
                return Megaphone
            case 'users':
                return Users
            case 'activity':
                return Activity
            case 'building':
                return Building2
            default:
                return FileText
        }
    }

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'gallery':
                return { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600 dark:text-blue-400' }
            case 'post':
                return { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-600 dark:text-green-400' }
            case 'announcement':
                return { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-600 dark:text-yellow-400' }
            case 'staff':
                return { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600 dark:text-purple-400' }
            case 'extra':
                return { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-600 dark:text-teal-400' }
            case 'facility':
                return { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-600 dark:text-indigo-400' }
            default:
                return { bg: 'bg-gray-100 dark:bg-gray-900', text: 'text-gray-600 dark:text-gray-400' }
        }
    }

    const statCards = [
        {
            name: 'Total Galeri',
            value: stats?.galleries.total || 0,
            icon: Image,
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50 dark:bg-blue-900',
            href: '/admin/galleries',
            description: `${stats?.galleries.photo || 0} foto, ${stats?.galleries.video || 0} video`,
        },
        {
            name: 'Informasi',
            value: stats?.posts.total || 0,
            icon: FileText,
            color: 'bg-green-500',
            lightColor: 'bg-green-50 dark:bg-green-900',
            href: '/admin/posts',
            description: `${stats?.posts.published || 0} dipublikasi`,
        },
        {
            name: 'Staff & Guru',
            value: stats?.staff.total || 0,
            icon: Users,
            color: 'bg-purple-500',
            lightColor: 'bg-purple-50 dark:bg-purple-900',
            href: '/admin/staff',
            description: `${stats?.staff.teachers || 0} guru`,
        },
        {
            name: 'Pengumuman',
            value: stats?.announcements.total || 0,
            icon: Megaphone,
            color: 'bg-yellow-500',
            lightColor: 'bg-yellow-50 dark:bg-yellow-900',
            href: '/admin/announcements',
            description: `${stats?.announcements.active || 0} aktif`,
        },
        {
            name: 'Ekstrakurikuler',
            value: stats?.extras.total || 0,
            icon: Activity,
            color: 'bg-teal-500',
            lightColor: 'bg-teal-50 dark:bg-teal-900',
            href: '/admin/extras',
            description: `${stats?.extras.totalMembers || 0} total anggota`,
        },
        {
            name: 'Fasilitas',
            value: stats?.facilities.total || 0,
            icon: FileText,
            color: 'bg-indigo-500',
            lightColor: 'bg-indigo-50 dark:bg-indigo-900',
            href: '/admin/facilities',
            description: `${stats?.facilities.bookable || 0} bisa dipesan`,
        },
    ]

    const quickActions = [
        {
            title: 'Buat Galeri Baru',
            description: 'Tambahkan foto kegiatan sekolah',
            icon: Image,
            color: 'bg-blue-100 dark:bg-blue-900',
            iconColor: 'text-blue-600 dark:text-blue-400',
            href: '/admin/galleries/create',
            badge: 'Galeri'
        },
        {
            title: 'Tambah Slider',
            description: 'Update banner homepage',
            icon: FileText,
            color: 'bg-green-100 dark:bg-green-900',
            iconColor: 'text-green-600 dark:text-green-400',
            href: '/admin/sliders/create',
            badge: 'Homepage'
        },
        {
            title: 'Buat Pengumuman',
            description: 'Publikasikan informasi penting',
            icon: Megaphone,
            color: 'bg-yellow-100 dark:bg-yellow-900',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            href: '/admin/announcements/create',
            badge: 'Pengumuman'
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white"
                >
                    <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                    <p className="text-blue-100 text-sm">
                        Admin Panel SMA Negeri 1 Surakarta
                    </p>
                </motion.div>
            </div>

            {/* Stats Grid - 3x2 for mobile */}
            <div className="px-4 -mt-6 mb-6">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-3"
                >
                    {statCards.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <motion.div key={stat.name} variants={item}>
                                <Link href={stat.href}>
                                    <Card className="hover:shadow-md transition-all active:scale-95">
                                        <CardContent className="p-4">
                                            <div className={`${stat.lightColor} p-2 rounded-lg w-fit mb-3`}>
                                                <Icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                                            </div>
                                            {isLoading ? (
                                                <Skeleton className="h-6 w-12" />
                                            ) : (
                                                <>
                                                    <div className="text-xl font-bold mb-1">{stat.value}</div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {stat.description}
                                                    </p>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mb-6">
                <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Aksi Cepat</h2>
                <div className="space-y-3">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={action.href}>
                                    <Card className="hover:shadow-md transition-all active:scale-[0.98]">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`${action.color} p-3 rounded-lg flex-shrink-0`}>
                                                    <Icon className={`w-5 h-5 ${action.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm mb-0.5">{action.title}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {action.description}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {action.badge}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4 mb-6">
                <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Aktivitas Terbaru</h2>
                <Card>
                    <CardContent className="p-4 space-y-4">
                        {isLoadingActivities ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Skeleton className="w-8 h-8 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-48" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        ) : recentActivities && recentActivities.length > 0 ? (
                            recentActivities.map((activity, index) => {
                                const Icon = getActivityIcon(activity.icon)
                                const colors = getActivityColor(activity.type)
                                return (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`${colors.bg} p-2 rounded-full flex-shrink-0`}>
                                            <Icon className={`w-4 h-4 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {formatDistanceToNow(activity.timestamp, {
                                                    addSuffix: true,
                                                    locale: idLocale
                                                })}
                                            </p>
                                        </div>
                                    </motion.div>
                                )
                            })
                        ) : (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                                Belum ada aktivitas terbaru
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Overview Stats - Stacked vertically */}
            <div className="px-4 mb-6">
                <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Ringkasan</h2>
                <div className="space-y-3">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Pengunjung</p>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {isLoadingVisitors ? (
                                <>
                                    <Skeleton className="h-8 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold mb-1">
                                        {visitorStats?.total_visitors?.toLocaleString('id-ID') || '0'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className={`font-medium ${(visitorStats?.growth_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {(visitorStats?.growth_percentage || 0) >= 0 ? '+' : ''}{visitorStats?.growth_percentage || 0}%
                                        </span> dari bulan lalu
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">Konten Terpublikasi</p>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold mb-1">
                                {(stats?.galleries.total || 0) +
                                    (stats?.posts.published || 0) +
                                    (stats?.announcements.total || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Galeri, informasi & pengumuman
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">Update Terakhir</p>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold mb-1">Hari ini</div>
                            <p className="text-xs text-muted-foreground">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Charts - Stacked vertically */}
            <div className="px-4 mb-6">
                <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">Statistik</h2>
                <div className="space-y-4">
                    <VisitorChart />
                    <ContentDistributionChart
                        galleries={stats?.galleries.total || 0}
                        posts={stats?.posts.total || 0}
                        announcements={stats?.announcements.total || 0}
                        staff={stats?.staff.total || 0}
                        extras={stats?.extras.total || 0}
                        facilities={stats?.facilities.total || 0}
                    />
                </div>
            </div>
        </div>
    )
}
