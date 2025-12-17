'use client'

import { usePathname } from 'next/navigation'
import { Header, Footer } from '@/components/layout'

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    if (isAdminRoute) {
        // Admin pages - no public header/footer
        return <>{children}</>
    }

    // Public pages - with header and footer
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
