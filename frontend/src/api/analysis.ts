import api from './index'

export interface AnalysisResult {
    match_score: number
    ats_score: number
    summary: string
    matching_keywords: string[]
    missing_keywords: string[]
    strengths: string[]
    skill_gaps: string[]
    recommendations: string[]
}

export interface TailoringSection {
    original: string
    rewritten: string
    changes_made: string
}

export interface TailoringResult {
    rewritten_sections: TailoringSection[]
    keywords_added: string[]
    overall_advice: string
}

export interface CoverLetterResult {
    cover_letter: string
    key_points_highlighted: string[]
}

export interface InterviewQuestion {
    question: string
    category: string
    difficulty: string
    suggested_answer: string
    key_points: string[]
}

export interface InterviewPrepResult {
    questions: InterviewQuestion[]
    preparation_tips: string[]
}

export interface JobAnalysisResponse {
    id: string
    cv_id: string
    job_id: string
    analysis: AnalysisResult | null
    tailoring: TailoringResult | null
    cover_letter: CoverLetterResult | null
    interview_prep: InterviewPrepResult | null
    created_at: string
    updated_at: string
}

export const analyzeForJob = async (
    cv_id: string,
    job_id: string
): Promise<JobAnalysisResponse> => {
    const response = await api.post<JobAnalysisResponse>('/analysis/analyze/job', {
        cv_id,
        job_id
    })
    return response.data
}

export const tailorForJob = async (
    cv_id: string,
    job_id: string
): Promise<JobAnalysisResponse> => {
    const response = await api.post<JobAnalysisResponse>('/analysis/tailor/job', {
        cv_id,
        job_id
    })
    return response.data
}

export const generateCoverLetter = async (
    cv_id: string,
    job_id: string,
    company_name: string,
    role_title: string,
    tone: string = 'professional'
): Promise<JobAnalysisResponse> => {
    const response = await api.post<JobAnalysisResponse>('/analysis/cover-letter/job', {
        cv_id,
        job_id,
        company_name,
        role_title,
        tone
    })
    return response.data
}

export const generateInterviewPrep = async (
    cv_id: string,
    job_id: string
): Promise<JobAnalysisResponse> => {
    const response = await api.post<JobAnalysisResponse>('/analysis/interview-prep/job', {
        cv_id,
        job_id
    })
    return response.data
}

export const getJobAnalysis = async (
    job_id: string
): Promise<JobAnalysisResponse> => {
    const response = await api.get<JobAnalysisResponse>(`/analysis/job/${job_id}`)
    return response.data
}