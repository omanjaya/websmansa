interface OrganizationJsonLdProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    email: string
  }
  sameAs?: string[]
}

export function OrganizationJsonLd({
  name = 'SMA Negeri 1 Denpasar',
  url = 'https://sman1denpasar.sch.id',
  logo = 'https://sman1denpasar.sch.id/logo.png',
  description = 'SMA Negeri 1 Denpasar - Unggul dalam Prestasi, Berkarakter Pancasila. Sekolah menengah atas negeri terbaik di Denpasar, Bali.',
  address = {
    streetAddress: 'Jl. Kamboja No. 4',
    addressLocality: 'Denpasar',
    addressRegion: 'Bali',
    postalCode: '80231',
    addressCountry: 'ID',
  },
  contactPoint = {
    telephone: '+62361234567',
    email: 'info@sman1denpasar.sch.id',
  },
  sameAs = [
    'https://www.facebook.com/sman1denpasar',
    'https://www.instagram.com/sman1denpasar',
    'https://www.youtube.com/@sman1denpasar',
  ],
}: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${url}/#organization`,
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    description,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactPoint.telephone,
      email: contactPoint.email,
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface WebsiteJsonLdProps {
  name?: string
  url?: string
  description?: string
}

export function WebsiteJsonLd({
  name = 'SMA Negeri 1 Denpasar',
  url = 'https://sman1denpasar.sch.id',
  description = 'Website resmi SMA Negeri 1 Denpasar - Informasi sekolah, berita, pengumuman, dan kegiatan.',
}: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name,
    url,
    description,
    publisher: {
      '@id': `${url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName?: string
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'Admin SMAN 1 Denpasar',
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: image || 'https://sman1denpasar.sch.id/og-image.jpg',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SMA Negeri 1 Denpasar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sman1denpasar.sch.id/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface FAQJsonLdProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// School Schema (More specific than EducationalOrganization)
interface SchoolJsonLdProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  foundingDate?: string
  numberOfStudents?: number
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  telephone?: string
  email?: string
  sameAs?: string[]
}

export function SchoolJsonLd({
  name = 'SMA Negeri 1 Denpasar',
  url = 'https://sman1denpasar.sch.id',
  logo = 'https://sman1denpasar.sch.id/logo.png',
  description = 'SMA Negeri 1 Denpasar adalah sekolah menengah atas negeri unggulan di Kota Denpasar, Bali. Berdiri sejak 1950, sekolah ini telah menghasilkan ribuan lulusan berkualitas.',
  foundingDate = '1950',
  numberOfStudents = 1200,
  address = {
    streetAddress: 'Jl. Kamboja No. 4',
    addressLocality: 'Denpasar',
    addressRegion: 'Bali',
    postalCode: '80231',
    addressCountry: 'ID',
  },
  geo = {
    latitude: -8.6705,
    longitude: 115.2126,
  },
  telephone = '+62361234567',
  email = 'info@sman1denpasar.sch.id',
  sameAs = [
    'https://www.facebook.com/sman1denpasar',
    'https://www.instagram.com/sman1denpasar',
    'https://www.youtube.com/@sman1denpasar',
    'https://twitter.com/sman1denpasar',
  ],
}: SchoolJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'School',
    '@id': `${url}/#school`,
    name,
    alternateName: 'SMAN 1 Denpasar',
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 200,
      height: 200,
    },
    image: logo,
    description,
    foundingDate,
    numberOfStudents,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    telephone,
    email,
    sameAs,
    areaServed: {
      '@type': 'City',
      name: 'Denpasar',
    },
    isAccessibleForFree: false,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'High School Diploma',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// NewsArticle Schema (Better for news content)
interface NewsArticleJsonLdProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  section?: string
  keywords?: string[]
}

export function NewsArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  section = 'Berita Sekolah',
  keywords = [],
}: NewsArticleJsonLdProps) {
  const BASE_URL = 'https://sman1denpasar.sch.id'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    image: image ? [image] : [`${BASE_URL}/og-image.jpg`],
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'SMA Negeri 1 Denpasar',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SMA Negeri 1 Denpasar',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 200,
        height: 200,
      },
    },
    articleSection: section,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    inLanguage: 'id-ID',
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Event Schema
interface EventJsonLdProps {
  name: string
  description: string
  url: string
  startDate: string
  endDate?: string
  location?: string
  image?: string
  organizer?: string
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled'
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode'
}

export function EventJsonLd({
  name,
  description,
  url,
  startDate,
  endDate,
  location = 'SMA Negeri 1 Denpasar',
  image,
  organizer = 'SMA Negeri 1 Denpasar',
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OfflineEventAttendanceMode',
}: EventJsonLdProps) {
  const BASE_URL = 'https://sman1denpasar.sch.id'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    url,
    startDate,
    endDate: endDate || startDate,
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Kamboja No. 4',
        addressLocality: 'Denpasar',
        addressRegion: 'Bali',
        postalCode: '80231',
        addressCountry: 'ID',
      },
    },
    image: image || `${BASE_URL}/og-image.jpg`,
    organizer: {
      '@type': 'Organization',
      name: organizer,
      url: BASE_URL,
    },
    performer: {
      '@type': 'Organization',
      name: 'SMA Negeri 1 Denpasar',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Person Schema (for staff)
interface PersonJsonLdProps {
  name: string
  url: string
  image?: string
  jobTitle: string
  description?: string
  email?: string
  telephone?: string
  worksFor?: string
  alumniOf?: string
}

export function PersonJsonLd({
  name,
  url,
  image,
  jobTitle,
  description,
  email,
  telephone,
  worksFor = 'SMA Negeri 1 Denpasar',
  alumniOf,
}: PersonJsonLdProps) {
  const BASE_URL = 'https://sman1denpasar.sch.id'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    image: image || `${BASE_URL}/default-avatar.jpg`,
    jobTitle,
    description,
    email,
    telephone,
    worksFor: {
      '@type': 'Organization',
      name: worksFor,
      url: BASE_URL,
    },
    alumniOf: alumniOf
      ? {
          '@type': 'EducationalOrganization',
          name: alumniOf,
        }
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Course Schema (for extracurricular)
interface CourseJsonLdProps {
  name: string
  description: string
  url: string
  provider?: string
  instructor?: string
  schedule?: string
}

export function CourseJsonLd({
  name,
  description,
  url,
  provider = 'SMA Negeri 1 Denpasar',
  instructor,
  schedule,
}: CourseJsonLdProps) {
  const BASE_URL = 'https://sman1denpasar.sch.id'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: BASE_URL,
    },
    instructor: instructor
      ? {
          '@type': 'Person',
          name: instructor,
        }
      : undefined,
    courseMode: 'onsite',
    inLanguage: 'id',
    isAccessibleForFree: true,
    hasCourseInstance: schedule
      ? {
          '@type': 'CourseInstance',
          courseSchedule: {
            '@type': 'Schedule',
            scheduleTimezone: 'Asia/Makassar',
            repeatFrequency: 'P1W',
          },
        }
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Place Schema (for facilities)
interface PlaceJsonLdProps {
  name: string
  description: string
  url: string
  image?: string
  maximumAttendeeCapacity?: number
  address?: string
  amenities?: string[]
}

export function PlaceJsonLd({
  name,
  description,
  url,
  image,
  maximumAttendeeCapacity,
  amenities = [],
}: PlaceJsonLdProps) {
  const BASE_URL = 'https://sman1denpasar.sch.id'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    description,
    url,
    image: image || `${BASE_URL}/og-image.jpg`,
    maximumAttendeeCapacity,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Kamboja No. 4',
      addressLocality: 'Denpasar',
      addressRegion: 'Bali',
      postalCode: '80231',
      addressCountry: 'ID',
    },
    amenityFeature: amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    containedInPlace: {
      '@type': 'School',
      name: 'SMA Negeri 1 Denpasar',
      url: BASE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// LocalBusiness (for contact page)
interface LocalBusinessJsonLdProps {
  name?: string
  url?: string
  telephone?: string
  email?: string
  openingHours?: string[]
}

export function LocalBusinessJsonLd({
  name = 'SMA Negeri 1 Denpasar',
  url = 'https://sman1denpasar.sch.id',
  telephone = '+62361234567',
  email = 'info@sman1denpasar.sch.id',
  openingHours = ['Mo-Fr 07:00-15:00', 'Sa 07:00-12:00'],
}: LocalBusinessJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name,
    url,
    telephone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Kamboja No. 4',
      addressLocality: 'Denpasar',
      addressRegion: 'Bali',
      postalCode: '80231',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.6705,
      longitude: 115.2126,
    },
    openingHoursSpecification: openingHours.map((hours) => {
      const [days, time] = hours.split(' ')
      const [opens, closes] = time.split('-')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.includes('-')
          ? days
              .split('-')
              .map((d) =>
                d === 'Mo'
                  ? 'Monday'
                  : d === 'Tu'
                  ? 'Tuesday'
                  : d === 'We'
                  ? 'Wednesday'
                  : d === 'Th'
                  ? 'Thursday'
                  : d === 'Fr'
                  ? 'Friday'
                  : d === 'Sa'
                  ? 'Saturday'
                  : 'Sunday'
              )
          : days === 'Mo'
          ? 'Monday'
          : days === 'Sa'
          ? 'Saturday'
          : days,
        opens,
        closes,
      }
    }),
    priceRange: '$$',
    image: `${url}/logo.png`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// SiteNavigationElement Schema
interface SiteNavigationJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function SiteNavigationJsonLd({ items }: SiteNavigationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: items.map((item) => ({
      '@type': 'SiteNavigationElement',
      name: item.name,
      url: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
