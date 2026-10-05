import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { login, register, getMe } from '../api/auth'
import type { RegisterPayload, LoginPayload } from '../api/auth'

export function useLogin() {
    const navigate = useNavigate()
    const { setToken, setUser } = useAuthStore()

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const tokenResponse = await login(payload)
            setToken(tokenResponse.access_token)
            localStorage.setItem('token', tokenResponse.access_token)
            const user = await getMe()
            setUser(user)
            return user
        },
        onSuccess: () => {
            navigate('/dashboard')
        }
    })
}

export function useRegister() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (payload: RegisterPayload) => {
            await register(payload)
        },
        onSuccess: () => {
            navigate('/login')
        }
    })
}

export function useLogout() {
    const logout = useAuthStore(state => state.logout)
    return logout
}