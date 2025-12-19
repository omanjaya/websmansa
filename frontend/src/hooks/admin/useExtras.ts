import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAdminExtras,
    getAdminExtra,
    createExtra,
    updateExtra,
    deleteExtra,
    type CreateExtraData,
    type UpdateExtraData,
} from '@/lib/api'

export function useExtras(params?: {
    search?: string
    category?: string
    page?: number
    per_page?: number
    paginate?: boolean
}) {
    const { paginate = true, ...queryParams } = params || {}

    return useQuery({
        queryKey: ['admin-extras', queryParams],
        queryFn: () => getAdminExtras(paginate ? queryParams : { ...queryParams, per_page: 100 }),
        select: (data) => data.data,
    })
}

export function useExtra(id: string | number) {
    return useQuery({
        queryKey: ['admin-extra', id],
        queryFn: () => getAdminExtra(id),
        select: (data) => data.data,
    })
}

export function useCreateExtra() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateExtraData) => createExtra(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
        },
    })
}

export function useUpdateExtra(id: string | number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateExtraData) => updateExtra(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
            queryClient.invalidateQueries({ queryKey: ['admin-extra', id] })
        },
    })
}

export function useDeleteExtra() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string | number) => deleteExtra(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-extras'] })
        },
    })
}
