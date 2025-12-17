'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, GraduationCap } from 'lucide-react'
import { ThemeToggle } from '@/components/ui'

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang', href: '/tentang' },
  { name: 'Informasi', href: '/informasi' },
  { name: 'Pengumuman', href: '/pengumuman' },
  { name: 'Ekstrakurikuler', href: '/ekstrakurikuler' },
  { name: 'Fasilitas', href: '/fasilitas' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Staff', href: '/staff' },
  { name: 'Kontak', href: '/kontak' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
      </a>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-700/50'
          : 'bg-black/20 backdrop-blur-sm'
          }`}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25"
              >
                <GraduationCap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <div className={`font-bold transition-colors ${isScrolled
                  ? 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  : 'text-white group-hover:text-white/80'}`}>
                  SMAN 1 Denpasar
                </div>
                <div className={`text-xs transition-colors ${isScrolled
                  ? 'text-gray-500 dark:text-slate-400'
                  : 'text-white/70'}`}>
                  Unggul dalam Prestasi
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${isScrolled
                      ? isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      : isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                      }`}
                  >
                    {item.name}
                    {isActive && isScrolled && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 rounded-xl -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    {isActive && !isScrolled && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-white/20 rounded-xl -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle transparent={!isScrolled} />

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={`lg:hidden p-2 rounded-xl transition-colors ${isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/20'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full left-0 right-0 p-4 lg:hidden"
                style={{ transformOrigin: 'top' }}
              >
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-2xl p-2 shadow-2xl border border-white/20 dark:border-slate-700/50 ring-1 ring-black/5">
                  <div className="flex flex-col gap-1">
                    {navigation.map((item, index) => {
                      const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))

                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${isActive
                              ? 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/30'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-800/40'
                              }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  )
}
