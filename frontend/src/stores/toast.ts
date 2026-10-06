import { create } from 'zustand'
import type { ToastMessage } from '../components/ui/Toast'

interface ToastState {
    toasts: ToastMessage[]
    addToast: (type: ToastMessage['type'], message: string) => void
    removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (type, message) => {
        const id = crypto.randomUUID()
        set(state => ({
            toasts: [...state.toasts, { id, type, message }]
        }))
    },
    removeToast: (id) => {
        set(state => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }))
    }
}))

// Helper hook for convenience
export function useToast() {
    const { addToast } = useToastStore()
    return {
        success: (message: string) => addToast('success', message),
        error: (message: string) => addToast('error', message),
        info: (message: string) => addToast('info', message)
    }
}