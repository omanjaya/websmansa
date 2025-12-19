'use client'

import { useEffect, useState, useCallback } from 'react'
import { ArrowUp, Share2, Facebook, Twitter, Link2, Check, MessageCircle } from 'lucide-react'

// ============================================================================
// Reading Progress Bar
// ============================================================================
export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollTop = window.scrollY
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
            setProgress(Math.min(100, Math.max(0, progress)))
        }

        window.addEventListener('scroll', updateProgress)
        updateProgress()
        return () => window.removeEventListener('scroll', updateProgress)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

// ============================================================================
// Back to Top Button
// ============================================================================
export function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 500)
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (!isVisible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in"
            aria-label="Back to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    )
}

// ============================================================================
// Floating Social Share
// ============================================================================
interface FloatingSocialShareProps {
    title: string
    url?: string
}

export function FloatingSocialShare({ title, url }: FloatingSocialShareProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [copied, setCopied] = useState(false)
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback
        }
    }

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    const shareToWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank')
    }

    if (!isVisible) return null

    return (
        <div className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 text-center py-1">
                    <Share2 className="w-4 h-4 mx-auto" />
                </span>
                <button
                    onClick={shareToFacebook}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="w-4 h-4" />
                </button>
                <button
                    onClick={shareToTwitter}
                    className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="w-4 h-4" />
                </button>
                <button
                    onClick={shareToWhatsApp}
                    className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Share on WhatsApp"
                >
                    <MessageCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={copyLink}
                    className={`w-10 h-10 ${copied ? 'bg-green-500' : 'bg-slate-600 hover:bg-slate-700'} text-white rounded-xl flex items-center justify-center transition-all hover:scale-110`}
                    aria-label="Copy link"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    )
}

// ============================================================================
// Copy Link Button (Inline)
// ============================================================================
interface CopyLinkButtonProps {
    url?: string
    className?: string
}

export function CopyLinkButton({ url, className = '' }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false)

    const copyLink = async () => {
        const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback
        }
    }

    return (
        <button
            onClick={copyLink}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${copied
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                } ${className}`}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Tersalin!
                </>
            ) : (
                <>
                    <Link2 className="w-4 h-4" />
                    Salin Link
                </>
            )}
        </button>
    )
}

// ============================================================================
// Table of Contents
// ============================================================================
interface TOCItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    contentSelector?: string
}

export function TableOfContents({ contentSelector = '.prose' }: TableOfContentsProps) {
    const [items, setItems] = useState<TOCItem[]>([])
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        const content = document.querySelector(contentSelector)
        if (!content) return

        const headings = content.querySelectorAll('h2, h3')
        const tocItems: TOCItem[] = []

        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`
            if (!heading.id) heading.id = id

            tocItems.push({
                id,
                text: heading.textContent || '',
                level: heading.tagName === 'H2' ? 2 : 3,
            })
        })

        setItems(tocItems)
    }, [contentSelector])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -80% 0px' }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [items])

    const scrollToHeading = useCallback((id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100
            const elementPosition = element.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth',
            })
        }
    }, [])

    if (items.length < 2) return null

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </span>
                Daftar Isi
            </h4>
            <nav className="space-y-1">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${item.level === 3 ? 'pl-6' : ''
                            } ${activeId === item.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {item.text}
                    </button>
                ))}
            </nav>
        </div>
    )
}

// ============================================================================
// Author Card
// ============================================================================
interface AuthorCardProps {
    name: string
    avatar?: string
    role?: string
    bio?: string
}

export function AuthorCard({ name, avatar, role = 'Penulis', bio }: AuthorCardProps) {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-slate-700">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-blue-500/30">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        name.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                        {role}
                    </p>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {name}
                    </h4>
                    {bio && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {bio}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// Reading Time Visual
// ============================================================================
interface ReadingTimeProps {
    minutes: number
    className?: string
}

export function ReadingTimeVisual({ minutes, className = '' }: ReadingTimeProps) {
    const cups = Math.ceil(minutes / 5) // 1 cup = 5 minutes

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex -space-x-1">
                {Array.from({ length: Math.min(cups, 3) }).map((_, i) => (
                    <span key={i} className="text-lg" role="img" aria-label="coffee">
                        ☕
                    </span>
                ))}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
                {minutes} menit baca
            </span>
        </div>
    )
}

// ============================================================================
// Enhanced Related Post Card
// ============================================================================
interface RelatedPostCardProps {
    title: string
    excerpt: string
    slug: string
    image?: string
    date: string
    category?: string
}

export function RelatedPostCard({ title, excerpt, slug, image, date, category }: RelatedPostCardProps) {
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    return (
        <a
            href={`/informasi/${slug}`}
            className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Category Badge */}
                {category && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 rounded-full shadow-lg">
                            {category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{formattedDate}</div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{excerpt}</p>

                {/* Read More */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                    Baca selengkapnya
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </a>
    )
}
