import { MetadataRoute } from 'next'
import { getPosts, getAnnouncements, getExtras, getFacilities, getStaff } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/informasi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pengumuman`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ekstrakurikuler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/fasilitas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/staff`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic pages - fetch from API with fallback
  let postPages: MetadataRoute.Sitemap = []
  let announcementPages: MetadataRoute.Sitemap = []
  let extraPages: MetadataRoute.Sitemap = []
  let facilityPages: MetadataRoute.Sitemap = []
  let staffPages: MetadataRoute.Sitemap = []

  try {
    const postsResponse = await getPosts({ per_page: 100 })
    if (postsResponse.data) {
      postPages = postsResponse.data.map((post) => ({
        url: `${BASE_URL}/informasi/${post.attributes.slug}`,
        lastModified: new Date(post.attributes.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // Skip if API unavailable
  }

  try {
    const announcementsResponse = await getAnnouncements({ per_page: 100 })
    if (announcementsResponse.data) {
      announcementPages = announcementsResponse.data.map((announcement) => ({
        url: `${BASE_URL}/pengumuman/${announcement.attributes.slug}`,
        lastModified: new Date(announcement.attributes.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // Skip if API unavailable
  }

  try {
    const extrasResponse = await getExtras({ per_page: 100 })
    if (extrasResponse.data) {
      extraPages = extrasResponse.data.map((extra) => ({
        url: `${BASE_URL}/ekstrakurikuler/${extra.attributes.slug}`,
        lastModified: new Date(extra.attributes.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    }
  } catch {
    // Skip if API unavailable
  }

  try {
    const facilitiesResponse = await getFacilities({ per_page: 100 })
    if (facilitiesResponse.data) {
      facilityPages = facilitiesResponse.data.map((facility) => ({
        url: `${BASE_URL}/fasilitas/${facility.attributes.slug}`,
        lastModified: new Date(facility.attributes.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    }
  } catch {
    // Skip if API unavailable
  }

  try {
    const staffResponse = await getStaff({ per_page: 100 })
    if (staffResponse.data) {
      staffPages = staffResponse.data.map((member) => ({
        url: `${BASE_URL}/staff/${member.attributes.slug}`,
        lastModified: new Date(member.attributes.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    }
  } catch {
    // Skip if API unavailable
  }

  return [
    ...staticPages,
    ...postPages,
    ...announcementPages,
    ...extraPages,
    ...facilityPages,
    ...staffPages,
  ]
}
