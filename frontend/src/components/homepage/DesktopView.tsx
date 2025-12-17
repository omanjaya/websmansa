'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/Motion'
import { GalleryPreview } from './components/GalleryPreview'
import { AchievementsCarousel } from './components/AchievementsCarousel'
import { PartnershipLogos } from './components/PartnershipLogos'
import { LocationMap } from './components/LocationMap'
import { HeroSection } from './components/HeroSection'
import { WhyChooseUs } from './components/WhyChooseUs'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

const typeLabels: Record<string, string> = {
    general: 'Umum',
    academic: 'Akademik',
    event: 'Kegiatan',
    urgent: 'Penting',
}

interface DesktopViewProps {
    posts: any[]
    announcements: any[]
    slides?: any[]
}

export function DesktopView({ posts, announcements, slides }: DesktopViewProps) {
    const { settings } = useSiteConfig()

    // Build principal data from settings
    const principalData = {
        name: settings.principal_name,
        title: `${settings.principal_title} ${settings.site_name}`,
        message: `"${settings.principal_message}"`,
        description: settings.principal_description,
        image: settings.principal_photo || '/principal.png',
        since: settings.principal_since
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section with Slider */}
            <HeroSection slides={slides} />

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Principal Section */}
            <section className="py-24 pb-32 bg-slate-50 dark:bg-slate-900 relative overflow-visible">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 dark:bg-blue-900/10 skew-x-12 translate-x-20" />

                <div className="container mx-auto px-4 relative">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <ScrollReveal direction="left" delay={0.1} className="order-2 md:order-1 space-y-8">
                            <div className="relative">
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm flex items-center gap-2">
                                    <span className="w-10 h-[2px] bg-blue-600"></span>
                                    Sambutan Kepala Sekolah
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-4 mb-6 leading-tight">
                                    Membangun Generasi <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                        Masa Depan
                                    </span>
                                </h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300 relative z-10">
                                <div className="relative pl-6 border-l-4 border-blue-200 dark:border-blue-900 italic text-xl text-slate-700 dark:text-slate-200 mb-6">
                                    {principalData.message}
                                </div>
                                <p className="text-base leading-relaxed">
                                    {principalData.description}
                                </p>
                            </div>

                            <div className="pt-6 flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-slate-900 dark:text-white">{principalData.name}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{principalData.title}</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={0.2} className="order-1 md:order-2 relative mt-10 md:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] transform rotate-3 scale-95 opacity-20 blur-sm translate-y-4"></div>

                            <div className="relative z-10 bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-2xl border border-white/20">
                                <div className="relative rounded-3xl overflow-visible aspect-[4/5] md:aspect-[3/4]">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl -z-10 dark:from-blue-900/20 dark:to-indigo-900/20"></div>

                                    <div className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden rounded-2xl">
                                        <Image
                                            src={principalData.image}
                                            alt={`${principalData.name} - ${principalData.title}`}
                                            fill
                                            className="object-cover object-top hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                                    </div>

                                    <div className="absolute -bottom-6 -right-6">
                                        <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-600 flex items-center gap-3">
                                            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full text-yellow-600 dark:text-yellow-400">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Sejak</p>
                                                <p className="text-lg font-bold text-slate-800 dark:text-white">{principalData.since}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* News & Announcements */}
            <section className="py-20 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Berita & Informasi</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Update terkini seputar kegiatan sekolah</p>
                            </div>
                            <Link href="/informasi" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 hover:underline">
                                Lihat Semua Berita
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </ScrollReveal>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <StaggerContainer staggerDelay={0.1} className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                            {posts.map((post) => (
                                <StaggerItem key={post.id}>
                                    <Link
                                        href={`/informasi/${post.attributes.slug}`}
                                        className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-800 hover:-translate-y-2"
                                    >
                                    <div className="h-56 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                                        {post.attributes.featured_image ? (
                                            <Image
                                                src={post.attributes.featured_image}
                                                alt={post.attributes.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            {post.relationships.categories && post.relationships.categories[0] && (
                                                <Badge className="bg-white/90 text-blue-800 backdrop-blur shadow-sm hover:bg-white">
                                                    {post.relationships.categories[0].name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {new Date(post.attributes.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {post.attributes.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 border-l-4 border-gray-200 dark:border-slate-700 pl-3">
                                            {post.attributes.excerpt}
                                        </p>
                                    </div>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>

                        <ScrollReveal delay={0.3} className="space-y-6">
                            <div className="glass-card-strong p-6">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">Pengumuman</h3>
                                    <Link href="/pengumuman" className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 hover:underline">Lihat Semua</Link>
                                </div>

                                <div className="space-y-4">
                                    {announcements.map((announcement) => (
                                        <Link key={announcement.id} href={`/pengumuman/${announcement.attributes.slug}`} className="block group">
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all">
                                                <div className="flex-shrink-0 w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex flex-col items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                                                    <span className="text-xl leading-none">{new Date(announcement.attributes.published_at).getDate()}</span>
                                                    <span className="text-[10px] uppercase">{new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                                </div>
                                                <div>
                                                    <Badge variant={announcement.attributes.type === 'urgent' ? 'destructive' : 'secondary'} className="mb-1 text-[10px] px-1.5 py-0.5 h-auto">
                                                        {typeLabels[announcement.attributes.type] || announcement.attributes.type}
                                                    </Badge>
                                                    <h4 className="text-sm font-semibold leading-snug text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                        {announcement.attributes.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-8 text-center text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -ml-8 -mb-8" />
                                <h3 className="text-2xl font-bold mb-2 relative z-10">Siap bergabung?</h3>
                                <p className="text-primary-100 mb-6 text-sm relative z-10">Jadilah bagian dari keluarga besar {settings.site_short_name}.</p>
                                <Link href="/ppdb" className="inline-block w-full py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg relative z-10 hover:shadow-xl hover:-translate-y-0.5">
                                    Info PPDB
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Achievements Carousel */}
            <AchievementsCarousel />

            {/* Gallery Preview with Lightbox */}
            <GalleryPreview />

            {/* Partnership & Alumni Universities */}
            <PartnershipLogos />

            {/* Location & Contact Map */}
            <LocationMap />

            {/* Footer CTA */}
            <section className="py-24 hero-gradient text-white relative overflow-hidden">
                <div className="hero-pattern" />
                <div className="decorative-grid" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">{settings.cta_title}</h2>
                        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">{settings.cta_subtitle}</p>
                        <div className="flex justify-center gap-4">
                            <Link href={settings.cta_button_link} className="px-8 py-4 bg-white text-primary-600 hover:bg-primary-50 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                {settings.cta_button_text}
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    )
}
