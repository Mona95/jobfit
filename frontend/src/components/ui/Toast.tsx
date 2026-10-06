import { useEffect } from 'react'

export interface ToastMessage {
    id: string
    type: 'success' | 'error' | 'info'
    message: string
}

interface ToastProps {
    toast: ToastMessage
    onRemove: (id: string) => void
}

const styles = {
    success: 'bg-green-950 border-green-700 text-green-300',
    error: 'bg-red-950 border-red-700 text-red-300',
    info: 'bg-blue-950 border-blue-700 text-blue-300'
}

const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
}

function Toast({ toast, onRemove }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 3000)
        return () => clearTimeout(timer)
    }, [toast.id, onRemove])

    return (
        <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl border
      shadow-lg text-sm font-medium min-w-72 max-w-sm
      animate-in slide-in-from-right duration-300
      ${styles[toast.type]}
    `}>
            <span className="font-bold shrink-0 text-base">{icons[toast.type]}</span>
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="opacity-50 hover:opacity-100 transition-opacity shrink-0"
            >
                ✕
            </button>
        </div>
    )
}

interface ToastContainerProps {
    toasts: ToastMessage[]
    onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (!toasts.length) return null

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    )
}