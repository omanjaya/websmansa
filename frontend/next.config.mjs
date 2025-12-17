/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const apiHost = apiUrl.replace(/\/api\/v1$/, ''); // Extract base host

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data: blob: ${apiHost};
  font-src 'self' data:;
  connect-src 'self' ${apiHost} ${apiHost}/api/v1 ${apiHost}/api/admin/v1 ws://localhost:3000;
  frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com;
  frame-ancestors 'self';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
`.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sman1denpasar.sch.id',
      },
      {
        protocol: 'https',
        hostname: '*.sman1denpasar.sch.id',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
      },
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Powered by header removal for security
  poweredByHeader: false,

  // Strict mode for React
  reactStrictMode: true,

  // Generate ETags for caching
  generateEtags: true,

  // Trailing slash configuration
  trailingSlash: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
      // Cache static assets
      {
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.sman1denpasar.sch.id',
          },
        ],
        destination: 'https://sman1denpasar.sch.id/:path*',
        permanent: true,
      },
      {
        source: '/berita',
        destination: '/informasi',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/informasi',
        permanent: true,
      },
      {
        source: '/announcement',
        destination: '/pengumuman',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/kontak',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/tentang',
        permanent: true,
      },
      {
        source: '/ekskul',
        destination: '/ekstrakurikuler',
        permanent: true,
      },
      {
        source: '/guru',
        destination: '/staff',
        permanent: true,
      },
      {
        source: '/teacher',
        destination: '/staff',
        permanent: true,
      },
      {
        source: '/facility',
        destination: '/fasilitas',
        permanent: true,
      },
    ]
  },

  // Production optimizations
  swcMinify: true,

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['@/components/ui', '@/components/seo', '@/lib'],
  },
};

export default nextConfig;
