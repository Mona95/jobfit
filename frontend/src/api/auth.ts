import api from './index'

export interface RegisterPayload {
    email: string
    password: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface TokenResponse {
    access_token: string
    token_type: string
}

export interface UserResponse {
    id: string
    email: string
}

export const register = async (payload: RegisterPayload): Promise<void> => {
    await api.post('/auth/register', payload)
}

export const login = async (payload: LoginPayload): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', payload)
    return response.data
}

export const getMe = async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/auth/me')
    return response.data
}