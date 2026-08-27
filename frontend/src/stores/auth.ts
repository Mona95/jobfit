import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
}

interface AuthState {
    token: string | null
    user: User | null
    setToken: (token: string) => void
    setUser: (user: User) => void
    logout: () => void
    isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => {
                set({ token: null, user: null })
                localStorage.removeItem('token')
                window.location.href = '/login'
            },
            isAuthenticated: () => !!get().token
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user
            })
        }
    )
)