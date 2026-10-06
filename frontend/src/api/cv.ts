import api from './index'

export interface CV {
    id: string
    title: string
    label: string | null
    content: string
    file_name: string | null
    file_path: string | null
    created_at: string
    updated_at: string
}

export interface CVListItem {
    id: string
    title: string
    label: string | null
    file_name: string | null
    file_path: string | null
    created_at: string
}

export interface CVStats {
    cv_id: string
    title: string
    label: string | null
    total_applications: number
    avg_match_score: number
    avg_ats_score: number
    best_match_score: number
}

export interface CVUpdatePayload {
    title?: string
    label?: string
}

export const uploadCV = async (title: string, label: string | null, file: File): Promise<CV> => {
    const formData = new FormData()
    formData.append('title', title)
    if (label) formData.append('label', label)
    formData.append('file', file)
    const response = await api.post<CV>('/cv', formData)
    return response.data
}

export const getCVs = async (): Promise<CVListItem[]> => {
    const response = await api.get<CVListItem[]>('/cv')
    return response.data
}

export const getCV = async (id: string): Promise<CV> => {
    const response = await api.get<CV>(`/cv/${id}`)
    return response.data
}

export const getCVStats = async (): Promise<CVStats[]> => {
    const response = await api.get<CVStats[]>('/cv/stats')
    return response.data
}

export const updateCV = async (id: string, payload: CVUpdatePayload): Promise<CV> => {
    const response = await api.patch<CV>(`/cv/${id}`, payload)
    return response.data
}

export const deleteCV = async (id: string): Promise<void> => {
    await api.delete(`/cv/${id}`)
}