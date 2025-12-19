'use client'

import { motion } from 'framer-motion'

interface Partner {
    id: number
    name: string
    logo: string
    category: 'university' | 'company' | 'institution'
}

// Dummy data - replace with real logos
const partners: Partner[] = [
    { id: 1, name: 'Universitas Indonesia', logo: '/partners/ui.png', category: 'university' },
    { id: 2, name: 'Institut Teknologi Bandung', logo: '/partners/itb.png', category: 'university' },
    { id: 3, name: 'Universitas Gadjah Mada', logo: '/partners/ugm.png', category: 'university' },
    { id: 4, name: 'Universitas Udayana', logo: '/partners/unud.png', category: 'university' },
    { id: 5, name: 'Universitas Airlangga', logo: '/partners/unair.png', category: 'university' },
    { id: 6, name: 'Institut Teknologi Sepuluh Nopember', logo: '/partners/its.png', category: 'university' },
]

export function PartnershipLogos() {
    return (
        <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Universitas Tujuan Alumni
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Alumni kami diterima di universitas terkemuka di Indonesia
                    </p>
                </motion.div>

                {/* Infinite Scroll Animation */}
                <div className="relative">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />

                    {/* Scrolling Container */}
                    <div className="flex gap-8 md:gap-16">
                        {/* First Set */}
                        <motion.div
                            className="flex gap-8 md:gap-16 flex-shrink-0"
                            animate={{
                                x: [0, -1200],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                    duration: 30,
                                    ease: 'linear',
                                },
                            }}
                        >
                            {partners.map((partner) => (
                                <div
                                    key={`first-${partner.id}`}
                                    className="flex-shrink-0 w-40 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-center p-6 hover:shadow-xl transition-shadow group"
                                >
                                    <div className="relative w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                                        {/* Placeholder for logo - replace with real Image component when logos are available */}
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-xs text-center font-semibold text-gray-400 dark:text-gray-500">
                                                {partner.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Second Set (Duplicate for seamless loop) */}
                        <motion.div
                            className="flex gap-8 md:gap-16 flex-shrink-0"
                            animate={{
                                x: [0, -1200],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                    duration: 30,
                                    ease: 'linear',
                                },
                            }}
                        >
                            {partners.map((partner) => (
                                <div
                                    key={`second-${partner.id}`}
                                    className="flex-shrink-0 w-40 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-center p-6 hover:shadow-xl transition-shadow group"
                                >
                                    <div className="relative w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-xs text-center font-semibold text-gray-400 dark:text-gray-500">
                                                {partner.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Lulus PTN Favorit
                        </div>
                    </div>
                    <div className="text-center border-x border-gray-200 dark:border-slate-700">
                        <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Diterima Via SNBP
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Beasiswa Diterima
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
