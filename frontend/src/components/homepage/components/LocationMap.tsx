'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function LocationMap() {
    const { settings } = useSiteConfig()

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
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
                        Lokasi & Kontak
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Kunjungi kami atau hubungi untuk informasi lebih lanjut
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
                            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                                Informasi Kontak
                            </h3>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                            Alamat
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {settings.address}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                            Telepon
                                        </h4>
                                        <a
                                            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                                        >
                                            {settings.phone}
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                            Email
                                        </h4>
                                        <a
                                            href={`mailto:${settings.email}`}
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                                        >
                                            {settings.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                            Jam Operasional
                                        </h4>
                                        <div className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                                            <p>Senin - Jumat: {settings.weekday_hours}</p>
                                            <p>Sabtu: {settings.saturday_hours}</p>
                                            <p>Minggu: {settings.sunday_hours}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Dapatkan Petunjuk Arah
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="h-[500px] lg:h-full min-h-[400px]"
                    >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                            {settings.maps_embed ? (
                                <iframe
                                    src={settings.maps_embed}
                                    width="100%"
                                    height="100%"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full border-0"
                                    title={`Lokasi ${settings.site_name}`}
                                />
                            ) : (
                                // Fallback: Use coordinates to generate a static map or show placeholder
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Peta tidak tersedia
                                        </p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${settings.latitude},${settings.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-4 text-blue-600 hover:underline"
                                        >
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
