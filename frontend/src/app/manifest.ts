import { MetadataRoute } from 'next'
import { getServerSettings } from '@/lib/settings-server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getServerSettings()

  return {
    name: settings.site_name,
    short_name: settings.site_short_name,
    description: `${settings.site_tagline} - Website Resmi ${settings.site_name}`,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: settings.primary_color || '#1e3a8a',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'id',
    categories: ['education', 'school'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '750x1334',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Berita Terbaru',
        short_name: 'Berita',
        description: 'Lihat berita dan informasi terbaru',
        url: '/informasi',
        icons: [{ src: '/icons/news-icon.png', sizes: '96x96' }],
      },
      {
        name: 'Pengumuman',
        short_name: 'Pengumuman',
        description: 'Lihat pengumuman sekolah',
        url: '/pengumuman',
        icons: [{ src: '/icons/announcement-icon.png', sizes: '96x96' }],
      },
      {
        name: 'Hubungi Kami',
        short_name: 'Kontak',
        description: `Hubungi ${settings.site_name}`,
        url: '/kontak',
        icons: [{ src: '/icons/contact-icon.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
