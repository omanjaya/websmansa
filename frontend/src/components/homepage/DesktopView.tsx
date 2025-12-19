'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react'
import { SectionHeader, NewsCard } from '@/components/shared'
import { Post, Slider, Achievement, Alumni, Gallery } from '@/lib/api'
import { GalleryPreview } from './components/GalleryPreview'
import { InfiniteMarqueeAchievements } from './components/InfiniteMarqueeAchievements'
import { InfiniteMarqueeAlumni } from './components/InfiniteMarqueeAlumni'
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

    return (
        <main id="main-content" className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Hero Section */}
            <HeroSection slides={slides} />

            {/* Principal Welcome Section - Centered & Symmetrical */}
            <section className="py-10 md:py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
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

                        {/* Principal Layout - Photo outside, Quote in card */}
                        <motion.div
                            variants={fadeInScale}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="flex flex-col md:flex-row gap-8 items-center"
                        >
                            {/* Left: Photo + Caption (Outside Card) */}
                            <div className="flex-shrink-0 w-full md:w-72 lg:w-80 text-center">
                                {/* Photo */}
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mb-4 mx-auto w-56 md:w-full">
                                    <Image
                                        src={settings.principal_photo || '/principal.png'}
                                        alt={settings.principal_name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 224px, 320px"
                                    />
                                </div>
                                {/* Caption */}
                                <h4 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                                    {settings.principal_name}
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    {settings.principal_title}
                                </p>
                            </div>

                            {/* Right: Quote Card */}
                            <div className="flex-1 principal-card p-6 md:p-8">
                                <div className="elegant-quote mb-4">
                                    {settings.principal_message}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    {settings.principal_description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* News & Announcements Section - Symmetrical Grid */}
            <section className="py-10 md:py-14 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
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

            {/* Achievements Section - Infinite Marquee */}
            <InfiniteMarqueeAchievements achievements={achievements} />

            {/* Divider */}
            <div className="section-divider" />

            {/* Gallery Section */}
            <section className="py-10 md:py-14 bg-white dark:bg-slate-950">
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

            {/* Alumni Section - Infinite Marquee */}
            <InfiniteMarqueeAlumni alumni={alumni} />

            {/* Divider */}
            <div className="section-divider" />

            {/* Contact & Location Section - Symmetrical Grid */}
            <section className="py-10 md:py-14 bg-white dark:bg-slate-950">
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
