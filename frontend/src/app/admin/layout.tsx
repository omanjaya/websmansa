'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

    // Check auth only once on mount
    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            setAuthState('authenticated') // Allow rendering login page
            return
        }

        // Simple token check - no API call needed for initial render
        const token = localStorage.getItem('auth_token')
        if (token) {
            setAuthState('authenticated')
        } else {
            setAuthState('unauthenticated')
            router.replace('/admin/login')
        }
    }, []) // Empty dependency - only run once on mount

    // Handle pathname changes separately
    useEffect(() => {
        if (pathname === '/admin/login') return

        const token = localStorage.getItem('auth_token')
        if (!token && authState === 'authenticated') {
            setAuthState('unauthenticated')
            router.replace('/admin/login')
        }
    }, [pathname])

    // Login page - just render children
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    // Loading state
    if (authState === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Not authenticated - show nothing while redirecting
    if (authState === 'unauthenticated') {
        return null
    }

    // Authenticated - render admin layout
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="lg:ml-64">
                <AdminHeader />
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
