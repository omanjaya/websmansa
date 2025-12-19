import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './tiptap.css'
import { ConditionalLayout } from '@/components/layout'
import { QueryProvider, ThemeProvider } from '@/providers'
import { SchoolJsonLd, WebsiteJsonLd, SiteNavigationJsonLd } from '@/components/seo'
import { Toaster } from 'sonner'
import { SiteConfigProvider } from '@/contexts/SiteConfigContext'
import { getServerSettings } from '@/lib/settings-server'

const inter = Inter({ subsets: ['latin'] })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings()

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: settings.site_name,
      template: `%s | ${settings.site_short_name}`,
    },
    description: settings.meta_description || settings.site_description,
    keywords: settings.meta_keywords.split(',').map(k => k.trim()),
    authors: [{ name: settings.site_name, url: BASE_URL }],
    creator: settings.site_name,
    publisher: settings.site_name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description || settings.site_description,
      url: BASE_URL,
      siteName: settings.site_name,
      locale: 'id_ID',
      type: 'website',
      images: settings.og_image ? [
        {
          url: settings.og_image,
          width: 1200,
          height: 630,
          alt: settings.site_name,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description || settings.site_description,
      images: settings.og_image ? [settings.og_image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code',
    },
    alternates: {
      canonical: BASE_URL,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch settings on server for initial hydration
  const settings = await getServerSettings()

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <SchoolJsonLd />
        <WebsiteJsonLd />
        <SiteNavigationJsonLd
          items={[
            { name: 'Beranda', url: `${BASE_URL}` },
            { name: 'Tentang', url: `${BASE_URL}/tentang` },
            { name: 'Informasi', url: `${BASE_URL}/informasi` },
            { name: 'Pengumuman', url: `${BASE_URL}/pengumuman` },
            { name: 'Ekstrakurikuler', url: `${BASE_URL}/ekstrakurikuler` },
            { name: 'Fasilitas', url: `${BASE_URL}/fasilitas` },
            { name: 'Staff & Guru', url: `${BASE_URL}/staff` },
            { name: 'Kontak', url: `${BASE_URL}/kontak` },
          ]}
        />
        <link rel="alternate" type="application/rss+xml" title={`Berita ${settings.site_short_name}`} href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title={`Pengumuman ${settings.site_short_name}`} href="/pengumuman/feed.xml" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <SiteConfigProvider initialSettings={settings}>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </SiteConfigProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
