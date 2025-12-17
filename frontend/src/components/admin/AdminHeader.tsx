'use client'

import { Bell, Search } from 'lucide-react'
import Link from 'next/link'

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Cari..."
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 ml-6">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* Visit Site */}
                    <Link
                        href="/"
                        target="_blank"
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                        Lihat Website
                    </Link>
                </div>
            </div>
        </header>
    )
}
