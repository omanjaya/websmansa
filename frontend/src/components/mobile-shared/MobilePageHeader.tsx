'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface MobilePageHeaderProps {
    title: string
    subtitle?: string
    label?: string
    gradient?: string
    bgImage?: string
}

export function MobilePageHeader({
    title,
    subtitle,
    label,
    gradient = 'from-blue-600 via-blue-700 to-indigo-800',
    bgImage
}: MobilePageHeaderProps) {
    return (
        <div className="relative min-h-[220px] overflow-hidden">
            {/* Background */}
            {bgImage ? (
                <>
                    <div className="absolute inset-0">
                        <Image
                            src={bgImage}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-blue-900/90" />
                    </div>
                </>
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/4 -translate-y-1/4" />
                </div>
            )}

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end px-4 pb-8 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                >
                    {label && (
                        <span className="text-white/80 font-semibold tracking-wider uppercase text-xs flex items-center gap-2 mb-2">
                            <span className="w-6 h-[2px] bg-white/60"></span>
                            {label}
                        </span>
                    )}
                    <h1 className="text-2xl font-bold mb-2 leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-white/90 text-sm leading-relaxed max-w-xs">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
