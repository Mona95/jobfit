import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    analyzeForJob,
    tailorForJob,
    generateCoverLetter,
    generateInterviewPrep,
    getJobAnalysis
} from '../api/analysis'

export function useJobAnalysis(jobId: string) {
    return useQuery({
        queryKey: ['analysis', jobId],
        queryFn: () => getJobAnalysis(jobId),
        enabled: !!jobId,
        retry: false
    })
}

export function useAnalyzeJob() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ cvId, jobId }: { cvId: string; jobId: string }) =>
            analyzeForJob(cvId, jobId),
        onSuccess: (_, { jobId }) => {
            queryClient.invalidateQueries({ queryKey: ['analysis', jobId] })
        }
    })
}

export function useTailorCV() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ cvId, jobId }: { cvId: string; jobId: string }) =>
            tailorForJob(cvId, jobId),
        onSuccess: (_, { jobId }) => {
            queryClient.invalidateQueries({ queryKey: ['analysis', jobId] })
        }
    })
}

export function useGenerateCoverLetter() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         cvId,
                         jobId,
                         companyName,
                         roleTitle,
                         tone
                     }: {
            cvId: string
            jobId: string
            companyName: string
            roleTitle: string
            tone: string
        }) => generateCoverLetter(cvId, jobId, companyName, roleTitle, tone),
        onSuccess: (_, { jobId }) => {
            queryClient.invalidateQueries({ queryKey: ['analysis', jobId] })
        }
    })
}

export function useGenerateInterviewPrep() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ cvId, jobId }: { cvId: string; jobId: string }) =>
            generateInterviewPrep(cvId, jobId),
        onSuccess: (_, { jobId }) => {
            queryClient.invalidateQueries({ queryKey: ['analysis', jobId] })
        }
    })
}