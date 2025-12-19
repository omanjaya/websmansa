'use client'

import { useQuery } from '@tanstack/react-query'
import {
    getAdminGalleries,
    getAdminPosts,
    getAdminExtras,
    getAdminFacilities
} from '@/lib/api'
import { useStaff } from './useStaff'
import { useAnnouncements } from './useAnnouncements'

export interface DashboardStats {
    galleries: {
        total: number
        published: number
        photo: number
        video: number
    }
    posts: {
        total: number
        published: number
        draft: number
        featured: number
    }
    staff: {
        total: number
        teachers: number
        active: number
    }
    announcements: {
        total: number
        active: number
        pinned: number
    }
    extras: {
        total: number
        active: number
        featured: number
        totalMembers: number
    }
    facilities: {
        total: number
        active: number
        bookable: number
    }
}

export function useDashboardStats() {
    // Use existing hooks
    const { data: staffData } = useStaff({ paginate: false })
    const { data: announcementsData } = useAnnouncements({ paginate: false })

    return useQuery({
        queryKey: ['dashboard-stats', staffData, announcementsData],
        queryFn: async (): Promise<DashboardStats> => {
            // Fetch all data in parallel
            const [galleries, posts, extras, facilities] = await Promise.all([
                getAdminGalleries({ per_page: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
                getAdminPosts({ per_page: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
                getAdminExtras({ per_page: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
                getAdminFacilities({ per_page: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
            ])

            // Calculate stats
            const galleriesData = galleries.data || []
            const postsData = posts.data || []
            const extrasData = extras.data || []
            const facilitiesData = facilities.data || []

            return {
                galleries: {
                    total: galleriesData.length,
                    published: galleriesData.length, // All galleries in admin are considered published
                    photo: galleriesData.filter(g => g.type === 'photo').length,
                    video: galleriesData.filter(g => g.type === 'video').length,
                },
                posts: {
                    total: postsData.length,
                    published: postsData.filter(p => p.attributes.status === 'published').length,
                    draft: postsData.filter(p => p.attributes.status === 'draft').length,
                    featured: postsData.filter(p => p.attributes.is_featured).length,
                },
                staff: {
                    total: staffData?.length || 0,
                    teachers: staffData?.filter(s => s.attributes.type === 'teacher').length || 0,
                    active: staffData?.filter(s => s.attributes.is_active).length || 0,
                },
                announcements: {
                    total: announcementsData?.length || 0,
                    active: announcementsData?.filter(a => a.attributes.is_active).length || 0,
                    pinned: announcementsData?.filter(a => a.attributes.is_pinned).length || 0,
                },
                extras: {
                    total: extrasData.length,
                    active: extrasData.filter(e => e.attributes.is_active).length,
                    featured: extrasData.filter(e => e.attributes.is_featured).length,
                    totalMembers: extrasData.reduce((sum, e) => sum + (e.attributes.member_count || 0), 0),
                },
                facilities: {
                    total: facilitiesData.length,
                    active: facilitiesData.filter(f => f.attributes.is_active).length,
                    bookable: facilitiesData.filter(f => f.attributes.is_bookable).length,
                },
            }
        },
        enabled: !!staffData && !!announcementsData, // Only run when staff and announcements are loaded
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
