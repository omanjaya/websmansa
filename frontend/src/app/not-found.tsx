import Link from 'next/link'
import { Metadata } from 'next'
import { Home, Newspaper, Bell, Mail, ArrowLeft, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak ditemukan',
}

export default function NotFound() {
  const suggestions = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Berita & Informasi', href: '/informasi', icon: Newspaper },
    { name: 'Pengumuman', href: '/pengumuman', icon: Bell },
    { name: 'Hubungi Kami', href: '/kontak', icon: Mail },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 
      bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-lg w-full text-center relative z-10">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 blur-3xl opacity-20" />
            <h1 className="relative text-[10rem] font-black leading-none 
              bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent
              drop-shadow-sm">
              404
            </h1>
          </div>
        </div>

        {/* Glass Card */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl 
          border border-white/50 dark:border-slate-700/50 
          shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          p-8 mb-8">

          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 
            dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl flex items-center justify-center">
            <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
            Halaman mungkin telah dipindahkan atau dihapus.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl 
          border border-white/40 dark:border-slate-700/40 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />
            Mungkin Anda mencari
            <span className="w-8 h-0.5 bg-gradient-to-l from-blue-600 to-transparent rounded-full" />
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {suggestions.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl 
                    bg-white/50 dark:bg-slate-700/50 
                    border border-white/60 dark:border-slate-600/50
                    hover:bg-white dark:hover:bg-slate-700 
                    hover:shadow-lg hover:-translate-y-0.5
                    transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 
                    dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center 
                    group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 
                    group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 
            bg-gradient-to-r from-blue-600 to-cyan-600 
            hover:from-blue-700 hover:to-cyan-700
            text-white rounded-2xl font-semibold 
            shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
            hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
