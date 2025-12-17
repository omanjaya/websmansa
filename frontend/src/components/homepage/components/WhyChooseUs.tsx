'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const quickInfoItems = [
    {
        title: 'Akademik',
        description: 'Program pembelajaran berkualitas dengan kurikulum terkini',
        icon: (
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        color: 'bg-blue-100 dark:bg-blue-900/50',
        href: '/tentang',
    },
    {
        title: 'Ekstrakurikuler',
        description: 'Berbagai kegiatan untuk pengembangan bakat dan minat',
        icon: (
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        color: 'bg-green-100 dark:bg-green-900/50',
        href: '/ekstrakurikuler',
    },
    {
        title: 'Fasilitas',
        description: 'Infrastruktur pendukung pembelajaran modern',
        icon: (
            <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        color: 'bg-purple-100 dark:bg-purple-900/50',
        href: '/fasilitas',
    },
]

export function WhyChooseUs() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Mengapa SMAN 1 Denpasar?
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Kami berkomitmen memberikan lingkungan belajar terbaik untuk mendukung potensi siswa
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {quickInfoItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                className="group relative p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:-translate-y-2 overflow-hidden block h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-transparent rounded-bl-full opacity-50 dark:opacity-30 group-hover:scale-150 transition-transform duration-500" />
                                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {item.description}
                                </p>
                                <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                    Pelajari{' '}
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
