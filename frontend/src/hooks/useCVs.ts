import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadCV, getCVs, getCV, getCVStats, updateCV, deleteCV } from '../api/cv'
import type { CVUpdatePayload } from '../api/cv'

export function useCVList() {
    return useQuery({
        queryKey: ['cvs'],
        queryFn: getCVs
    })
}

export function useCV(id: string) {
    return useQuery({
        queryKey: ['cvs', id],
        queryFn: () => getCV(id),
        enabled: !!id
    })
}

export function useCVStats() {
    return useQuery({
        queryKey: ['cv-stats'],
        queryFn: getCVStats
    })
}

export function useUploadCV() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
                         title,
                         label,
                         file
                     }: {
            title: string
            label: string | null
            file: File
        }) => uploadCV(title, label, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cvs'] })
            queryClient.invalidateQueries({ queryKey: ['cv-stats'] })
        }
    })
}

export function useUpdateCV() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CVUpdatePayload }) =>
            updateCV(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cvs'] })
        }
    })
}

export function useDeleteCV() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteCV(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cvs'] })
            queryClient.invalidateQueries({ queryKey: ['cv-stats'] })
        }
    })
}