# SEO Strategy & Implementation

## 🎯 SEO Goals

1. **Rank #1** untuk "SMA Negeri 1 Denpasar" dan variasinya
2. **Top 3** untuk keywords sekolah unggulan Bali
3. **Organic Traffic**: +100% dalam 6 bulan
4. **Domain Authority**: 40+ dalam 12 bulan
5. **Core Web Vitals**: All metrics in "Good" range

## 📊 Target Keywords

### Primary Keywords

- "SMA Negeri 1 Denpasar"
- "SMAN 1 Denpasar"
- "Sekolah SMA terbaik Denpasar"
- "SMA favorit Bali"
- "PPDB SMAN 1 Denpasar"

### Secondary Keywords

- "Ekstrakurikuler SMAN 1 Denpasar"
- "Prestasi SMAN 1 Denpasar"
- "Fasilitas SMAN 1 Denpasar"
- "Alumni SMAN 1 Denpasar"
- "Akreditasi SMAN 1 Denpasar"

### Long-tail Keywords

- "Cara daftar SMAN 1 Denpasar 2025"
- "Passing grade SMAN 1 Denpasar"
- "Biaya SMAN 1 Denpasar"
- "Kurikulum SMAN 1 Denpasar"

## 🏗️ Technical SEO Implementation

### 1. Server-Side Rendering (SSR) with Next.js

```typescript
// app/(public)/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://smansadps.sch.id'),
  title: {
    default: 'SMA Negeri 1 Denpasar - Sekolah Unggulan Bali',
    template: '%s | SMAN 1 Denpasar',
  },
  description: 'SMA Negeri 1 Denpasar adalah sekolah menengah atas unggulan di Bali dengan akreditasi A, fasilitas modern, dan prestasi gemilang tingkat nasional dan internasional.',
  keywords: [
    'SMAN 1 Denpasar',
    'SMA Negeri 1 Denpasar',
    'Sekolah SMA Denpasar',
    'SMA terbaik Bali',
    'SMA favorit Denpasar',
  ],
  authors: [{ name: 'SMAN 1 Denpasar' }],
  creator: 'SMAN 1 Denpasar',
  publisher: 'SMAN 1 Denpasar',
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
  alternates: {
    canonical: 'https://smansadps.sch.id',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://smansadps.sch.id',
    siteName: 'SMAN 1 Denpasar',
    title: 'SMA Negeri 1 Denpasar - Sekolah Unggulan Bali',
    description: '...',
    images: [
      {
        url: 'https://smansadps.sch.id/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMAN 1 Denpasar',
    description: '...',
    images: ['https://smansadps.sch.id/og-image.jpg'],
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};
```

### 2. Dynamic Page Metadata

```typescript
// app/(public)/informasi/[slug]/page.tsx
import { Metadata } from 'next';
import { getPost } from '@/lib/api';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: post.categories.map((c) => c.name),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  return <PostDetail post={post} />;
}
```

### 3. Structured Data (JSON-LD)

```typescript
// components/seo/StructuredData.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': 'https://smansadps.sch.id#organization',
    name: 'SMA Negeri 1 Denpasar',
    alternateName: 'SMAN 1 Denpasar',
    url: 'https://smansadps.sch.id',
    logo: 'https://smansadps.sch.id/logo.png',
    description: '...',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. ...',
      addressLocality: 'Denpasar',
      addressRegion: 'Bali',
      postalCode: '80114',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-361-xxxxx',
      contactType: 'Customer Service',
      email: 'info@smansadps.sch.id',
    },
    sameAs: [
      'https://facebook.com/smansadps',
      'https://instagram.com/smansadps',
      'https://youtube.com/@smansadps',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({ post }: { post: Post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SMAN 1 Denpasar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smansadps.sch.id/logo.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 4. Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getPosts, getExtras, getFacilities } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://smansadps.sch.id';

  // Static pages
  const staticPages = [
    '',
    '/tentang-kami',
    '/informasi',
    '/pengumuman',
    '/ekstrakurikuler',
    '/fasilitas',
    '/staff',
    '/galeri',
    '/alumni',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic pages - Posts
  const posts = await getPosts({ perPage: 10000 });
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/informasi/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic pages - Extras
  const extras = await getExtras();
  const extraPages = extras.map((extra) => ({
    url: `${baseUrl}/ekstrakurikuler/${extra.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...extraPages];
}
```

### 5. Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://smansadps.sch.id/sitemap.xml',
  };
}
```

### 6. Canonical URLs

```typescript
// In every page
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://smansadps.sch.id/current-page',
  },
};
```

## 🚀 On-Page SEO

### 1. URL Structure

```
✅ Good:
https://smansadps.sch.id/informasi/prestasi-olimpiade-sains-2025
https://smansadps.sch.id/ekstrakurikuler/basket

❌ Bad:
https://smansadps.sch.id/post/123
https://smansadps.sch.id/extra?id=5
```

### 2. Heading Hierarchy

```html
<h1>Prestasi Siswa SMAN 1 Denpasar di Olimpiade Sains 2025</h1>
  <h2>Latar Belakang</h2>
    <h3>Persiapan Tim</h3>
  <h2>Hasil Kompetisi</h2>
    <h3>Medali Emas</h3>
    <h3>Medali Perak</h3>
  <h2>Kesimpulan</h2>
```

**Rules:**

- Only ONE H1 per page
- Proper hierarchy (don't skip levels)
- Include keywords naturally
- Descriptive and relevant

### 3. Content Optimization

**Content Length:**

- Homepage: 500-800 words
- About: 800-1500 words
- Blog posts: 1000-2500 words
- Service pages: 600-1200 words

**Keyword Density:**

- Primary keyword: 1-2%
- Related keywords: Natural usage
- LSI keywords: Throughout content

**Content Structure:**

- Introduction (100-150 words)
- Main content (subheadings, lists, images)
- Conclusion (80-100 words)
- Call-to-action

### 4. Image Optimization

```typescript
// next/image automatic optimization
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Gedung SMAN 1 Denpasar - Sekolah Unggulan Bali"
  width={1920}
  height={1080}
  priority // For above-the-fold images
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Best Practices:**

- Use WebP format (automatic with next/image)
- Add descriptive alt text
- Include keywords in filename
- Lazy load below-the-fold images
- Use appropriate dimensions
- Compress before upload

### 5. Internal Linking

```typescript
// components/InternalLinks.tsx
export function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <section>
      <h3>Artikel Terkait</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/informasi/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**Strategy:**

- Link to related content
- Use descriptive anchor text
- 3-5 internal links per page
- Deep linking (not just homepage)
- Breadcrumbs navigation

### 6. Schema Markup Examples

```typescript
// Event Schema (for school events)
const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Penerimaan Siswa Baru 2025',
  startDate: '2025-06-01',
  endDate: '2025-07-31',
  location: {
    '@type': 'Place',
    name: 'SMAN 1 Denpasar',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Denpasar',
      addressRegion: 'Bali',
      addressCountry: 'ID',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'SMAN 1 Denpasar',
    url: 'https://smansadps.sch.id',
  },
};

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Bagaimana cara mendaftar di SMAN 1 Denpasar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pendaftaran dilakukan melalui...',
      },
    },
  ],
};
```

## 📱 Mobile SEO

### 1. Responsive Design

```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
```

### 2. Mobile-Friendly Features

- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Readable font sizes (min 16px)
- ✅ No horizontal scrolling
- ✅ Adequate spacing
- ✅ Fast loading (< 3s)

## ⚡ Performance SEO

### 1. Core Web Vitals Optimization

**Largest Contentful Paint (LCP) < 2.5s:**

- Optimize images (WebP, lazy loading)
- Use CDN for static assets
- Implement caching
- Minimize render-blocking resources

**First Input Delay (FID) < 100ms:**

- Code splitting
- Defer non-critical JavaScript
- Use web workers for heavy tasks

**Cumulative Layout Shift (CLS) < 0.1:**

- Set width/height for images
- Reserve space for ads/embeds
- Avoid inserting content above existing content

### 2. Page Speed Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  compress: true,
};
```

### 3. Caching Strategy

```typescript
// app/layout.tsx
export const revalidate = 3600; // ISR - revalidate every hour

// app/informasi/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

// For dynamic pages
export async function generateStaticParams() {
  const posts = await getPosts({ perPage: 1000 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

## 🔗 Off-Page SEO

### 1. Backlink Strategy

**Target Sites:**

- Dinas Pendidikan Bali - Backlink dari website dinas
- Sekolah partner - Link exchange
- Media lokal - Press releases
- Educational directories
- Alumni websites
- Event organizers

### 2. Social Media Integration

```typescript
// components/SocialShare.tsx
export function SocialShare({ url, title }: Props) {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <div className="social-share">
      <a href={shareUrls.facebook} target="_blank" rel="noopener">Share on Facebook</a>
      <a href={shareUrls.twitter} target="_blank" rel="noopener">Share on Twitter</a>
      {/* ... */}
    </div>
  );
}
```

### 3. Local SEO

**Google Business Profile:**

- Complete profile
- Regular posts
- Respond to reviews
- Add photos
- Update business hours

**Local Citations:**

- Consistent NAP (Name, Address, Phone)
- List in educational directories
- Yelp, Foursquare, etc.

```typescript
// LocalBusiness Schema
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HighSchool',
  name: 'SMA Negeri 1 Denpasar',
  image: 'https://smansadps.sch.id/building.jpg',
  '@id': 'https://smansadps.sch.id',
  url: 'https://smansadps.sch.id',
  telephone: '+62-361-xxxxx',
  priceRange: 'Free',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. ...',
    addressLocality: 'Denpasar',
    postalCode: '80114',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -8.xxxxx,
    longitude: 115.xxxxx,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '07:00',
    closes: '15:00',
  },
};
```

## 📊 SEO Monitoring & Analytics

### 1. Google Analytics 4

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: GtagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### 2. Google Search Console

**Setup:**

- Verify ownership
- Submit sitemap
- Monitor search performance
- Fix crawl errors
- Check mobile usability
- Monitor Core Web Vitals

### 3. SEO Metrics to Track

**Rankings:**

- Target keywords position
- Organic visibility
- Featured snippets

**Traffic:**

- Organic traffic
- Organic CTR
- Bounce rate
- Time on site
- Pages per session

**Technical:**

- Crawl errors
- Index coverage
- Core Web Vitals
- Page speed
- Mobile usability

**Backlinks:**

- Total backlinks
- Referring domains
- Domain authority
- Spam score

### 4. SEO Audit Tools

- Google Search Console
- Google PageSpeed Insights
- Google Analytics
- Screaming Frog (crawling)
- Ahrefs/SEMrush (keywords, backlinks)
- Lighthouse (performance)

## 📝 Content Marketing Strategy

### 1. Content Calendar

**Monthly Content:**

- 8-12 blog posts (informasi/berita)
- 2-4 announcements
- 1-2 gallery updates
- Social media posts (daily)

**Content Types:**

- Prestasi siswa/guru
- Tips & advice (belajar, ujian, etc.)
- School events
- Alumni success stories
- Educational content

### 2. Content Distribution

- Website (primary)
- Social media (Facebook, Instagram, YouTube)
- Email newsletter
- WhatsApp groups
- Local media

## 🎯 SEO Checklist

### Pre-Launch

- [ ] Google Analytics installed
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Robots.txt configured
- [ ] SSL certificate installed
- [ ] Redirect HTTP to HTTPS
- [ ] Structured data implemented
- [ ] Meta tags on all pages
- [ ] Alt tags on all images
- [ ] Mobile-friendly test passed
- [ ] Page speed optimized
- [ ] 404 page customized
- [ ] Canonical URLs set

### Post-Launch

- [ ] Monitor search rankings
- [ ] Check crawl errors
- [ ] Monitor Core Web Vitals
- [ ] Build backlinks
- [ ] Create regular content
- [ ] Engage on social media
- [ ] Respond to reviews
- [ ] Update Google Business Profile

### Monthly Tasks

- [ ] Review analytics
- [ ] Check keyword rankings
- [ ] Fix any errors
- [ ] Publish new content
- [ ] Build backlinks
- [ ] Social media engagement
- [ ] Update meta descriptions
- [ ] Image optimization

## 🚀 Expected Results

**Month 1-3:**

- Indexed in Google
- Ranking for brand keywords
- Basic traffic growing

**Month 4-6:**

- Ranking for target keywords
- Growing organic traffic (+50%)
- Backlinks building

**Month 7-12:**

- Top 3 for primary keywords
- Organic traffic doubled
- Domain authority 30+
- Featured snippets

## 📈 Success Metrics

**Priority 1:**

- Rank #1 for "SMAN 1 Denpasar"
- Rank Top 3 for "SMA terbaik Denpasar"
- Core Web Vitals: All Green

**Priority 2:**

- 100+ organic keywords ranking
- 10,000+ monthly organic visits
- Domain Authority 40+
- 100+ quality backlinks

## 🎯 Summary

SEO strategy fokus pada:

- ✅ **Technical SEO** - Fast, mobile-friendly, structured data
- ✅ **On-Page SEO** - Quality content, proper optimization
- ✅ **Off-Page SEO** - Backlinks, social signals, local SEO
- ✅ **Performance** - Core Web Vitals optimization
- ✅ **Monitoring** - Regular tracking & improvement
