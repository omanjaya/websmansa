'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Clock } from 'lucide-react'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { FaTiktok } from 'react-icons/fa'

const quickLinks = [
  { name: 'Tentang Kami', href: '/tentang' },
  { name: 'Informasi', href: '/informasi' },
  { name: 'Pengumuman', href: '/pengumuman' },
  { name: 'Ekstrakurikuler', href: '/ekstrakurikuler' },
  { name: 'Fasilitas', href: '/fasilitas' },
  { name: 'Staff & Guru', href: '/staff' },
]

export default function Footer() {
  const { settings } = useSiteConfig()
  const currentYear = new Date().getFullYear()

  // Build dynamic social links from settings
  const socialLinks = [
    settings.facebook_url && { name: 'Facebook', icon: Facebook, href: settings.facebook_url, color: 'hover:bg-blue-600' },
    settings.instagram_url && { name: 'Instagram', icon: Instagram, href: settings.instagram_url, color: 'hover:bg-pink-600' },
    settings.youtube_url && { name: 'YouTube', icon: Youtube, href: settings.youtube_url, color: 'hover:bg-red-600' },
    settings.tiktok_url && { name: 'TikTok', icon: FaTiktok, href: settings.tiktok_url, color: 'hover:bg-gray-800' },
  ].filter(Boolean) as Array<{ name: string; icon: React.ComponentType<{ className?: string }>; href: string; color: string }>

  return (
    <footer className="relative overflow-hidden text-gray-300 bg-slate-900 dark:bg-slate-950">

      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">{settings.site_short_name}</div>
                <div className="text-xs text-gray-400">{settings.site_tagline.split(',')[0]}</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {settings.site_tagline}. {settings.site_description.split('.').slice(0, 1).join('.')}
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-slate-800 dark:bg-slate-800/50 rounded-xl flex items-center justify-center transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-white text-lg mb-6">Tautan Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-white text-lg mb-6">Kontak</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 dark:bg-slate-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Alamat</span>
                  <p className="mt-1">{settings.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 dark:bg-slate-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Telepon</span>
                  <p className="mt-1">
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary-400 transition-colors">
                      {settings.phone}
                    </a>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 dark:bg-slate-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Email</span>
                  <p className="mt-1">
                    <a href={`mailto:${settings.email}`} className="hover:text-primary-400 transition-colors">
                      {settings.email}
                    </a>
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Operating Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-white text-lg mb-6">Jam Operasional</h3>
            <div className="bg-slate-800/50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-gray-300 font-medium">Jadwal Sekolah</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Senin - Jumat</span>
                  <span className="text-gray-300">{settings.weekday_hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sabtu</span>
                  <span className="text-gray-300">{settings.saturday_hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minggu</span>
                  <span className={settings.sunday_hours.toLowerCase() === 'tutup' ? 'text-red-400' : 'text-gray-300'}>
                    {settings.sunday_hours}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} {settings.site_name}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <Link href="/kebijakan-privasi" className="hover:text-primary-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/syarat-ketentuan" className="hover:text-primary-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/sitemap.xml" className="hover:text-primary-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
