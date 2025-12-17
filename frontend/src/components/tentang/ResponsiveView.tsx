'use client'

import { School, Users, GraduationCap, Award } from 'lucide-react'
import Image from 'next/image'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

interface ResponsiveViewProps {
    stats: Array<{ label: string; value: string }>
    visiMisi: { visi: string; misi: string[] }
    sejarah: Array<{ year: string; title: string; description: string }>
    leadership: Array<{ name: string; position: string; image: string | null }>
}

export function ResponsiveView({ stats, visiMisi, sejarah, leadership }: ResponsiveViewProps) {
    const statIcons = [School, Users, GraduationCap, Award]

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
                            Profil Sekolah
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Tentang Kami
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            Profil dan sejarah SMA Negeri 1 Denpasar sejak tahun 1950
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 md:py-12 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {stats.map((stat, index) => {
                            const Icon = statIcons[index]
                            return (
                                <StaggerItem key={stat.label}>
                                    <div className="text-center p-4 md:p-6 glass-card-strong">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-3 md:mb-4">
                                            <Icon className="w-7 h-7 md:w-8 md:h-8" />
                                        </div>
                                        <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                </StaggerItem>
                            )
                        })}
                    </StaggerContainer>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Profile Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100 dark:border-slate-800 mb-8 md:mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <School className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                Profil Sekolah
                            </h2>
                        </div>
                        <div className="space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>
                                SMA Negeri 1 Denpasar adalah salah satu sekolah menengah atas tertua dan paling bergengsi di Provinsi Bali. Didirikan pada tahun 1950, sekolah ini telah menghasilkan ribuan alumni yang berkontribusi di berbagai bidang.
                            </p>
                            <p>
                                Berlokasi strategis di pusat Kota Denpasar, SMAN 1 Denpasar dilengkapi dengan fasilitas modern dan tenaga pengajar berkualitas yang berkomitmen untuk memberikan pendidikan terbaik.
                            </p>
                        </div>
                    </div>

                    {/* Visi & Misi */}
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
                        {/* Visi */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">Visi</h3>
                            </div>
                            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {visiMisi.visi}
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-100 dark:border-green-800/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">Misi</h3>
                            </div>
                            <ul className="space-y-4">
                                {visiMisi.misi.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-base md:text-lg text-gray-700 dark:text-gray-300">
                                        <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div className="mb-12 md:mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                Sejarah Singkat
                            </h2>
                        </div>
                        <div className="space-y-6 md:space-y-8">
                            {sejarah.map((item, index) => (
                                <div key={index} className="flex gap-4 md:gap-8 group">
                                    <div className="flex-shrink-0 relative">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm md:text-base shadow-lg group-hover:scale-105 transition-transform">
                                            {item.year}
                                        </div>
                                        {index !== sejarah.length - 1 && (
                                            <div className="absolute left-1/2 top-full w-0.5 h-6 md:h-8 bg-gradient-to-b from-blue-300 to-transparent -translate-x-1/2" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-6 md:pb-8 pt-2">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leadership */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                Kepemimpinan
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {leadership.map((leader, index) => (
                                <div key={index} className="group text-center">
                                    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl md:rounded-3xl mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                                        {leader.image ? (
                                            <Image
                                                src={leader.image}
                                                alt={leader.name}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-16 h-16 md:w-20 md:h-20 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-lg mb-1">
                                        {leader.name}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                        {leader.position}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Spacing */}
            <div className="h-12 md:h-20" />
        </div>
    )
}
