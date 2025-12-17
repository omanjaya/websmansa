'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Users, Building, Sparkles } from 'lucide-react'

const quickInfoItems = [
    {
        title: 'Akademik Unggul',
        description: 'Program pembelajaran berkualitas dengan kurikulum terkini dan metode pengajaran inovatif',
        icon: BookOpen,
        color: 'from-blue-500 to-cyan-500',
        bgGlow: 'bg-blue-500/20',
        href: '/tentang',
    },
    {
        title: 'Ekstrakurikuler',
        description: 'Berbagai kegiatan untuk pengembangan bakat, minat, dan karakter siswa',
        icon: Users,
        color: 'from-green-500 to-emerald-500',
        bgGlow: 'bg-green-500/20',
        href: '/ekstrakurikuler',
    },
    {
        title: 'Fasilitas Modern',
        description: 'Infrastruktur pendukung pembelajaran modern dan lengkap untuk kenyamanan belajar',
        icon: Building,
        color: 'from-purple-500 to-violet-500',
        bgGlow: 'bg-purple-500/20',
        href: '/fasilitas',
    },
]

export function WhyChooseUs() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    {/* Section Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                        bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            Keunggulan Kami
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                        Mengapa{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            SMAN 1 Denpasar
                        </span>
                        ?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Kami berkomitmen memberikan lingkungan belajar terbaik untuk mendukung potensi siswa
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {quickInfoItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className="group relative block h-full"
                                >
                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 ${item.bgGlow} rounded-3xl blur-2xl 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Card */}
                                    <div className="relative h-full glass-feature-card p-8 overflow-hidden">
                                        {/* Background Decoration */}
                                        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${item.color} 
                                            rounded-bl-full opacity-5 group-hover:opacity-10 
                                            transition-opacity duration-500 blur-xl`} />

                                        {/* Icon */}
                                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl 
                                            flex items-center justify-center mb-6 shadow-lg 
                                            group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white 
                                            group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                                            {item.description}
                                        </p>

                                        {/* Arrow */}
                                        <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold 
                                            opacity-0 group-hover:opacity-100 transition-all duration-300 
                                            translate-x-[-10px] group-hover:translate-x-0">
                                            Pelajari lebih lanjut
                                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
