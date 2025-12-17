'use client'

import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

const stats = [
    { label: 'Siswa Aktif', value: 1200, suffix: '+' },
    { label: 'Guru & Staff', value: 120, suffix: '+' },
    { label: 'Ekstrakurikuler', value: 25, suffix: '+' },
    { label: 'Alumni', value: 50000, suffix: '+' },
]

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
    const { count, ref } = useCountUp(value, 2000)

    return (
        <div ref={ref} className="text-center group p-2">
            <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-3"
            >
                {count.toLocaleString('id-ID')}
                {suffix}
            </motion.div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
            </div>
        </div>
    )
}

export function StatsSection() {
    return (
        <section className="relative z-20 -mt-24 px-4 pb-20">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 dark:bg-slate-800/90 dark:border-slate-700"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <StatCard label={stat.label} value={stat.value} suffix={stat.suffix} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
