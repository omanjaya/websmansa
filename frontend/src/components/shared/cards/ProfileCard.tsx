'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface ProfileCardProps {
    name: string
    role: string
    imageUrl?: string
    subtitle?: string // e.g., department, year
    badge?: string
    onClick?: () => void
    index?: number
    variant?: 'default' | 'compact' | 'featured' | 'magazine-featured' | 'magazine-compact'
}

export function ProfileCard({
    name,
    role,
    imageUrl,
    subtitle,
    badge,
    onClick,
    index = 0,
    variant = 'default',
}: ProfileCardProps) {
    // Compact variant
    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                className="group flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={onClick}
            >
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {role}
                    </p>
                </div>
            </motion.div>
        )
    }

    // Featured variant
    if (variant === 'featured') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={onClick}
            >
                {/* Large Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                            <User className="w-20 h-20 text-blue-300 dark:text-blue-600" />
                        </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Badge */}
                    {badge && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <span className="text-xs font-semibold text-white">{badge}</span>
                        </div>
                    )}

                    {/* Info on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-bold text-white text-xl mb-1 drop-shadow-lg">
                            {name}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {role}
                        </p>
                        {subtitle && (
                            <p className="text-white/60 text-xs mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        )
    }

    // Magazine featured variant
    if (variant === 'magazine-featured') {
        return (
            <div className="group relative">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-yellow-400 to-transparent opacity-30" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500"
                    whileHover={{ scale: 1.02 }}
                >
                    {/* Photo with frame */}
                    <div className="relative w-32 h-40 mx-auto pt-6">
                        <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                                    <User className="w-12 h-12 text-slate-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center px-6 pb-6">
                        {badge && (
                            <span className="inline-block px-3 py-1 text-xs font-bold bg-yellow-400 text-white rounded-full mb-3 uppercase tracking-wide">
                                {badge}
                            </span>
                        )}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            {role}
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    // Magazine compact variant
    if (variant === 'magazine-compact') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index, duration: 0.5 }}
                className="group bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 pt-10"
            >
                {/* Photo */}
                <div className="relative w-20 h-20 mx-auto -mt-10 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                            <User className="w-10 h-10 text-slate-400" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="text-center px-4 pt-4 pb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">
                        {name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {role}
                    </p>
                </div>
            </motion.div>
        )
    }

    // Default variant
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index }}
            className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center"
            onClick={onClick}
        >
            {/* Photo */}
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                        <User className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-5">
                {badge && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-2">
                        {badge}
                    </span>
                )}
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {role}
                </p>
                {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </motion.div>
    )
}
