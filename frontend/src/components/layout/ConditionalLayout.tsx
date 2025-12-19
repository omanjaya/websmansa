'use client'

import { usePathname } from 'next/navigation'
import { Header, Footer } from '@/components/layout'

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')
    const isHomePage = pathname === '/'

    if (isAdminRoute) {
        // Admin pages - no public header/footer
        return <>{children}</>
    }

    // Public pages - with header and footer
    // Homepage doesn't need padding-top since hero extends behind fixed header
    // Other pages need padding-top to account for fixed header height
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className={`flex-1 ${isHomePage ? '' : 'pt-16 lg:pt-20'}`}>
                {children}
            </main>
            <Footer />
        </div>
    )
}
