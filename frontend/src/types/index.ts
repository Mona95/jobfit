// Auth
export interface User {
    id: string
    email: string
}

// Generic API error shape
export interface APIError {
    detail: string
}

// Status types
export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected'

export type AnalysisType = 'analysis' | 'tailoring' | 'cover_letter' | 'interview_prep'

// Generic pagination (for future use)
export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
}