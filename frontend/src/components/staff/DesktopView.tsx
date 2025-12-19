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

function StaffCard({ item, index, isLeadership = false }: { item: Staff; index: number; isLeadership?: boolean }) {
    return (
        <Link
            href={`/staff/${item.attributes?.slug || item.id}`}
            className="group block"
        >
            <div
                className="relative rounded-[28px] overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,243,0.95) 100%)',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Gradient border effect */}
                <div
                    className="absolute inset-0 rounded-[28px] pointer-events-none"
                    style={{
                        padding: '1.5px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                />

                {/* Image Container */}
                <div className="m-3 rounded-[20px] overflow-hidden relative bg-gray-100" style={{ aspectRatio: '4/5' }}>
                    {item.attributes?.photo_url ? (
                        <Image
                            src={item.attributes.photo_url}
                            alt={item.attributes?.name}
                            fill
                            sizes={isLeadership ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"}
                            priority={index < 4}
                            loading={index < 4 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDBAURAAYhEhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQEBAQEBAAAAAAAAAAAAAAABAgADEf/aAAwDAQACEQMRAD8AzbZ21aG4Wu4VNTWTwSwOiKsaqVO5VjkE5B8c/mNGlY/rq4f1v//Z"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            style={{ objectPosition: 'center top' }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                            <svg className="w-20 h-20 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
                    {/* Image overlay gradient */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)' }}
                    />
                </div>

                {/* Content */}
                <div className="px-5 pb-5 pt-2">
                    {/* Name Row */}
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 tracking-tight line-clamp-1" style={{ letterSpacing: '-0.5px' }}>
                            {item.attributes?.name}
                        </h3>
                        {/* Verified/Type Badge */}
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
                                <path
                                    d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z"
                                    stroke="#555"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Position/Bio */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2" style={{ letterSpacing: '0.1px' }}>
                        {item.attributes?.position}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4">
                        {/* Type Badge */}
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600">
                                {typeLabels[item.attributes?.type] || item.attributes?.type || 'Staff'}
                            </span>
                        </div>

                        {/* View Profile Button */}
                        <div className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-800 transition-all duration-300 group-hover:-translate-y-0.5"
                            style={{
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
                            }}
                        >
                            Lihat
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export function DesktopView({ staff, categories: _categories, currentCategory }: {
    staff: Staff[]
    categories: string[]
    currentCategory?: string
}) {
    const filteredStaff = currentCategory
        ? staff.filter((s: Staff) => s.attributes?.type === currentCategory || s.attributes?.department === currentCategory)
        : staff

    // Separate leadership from regular staff
    const leadership = filteredStaff.filter((s: Staff) =>
        s.attributes?.type === 'principal' || s.attributes?.type === 'vice_principal'
    )
    const regularStaff = filteredStaff.filter((s: Staff) =>
        s.attributes?.type !== 'principal' && s.attributes?.type !== 'vice_principal'
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section - Enhanced */}
            <section className="relative -mt-16 lg:-mt-20 pt-28 lg:pt-32 pb-16 md:pb-24 hero-gradient overflow-hidden">
                {/* Decorative Elements */}
                <div className="hero-pattern" />
                <div className="decorative-grid" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                <div className="relative container mx-auto px-4">
                    <div className="max-w-3xl">
                        <span className="text-primary-200 font-bold tracking-wider uppercase text-sm flex items-center gap-2 mb-4">
                            <span className="w-10 h-[2px] bg-primary-300"></span>
                            Tim Kami
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Staff & Guru
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            Tenaga pendidik dan kependidikan SMA Negeri 1 Denpasar yang berdedikasi
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Category Filter */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <Link
                                href="/staff"
                                className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                                    !currentCategory
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200/50'
                                }`}
                                style={{ boxShadow: !currentCategory ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.06)' }}
                            >
                                Semua
                            </Link>
                            {Object.entries(typeLabels).map(([key, label]) => (
                                <Link
                                    key={key}
                                    href={`/staff?type=${key}`}
                                    className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                                        currentCategory === key
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200/50'
                                    }`}
                                    style={{ boxShadow: currentCategory === key ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.06)' }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Leadership Section */}
                    {leadership.length > 0 && !currentCategory && (
                        <div className="mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 md:mb-8" style={{ letterSpacing: '-0.5px' }}>
                                Pimpinan Sekolah
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {leadership.map((item: Staff, index: number) => (
                                    <StaffCard key={item.id} item={item} index={index} isLeadership />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular Staff Grid */}
                    {(regularStaff.length > 0 || currentCategory) && (
                        <div>
                            {!currentCategory && (
                                <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 md:mb-8" style={{ letterSpacing: '-0.5px' }}>
                                    Guru & Staff
                                </h2>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                                {(currentCategory ? filteredStaff : regularStaff).map((item: Staff, index: number) => (
                                    <StaffCard key={item.id} item={item} index={index} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredStaff.length === 0 && (
                        <div className="text-center py-20 rounded-[28px]" style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,243,0.95) 100%)',
                            boxShadow: '0 25px 80px rgba(0,0,0,0.08)'
                        }}>
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-2">
                                Tidak ada data
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Belum ada data staff untuk kategori ini.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Spacing */}
            <div className="h-12 md:h-20" />
        </div>
    )
}
