import api from './index'
import type { JobStatus } from '../types'

export interface Job {
    id: string
    title: string
    company: string
    description: string
    url: string | null
    status: JobStatus
    notes: string | null
    created_at: string
    updated_at: string
}

export interface JobListItem {
    id: string
    title: string
    company: string
    status: JobStatus
    url: string | null
    created_at: string
}

export interface JobCreatePayload {
    title: string
    company: string
    description: string
    url?: string
    notes?: string
}

export interface JobUpdatePayload {
    title?: string
    company?: string
    description?: string
    url?: string
    status?: JobStatus
    notes?: string
}

export const createJob = async (payload: JobCreatePayload): Promise<Job> => {
    const response = await api.post<Job>('/jobs', payload)
    return response.data
}

export const getJobs = async (status?: JobStatus): Promise<JobListItem[]> => {
    const params = status ? { status } : {}
    const response = await api.get<JobListItem[]>('/jobs', { params })
    return response.data
}

export const getJob = async (id: string): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`)
    return response.data
}

export const updateJob = async (id: string, payload: JobUpdatePayload): Promise<Job> => {
    const response = await api.patch<Job>(`/jobs/${id}`, payload)
    return response.data
}

export const deleteJob = async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`)
}