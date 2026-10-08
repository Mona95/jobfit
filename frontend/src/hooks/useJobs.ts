import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, getJob, createJob, updateJob, deleteJob } from '../api/jobs'
import type { JobCreatePayload, JobUpdatePayload } from '../api/jobs'
import type { JobStatus } from '../types'

export function useJobList(status?: JobStatus) {
    return useQuery({
        queryKey: ['jobs', status],
        queryFn: () => getJobs(status)
    })
}

export function useJob(id: string) {
    return useQuery({
        queryKey: ['jobs', id],
        queryFn: () => getJob(id),
        enabled: !!id
    })
}

export function useCreateJob() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: JobCreatePayload) => createJob(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
    })
}

export function useUpdateJob() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: JobUpdatePayload }) =>
            updateJob(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
    })
}

export function useDeleteJob() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
    })
}