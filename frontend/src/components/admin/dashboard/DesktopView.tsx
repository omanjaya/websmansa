'use client'

import {
    Image as ImageIcon,
    FileText,
    Megaphone,
    Users,
    Eye,
    Calendar,
    Activity,
    Building2
} from 'lucide-react'
import Link from 'next/link'
import { useDashboardStats } from '@/hooks/admin/useDashboardStats'
import { useRecentActivities } from '@/hooks/admin/useRecentActivities'
import { useVisitorStats } from '@/hooks/admin/useAnalytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { VisitorChart } from '@/components/admin/charts/VisitorChart'
import { ContentDistributionChart } from '@/components/admin/charts/ContentDistributionChart'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function DesktopView() {
    const { data: stats, isLoading } = useDashboardStats()
    const { data: recentActivities, isLoading: isLoadingActivities } = useRecentActivities(3)
    const { data: visitorStats, isLoading: isLoadingVisitors } = useVisitorStats(30)

    const getActivityIcon = (icon: string) => {
        switch (icon) {
            case 'image':
                return ImageIcon
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
                return { bg: 'bg-blue-100', text: 'text-blue-600' }
            case 'post':
                return { bg: 'bg-green-100', text: 'text-green-600' }
            case 'announcement':
                return { bg: 'bg-yellow-100', text: 'text-yellow-600' }
            case 'staff':
                return { bg: 'bg-purple-100', text: 'text-purple-600' }
            case 'extra':
                return { bg: 'bg-teal-100', text: 'text-teal-600' }
            case 'facility':
                return { bg: 'bg-indigo-100', text: 'text-indigo-600' }
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600' }
        }
    }

    const statCards = [
        {
            name: 'Total Galeri',
            value: stats?.galleries.total || 0,
            icon: ImageIcon,
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50',
            href: '/admin/galleries',
            description: `${stats?.galleries.photo || 0} foto, ${stats?.galleries.video || 0} video`,
        },
        {
            name: 'Informasi',
            value: stats?.posts.total || 0,
            icon: FileText,
            color: 'bg-green-500',
            lightColor: 'bg-green-50',
            href: '/admin/posts',
            description: `${stats?.posts.published || 0} dipublikasi`,
        },
        {
            name: 'Staff & Guru',
            value: stats?.staff.total || 0,
            icon: Users,
            color: 'bg-purple-500',
            lightColor: 'bg-purple-50',
            href: '/admin/staff',
            description: `${stats?.staff.teachers || 0} guru`,
        },
        {
            name: 'Pengumuman',
            value: stats?.announcements.total || 0,
            icon: Megaphone,
            color: 'bg-yellow-500',
            lightColor: 'bg-yellow-50',
            href: '/admin/announcements',
            description: `${stats?.announcements.active || 0} aktif`,
        },
        {
            name: 'Ekstrakurikuler',
            value: stats?.extras.total || 0,
            icon: Activity,
            color: 'bg-teal-500',
            lightColor: 'bg-teal-50',
            href: '/admin/extras',
            description: `${stats?.extras.totalMembers || 0} total anggota`,
        },
        {
            name: 'Fasilitas',
            value: stats?.facilities.total || 0,
            icon: FileText,
            color: 'bg-indigo-500',
            lightColor: 'bg-indigo-50',
            href: '/admin/facilities',
            description: `${stats?.facilities.bookable || 0} bisa dipesan`,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Selamat datang di Admin Panel SMAN 1 Denpasar
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Terakhir diperbarui</p>
                    <p className="text-sm font-medium text-gray-600">
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link key={stat.name} href={stat.href}>
                            <Card className="hover:shadow-md transition-all hover:border-blue-200 cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {stat.name}
                                    </CardTitle>
                                    <div className={`${stat.lightColor} p-2 rounded-lg`}>
                                        <Icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-20" />
                                    ) : (
                                        <>
                                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {stat.description}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {/* Quick Actions */}
                <Card className="lg:col-span-2">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-semibold text-gray-900">Aksi Cepat</CardTitle>
                        <CardDescription className="text-xs">
                            Kelola konten website dengan mudah
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-2">
                        <Link
                            href="/admin/galleries/create"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900">Buat Galeri Baru</h3>
                                <p className="text-xs text-gray-500 truncate">
                                    Tambahkan foto kegiatan sekolah
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">Galeri</Badge>
                        </Link>

                        <Link
                            href="/admin/sliders/create"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900">Tambah Slider</h3>
                                <p className="text-xs text-gray-500 truncate">
                                    Update banner homepage
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">Homepage</Badge>
                        </Link>

                        <Link
                            href="/admin/announcements/create"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Megaphone className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900">Buat Pengumuman</h3>
                                <p className="text-xs text-gray-500 truncate">
                                    Publikasikan informasi penting
                                </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">Pengumuman</Badge>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-semibold text-gray-900">Aktivitas Terbaru</CardTitle>
                        <CardDescription className="text-xs">
                            Update terkini
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                        {isLoadingActivities ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Skeleton className="w-7 h-7 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-48" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : recentActivities && recentActivities.length > 0 ? (
                            recentActivities.map((activity) => {
                                const Icon = getActivityIcon(activity.icon)
                                const colors = getActivityColor(activity.type)
                                return (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                                            <p className="text-xs text-gray-400">
                                                {formatDistanceToNow(activity.timestamp, {
                                                    addSuffix: true,
                                                    locale: idLocale
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-4 text-sm text-gray-500">
                                Belum ada aktivitas terbaru
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Total Pengunjung
                        </CardTitle>
                        <Eye className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {isLoadingVisitors ? (
                            <>
                                <Skeleton className="h-8 w-24 mb-1" />
                                <Skeleton className="h-4 w-32" />
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-gray-900">
                                    {visitorStats?.total_visitors?.toLocaleString('id-ID') || '0'}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className={`font-medium ${(visitorStats?.growth_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {(visitorStats?.growth_percentage || 0) >= 0 ? '+' : ''}{visitorStats?.growth_percentage || 0}%
                                    </span> dari bulan lalu
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Konten Terpublikasi
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-gray-900">
                            {(stats?.galleries.total || 0) +
                                (stats?.posts.published || 0) +
                                (stats?.announcements.total || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Galeri, informasi & pengumuman
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Update Terakhir
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-gray-900">Hari ini</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'short'
                            })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <VisitorChart />
                </div>
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
    )
}
