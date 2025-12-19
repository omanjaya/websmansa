'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Image,
    Megaphone,
    Dumbbell,
    Building2,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Presentation,
    Newspaper,
    Trophy,
    Award,
    GraduationCap,
    Activity,
    Mail,
    UserCog,
    CalendarDays,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { logout, getUser } from '@/lib/api'

interface AuthUser {
    name?: string
    email?: string
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Slider', href: '/admin/sliders', icon: Presentation },
    { name: 'Berita', href: '/admin/berita', icon: Newspaper },
    { name: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone },
    { name: 'Prestasi Artikel', href: '/admin/prestasi', icon: Trophy },
    { name: 'Prestasi Carousel', href: '/admin/achievements', icon: Award },
    { name: 'Alumni', href: '/admin/alumni', icon: GraduationCap },
    { name: 'Galeri', href: '/admin/galleries', icon: Image },
    { name: 'Jadwal Pelajaran', href: '/admin/schedules', icon: CalendarDays },
    { name: 'Ekstrakurikuler', href: '/admin/extras', icon: Dumbbell },
    { name: 'Fasilitas', href: '/admin/facilities', icon: Building2 },
    { name: 'Staff', href: '/admin/staff', icon: Users },
    { name: 'Pesan Kontak', href: '/admin/contact-messages', icon: Mail },
    { name: 'Activity Log', href: '/admin/activity-logs', icon: Activity },
    { name: 'Pengguna', href: '/admin/users', icon: UserCog },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<AuthUser | null>(null)

    useEffect(() => {
        setUser(getUser())
    }, [])

    const handleLogout = () => {
        if (confirm('Yakin ingin keluar?')) {
            logout()
        }
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300',
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">Admin Panel</h2>
                                <p className="text-xs text-gray-500">SMAN 1 Surakarta</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {navigation.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== '/admin' && pathname.startsWith(item.href))
                                const Icon = item.icon

                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || 'admin@smansa.sch.id'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
