'use client'

import { useQuery } from '@tanstack/react-query'
import {
    getAdminGalleries,
    getAdminPosts,
    getAdminExtras,
    getAdminFacilities,
    type Gallery,
    type Post,
    type Extra,
    type Facility,
} from '@/lib/api'
import { useStaff, type Staff } from './useStaff'
import { useAnnouncements, type Announcement } from './useAnnouncements'

export interface RecentActivity {
    id: string
    type: 'gallery' | 'post' | 'announcement' | 'staff' | 'extra' | 'facility'
    title: string
    description: string
    timestamp: Date
    icon: string
}

export function useRecentActivities(limit: number = 5) {
    const { data: staffData } = useStaff({ paginate: false })
    const { data: announcementsData } = useAnnouncements({ paginate: false })

    return useQuery({
        queryKey: ['recent-activities', limit, staffData, announcementsData],
        queryFn: async (): Promise<RecentActivity[]> => {
            // Fetch recent data from all resources
            const [galleries, posts, extras, facilities] = await Promise.all([
                getAdminGalleries({ per_page: 10 }).catch(() => ({ data: [] })),
                getAdminPosts({ per_page: 10 }).catch(() => ({ data: [] })),
                getAdminExtras({ per_page: 10 }).catch(() => ({ data: [] })),
                getAdminFacilities({ per_page: 10 }).catch(() => ({ data: [] })),
            ])

            const activities: RecentActivity[] = []

            // Add galleries
            galleries.data?.slice(0, 5).forEach((gallery: Gallery) => {
                activities.push({
                    id: `gallery-${gallery.id}`,
                    type: 'gallery',
                    title: 'Galeri ditambahkan',
                    description: gallery.title,
                    timestamp: new Date(gallery.created_at),
                    icon: 'image',
                })
            })

            // Add posts
            posts.data?.slice(0, 5).forEach((post: Post) => {
                activities.push({
                    id: `post-${post.id}`,
                    type: 'post',
                    title: 'Informasi dipublikasi',
                    description: post.attributes.title,
                    timestamp: new Date(post.attributes.created_at),
                    icon: 'file-text',
                })
            })

            // Add announcements
            announcementsData?.slice(0, 5).forEach((announcement: Announcement) => {
                activities.push({
                    id: `announcement-${announcement.id}`,
                    type: 'announcement',
                    title: 'Pengumuman baru',
                    description: announcement.attributes.title,
                    timestamp: new Date(announcement.attributes.created_at),
                    icon: 'megaphone',
                })
            })

            // Add staff
            staffData?.slice(0, 5).forEach((staff: Staff) => {
                activities.push({
                    id: `staff-${staff.id}`,
                    type: 'staff',
                    title: 'Staff ditambahkan',
                    description: staff.attributes.name,
                    timestamp: new Date(staff.attributes.created_at),
                    icon: 'users',
                })
            })

            // Add extras
            extras.data?.slice(0, 5).forEach((extra: Extra) => {
                activities.push({
                    id: `extra-${extra.id}`,
                    type: 'extra',
                    title: 'Ekstrakurikuler baru',
                    description: extra.attributes.name,
                    timestamp: new Date(extra.attributes.created_at),
                    icon: 'activity',
                })
            })

            // Add facilities
            facilities.data?.slice(0, 5).forEach((facility: Facility) => {
                activities.push({
                    id: `facility-${facility.id}`,
                    type: 'facility',
                    title: 'Fasilitas ditambahkan',
                    description: facility.attributes.name,
                    timestamp: new Date(facility.attributes.created_at),
                    icon: 'building',
                })
            })

            // Sort by timestamp (newest first) and limit
            return activities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, limit)
        },
        enabled: !!staffData && !!announcementsData,
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}
