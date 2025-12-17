'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Staff } from '@/lib/api'

const typeLabels: Record<string, string> = {
    principal: 'Kepala Sekolah',
    vice_principal: 'Wakil Kepala Sekolah',
    teacher: 'Guru',
    staff: 'Staff',
}

function MobileStaffCard({ item, index }: { item: Staff; index: number }) {
    return (
        <Link
            href={`/staff/${item.attributes?.slug || item.id}`}
            className="group block active:scale-[0.98] transition-transform"
        >
            <div
                className="relative rounded-[24px] overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,243,0.95) 100%)',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.1), 0 5px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Gradient border effect */}
                <div
                    className="absolute inset-0 rounded-[24px] pointer-events-none"
                    style={{
                        padding: '1px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                />

                {/* Image Container */}
                <div className="m-2 rounded-[18px] overflow-hidden relative bg-gray-100" style={{ aspectRatio: '4/5' }}>
                    {item.attributes?.photo_url ? (
                        <Image
                            src={item.attributes.photo_url}
                            alt={item.attributes?.name}
                            fill
                            sizes="45vw"
                            loading={index < 4 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDBAURAAYhEhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQEBAQEBAAAAAAAAAAAAAAABAgADEf/aAAwDAQACEQMRAD8AzbZ21aG4Wu4VNTWTwSwOiKsaqVO5VjkE5B8c/mNGlY/rq4f1v//Z"
                            className="object-cover"
                            style={{ objectPosition: 'center top' }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                            <svg className="w-14 h-14 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
                    {/* Image overlay gradient */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 100%)' }}
                    />
                </div>

                {/* Content */}
                <div className="px-3 pb-3 pt-1">
                    {/* Name Row */}
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 tracking-tight line-clamp-1 flex-1" style={{ letterSpacing: '-0.3px' }}>
                            {item.attributes?.name}
                        </h3>
                        {/* Verified Badge */}
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                <path
                                    d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z"
                                    stroke="#888"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Position */}
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2" style={{ letterSpacing: '0.1px' }}>
                        {item.attributes?.position}
                    </p>

                    {/* Type Badge */}
                    <div className="flex items-center gap-1 text-gray-400">
                        <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">
                            {typeLabels[item.attributes?.type] || item.attributes?.type || 'Staff'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export function MobileView({ staff, categories, currentCategory }: { 
    staff: Staff[] 
    categories: string[] 
    currentCategory?: string 
}) {
    const filteredStaff = currentCategory
        ? staff.filter((s: Staff) => s.attributes?.type === currentCategory || s.attributes?.department === currentCategory)
        : staff

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e8e4df 0%, #d4cfc8 50%, #c9c4bd 100%)' }}>
            {/* Mobile Header - Elegant dark design */}
            <section className="relative -mt-16 pt-24 pb-12" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="relative px-4">
                    <span className="text-gray-400 font-medium tracking-wider uppercase text-xs flex items-center gap-2 mb-3">
                        <span className="w-6 h-[1px] bg-gray-500"></span>
                        Tim Kami
                    </span>
                    <h1 className="text-3xl font-medium text-white mb-2" style={{ letterSpacing: '-0.5px' }}>
                        Staff & Guru
                    </h1>
                    <p className="text-sm text-gray-400 font-light">
                        Tenaga pendidik dan kependidikan SMA Negeri 1 Denpasar
                    </p>
                </div>
            </section>

            {/* Type Filters */}
            <div className="px-4 -mt-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Link
                        href="/staff"
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            !currentCategory
                                ? 'bg-gray-900 text-white'
                                : 'bg-white/80 text-gray-700 border border-gray-200/50'
                        }`}
                        style={{ boxShadow: !currentCategory ? '0 4px 15px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)' }}
                    >
                        Semua
                    </Link>
                    {Object.entries(typeLabels).map(([key, label]) => (
                        <Link
                            key={key}
                            href={`/staff?type=${key}`}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                currentCategory === key
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white/80 text-gray-700 border border-gray-200/50'
                            }`}
                            style={{ boxShadow: currentCategory === key ? '0 4px 15px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)' }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Staff Grid */}
            {filteredStaff.length > 0 ? (
                <div className="px-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredStaff.map((item: Staff, index: number) => (
                            <MobileStaffCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <div
                        className="rounded-[24px] py-12 px-6"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,243,0.95) 100%)',
                            boxShadow: '0 15px 50px rgba(0,0,0,0.08)'
                        }}
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada data</h3>
                        <p className="text-gray-500 text-sm">Belum ada data staff untuk kategori ini.</p>
                    </div>
                </div>
            )}

            {/* Bottom Spacing for Navigation */}
            <div className="h-20" />
        </div>
    )
}
