import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAdminPosts,
    getAdminPost,
    createPost,
    updatePost,
    deletePost,
    type CreatePostData,
    type UpdatePostData,
} from '@/lib/api'

export function usePosts(params?: {
    search?: string
    type?: string
    status?: string
    page?: number
    per_page?: number
    paginate?: boolean
}) {
    const { paginate = true, ...queryParams } = params || {}

    return useQuery({
        queryKey: ['admin-posts', queryParams],
        queryFn: () => getAdminPosts(paginate ? queryParams : { ...queryParams, per_page: 1000 }),
        select: (data) => data.data,
    })
}

export function usePost(id: string | number) {
    return useQuery({
        queryKey: ['admin-post', id],
        queryFn: () => getAdminPost(id),
        select: (data) => data.data,
    })
}

export function useCreatePost() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePostData) => createPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
        },
    })
}

export function useUpdatePost(id: string | number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdatePostData) => updatePost(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
            queryClient.invalidateQueries({ queryKey: ['admin-post', id] })
        },
    })
}

export function useDeletePost() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string | number) => deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
        },
    })
}
