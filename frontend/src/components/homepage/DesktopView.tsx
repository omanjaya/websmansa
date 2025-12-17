'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Users, GraduationCap, Award, Building, ArrowRight, MapPin, Phone, Mail } from 'lucide-react'
import { SectionHeader, StatsBar, NewsCard } from '@/components/shared'
import { GalleryPreview } from './components/GalleryPreview'
import { AchievementsCarousel } from './components/AchievementsCarousel'
import { AlumniCarousel } from './components/AlumniCarousel'
import { HeroSection } from './components/HeroSection'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

// Smooth easing function
const easeOutExpo = [0.16, 1, 0.3, 1] as const

// Smooth animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: easeOutExpo
        }
    }
}

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: easeOutExpo
        }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
}

const staggerItem = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easeOutExpo
        }
    }
}

const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: easeOutExpo
        }
    }
}

const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: easeOutExpo
        }
    }
}

const typeLabels: Record<string, string> = {
    general: 'Umum',
    academic: 'Akademik',
    event: 'Kegiatan',
    urgent: 'Penting',
}

interface DesktopViewProps {
    posts: Post[]
    announcements: Array<{
        id: number
        type: string
        attributes: {
            title: string
            slug: string
            type: string
            published_at: string
        }
    }>
    slides?: Slider[]
    achievements?: Achievement[]
    alumni?: Alumni[]
    galleries?: Gallery[]
}

export function DesktopView({ posts, announcements, slides, achievements, alumni, galleries }: DesktopViewProps) {
    const { settings } = useSiteConfig()

    const stats = [
        { value: parseInt(settings.total_students) || 1200, label: 'Siswa', icon: Users },
        { value: parseInt(settings.total_teachers) || 120, label: 'Guru', icon: GraduationCap },
        { value: 45, label: 'Ekstrakurikuler', icon: Award },
        { value: parseInt(settings.total_alumni) || 50000, label: 'Alumni', icon: Building },
    ]

    return (
        <main id="main-content" className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Hero Section */}
            <HeroSection slides={slides} />

            {/* Floating Stats Bar */}
            <section className="relative z-20 -mt-20">
                <div className="container mx-auto px-4">
                    <StatsBar stats={stats} variant="floating" />
                </div>
            </section>

            {/* Principal Welcome Section - Centered & Symmetrical */}
            <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
                {/* Subtle Pattern Background */}
                <motion.div
                    className="absolute inset-0 pattern-dots opacity-50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                />

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <SectionHeader
                                label="Sambutan"
                                title="Kepala Sekolah"
                                align="center"
                            />
                        </motion.div>

                        {/* Principal Card - Centered */}
                        <motion.div
                            variants={fadeInScale}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="principal-card p-8 md:p-12"
                        >
                            <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
                                {/* Photo - 2 columns */}
                                <div className="md:col-span-2">
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src={settings.principal_photo || '/principal.png'}
                                            alt={settings.principal_name}
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 768px) 100vw, 40vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                                    </div>
                                </div>

                                {/* Content - 3 columns */}
                                <div className="md:col-span-3 space-y-6">
                                    <div className="elegant-quote">
                                        {settings.principal_message}
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {settings.principal_description}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                                                {settings.principal_name}
                                            </h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                {settings.principal_title} {settings.site_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* News & Announcements Section - Symmetrical Grid */}
            <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div variants={slideInLeft}>
                            <SectionHeader
                                label="Terbaru"
                                title="Berita & Informasi"
                                subtitle="Update terkini seputar kegiatan dan prestasi sekolah"
                                align="left"
                                className="mb-0"
                            />
                        </motion.div>
                        <motion.div variants={slideInRight}>
                            <Link
                                href="/informasi"
                                className="btn-elegant-outline mt-6 md:mt-0 magnetic-hover"
                            >
                                Lihat Semua
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* News Grid - 3 columns symmetrical with stagger */}
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {posts.slice(0, 6).map((post, index) => (
                            <motion.div key={post.id} variants={staggerItem}>
                                <NewsCard
                                    title={post.attributes.title}
                                    excerpt={post.attributes.excerpt}
                                    image={post.attributes.featured_image}
                                    category={post.relationships?.categories?.[0]?.name}
                                    date={post.attributes.published_at}
                                    href={`/informasi/${post.attributes.slug}`}
                                    variant="featured"
                                    index={index}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Announcements Bar */}
                    {announcements.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-12 p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="font-display text-xl font-semibold mb-1">Pengumuman Terbaru</h3>
                                    <p className="text-blue-100 text-sm">
                                        {announcements[0]?.attributes?.title}
                                    </p>
                                </div>
                                <Link
                                    href="/pengumuman"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
                                >
                                    Lihat Pengumuman
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* Achievements Section */}
            <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <SectionHeader
                            label="Prestasi"
                            title="Kebanggaan Kami"
                            subtitle="Berbagai pencapaian gemilang siswa-siswi dalam bidang akademik, olahraga, dan seni"
                            align="center"
                        />
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <AchievementsCarousel achievements={achievements} />
                </motion.div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <SectionHeader
                            label="Galeri"
                            title="Momen Berharga"
                            subtitle="Dokumentasi kegiatan dan momen spesial di lingkungan sekolah"
                            align="center"
                        />
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                >
                    <GalleryPreview galleries={galleries} />
                </motion.div>
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* Alumni Section */}
            <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <SectionHeader
                            label="Alumni"
                            title="Jejak Sukses Alumni"
                            subtitle="Kisah inspiratif alumni yang telah berkontribusi di berbagai bidang"
                            align="center"
                        />
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <AlumniCarousel alumni={alumni} />
                </motion.div>
            </section>

            {/* CTA Section - Symmetrical */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
                {/* Decorative Elements */}
                <motion.div
                    className="absolute inset-0 pattern-grid opacity-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="space-y-6"
                        >
                            <motion.span
                                variants={staggerItem}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Pendaftaran Dibuka
                            </motion.span>

                            <motion.h2
                                variants={staggerItem}
                                className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white"
                            >
                                Bergabunglah Bersama Kami
                            </motion.h2>

                            <motion.p
                                variants={staggerItem}
                                className="text-xl text-slate-300 max-w-xl mx-auto"
                            >
                                Jadilah bagian dari keluarga besar {settings.site_short_name} dan raih masa depan cemerlang
                            </motion.p>

                            <motion.div
                                variants={staggerItem}
                                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                            >
                                <Link
                                    href="/ppdb"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-all duration-500 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1"
                                >
                                    Info Pendaftaran
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-500 hover:-translate-y-1"
                                >
                                    Hubungi Kami
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact & Location Section - Symmetrical Grid */}
            <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <SectionHeader
                            label="Kontak"
                            title="Hubungi Kami"
                            align="center"
                        />
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Location */}
                        <motion.div variants={staggerItem} className="stat-card smooth-hover">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">Alamat</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {settings.address || 'Jl. Kamboja No. 4, Dangin Puri Kangin, Denpasar Utara'}
                            </p>
                        </motion.div>

                        {/* Phone */}
                        <motion.div variants={staggerItem} className="stat-card smooth-hover">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                <Phone className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">Telepon</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {settings.phone || '(0361) 226311'}
                            </p>
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={staggerItem} className="stat-card smooth-hover">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                                <Mail className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">Email</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {settings.email || 'info@sman1denpasar.sch.id'}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="mt-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.363619842848!2d115.21894261478454!3d-8.657694793803037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd240ff4c5bb32d%3A0x6e68c5bfa9d2a6e6!2sSMA%20Negeri%201%20Denpasar!5e0!3m2!1sen!2sid!4v1640000000000!5m2!1sen!2sid"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi SMA Negeri 1 Denpasar"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
