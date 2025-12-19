import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAdminFacilities,
    getAdminFacility,
    createFacility,
    updateFacility,
    deleteFacility,
    type CreateFacilityData,
    type UpdateFacilityData,
} from '@/lib/api'

export function useFacilities(params?: {
    search?: string
    category?: string
    page?: number
    per_page?: number
    paginate?: boolean
}) {
    const { paginate = true, ...queryParams } = params || {}

    return useQuery({
        queryKey: ['admin-facilities', queryParams],
        queryFn: () => getAdminFacilities(paginate ? queryParams : { ...queryParams, per_page: 100 }),
        select: (data) => data.data,
    })
}

export function useFacility(id: string | number) {
    return useQuery({
        queryKey: ['admin-facility', id],
        queryFn: () => getAdminFacility(id),
        select: (data) => data.data,
    })
}

export function useCreateFacility() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateFacilityData) => createFacility(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-facilities'] })
        },
    })
}

export function useUpdateFacility(id: string | number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateFacilityData) => updateFacility(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-facilities'] })
            queryClient.invalidateQueries({ queryKey: ['admin-facility', id] })
        },
    })
}

export function useDeleteFacility() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string | number) => deleteFacility(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-facilities'] })
        },
    })
}
